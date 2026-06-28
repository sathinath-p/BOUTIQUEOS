import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_EMPLOYEES, 
  INITIAL_INVENTORY, 
  INITIAL_APPOINTMENTS, 
  INITIAL_DESIGN_LIBRARY 
} from './src/mockData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite3 database connection (stored as a local file 'boutique.db')
const dbPath = path.join(__dirname, 'boutique.db');
const db = new sqlite3.Database(dbPath);

const sqlitePool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      // Format parameters: convert array elements that are objects/arrays to JSON strings
      const bindings = {};
      if (Array.isArray(params)) {
        params.forEach((val, idx) => {
          let processedVal = val;
          if (val !== null && typeof val === 'object') {
            processedVal = JSON.stringify(val);
          }
          bindings[`$${idx + 1}`] = processedVal;
        });
      } else if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
          let processedVal = params[key];
          if (processedVal !== null && typeof processedVal === 'object') {
            processedVal = JSON.stringify(processedVal);
          }
          bindings[key.startsWith('$') ? key : `$${key}`] = processedVal;
        });
      }

      const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
      if (isSelect) {
        db.all(sql, bindings, (err, rows) => {
          if (err) return reject(err);
          // Parse stringified JSON values back to objects
          const parsedRows = rows.map(row => {
            const parsed = { ...row };
            
            // Map COUNT(*) to count for pg compatibility
            if ('COUNT(*)' in parsed) {
              parsed.count = parsed['COUNT(*)'];
            }
            
            if (typeof parsed.measurements === 'string') {
              try { parsed.measurements = JSON.parse(parsed.measurements); } catch (e) {}
            }
            if (typeof parsed.tags === 'string') {
              try { parsed.tags = JSON.parse(parsed.tags); } catch (e) {}
            }
            if (typeof parsed.images === 'string') {
              try { parsed.images = JSON.parse(parsed.images); } catch (e) {}
            }
            return parsed;
          });
          resolve({ rows: parsedRows, rowCount: parsedRows.length });
        });
      } else {
        db.run(sql, bindings, function(err) {
          if (err) return reject(err);
          resolve({ rows: [], rowCount: this.changes });
        });
      }
    });
  },

  connect: async () => {
    return {
      query: (sql, params = []) => sqlitePool.query(sql, params),
      release: () => {}
    };
  }
};

let pool = sqlitePool;

export async function initializeDatabase() {
  console.log('🔄 Checking and initializing SQLite3 database...');

  try {
    // 1. Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        contact VARCHAR(50),
        active BOOLEAN DEFAULT TRUE,
        assigned INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        delay_percentage DECIMAL DEFAULT 0,
        alteration_percentage DECIMAL DEFAULT 0,
        password_hash VARCHAR(255)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        mobile VARCHAR(50) NOT NULL,
        whatsapp VARCHAR(50),
        email VARCHAR(100),
        address TEXT,
        dob VARCHAR(50),
        anniversary VARCHAR(50),
        tags TEXT DEFAULT '[]',
        design_preferences TEXT,
        images TEXT DEFAULT '[]',
        measurements TEXT DEFAULT '{}',
        password_hash VARCHAR(255)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(50) PRIMARY KEY,
        customer_id VARCHAR(50) REFERENCES customers(id) ON DELETE SET NULL,
        customer_name VARCHAR(100),
        garment_type VARCHAR(100),
        quantity INTEGER DEFAULT 1,
        delivery_date VARCHAR(50),
        trial_date VARCHAR(50),
        assigned_tailor VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
        assigned_designer VARCHAR(50) REFERENCES employees(id) ON DELETE SET NULL,
        priority VARCHAR(50),
        status VARCHAR(100),
        notes TEXT,
        reference_image VARCHAR(255),
        fabric_used VARCHAR(255),
        fabric_quantity VARCHAR(50),
        stitching_cost DECIMAL DEFAULT 0,
        fabric_cost DECIMAL DEFAULT 0,
        advance_paid DECIMAL DEFAULT 0,
        payment_method VARCHAR(50)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS design_library (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        budget VARCHAR(50),
        neck_type VARCHAR(100),
        sleeve_type VARCHAR(100),
        occasion VARCHAR(100),
        rating DECIMAL DEFAULT 0,
        reviews_count INTEGER DEFAULT 0,
        base_price DECIMAL DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory_fabrics (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        color VARCHAR(100),
        supplier VARCHAR(100),
        quantity DECIMAL DEFAULT 0,
        min_stock DECIMAL DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS inventory_accessories (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(100),
        quantity DECIMAL DEFAULT 0,
        min_stock DECIMAL DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(50) PRIMARY KEY,
        customer_name VARCHAR(100),
        type VARCHAR(100),
        date VARCHAR(50),
        time VARCHAR(50),
        designer VARCHAR(100),
        notes TEXT
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_logs (
        id VARCHAR(50) PRIMARY KEY,
        timestamp VARCHAR(50),
        customer_name VARCHAR(100),
        mobile VARCHAR(50),
        type VARCHAR(100),
        message TEXT,
        status VARCHAR(50)
      );
    `);

    console.log('✅ SQLite3 tables checked/created successfully.');

    // 2. Clean up demo/mock data if present
    console.log('🧹 Purging demo data from SQLite3 database if present...');
    await pool.query("DELETE FROM orders WHERE customer_id IN ('CUST-001', 'CUST-002')");
    await pool.query("DELETE FROM appointments WHERE customer_name IN ('Priya Sharma', 'Meera Rajput')");
    await pool.query("DELETE FROM customers WHERE id IN ('CUST-001', 'CUST-002')");
    await pool.query("DELETE FROM employees WHERE id IN ('EMP-002', 'EMP-003', 'EMP-004', 'EMP-005', 'EMP-006')");

    // 3. Seed data if tables are empty
    await seedDatabase();

  } catch (err) {
    console.error('❌ Error initializing SQLite3 database:', err);
    throw err;
  }
}

async function seedDatabase() {
  try {
    // Generate a default hash for password '123456'
    const defaultHash = await bcrypt.hash('123456', 10);

    // Seed Employees
    const empCount = await pool.query('SELECT COUNT(*) FROM employees');
    if (parseInt(empCount.rows[0].count) === 0) {
      console.log('🌱 Seeding Employees...');
      for (const emp of INITIAL_EMPLOYEES) {
        await pool.query(
          `INSERT INTO employees (id, name, role, contact, active, assigned, completed, delay_percentage, alteration_percentage, password_hash) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [emp.id, emp.name, emp.role, emp.contact, emp.active, emp.assigned || 0, emp.completed || 0, emp.delayPercentage || 0, emp.alterationPercentage || 0, defaultHash]
        );
      }
    }

    // Seed Customers
    const custCount = await pool.query('SELECT COUNT(*) FROM customers');
    if (parseInt(custCount.rows[0].count) === 0) {
      console.log('🌱 Seeding Customers...');
      for (const cust of INITIAL_CUSTOMERS) {
        await pool.query(
          `INSERT INTO customers (id, name, mobile, whatsapp, email, address, dob, anniversary, tags, design_preferences, images, measurements, password_hash) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [cust.id, cust.name, cust.mobile, cust.whatsapp, cust.email, cust.address, cust.dob, cust.anniversary, cust.tags, cust.designPreferences, cust.images, JSON.stringify(cust.measurements), defaultHash]
        );
      }
    }

    // Seed Orders
    const orderCount = await pool.query('SELECT COUNT(*) FROM orders');
    if (parseInt(orderCount.rows[0].count) === 0) {
      console.log('🌱 Seeding Orders...');
      for (const order of INITIAL_ORDERS) {
        await pool.query(
          `INSERT INTO orders (id, customer_id, customer_name, garment_type, quantity, delivery_date, trial_date, assigned_tailor, assigned_designer, priority, status, notes, reference_image, fabric_used, fabric_quantity, stitching_cost, fabric_cost, advance_paid, payment_method) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
          [order.id, order.customerId, order.customerName, order.garmentType, order.quantity, order.deliveryDate, order.trialDate, order.assignedTailor, order.assignedDesigner, order.priority, order.status, order.notes, order.referenceImage, order.fabricUsed, order.fabricQuantity, order.stitchingCost, order.fabricCost, order.advancePaid, order.paymentMethod]
        );
      }
    }

    // Seed Design Library
    const designCount = await pool.query('SELECT COUNT(*) FROM design_library');
    if (parseInt(designCount.rows[0].count) === 0) {
      console.log('🌱 Seeding Design Library...');
      for (const design of INITIAL_DESIGN_LIBRARY) {
        await pool.query(
          `INSERT INTO design_library (id, title, category, image, description, budget, neck_type, sleeve_type, occasion, rating, reviews_count, base_price) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [design.id, design.title, design.category, design.image, design.description, design.budget, design.neckType, design.sleeveType, design.occasion, design.rating, design.reviewsCount, design.basePrice]
        );
      }
    }

    // Seed Inventory (Fabrics & Accessories)
    const fabCount = await pool.query('SELECT COUNT(*) FROM inventory_fabrics');
    if (parseInt(fabCount.rows[0].count) === 0) {
      console.log('🌱 Seeding Fabrics...');
      for (const fab of INITIAL_INVENTORY.fabrics) {
        await pool.query(
          `INSERT INTO inventory_fabrics (id, name, color, supplier, quantity, min_stock) 
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [fab.id, fab.name, fab.color, fab.supplier, fab.quantity, fab.minStock]
        );
      }
    }

    const accCount = await pool.query('SELECT COUNT(*) FROM inventory_accessories');
    if (parseInt(accCount.rows[0].count) === 0) {
      console.log('🌱 Seeding Accessories...');
      for (const acc of INITIAL_INVENTORY.accessories) {
        await pool.query(
          `INSERT INTO inventory_accessories (id, name, type, quantity, min_stock) 
           VALUES ($1, $2, $3, $4, $5)`,
          [acc.id, acc.name, acc.type, acc.quantity, acc.minStock]
        );
      }
    }

    // Seed Appointments
    const aptCount = await pool.query('SELECT COUNT(*) FROM appointments');
    if (parseInt(aptCount.rows[0].count) === 0) {
      console.log('🌱 Seeding Appointments...');
      for (const apt of INITIAL_APPOINTMENTS) {
        const id = `APT-${100 + Math.floor(Math.random() * 900)}`;
        await pool.query(
          `INSERT INTO appointments (id, customer_name, type, date, time, designer, notes) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, apt.customerName, apt.type, apt.date, apt.time, apt.designer, apt.notes]
        );
      }
    }

    console.log('🌱 Seeding completed successfully.');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  }
}

export function getPool() {
  return pool;
}
