import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeDatabase, getPool } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// Configure JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'boutique_jwt_secret_key_12345';

// Ensure the local 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// Configure Nodemailer transporter for Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'samyusboutiqueofficial@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

const GMAIL_USER = process.env.GMAIL_USER || 'samyusboutiqueofficial@gmail.com';

// REST Endpoint to route transactional emails from React App
app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;
  const recipient = to || GMAIL_USER;

  console.log(`✉️ Attempting to send email to: ${recipient} via Gmail SMTP...`);

  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!appPassword || appPassword === 'YOUR_GMAIL_APP_PASSWORD') {
    const errorMsg = 'Gmail App Password (GMAIL_APP_PASSWORD) is missing or set to placeholder in .env.';
    console.error(`❌ ${errorMsg}`);
    return res.status(500).json({ error: errorMsg });
  }

  const mailOptions = {
    from: `"Samyus Boutique Official" <${GMAIL_USER}>`,
    to: recipient,
    subject: subject || 'BoutiqueOS Notification',
    html: html || '<p>Notification triggered.</p>'
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email dispatched successfully via Gmail SMTP! MessageId:`, info.messageId);
    res.json({ success: true, message: 'Email dispatched successfully!', messageId: info.messageId });
  } catch (error) {
    console.error('❌ Gmail SMTP Client Exception:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// FILE UPLOAD ENDPOINT (FREE LOCAL STORAGE)
// ==========================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// ==========================================
// SECURE AUTHENTICATION ENDPOINT
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body; // username could be Employee ID or Customer Mobile
  if (!username || !password) {
    return res.status(400).json({ error: 'Username/ID and Password are required.' });
  }

  try {
    // 1. Try to find user in employees table
    const empResult = await getPool().query('SELECT * FROM employees WHERE id = $1', [username.trim().toUpperCase()]);
    if (empResult.rowCount > 0) {
      const employee = empResult.rows[0];
      if (!employee.active) {
        return res.status(403).json({ error: 'This staff profile is currently inactive.' });
      }

      // If they haven't configured a password yet, we use the default fallback check
      const validPassword = await bcrypt.compare(password, employee.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      const token = jwt.sign(
        { id: employee.id, name: employee.name, role: employee.role, type: 'employee' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: employee.id,
          name: employee.name,
          role: employee.role,
          contact: employee.contact,
          type: 'employee'
        }
      });
    }

    // 2. Try to find user in customers table (username is mobile)
    const cleanMobile = username.replace(/\D/g, '');
    const custResult = await getPool().query('SELECT * FROM customers WHERE mobile = $1 OR whatsapp LIKE $2', [cleanMobile, `%${cleanMobile}%`]);
    if (custResult.rowCount > 0) {
      const customer = custResult.rows[0];
      const validPassword = await bcrypt.compare(password, customer.password_hash || await bcrypt.hash('123456', 10));
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password.' });
      }

      const token = jwt.sign(
        { id: customer.id, name: customer.name, role: 'Customer Portal', type: 'customer' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: customer.id,
          name: customer.name,
          mobile: customer.mobile,
          whatsapp: customer.whatsapp,
          email: customer.email,
          role: 'Customer Portal',
          type: 'customer'
        }
      });
    }

    return res.status(404).json({ error: 'User profile not found with this ID or Mobile Number.' });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An error occurred during authentication.' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { id, name, mobile, email, address, dob, password, designPreferences } = req.body;
  if (!name || !mobile || !password) {
    return res.status(400).json({ error: 'Name, Mobile and Password are required.' });
  }
  
  try {
    const cleanMobile = mobile.replace(/\D/g, '');
    const exists = await getPool().query('SELECT 1 FROM customers WHERE mobile = $1', [cleanMobile]);
    if (exists.rowCount > 0) {
      return res.status(400).json({ error: 'An account with this mobile number already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO customers (id, name, mobile, whatsapp, email, address, dob, anniversary, tags, design_preferences, images, measurements, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`;
    
    const values = [
      id, name, cleanMobile, `+91 ${cleanMobile}`, email || `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
      address || 'Address Not Provided', dob || '1995-01-01', null, ['New', 'Regular'], designPreferences || '', [], {}, passwordHash
    ];

    const result = await getPool().query(query, values);
    
    // Generate JWT token for immediate login after registration
    const customer = result.rows[0];
    const token = jwt.sign(
      { id: customer.id, name: customer.name, role: 'Customer Portal', type: 'customer' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: customer.id,
        name: customer.name,
        mobile: customer.mobile,
        whatsapp: customer.whatsapp,
        email: customer.email,
        role: 'Customer Portal',
        type: 'customer'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// POSTGRESQL CRUD & BULK SYNC ENDPOINTS
// ==========================================

// --- CUSTOMERS ---
app.get('/api/customers', async (req, res) => {
  try {
    const result = await getPool().query('SELECT * FROM customers ORDER BY name ASC');
    const customers = result.rows.map(c => ({
      id: c.id,
      name: c.name,
      mobile: c.mobile,
      whatsapp: c.whatsapp,
      email: c.email,
      address: c.address,
      dob: c.dob,
      anniversary: c.anniversary,
      tags: c.tags,
      designPreferences: c.design_preferences,
      images: c.images,
      measurements: c.measurements
    }));
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/customers', async (req, res) => {
  const customers = req.body;
  if (!Array.isArray(customers)) return res.status(400).json({ error: 'Body must be an array' });
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const defaultHash = await bcrypt.hash('123456', 10);
    for (const cust of customers) {
      let passwordHash = null;
      if (cust.password) {
        passwordHash = await bcrypt.hash(cust.password, 10);
      }
      const query = `
        INSERT INTO customers (id, name, mobile, whatsapp, email, address, dob, anniversary, tags, design_preferences, images, measurements, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, COALESCE($13, (SELECT password_hash FROM customers WHERE id = $1), $14))
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          mobile = EXCLUDED.mobile,
          whatsapp = EXCLUDED.whatsapp,
          email = EXCLUDED.email,
          address = EXCLUDED.address,
          dob = EXCLUDED.dob,
          anniversary = EXCLUDED.anniversary,
          tags = EXCLUDED.tags,
          design_preferences = EXCLUDED.design_preferences,
          images = EXCLUDED.images,
          measurements = EXCLUDED.measurements,
          password_hash = COALESCE(EXCLUDED.password_hash, customers.password_hash)`;
      const values = [
        cust.id, cust.name, cust.mobile, cust.whatsapp, cust.email, cust.address, cust.dob, cust.anniversary,
        cust.tags || [], cust.designPreferences || '', cust.images || [], cust.measurements || {}, passwordHash, defaultHash
      ];
      await client.query(query, values);
    }
    const ids = customers.map(c => c.id);
    if (ids.length > 0) {
      const dollarPlaceholders = ids.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM customers WHERE id NOT IN (${dollarPlaceholders})`, ids);
    } else {
      await client.query('DELETE FROM customers');
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- ORDERS ---
app.get('/api/orders', async (req, res) => {
  try {
    const result = await getPool().query('SELECT * FROM orders ORDER BY id DESC');
    const orders = result.rows.map(o => ({
      id: o.id,
      customerId: o.customer_id,
      customerName: o.customer_name,
      garmentType: o.garment_type,
      quantity: o.quantity,
      deliveryDate: o.delivery_date,
      trialDate: o.trial_date,
      assignedTailor: o.assigned_tailor,
      assignedDesigner: o.assigned_designer,
      priority: o.priority,
      status: o.status,
      notes: o.notes,
      referenceImage: o.reference_image,
      fabricUsed: o.fabric_used,
      fabricQuantity: o.fabric_quantity,
      stitchingCost: Number(o.stitching_cost),
      fabricCost: Number(o.fabric_cost),
      advancePaid: Number(o.advance_paid),
      paymentMethod: o.payment_method
    }));
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/orders', async (req, res) => {
  const orders = req.body;
  if (!Array.isArray(orders)) return res.status(400).json({ error: 'Body must be an array' });
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const o of orders) {
      const query = `
        INSERT INTO orders (
          id, customer_id, customer_name, garment_type, quantity, delivery_date, trial_date, 
          assigned_tailor, assigned_designer, priority, status, notes, reference_image, 
          fabric_used, fabric_quantity, stitching_cost, fabric_cost, advance_paid, payment_method
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        ON CONFLICT (id) DO UPDATE SET
          customer_id = EXCLUDED.customer_id,
          customer_name = EXCLUDED.customer_name,
          garment_type = EXCLUDED.garment_type,
          quantity = EXCLUDED.quantity,
          delivery_date = EXCLUDED.delivery_date,
          trial_date = EXCLUDED.trial_date,
          assigned_tailor = EXCLUDED.assigned_tailor,
          assigned_designer = EXCLUDED.assigned_designer,
          priority = EXCLUDED.priority,
          status = EXCLUDED.status,
          notes = EXCLUDED.notes,
          reference_image = EXCLUDED.reference_image,
          fabric_used = EXCLUDED.fabric_used,
          fabric_quantity = EXCLUDED.fabric_quantity,
          stitching_cost = EXCLUDED.stitching_cost,
          fabric_cost = EXCLUDED.fabric_cost,
          advance_paid = EXCLUDED.advance_paid,
          payment_method = EXCLUDED.payment_method`;
      const values = [
        o.id, o.customerId, o.customerName, o.garmentType, o.quantity, o.deliveryDate, o.trialDate,
        o.assignedTailor, o.assignedDesigner, o.priority, o.status, o.notes, o.referenceImage,
        o.fabricUsed, o.fabricQuantity, o.stitchingCost || 0, o.fabricCost || 0, o.advancePaid || 0, o.paymentMethod
      ];
      await client.query(query, values);
    }
    const ids = orders.map(o => o.id);
    if (ids.length > 0) {
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM orders WHERE id NOT IN (${placeholders})`, ids);
    } else {
      await client.query('DELETE FROM orders');
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- EMPLOYEES ---
app.get('/api/employees', async (req, res) => {
  try {
    const result = await getPool().query('SELECT * FROM employees ORDER BY role, name ASC');
    const employees = result.rows.map(e => ({
      id: e.id,
      name: e.name,
      role: e.role,
      contact: e.contact,
      active: e.active,
      assigned: e.assigned,
      completed: e.completed,
      delayPercentage: Number(e.delay_percentage),
      alterationPercentage: Number(e.alteration_percentage)
    }));
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/employees', async (req, res) => {
  const employees = req.body;
  if (!Array.isArray(employees)) return res.status(400).json({ error: 'Body must be an array' });
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const defaultHash = await bcrypt.hash('123456', 10);
    for (const e of employees) {
      let passwordHash = null;
      if (e.password) {
        passwordHash = await bcrypt.hash(e.password, 10);
      }
      const query = `
        INSERT INTO employees (id, name, role, contact, active, assigned, completed, delay_percentage, alteration_percentage, password_hash)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, COALESCE($10, (SELECT password_hash FROM employees WHERE id = $1), $11))
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          role = EXCLUDED.role,
          contact = EXCLUDED.contact,
          active = EXCLUDED.active,
          assigned = EXCLUDED.assigned,
          completed = EXCLUDED.completed,
          delay_percentage = EXCLUDED.delay_percentage,
          alteration_percentage = EXCLUDED.alteration_percentage,
          password_hash = COALESCE(EXCLUDED.password_hash, employees.password_hash)`;
      const values = [
        e.id, e.name, e.role, e.contact, e.active !== false, e.assigned || 0, e.completed || 0, e.delayPercentage || 0, e.alterationPercentage || 0, passwordHash, defaultHash
      ];
      await client.query(query, values);
    }
    const ids = employees.map(e => e.id);
    if (ids.length > 0) {
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM employees WHERE id NOT IN (${placeholders})`, ids);
    } else {
      await client.query('DELETE FROM employees');
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- INVENTORY ---
app.get('/api/inventory', async (req, res) => {
  try {
    const fabrics = await getPool().query('SELECT * FROM inventory_fabrics ORDER BY id ASC');
    const accessories = await getPool().query('SELECT * FROM inventory_accessories ORDER BY id ASC');
    
    const mappedFabrics = fabrics.rows.map(f => ({
      id: f.id,
      name: f.name,
      color: f.color,
      supplier: f.supplier,
      quantity: Number(f.quantity),
      minStock: Number(f.min_stock)
    }));

    const mappedAccessories = accessories.rows.map(a => ({
      id: a.id,
      name: a.name,
      type: a.type,
      quantity: Number(a.quantity),
      minStock: Number(a.min_stock)
    }));

    res.json({ fabrics: mappedFabrics, accessories: mappedAccessories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/inventory', async (req, res) => {
  const inventory = req.body;
  if (!inventory || !Array.isArray(inventory.fabrics) || !Array.isArray(inventory.accessories)) {
    return res.status(400).json({ error: 'Body must be an object containing fabrics and accessories arrays' });
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    
    for (const f of inventory.fabrics) {
      const query = `
        INSERT INTO inventory_fabrics (id, name, color, supplier, quantity, min_stock)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          color = EXCLUDED.color,
          supplier = EXCLUDED.supplier,
          quantity = EXCLUDED.quantity,
          min_stock = EXCLUDED.min_stock`;
      await client.query(query, [f.id, f.name, f.color, f.supplier, f.quantity, f.minStock]);
    }
    const fabIds = inventory.fabrics.map(f => f.id);
    if (fabIds.length > 0) {
      const placeholders = fabIds.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM inventory_fabrics WHERE id NOT IN (${placeholders})`, fabIds);
    } else {
      await client.query('DELETE FROM inventory_fabrics');
    }

    for (const a of inventory.accessories) {
      const query = `
        INSERT INTO inventory_accessories (id, name, type, quantity, min_stock)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          quantity = EXCLUDED.quantity,
          min_stock = EXCLUDED.min_stock`;
      await client.query(query, [a.id, a.name, a.type, a.quantity, a.minStock]);
    }
    const accIds = inventory.accessories.map(a => a.id);
    if (accIds.length > 0) {
      const placeholders = accIds.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM inventory_accessories WHERE id NOT IN (${placeholders})`, accIds);
    } else {
      await client.query('DELETE FROM inventory_accessories');
    }

    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- APPOINTMENTS ---
app.get('/api/appointments', async (req, res) => {
  try {
    const result = await getPool().query('SELECT * FROM appointments ORDER BY date, time ASC');
    const appointments = result.rows.map(a => ({
      id: a.id,
      customerName: a.customer_name,
      type: a.type,
      date: a.date,
      time: a.time,
      designer: a.designer,
      notes: a.notes
    }));
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/appointments', async (req, res) => {
  const appointments = req.body;
  if (!Array.isArray(appointments)) return res.status(400).json({ error: 'Body must be an array' });
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const a of appointments) {
      const query = `
        INSERT INTO appointments (id, customer_name, type, date, time, designer, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          customer_name = EXCLUDED.customer_name,
          type = EXCLUDED.type,
          date = EXCLUDED.date,
          time = EXCLUDED.time,
          designer = EXCLUDED.designer,
          notes = EXCLUDED.notes`;
      await client.query(query, [a.id, a.customerName, a.type, a.date, a.time, a.designer, a.notes]);
    }
    const ids = appointments.map(a => a.id);
    if (ids.length > 0) {
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM appointments WHERE id NOT IN (${placeholders})`, ids);
    } else {
      await client.query('DELETE FROM appointments');
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- DESIGNS ---
app.get('/api/designs', async (req, res) => {
  try {
    const result = await getPool().query('SELECT * FROM design_library ORDER BY rating DESC');
    const designs = result.rows.map(d => ({
      id: d.id,
      title: d.title,
      category: d.category,
      image: d.image,
      description: d.description,
      budget: d.budget,
      neckType: d.neck_type,
      sleeveType: d.sleeve_type,
      occasion: d.occasion,
      rating: Number(d.rating),
      reviewsCount: d.reviews_count,
      basePrice: Number(d.base_price)
    }));
    res.json(designs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/designs', async (req, res) => {
  const designs = req.body;
  if (!Array.isArray(designs)) return res.status(400).json({ error: 'Body must be an array' });
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const d of designs) {
      const query = `
        INSERT INTO design_library (id, title, category, image, description, budget, neck_type, sleeve_type, occasion, rating, reviews_count, base_price)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          image = EXCLUDED.image,
          description = EXCLUDED.description,
          budget = EXCLUDED.budget,
          neck_type = EXCLUDED.neck_type,
          sleeve_type = EXCLUDED.sleeve_type,
          occasion = EXCLUDED.occasion,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          base_price = EXCLUDED.base_price`;
      await client.query(query, [d.id, d.title, d.category, d.image, d.description, d.budget, d.neckType, d.sleeveType, d.occasion, d.rating || 0, d.reviewsCount || 0, d.basePrice || 0]);
    }
    const ids = designs.map(d => d.id);
    if (ids.length > 0) {
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM design_library WHERE id NOT IN (${placeholders})`, ids);
    } else {
      await client.query('DELETE FROM design_library');
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// --- WHATSAPP LOGS ---
app.get('/api/whatsapp-logs', async (req, res) => {
  try {
    const result = await getPool().query('SELECT * FROM whatsapp_logs ORDER BY timestamp DESC');
    const logs = result.rows.map(w => ({
      id: w.id,
      timestamp: w.timestamp,
      customerName: w.customer_name,
      mobile: w.mobile,
      type: w.type,
      message: w.message,
      status: w.status
    }));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/sync/whatsapp-logs', async (req, res) => {
  const logs = req.body;
  if (!Array.isArray(logs)) return res.status(400).json({ error: 'Body must be an array' });
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const w of logs) {
      const query = `
        INSERT INTO whatsapp_logs (id, timestamp, customer_name, mobile, type, message, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (id) DO UPDATE SET
          timestamp = EXCLUDED.timestamp,
          customer_name = EXCLUDED.customer_name,
          mobile = EXCLUDED.mobile,
          type = EXCLUDED.type,
          message = EXCLUDED.message,
          status = EXCLUDED.status`;
      await client.query(query, [w.id, w.timestamp, w.customerName, w.mobile, w.type, w.message, w.status]);
    }
    const ids = logs.map(w => w.id);
    if (ids.length > 0) {
      const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
      await client.query(`DELETE FROM whatsapp_logs WHERE id NOT IN (${placeholders})`, ids);
    } else {
      await client.query('DELETE FROM whatsapp_logs');
    }
    await client.query('COMMIT');
    res.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

app.post('/api/reset-database', async (req, res) => {
  try {
    const client = await getPool().connect();
    try {
      await client.query('BEGIN');
      await client.query('TRUNCATE orders, appointments, customers, whatsapp_logs CASCADE');
      await client.query('TRUNCATE employees CASCADE');
      await client.query('COMMIT');
      
      // Re-run database initialization & seeding
      await initializeDatabase(); 
      
      res.json({ success: true, message: 'Database reset successfully to clean production state.' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Reset database error:', err);
    res.status(500).json({ error: 'Failed to reset database.' });
  }
});

// Serve static files from Vite build (dist/)
const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  
  // Wildcard route to serve React's index.html for client-side routing
  app.get('/*splat', (req, res, next) => {
    // Only fallback for non-API, non-upload routes
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`⚡ BoutiqueOS Backend Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server due to database initialization failure:', err);
    process.exit(1);
  }
}

start();
