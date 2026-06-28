import React, { useState, useEffect } from 'react';
import { 
  User, Scissors, FileText, CheckCircle, Calendar, Users, 
  CreditCard, Layers, LogOut, MessageSquare, TrendingUp, 
  AlertTriangle, Plus, Search, Filter, ArrowRight, Clock, 
  Sparkles, X, Printer, Download, Tag, ShoppingBag, 
  Smartphone, Sun, Moon, Eye, RefreshCw, ChevronRight, Check,
  ShoppingCart, Trash2, Heart
} from 'lucide-react';
import './App.css';

import { 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_EMPLOYEES, 
  INITIAL_INVENTORY, 
  INITIAL_APPOINTMENTS, 
  INITIAL_DESIGN_LIBRARY 
} from './mockData';

const BoutiqueLogo = () => (
  <svg 
    width="44" 
    height="44" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="var(--gold)" 
    strokeWidth="1.8" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    style={{ marginBottom: '8px', display: 'block', margin: '0 auto' }}
  >
    <path d="M12 5V2.5a1.5 1.5 0 0 1 1.5-1.5h1" />
    <circle cx="8" cy="8" r="2.5" />
    <circle cx="16" cy="8" r="2.5" />
    <circle cx="12" cy="12" r="1.2" fill="var(--gold)" />
    <path d="M9.8 9.8l4.4 7.2" />
    <path d="M14.2 9.8L9.8 17" />
    <path d="M5 17h14" />
  </svg>
);

function App() {
  const API_BASE = import.meta.env.VITE_API_URL || '';
  // Theme State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('boutique_theme') || 'dark';
  });

  const [showPassword, setShowPassword] = useState(false);

  // Data States loaded from LocalStorage or defaults
  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem('boutique_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('boutique_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('boutique_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('boutique_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem('boutique_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [designLibrary, setDesignLibrary] = useState(() => {
    const saved = localStorage.getItem('boutique_design_library');
    return saved ? JSON.parse(saved) : INITIAL_DESIGN_LIBRARY;
  });

  const [whatsappLogs, setWhatsappLogs] = useState(() => {
    const saved = localStorage.getItem('boutique_whatsapp_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & Role States
  const [employeeSession, setEmployeeSession] = useState(() => {
    const saved = localStorage.getItem('boutique_employee_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentRole, setCurrentRole] = useState(() => {
    const savedEmp = localStorage.getItem('boutique_employee_session');
    if (savedEmp) {
      return JSON.parse(savedEmp).role;
    }
    const savedCust = localStorage.getItem('boutique_customer_session');
    if (savedCust) {
      return 'Customer Portal';
    }
    return 'Customer Portal';
  });

  const [currentTab, setCurrentTab] = useState(() => {
    const savedEmp = localStorage.getItem('boutique_employee_session');
    if (savedEmp) {
      const role = JSON.parse(savedEmp).role;
      return (role === 'Tailor' || role === 'Designer') ? 'orders' : 'dashboard';
    }
    return 'portal-home';
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Gateway / Router Portal States (Client Lounge vs Staff Atelier)
  const [portalMode, setPortalMode] = useState(() => {
    return window.location.hash === '#/staff' ? 'staff' : 'customer';
  });

  useEffect(() => {
    const handleHashChange = () => {
      setPortalMode(window.location.hash === '#/staff' ? 'staff' : 'customer');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [employeeLoginId, setEmployeeLoginId] = useState('');
  const [employeeLoginPin, setEmployeeLoginPin] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Portal States
  const [selectedPortalCustomer, setSelectedPortalCustomer] = useState(() => {
    return INITIAL_CUSTOMERS[0]?.id || '';
  });

  // Measurement Comparison State
  const [compVersion1, setCompVersion1] = useState('');
  const [compVersion2, setCompVersion2] = useState('');
  const [activeGarmentTab, setActiveGarmentTab] = useState('blouse');

  // Modals visibility
  const [showAddCustModal, setShowAddCustModal] = useState(false);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddAptModal, setShowAddAptModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpId, setNewEmpId] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Tailor');
  const [newEmpContact, setNewEmpContact] = useState('');
  const [newEmpPassword, setNewEmpPassword] = useState('');
  
  // Printable states
  const [showKOTPrint, setShowKOTPrint] = useState(false);
  const [showInvoicePrint, setShowInvoicePrint] = useState(false);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);

  // Simulated WhatsApp Notification Toast
  const [activeNotification, setActiveNotification] = useState(null);

  // E-commerce Customer Portal States
  const [customerSession, setCustomerSession] = useState(() => {
    const saved = localStorage.getItem('boutique_customer_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [ecommerceTab, setEcommerceTab] = useState('shop');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('boutique_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Login / Reg inputs
  const [loginMobile, setLoginMobile] = useState('');
  const [loginTab, setLoginTab] = useState('login'); // 'login' | 'register'
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPreferences, setRegPreferences] = useState('');

  // Customizer inputs
  const [customizerFabric, setCustomizerFabric] = useState('Boutique Stock Fabric');
  const [customizerColor, setCustomizerColor] = useState('Royal Crimson');
  const [customizerSizingMode, setCustomizerSizingMode] = useState('standard'); // 'passport' | 'custom' | 'standard'
  const [customizerStandardSize, setCustomizerStandardSize] = useState('M');
  const [customizerDesigner, setCustomizerDesigner] = useState('EMP-003'); // Default designer Anjali
  const [customizerTrialDate, setCustomizerTrialDate] = useState('');
  const [customizerDeliveryDate, setCustomizerDeliveryDate] = useState('');
  const [customizerNotes, setCustomizerNotes] = useState('');
  const [customizerUploadedDesign, setCustomizerUploadedDesign] = useState(null);

  // Custom dimensions state if sizingMode is 'custom'
  const [customDimensions, setCustomDimensions] = useState({
    bust: 36,
    waist: 30,
    shoulder: 15,
    sleeveLength: 10,
    armRound: 12,
    frontNeck: 7.5,
    backNeck: 8,
    length: 15
  });

  // CRM Manual Broadcast
  const [crmSegment, setCrmSegment] = useState('VIP');
  const [crmChannel, setCrmChannel] = useState('WhatsApp');
  const [crmMessage, setCrmMessage] = useState('Dear Valued Customer, we have launched our new festive collection! Visit us this weekend for an exclusive preview and get 15% off.');

  // Form Fields States
  // 1. Customer
  const [newCustName, setNewCustName] = useState('');
  const [newCustMobile, setNewCustMobile] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustDob, setNewCustDob] = useState('');
  const [newCustAnniversary, setNewCustAnniversary] = useState('');
  const [newCustTags, setNewCustTags] = useState('Regular');
  
  // 2. Order
  const [newOrdCust, setNewOrdCust] = useState('');
  const [newOrdGarment, setNewOrdGarment] = useState('Blouse');
  const [newOrdQty, setNewOrdQty] = useState(1);
  const [newOrdDelDate, setNewOrdDelDate] = useState('');
  const [newOrdTrialDate, setNewOrdTrialDate] = useState('');
  const [newOrdTailor, setNewOrdTailor] = useState('');
  const [newOrdDesigner, setNewOrdDesigner] = useState('');
  const [newOrdPriority, setNewOrdPriority] = useState('Medium');
  const [newOrdStitchCost, setNewOrdStitchCost] = useState(3000);
  const [newOrdFabricCost, setNewOrdFabricCost] = useState(1000);
  const [newOrdAdvance, setNewOrdAdvance] = useState(1000);
  const [newOrdPayMethod, setNewOrdPayMethod] = useState('UPI');
  const [newOrdNotes, setNewOrdNotes] = useState('');
  const [newOrdImage, setNewOrdImage] = useState('/design_designer_blouse.png');

  // 3. New Measurement
  const [newMeasBust, setNewMeasBust] = useState('');
  const [newMeasWaist, setNewMeasWaist] = useState('');
  const [newMeasShoulder, setNewMeasShoulder] = useState('');
  const [newMeasSleeveLen, setNewMeasSleeveLen] = useState('');
  const [newMeasArmRound, setNewMeasArmRound] = useState('');
  const [newMeasFrontNeck, setNewMeasFrontNeck] = useState('');
  const [newMeasBackNeck, setNewMeasBackNeck] = useState('');
  const [newMeasLength, setNewMeasLength] = useState('');
  const [newMeasNotes, setNewMeasNotes] = useState('');

  // 4. Appointment
  const [newAptCust, setNewAptCust] = useState('');
  const [newAptType, setNewAptType] = useState('Trial');
  const [newAptDate, setNewAptDate] = useState('');
  const [newAptTime, setNewAptTime] = useState('11:00 AM');
  const [newAptDesigner, setNewAptDesigner] = useState('');
  const [newAptNotes, setNewAptNotes] = useState('');

  // 5. Payment
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // 6. Inventory
  const [invType, setInvType] = useState('fabric');
  const [invItemName, setInvItemName] = useState('');
  const [invColorType, setInvColorType] = useState('');
  const [invSupplier, setInvSupplier] = useState('');
  const [invQty, setInvQty] = useState(10);
  const [invMinStock, setInvMinStock] = useState(5);

  // Sync state with backend database on startup
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const cRes = await fetch(`${API_BASE}/api/customers`);
        if (cRes.ok) setCustomers(await cRes.json());
        
        const oRes = await fetch(`${API_BASE}/api/orders`);
        if (oRes.ok) setOrders(await oRes.json());

        const eRes = await fetch(`${API_BASE}/api/employees`);
        if (eRes.ok) setEmployees(await eRes.json());

        const iRes = await fetch(`${API_BASE}/api/inventory`);
        if (iRes.ok) setInventory(await iRes.json());

        const aRes = await fetch(`${API_BASE}/api/appointments`);
        if (aRes.ok) setAppointments(await aRes.json());

        const dRes = await fetch(`${API_BASE}/api/designs`);
        if (dRes.ok) setDesignLibrary(await dRes.json());

        const wRes = await fetch(`${API_BASE}/api/whatsapp-logs`);
        if (wRes.ok) setWhatsappLogs(await wRes.json());
      } catch (err) {
        console.warn("Backend server not running or database offline. Using local data.", err);
      } finally {
        setIsDataLoaded(true);
      }
    };
    loadAllData();
  }, [API_BASE]);

  // Sync to LocalStorage & Backend PostgreSQL Database
  useEffect(() => {
    localStorage.setItem('boutique_customers', JSON.stringify(customers));
    if (isDataLoaded) {
      fetch(`${API_BASE}/api/sync/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customers)
      }).catch(err => console.warn('Could not sync customers to backend:', err));
    }
  }, [customers, isDataLoaded, API_BASE]);

  useEffect(() => {
    localStorage.setItem('boutique_orders', JSON.stringify(orders));
    if (isDataLoaded) {
      fetch(`${API_BASE}/api/sync/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orders)
      }).catch(err => console.warn('Could not sync orders to backend:', err));
    }
  }, [orders, isDataLoaded, API_BASE]);

  useEffect(() => {
    localStorage.setItem('boutique_employees', JSON.stringify(employees));
    if (isDataLoaded) {
      fetch(`${API_BASE}/api/sync/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employees)
      }).catch(err => console.warn('Could not sync employees to backend:', err));
    }
  }, [employees, isDataLoaded, API_BASE]);

  useEffect(() => {
    localStorage.setItem('boutique_inventory', JSON.stringify(inventory));
    if (isDataLoaded) {
      fetch(`${API_BASE}/api/sync/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventory)
      }).catch(err => console.warn('Could not sync inventory to backend:', err));
    }
  }, [inventory, isDataLoaded, API_BASE]);

  useEffect(() => {
    localStorage.setItem('boutique_appointments', JSON.stringify(appointments));
    if (isDataLoaded) {
      fetch(`${API_BASE}/api/sync/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointments)
      }).catch(err => console.warn('Could not sync appointments to backend:', err));
    }
  }, [appointments, isDataLoaded, API_BASE]);

  useEffect(() => {
    localStorage.setItem('boutique_design_library', JSON.stringify(designLibrary));
    if (isDataLoaded) {
      fetch(`${API_BASE}/api/sync/designs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(designLibrary)
      }).catch(err => console.warn('Could not sync design library to backend:', err));
    }
  }, [designLibrary, isDataLoaded, API_BASE]);

  useEffect(() => {
    localStorage.setItem('boutique_whatsapp_logs', JSON.stringify(whatsappLogs));
    if (isDataLoaded) {
      fetch(`${API_BASE}/api/sync/whatsapp-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(whatsappLogs)
      }).catch(err => console.warn('Could not sync whatsapp logs to backend:', err));
    }
  }, [whatsappLogs, isDataLoaded, API_BASE]);

  useEffect(() => {
    localStorage.setItem('boutique_theme', theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [theme]);

  // Sync e-commerce customer session
  useEffect(() => {
    if (customerSession) {
      localStorage.setItem('boutique_customer_session', JSON.stringify(customerSession));
    } else {
      localStorage.removeItem('boutique_customer_session');
    }
  }, [customerSession]);

  // Sync e-commerce cart
  useEffect(() => {
    localStorage.setItem('boutique_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync employee session
  useEffect(() => {
    if (employeeSession) {
      localStorage.setItem('boutique_employee_session', JSON.stringify(employeeSession));
    } else {
      localStorage.removeItem('boutique_employee_session');
    }
  }, [employeeSession]);

  // Tab restriction security enforcement
  useEffect(() => {
    if (employeeSession) {
      const role = employeeSession.role;
      const isTabAllowed = (r, t) => {
        if (r === 'Boutique Owner') return true;
        if (r === 'Receptionist') {
          return ['dashboard', 'customers', 'orders', 'designs', 'appointments', 'billing', 'whatsapp'].includes(t);
        }
        if (r === 'Tailor') {
          return ['orders'].includes(t);
        }
        if (r === 'Designer') {
          return ['orders', 'designs', 'appointments'].includes(t);
        }
        return false;
      };
      
      if (!isTabAllowed(role, currentTab)) {
        setCurrentTab((role === 'Tailor' || role === 'Designer') ? 'orders' : 'dashboard');
      }
    }
  }, [currentRole, currentTab, employeeSession]);

  // Helper to send transactional emails via local Resend server
  const sendEmailAlert = async (subject, htmlContent, recipient = '') => {
    try {
      const response = await fetch(`${API_BASE}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          subject: subject,
          html: htmlContent
        })
      });
      if (!response.ok) {
        const errData = await response.json();
        console.error('Email sending failed:', errData.error);
      } else {
        console.log('Email sent successfully to:', recipient || 'default recipient');
      }
    } catch (err) {
      console.error('Email dispatch connection error (is the backend server running on port 5000?):', err);
    }
  };

  // Helper to trigger simulated WhatsApp notification
  const triggerWhatsApp = (customerName, mobile, type, message, email = '') => {
    const newLog = {
      id: `WA-LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
      customerName,
      mobile,
      type,
      message,
      status: 'Sent'
    };
    setWhatsappLogs(prev => [newLog, ...prev]);
    setActiveNotification({
      customerName,
      type,
      message
    });
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);

    // Try to determine recipient email if not explicitly provided
    let recipientEmail = email;
    if (!recipientEmail && mobile) {
      const cleanMobile = mobile.replace(/\D/g, '');
      const foundCust = customers.find(c => {
        const cMobile = c.mobile ? c.mobile.replace(/\D/g, '') : '';
        const cWhatsapp = c.whatsapp ? c.whatsapp.replace(/\D/g, '') : '';
        return (cMobile && (cMobile.includes(cleanMobile) || cleanMobile.includes(cMobile))) ||
               (cWhatsapp && (cWhatsapp.includes(cleanMobile) || cleanMobile.includes(cWhatsapp)));
      });
      if (foundCust && foundCust.email) {
        recipientEmail = foundCust.email;
      }
    }

    // Call Resend email API in background to notify the customer/store
    const emailSubject = `BoutiqueOS Haute Couture Alert: ${type}`;
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #dddddd; border-radius: 12px; background-color: #ffffff; color: #333333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 1px;">SAMYUS BOUTIQUE</h2>
          <span style="font-size: 11px; text-transform: uppercase; color: #999;">Haute Couture & Atelier Console</span>
        </div>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin-bottom: 20px;" />
        <p>Dear <strong>${customerName}</strong>,</p>
        <p style="font-size: 15px; line-height: 1.6; background-color: #fcfbf7; border-left: 4px solid #d4af37; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
          ${message}
        </p>
        <p style="font-size: 12px; color: #999999; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; text-align: center;">
          This is an automated transmission from your BoutiqueOS Client Portal. Please do not reply directly.
        </p>
      </div>
    `;
    sendEmailAlert(emailSubject, emailHtml, recipientEmail);
  };

  // Status List mapping
  const STATUS_LIST = [
    "Order Created",
    "Measurement Taken",
    "Design Approved",
    "Cutting",
    "Stitching",
    "Trial Scheduled",
    "Alteration",
    "Ready for Delivery",
    "Delivered",
    "Closed"
  ];

  // Calculated Dashboard stats
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Closed').length;
  
  const totalRevenue = orders.reduce((sum, o) => {
    const stitch = Number(o.stitchingCost || 0);
    const fab = Number(o.fabricCost || 0);
    const totalCost = stitch + fab;
    const paid = Number(o.advancePaid || 0);
    return sum + paid;
  }, 0);

  const totalInvoiced = orders.reduce((sum, o) => {
    const stitch = Number(o.stitchingCost || 0);
    const fab = Number(o.fabricCost || 0);
    return sum + (stitch + fab);
  }, 0);

  const balanceDueTotal = totalInvoiced - totalRevenue;

  const lowStockCount = 
    inventory.fabrics.filter(f => f.quantity <= f.minStock).length + 
    inventory.accessories.filter(a => a.quantity <= a.minStock).length;

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setCurrentRole(role);
    if (role === 'Customer Portal') {
      setCurrentTab('portal-home');
    } else if (role === 'Tailor' || role === 'Designer') {
      setCurrentTab('orders');
    } else {
      setCurrentTab('dashboard');
    }
  };

  // E-commerce Portal Action Handlers
  const handleEcommerceLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginMobile) {
      alert("Please enter a mobile number");
      return;
    }
    const cleanMobile = loginMobile.replace(/\D/g, ''); // strip non-numeric

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanMobile, password: loginPassword || '123456' })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('boutique_token', data.token);
        setCustomerSession(data.user);
        setCurrentRole('Customer Portal');
        setCurrentTab('portal-home');
        setEcommerceTab('shop');
        setLoginMobile('');
        setLoginPassword('');
        triggerWhatsApp(
          data.user.name,
          data.user.mobile,
          "Access Alert",
          `Hello ${data.user.name}, you have successfully signed into your BoutiqueOS Client Portal.`,
          data.user.email
        );
        return;
      } else {
        console.warn("Backend auth failed, trying local fallback:", data.error);
      }
    } catch (err) {
      console.warn("Backend connection failed, trying local fallback...", err);
    }

    // Local Fallback
    const found = customers.find(c => c.mobile.includes(cleanMobile) || cleanMobile.includes(c.mobile));
    if (found) {
      setCustomerSession(found);
      setCurrentRole('Customer Portal');
      setCurrentTab('portal-home');
      setEcommerceTab('shop');
      setLoginMobile('');
      setLoginPassword('');
      triggerWhatsApp(
        found.name,
        found.mobile,
        "Access Alert",
        `Hello ${found.name}, you have successfully signed into your BoutiqueOS Haute Couture e-store. Start designing your dream garments today!`,
        found.email
      );
    } else {
      alert("No customer account found with this mobile number. Please check the number or switch to Register!");
    }
  };

  const handleEcommerceRegister = async (e) => {
    if (e) e.preventDefault();
    if (!regName || !regMobile) {
      alert("Please enter both Name and Mobile number");
      return;
    }
    const cleanMobile = regMobile.replace(/\D/g, '');
    const exists = customers.find(c => c.mobile.includes(cleanMobile) || cleanMobile.includes(c.mobile));
    if (exists) {
      alert("An account with this mobile number already exists. Please Log In.");
      setLoginTab('login');
      setLoginMobile(regMobile);
      return;
    }

    const newCust = {
      id: `CUST-0${customers.length + 1}`,
      name: regName,
      mobile: cleanMobile,
      whatsapp: `+91 ${cleanMobile}`,
      email: regEmail || `${regName.toLowerCase().replace(/\s/g, '')}@example.com`,
      address: regAddress || 'Address Not Provided',
      dob: regDob || '1995-01-01',
      anniversary: null,
      tags: ["New", "Regular"],
      designPreferences: regPreferences || 'No specific preferences set.',
      images: [],
      measurements: { blouse: [], chudidar: [], lehenga: [], gown: [] }
    };

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCust,
          password: regPassword || '123456'
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('boutique_token', data.token);
        setCustomers([data.user, ...customers]);
        setCustomerSession(data.user);
        setCurrentRole('Customer Portal');
        setCurrentTab('portal-home');
        setEcommerceTab('shop');
        
        setRegName('');
        setRegMobile('');
        setRegEmail('');
        setRegDob('');
        setRegAddress('');
        setRegPreferences('');
        setRegPassword('');
        
        triggerWhatsApp(
          data.user.name,
          data.user.mobile,
          "Welcome Message",
          `Welcome ${data.user.name}! You are registered with BoutiqueOS Haute Couture.`,
          data.user.email
        );
        return;
      }
    } catch (err) {
      console.warn("Backend registration failed, using local storage:", err);
    }

    // Local Fallback
    setCustomers([newCust, ...customers]);
    setCustomerSession(newCust);
    setCurrentRole('Customer Portal');
    setCurrentTab('portal-home');
    setEcommerceTab('shop');
    
    setRegName('');
    setRegMobile('');
    setRegEmail('');
    setRegDob('');
    setRegAddress('');
    setRegPreferences('');
    setRegPassword('');

    triggerWhatsApp(
      newCust.name,
      newCust.mobile,
      "Welcome Message",
      `Welcome ${newCust.name}! You are registered with BoutiqueOS Haute Couture. Browse our catalog, choose a design, customize fit options, and checkout.`,
      newCust.email
    );
  };

  const handleEmployeeLogin = async (e) => {
    if (e) e.preventDefault();
    if (!employeeLoginId) {
      alert("Please enter your Employee ID");
      return;
    }
    const cleanId = employeeLoginId.trim().toUpperCase();

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanId, password: employeeLoginPin || '123456' })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('boutique_token', data.token);
        setEmployeeSession(data.user);
        setCurrentRole(data.user.role);
        if (data.user.role === 'Tailor' || data.user.role === 'Designer') {
          setCurrentTab('orders');
        } else {
          setCurrentTab('dashboard');
        }
        
        setEmployeeLoginId('');
        setEmployeeLoginPin('');
        
        triggerWhatsApp(
          data.user.name,
          data.user.contact,
          "Staff Login Alert",
          `Hello ${data.user.name}, you have successfully signed into the BoutiqueOS Atelier Console as ${data.user.role}.`
        );
        return;
      } else {
        console.warn("Backend login failed, trying local fallback:", data.error);
      }
    } catch (err) {
      console.warn("Backend server connection failed, trying local fallback...", err);
    }

    // Local Fallback
    const found = employees.find(emp => emp.id.toUpperCase() === cleanId);
    if (found) {
      if (!found.active) {
        alert("This employee profile is currently deactivated.");
        return;
      }
      setEmployeeSession(found);
      setCurrentRole(found.role);
      if (found.role === 'Tailor' || found.role === 'Designer') {
        setCurrentTab('orders');
      } else {
        setCurrentTab('dashboard');
      }
      
      setEmployeeLoginId('');
      setEmployeeLoginPin('');
      
      triggerWhatsApp(
        found.name,
        found.contact,
        "Staff Login Alert",
        `Hello ${found.name}, you have successfully signed into the BoutiqueOS Atelier Console as ${found.role}.`
      );
    } else {
      alert("Invalid Employee ID. Please use EMP-001 (Owner), EMP-002 (Tailor), EMP-003 (Designer), or EMP-006 (Receptionist) for testing.");
    }
  };

  const handleEmployeeLogout = () => {
    setEmployeeSession(null);
    localStorage.removeItem('boutique_employee_session');
    setCurrentRole('Customer Portal');
    setCurrentTab('portal-home');
  };

  const handleGuestLogin = () => {
    const guest = { id: 'GUEST', name: 'Guest Client', mobile: '', isGuest: true };
    setCustomerSession(guest);
    setCurrentRole('Customer Portal');
    setCurrentTab('portal-home');
    setEcommerceTab('shop');
  };

  const handleCustomerLogout = () => {
    setCustomerSession(null);
    localStorage.removeItem('boutique_customer_session');
    setCart([]);
    setEcommerceTab('shop');
    setCurrentRole('Customer Portal');
    setCurrentTab('portal-home');
  };

  const handleAddToCart = (product) => {
    // Determine fabric cost
    let fabricCost = 0;
    if (customizerFabric !== 'Provide My Own Fabric') {
      fabricCost = product.category === 'Lehenga' ? 5000 : (product.category === 'Gown' ? 3000 : 1500);
    }

    const customization = {
      fabric: customizerFabric,
      fabricCost: fabricCost,
      color: customizerColor,
      sizingMode: customizerSizingMode,
      standardSize: customizerStandardSize,
      customMeasurements: customizerSizingMode === 'custom' ? { ...customDimensions } : null,
      designer: customizerDesigner,
      trialDate: customizerTrialDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryDate: customizerDeliveryDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: customizerNotes,
      uploadedDesign: customizerUploadedDesign
    };

    const cartItem = {
      id: `CART-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      product,
      customization,
      quantity: 1
    };

    setCart([...cart, cartItem]);
    alert(`${product.title} added to custom shopping cart!`);
    setEcommerceTab('cart');

    // Reset fields
    setCustomizerNotes('');
    setCustomizerUploadedDesign(null);
  };

  const handleRemoveFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const handleEcommerceCheckout = (e, guestDetails = null) => {
    if (e) e.preventDefault();
    
    let finalCustomer = customerSession;
    if (!finalCustomer) {
      if (!guestDetails || !guestDetails.name || !guestDetails.mobile) {
        alert("Please log in or fill in guest details to checkout.");
        return;
      }
      const cleanMobile = guestDetails.mobile.replace(/\D/g, '');
      const found = customers.find(c => c.mobile.includes(cleanMobile) || cleanMobile.includes(c.mobile));
      if (found) {
        finalCustomer = found;
        setCustomerSession(found);
      } else {
        const guestCust = {
          id: `CUST-0${customers.length + 1}`,
          name: guestDetails.name,
          mobile: cleanMobile,
          whatsapp: `+91 ${cleanMobile}`,
          email: guestDetails.email || `${guestDetails.name.toLowerCase().replace(/\s/g, '')}@example.com`,
          address: guestDetails.address || 'Address Not Provided',
          dob: '1995-01-01',
          anniversary: null,
          tags: ["New", "Regular"],
          designPreferences: 'Guest Order Placed.',
          images: [],
          measurements: { blouse: [], chudidar: [], lehenga: [], gown: [] }
        };
        setCustomers(prev => [guestCust, ...prev]);
        finalCustomer = guestCust;
        setCustomerSession(guestCust);
      }
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const newOrdersList = cart.map((item, idx) => {
      const stitchCost = item.product.basePrice;
      const fabricCost = item.customization.fabricCost;
      const totalCost = stitchCost + fabricCost;
      
      const availableTailor = employees.find(e => e.role === 'Tailor' && e.active) || employees[1];
      
      // Update customer passport if custom size entered
      if (item.customization.sizingMode === 'custom' && item.customization.customMeasurements) {
        const typeKey = item.product.category.toLowerCase();
        const updatedCustomers = customers.map(c => {
          if (c.id === finalCustomer.id) {
            const history = c.measurements[typeKey] || [];
            const nextVer = history.length + 1;
            const newMeas = {
              version: nextVer,
              date: new Date().toISOString().split('T')[0],
              ...item.customization.customMeasurements,
              notes: `Entered at checkout for ${item.product.title}`
            };
            return {
              ...c,
              measurements: {
                ...c.measurements,
                [typeKey]: [newMeas, ...history]
              }
            };
          }
          return c;
        });
        setCustomers(updatedCustomers);
      }

      return {
        id: `ORD-${100 + orders.length + idx + 1}`,
        customerId: finalCustomer.id,
        customerName: finalCustomer.name,
        garmentType: item.product.category,
        quantity: item.quantity,
        deliveryDate: item.customization.deliveryDate,
        trialDate: item.customization.trialDate,
        assignedTailor: availableTailor.id,
        assignedDesigner: item.customization.designer,
        priority: item.product.category === 'Lehenga' ? 'High' : 'Medium',
        status: 'Order Created',
        notes: `[E-COMMERCE ORDER] Fabric: ${item.customization.fabric}. Color: ${item.customization.color}. Size: ${item.customization.sizingMode === 'passport' ? 'Passport Fit' : (item.customization.sizingMode === 'standard' ? `Standard ${item.customization.standardSize}` : 'Custom Measurements')}. Special Info: ${item.customization.notes || 'None'}`,
        referenceImage: item.customization.uploadedDesign || item.product.image,
        fabricUsed: item.customization.fabric,
        fabricQuantity: item.product.category === 'Lehenga' ? '5.5 meters' : '2 meters',
        stitchingCost: stitchCost,
        fabricCost: fabricCost,
        advancePaid: Math.floor(totalCost * 0.5),
        paymentMethod: 'UPI'
      };
    });

    setOrders(prev => [...newOrdersList, ...prev]);

    const primaryOrd = newOrdersList[0];
    triggerWhatsApp(
      finalCustomer.name,
      finalCustomer.mobile,
      "Order Created",
      `Dear ${finalCustomer.name}, thank you for placing custom orders (${newOrdersList.map(o => o.id).join(', ')}). Total stitching charges: ₹${newOrdersList.reduce((acc, o) => acc + o.stitchingCost, 0)}. 50% advance UPI payment received. Trial scheduled on ${primaryOrd.trialDate}.`,
      finalCustomer.email
    );

    setCart([]);
    setEcommerceTab('my-orders');
    alert("Bespoke order successfully placed! You can track progress in the orders panel.");
  };

  // Create new customer handler
  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newCustName || !newCustMobile) return;
    
    const newCust = {
      id: `CUST-0${customers.length + 1}`,
      name: newCustName,
      mobile: newCustMobile,
      whatsapp: newCustMobile,
      email: newCustEmail || `${newCustName.toLowerCase().replace(/\s/g, '')}@example.com`,
      address: newCustAddress || 'Address Not Provided',
      dob: newCustDob || '1995-01-01',
      anniversary: newCustAnniversary || null,
      tags: [newCustTags],
      designPreferences: 'No preferences set yet.',
      images: [],
      measurements: { blouse: [], chudidar: [], lehenga: [], gown: [] }
    };

    setCustomers([newCust, ...customers]);
    setShowAddCustModal(false);
    
    // Auto WhatsApp
    triggerWhatsApp(
      newCust.name, 
      newCust.mobile, 
      "Welcome Message", 
      `Hello ${newCust.name}! Welcome to BoutiqueOS Haute Couture. Your digital profile has been registered. You can access your customer portal via mobile using your number.`,
      newCust.email
    );

    // Reset fields
    setNewCustName('');
    setNewCustMobile('');
    setNewCustEmail('');
    setNewCustAddress('');
    setNewCustDob('');
    setNewCustAnniversary('');
  };

  // Create new order handler
  const handleAddOrder = (e) => {
    e.preventDefault();
    if (!newOrdCust || !newOrdDelDate) return;

    const custObj = customers.find(c => c.id === newOrdCust);
    const newOrd = {
      id: `ORD-${100 + orders.length + 1}`,
      customerId: newOrdCust,
      customerName: custObj ? custObj.name : 'Unknown Customer',
      garmentType: newOrdGarment,
      quantity: Number(newOrdQty),
      deliveryDate: newOrdDelDate,
      trialDate: newOrdTrialDate || newOrdDelDate,
      assignedTailor: newOrdTailor || INITIAL_EMPLOYEES[1].id,
      assignedDesigner: newOrdDesigner || INITIAL_EMPLOYEES[2].id,
      priority: newOrdPriority,
      status: "Order Created",
      notes: newOrdNotes,
      referenceImage: newOrdImage,
      fabricUsed: "Standard Fabric Selection",
      fabricQuantity: "As per requirement",
      stitchingCost: Number(newOrdStitchCost),
      fabricCost: Number(newOrdFabricCost),
      advancePaid: Number(newOrdAdvance),
      paymentMethod: newOrdPayMethod
    };

    // Update Employee assigned orders
    const updatedEmps = employees.map(emp => {
      if (emp.id === newOrdTailor || emp.id === newOrdDesigner) {
        return { ...emp, assigned: (emp.assigned || 0) + 1 };
      }
      return emp;
    });
    setEmployees(updatedEmps);

    setOrders([newOrd, ...orders]);
    setShowAddOrderModal(false);

    // Auto WhatsApp Notification
    triggerWhatsApp(
      newOrd.customerName,
      custObj ? custObj.whatsapp : '+91 99999 99999',
      "Order Created",
      `Dear ${newOrd.customerName},\nYour custom order ${newOrd.id} for a ${newOrd.garmentType} has been successfully created!\nStitching Charges: ₹${newOrd.stitchingCost}\nAdvance Paid: ₹${newOrd.advancePaid}\nExpected Trial Date: ${newOrd.trialDate}\nEstimated Delivery: ${newOrd.deliveryDate}.\n\nTrack your order in your Customer Portal.`,
      custObj ? custObj.email : ''
    );

    // Reset fields
    setNewOrdQty(1);
    setNewOrdNotes('');
    setNewOrdStitchCost(3000);
    setNewOrdFabricCost(1000);
    setNewOrdAdvance(1000);
  };

  // Measurement Version creation
  const handleAddMeasurement = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    const newVersionNum = (selectedCustomer.measurements[activeGarmentTab]?.length || 0) + 1;
    
    let measData = {};
    if (activeGarmentTab === 'gown') {
      measData = {
        version: newVersionNum,
        date: new Date().toISOString().split('T')[0],
        fullMeasurements: `Bust: ${newMeasBust || 'N/A'}, Waist: ${newMeasWaist || 'N/A'}, Shoulder: ${newMeasShoulder || 'N/A'}, Sleeve: ${newMeasSleeveLen || 'N/A'}, Length: ${newMeasLength || 'N/A'}`,
        notes: newMeasNotes || 'Added via measurements passport'
      };
    } else {
      measData = {
        version: newVersionNum,
        date: new Date().toISOString().split('T')[0],
        bust: Number(newMeasBust || 0),
        waist: Number(newMeasWaist || 0),
        shoulder: Number(newMeasShoulder || 0),
        sleeveLength: Number(newMeasSleeveLen || 0),
        armRound: Number(newMeasArmRound || 0),
        frontNeck: Number(newMeasFrontNeck || 0),
        backNeck: Number(newMeasBackNeck || 0),
        length: Number(newMeasLength || 0),
        chest: Number(newMeasBust || 0), // maps to chest for chudidar
        hip: Number(newMeasWaist || 0) * 1.25, // mock hip
        height: Number(newMeasLength || 0), // maps to height
        sleeve: Number(newMeasSleeveLen || 0),
        notes: newMeasNotes || 'Updated profile measurements'
      };
    }

    const updatedCusts = customers.map(c => {
      if (c.id === selectedCustomer.id) {
        const currentGarmentList = c.measurements[activeGarmentTab] || [];
        return {
          ...c,
          measurements: {
            ...c.measurements,
            [activeGarmentTab]: [measData, ...currentGarmentList]
          }
        };
      }
      return c;
    });

    setCustomers(updatedCusts);
    // update current selected customer view
    const updatedSelected = updatedCusts.find(c => c.id === selectedCustomer.id);
    setSelectedCustomer(updatedSelected);

    // Auto notification
    triggerWhatsApp(
      selectedCustomer.name,
      selectedCustomer.whatsapp,
      "Passport Update",
      `Hi ${selectedCustomer.name}, your Digital Measurement Passport has been updated with a new version (V${newVersionNum}) for ${activeGarmentTab.toUpperCase()}.\nView details in your customer profile.`,
      selectedCustomer.email
    );

    // reset fields
    setNewMeasBust('');
    setNewMeasWaist('');
    setNewMeasShoulder('');
    setNewMeasSleeveLen('');
    setNewMeasArmRound('');
    setNewMeasFrontNeck('');
    setNewMeasBackNeck('');
    setNewMeasLength('');
    setNewMeasNotes('');
  };

  // One click reorder from Digital Wardrobe
  const handleOneClickReorder = (garmentName, cost, referenceImage) => {
    if (!selectedCustomer) return;
    
    // Set form fields pre-populated
    setNewOrdCust(selectedCustomer.id);
    setNewOrdGarment(garmentName);
    setNewOrdQty(1);
    setNewOrdStitchCost(cost);
    setNewOrdFabricCost(0);
    setNewOrdAdvance(Math.floor(cost / 2));
    setNewOrdNotes(`One-click reorder of wardrobe item: ${garmentName}`);
    setNewOrdImage(referenceImage);
    
    const today = new Date();
    const trial = new Date();
    trial.setDate(today.getDate() + 10);
    const del = new Date();
    del.setDate(today.getDate() + 14);

    setNewOrdTrialDate(trial.toISOString().split('T')[0]);
    setNewOrdDelDate(del.toISOString().split('T')[0]);

    setShowAddOrderModal(true);
  };

  // Appointment creation
  const handleAddAppointment = (e) => {
    e.preventDefault();
    if (!newAptCust || !newAptDate) return;

    const custObj = customers.find(c => c.id === newAptCust);
    const newApt = {
      id: `APT-${100 + appointments.length + 1}`,
      customerName: custObj ? custObj.name : 'Walk-in Client',
      type: newAptType,
      date: newAptDate,
      time: newAptTime,
      designer: newAptDesigner || 'Anjali Malhotra',
      notes: newAptNotes
    };

    setAppointments([newApt, ...appointments]);
    setShowAddAptModal(false);

    // WhatsApp Reminder
    triggerWhatsApp(
      newApt.customerName,
      custObj ? custObj.whatsapp : '+91 99999 99999',
      "Appointment Booked",
      `Hello ${newApt.customerName},\nYour ${newApt.type} consultation at BoutiqueOS has been scheduled successfully!\nDate: ${newApt.date}\nTime: ${newApt.time}\nAssigned consultant: ${newApt.designer}.\nWe look forward to seeing you!`,
      custObj ? custObj.email : ''
    );

    setNewAptNotes('');
  };

  // Update order status & trigger WhatsApp automation
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(ord => {
      if (ord.id === orderId) {
        // Trigger status specific alerts
        const customerObj = customers.find(c => c.id === ord.customerId);
        const phone = customerObj ? customerObj.whatsapp : '+91 99999 99999';
        
        let msg = '';
        if (newStatus === 'Design Approved') {
          msg = `Hi ${ord.customerName}, your design draft for order ${ord.id} has been approved by the designer and cutting has commenced.`;
        } else if (newStatus === 'Stitching') {
          msg = `Hello ${ord.customerName}, great news! Tailoring work has started on your garment ${ord.id}.`;
        } else if (newStatus === 'Trial Scheduled') {
          msg = `Hi ${ord.customerName}, your trial schedule for order ${ord.id} is set for ${ord.trialDate}. Please visit the boutique as scheduled.`;
        } else if (newStatus === 'Ready for Delivery') {
          msg = `Congratulations ${ord.customerName}! Your custom garment is finished, steam-pressed, and ready for pickup. Please clear pending balance (if any) during delivery.`;
        } else if (newStatus === 'Delivered') {
          msg = `Thank you for shopping with BoutiqueOS Haute Couture! Your order ${ord.id} has been marked as delivered. We value your feedback.`;
        } else {
          msg = `Hello ${ord.customerName}, your order ${ord.id} status has been updated to: ${newStatus.toUpperCase()}.`;
        }

        triggerWhatsApp(ord.customerName, phone, `Status: ${newStatus}`, msg, customerObj ? customerObj.email : '');
        return { ...ord, status: newStatus };
      }
      return ord;
    });

    setOrders(updatedOrders);
    
    // Update active order view if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updatedOrders.find(o => o.id === orderId));
    }
  };

  // Record order payment
  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedOrder || !paymentAmount) return;

    const amt = Number(paymentAmount);
    const updatedOrders = orders.map(ord => {
      if (ord.id === selectedOrder.id) {
        const prevPaid = Number(ord.advancePaid || 0);
        return { 
          ...ord, 
          advancePaid: prevPaid + amt,
          paymentMethod: paymentMethod 
        };
      }
      return ord;
    });

    setOrders(updatedOrders);
    const updatedSel = updatedOrders.find(o => o.id === selectedOrder.id);
    setSelectedOrder(updatedSel);
    setShowPaymentModal(false);

    const customerObj = customers.find(c => c.id === selectedOrder.customerId);
    const customerEmail = customerObj ? customerObj.email : '';

    // Whatsapp payment receipt
    triggerWhatsApp(
      selectedOrder.customerName,
      customerObj ? customerObj.whatsapp : "+91 98765 43210",
      "Payment Received",
      `Payment Received! We have received a payment of ₹${amt} via ${paymentMethod} towards order ${selectedOrder.id}.\nTotal Paid so far: ₹${updatedSel.advancePaid}.\nThank you.`,
      customerEmail
    );

    setPaymentAmount('');
  };

  // Log inventory stock transaction
  const handleAddInventoryStock = (e) => {
    e.preventDefault();
    if (!invItemName) return;

    const newItem = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      name: invItemName,
      color: invColorType || 'N/A',
      supplier: invSupplier || 'General Supply',
      quantity: Number(invQty),
      minStock: Number(invMinStock)
    };

    if (invType === 'fabric') {
      setInventory({
        ...inventory,
        fabrics: [...inventory.fabrics, newItem]
      });
    } else {
      setInventory({
        ...inventory,
        accessories: [...inventory.accessories, { ...newItem, type: invColorType || 'General' }]
      });
    }

    setShowInventoryModal(false);
    setInvItemName('');
    setInvColorType('');
    setInvSupplier('');
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmpId || !newEmpName) return;

    const exists = employees.find(emp => emp.id.toUpperCase() === newEmpId.trim().toUpperCase());
    if (exists) {
      alert("An employee with this ID already exists.");
      return;
    }

    const newEmp = {
      id: newEmpId.trim().toUpperCase(),
      name: newEmpName,
      role: newEmpRole,
      contact: newEmpContact || 'N/A',
      active: true,
      assigned: 0,
      completed: 0,
      delayPercentage: 0,
      alterationPercentage: 0,
      password: newEmpPassword || '123456'
    };

    setEmployees([...employees, newEmp]);
    setShowAddEmpModal(false);

    // Reset
    setNewEmpId('');
    setNewEmpName('');
    setNewEmpRole('Tailor');
    setNewEmpContact('');
    setNewEmpPassword('');
  };

  const handleToggleEmployeeActive = (empId) => {
    if (empId === 'EMP-001') {
      alert("Cannot deactivate primary Boutique Owner.");
      return;
    }
    const updated = employees.map(emp => {
      if (emp.id === empId) {
        return { ...emp, active: !emp.active };
      }
      return emp;
    });
    setEmployees(updated);
  };

  // Trigger CRM manual marketing campaign simulation
  const handleCrmBroadcast = () => {
    // Filter matching customers
    const targetCustomers = customers.filter(cust => {
      if (crmSegment === 'VIP') return cust.tags.includes('VIP');
      if (crmSegment === 'Bridal') return cust.tags.includes('Bridal');
      if (crmSegment === 'Regular') return cust.tags.includes('Regular');
      return true; // All Customers
    });

    targetCustomers.forEach(cust => {
      triggerWhatsApp(cust.name, cust.whatsapp, `CRM Campaign: ${crmSegment}`, crmMessage, cust.email);
    });

    alert(`Simulated campaign broadcast sent to ${targetCustomers.length} ${crmSegment} customers successfully! Logs updated.`);
  };

  // Setup comparison measurements
  const getMeasurementComparisonVal = (field) => {
    if (!selectedCustomer) return null;
    const list = selectedCustomer.measurements[activeGarmentTab] || [];
    const v1Obj = list.find(v => v.version === Number(compVersion1));
    const v2Obj = list.find(v => v.version === Number(compVersion2));

    if (!v1Obj || !v2Obj) return null;
    const val1 = v1Obj[field] || 0;
    const val2 = v2Obj[field] || 0;
    const diff = val2 - val1;

    return {
      val1,
      val2,
      diff
    };
  };

  // Search/Filters states helper
  const [custSearch, setCustSearch] = useState('');
  const [custTagFilter, setCustTagFilter] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [designSearch, setDesignSearch] = useState('');
  const [designFilter, setDesignFilter] = useState('');

  // Filter lists
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(custSearch.toLowerCase()) || 
                          c.mobile.includes(custSearch) || 
                          c.id.toLowerCase().includes(custSearch.toLowerCase());
    const matchesTag = custTagFilter ? c.tags.includes(custTagFilter) : true;
    return matchesSearch && matchesTag;
  });

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
                          o.garmentType.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter ? o.status === orderStatusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Portal Customer Data
  const portalCustObj = customers.find(c => c.id === selectedPortalCustomer) || customers[0];
  const portalCustOrders = orders.filter(o => o.customerId === portalCustObj?.id);
  const activePortalOrder = portalCustOrders.find(o => o.status !== 'Delivered' && o.status !== 'Closed') || portalCustOrders[0];

  // Gateway Slideshow State
  const gatewaySlides = [
    {
      image: '/boutique_mannequin_gown.png',
      title: 'Where Elegance',
      italic: 'Meets Exclusivity',
      type: 'zoom'
    },
    {
      image: '/design_bridal_lehenga.png',
      title: 'Crafting Your',
      italic: 'Dream Silhouette',
      type: 'slide'
    },
    {
      image: '/design_designer_blouse.png',
      title: 'Timeless Artistry',
      italic: 'In Every Stitch',
      type: 'puzzle'
    },
    {
      image: '/design_party_gown.png',
      title: 'Indulge In',
      italic: 'Ultimate Luxury',
      type: 'shutter'
    }
  ];

  const [currentGatewaySlide, setCurrentGatewaySlide] = useState(0);

  useEffect(() => {
    if (!customerSession && !employeeSession) {
      const timer = setInterval(() => {
        setCurrentGatewaySlide((prev) => (prev + 1) % gatewaySlides.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [customerSession, employeeSession]);

  // Check 1: CENTRAL SECURITY GATEWAY SCREEN (Shown if no customer or employee session is active)
  if (!customerSession && !employeeSession) {
    return (
      <div className="gateway-container">
        {/* Floating Theme Toggle in Gateway */}
        <button 
          className="theme-toggle-gateway"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <Sun size={18} color="var(--gold)" /> : <Moon size={18} color="var(--gold)" />}
        </button>

        <div className="gateway-background-effects"></div>
        
        <div className="gateway-split-wrapper">
          {/* LEFT branding panel with dynamic slides */}
          <div className="gateway-branding-card">
            {/* Render slides with distinct custom transition types */}
            {gatewaySlides.map((slide, idx) => {
              const isActive = idx === currentGatewaySlide;
              return (
                <div 
                  key={idx}
                  className={`gateway-slide slide-${slide.type} ${isActive ? 'active' : ''}`}
                >
                  {slide.type === 'puzzle' ? (
                    <div className="puzzle-grid">
                      <div className="puzzle-part p1" style={{ backgroundImage: `url(${slide.image})` }}></div>
                      <div className="puzzle-part p2" style={{ backgroundImage: `url(${slide.image})` }}></div>
                      <div className="puzzle-part p3" style={{ backgroundImage: `url(${slide.image})` }}></div>
                      <div className="puzzle-part p4" style={{ backgroundImage: `url(${slide.image})` }}></div>
                    </div>
                  ) : slide.type === 'shutter' ? (
                    <div className="shutter-grid">
                      <div className="shutter-part s1" style={{ backgroundImage: `url(${slide.image})` }}></div>
                      <div className="shutter-part s2" style={{ backgroundImage: `url(${slide.image})` }}></div>
                      <div className="shutter-part s3" style={{ backgroundImage: `url(${slide.image})` }}></div>
                      <div className="shutter-part s4" style={{ backgroundImage: `url(${slide.image})` }}></div>
                    </div>
                  ) : (
                    <div 
                      className="slide-image"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    />
                  )}
                </div>
              );
            })}

            <div className="gateway-branding-overlay"></div>
            <div className="gateway-branding-content">
              {/* Top B emblem */}
              <div className="brand-b-emblem">B</div>

              {/* Center brand logo and slogans */}
              <div className="brand-center-group">
                <div className="brand-logo-crossed">
                  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8" cy="8" r="2.5" />
                    <circle cx="16" cy="8" r="2.5" />
                    <path d="M9.8 9.8l5.4 7.2" />
                    <path d="M14.2 9.8l-5.4 7.2" />
                    <path d="M14 15.5l1.5 1.5M13.2 14.4l1.5 1.5" />
                    <path d="M12 5.5c0-1.5-1-2.5-2-2.5s-2 1-2 2.5" />
                  </svg>
                </div>
                <h2 className="brand-title-text">BOUTIQUEOS</h2>
                <p className="brand-subtitle-text">HAUTE COUTURE CLIENT LOUNGE</p>
                
                <div className="brand-separator">
                  <span className="brand-sep-line"></span>
                  <span className="brand-sep-diamond">✦</span>
                  <span className="brand-sep-line"></span>
                </div>
                
                <p className="brand-slogan-text">
                  {gatewaySlides[currentGatewaySlide].title} <br />
                  <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>
                    {gatewaySlides[currentGatewaySlide].italic}
                  </span>
                </p>
              </div>

              {/* Bottom features list */}
              <div className="brand-bottom-group">
                <div className="brand-features-row">
                  <div className="brand-feature-item">
                    {/* Crown SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
                      <path d="M3 20h18" />
                    </svg>
                    <span>Premium Experience</span>
                  </div>
                  <div className="brand-feature-item">
                    {/* Diamond SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12l4 6-10 13L2 9z" />
                    </svg>
                    <span>Exclusive Collections</span>
                  </div>
                  <div className="brand-feature-item">
                    {/* Dress mannequin outline SVG */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="3" r="1.5" />
                      <path d="M12 4.5v1.5M9 6h6l1.5 5.5c.2.7-.3 1.5-1.1 1.5H8.6c-.8 0-1.3-.8-1.1-1.5L9 6z" />
                      <path d="M9.5 13h5l2 7.5c.1.5-.2 1-.8 1H8.3c-.6 0-.9-.5-.8-1l2-7.5zM12 21.5v2M8 23.5h8" />
                    </svg>
                    <span>Tailored Just for You</span>
                  </div>
                </div>

                {/* Dot pagination indicators */}
                <div className="brand-carousel-dots">
                  {gatewaySlides.map((_, idx) => (
                    <span 
                      key={idx} 
                      className={`dot ${idx === currentGatewaySlide ? 'active' : ''}`}
                      onClick={() => setCurrentGatewaySlide(idx)}
                      style={{ cursor: 'pointer' }}
                    ></span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT auth card */}
          <div className="gateway-auth-card">
            {/* Back button (Only shown if we are in Register mode or Staff mode) */}
            {(loginTab === 'register' || portalMode === 'staff') && (
              <button 
                type="button" 
                className="auth-back-btn" 
                onClick={() => {
                  if (portalMode === 'staff') {
                    window.location.hash = '';
                    setPortalMode('customer');
                  } else {
                    setLoginTab('login');
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}

            {/* Top mannequin badge */}
            <div className="auth-circle-badge">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="3" r="1.5" />
                <path d="M12 4.5v1.5M9 6h6l1.5 5.5c.2.7-.3 1.5-1.1 1.5H8.6c-.8 0-1.3-.8-1.1-1.5L9 6z" />
                <path d="M9.5 13h5l2 7.5c.1.5-.2 1-.8 1H8.3c-.6 0-.9-.5-.8-1l2-7.5zM12 21.5v2M8 23.5h8" />
              </svg>
            </div>

            {/* Portal Customer vs Staff forms */}
            {portalMode === 'customer' ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flex: 1 }}>
                
                {/* Header text group */}
                <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
                  <h2 className="auth-card-title">
                    {loginTab === 'login' ? 'Sign In' : 'Create Account'}
                  </h2>
                  <p className="auth-card-subtitle">
                    {loginTab === 'login' ? 'Welcome back to your exclusive salon' : 'Join our exclusive couture experience'}
                  </p>
                  
                  <div className="auth-separator">
                    <span className="auth-sep-line"></span>
                    <span className="auth-sep-diamond">✦</span>
                    <span className="auth-sep-line"></span>
                  </div>
                </div>

                {/* Form fields */}
                {loginTab === 'login' ? (
                  <form onSubmit={handleEcommerceLogin} className="gateway-form">
                    <div className="gateway-input-wrapper">
                      <div className="input-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                          <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                      </div>
                      <div className="input-field-group">
                        <label className="form-label">Mobile Number</label>
                        <input 
                          type="tel" 
                          placeholder="Enter registered mobile (e.g. 9900990099)" 
                          className="form-input"
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="gateway-input-wrapper">
                      <div className="input-icon-box">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                      <div className="input-field-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter password (default: 123456)" 
                            className="form-input"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                          />
                          <button 
                            type="button" 
                            className="password-toggle-btn"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                              </svg>
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="auth-gradient-btn">
                      <span>Enter Couture Salon</span>
                      <div className="btn-arrow-circle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleEcommerceRegister} className="gateway-form">
                    <div className="gateway-form-scroll">
                      <div className="gateway-input-wrapper">
                        <div className="input-icon-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div className="input-field-group">
                          <label className="form-label">Full Name *</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Anya Sen" 
                            className="form-input"
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="gateway-input-wrapper">
                        <div className="input-icon-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                        </div>
                        <div className="input-field-group">
                          <label className="form-label">Mobile Number *</label>
                          <input 
                            type="tel" 
                            placeholder="e.g. 9876543210" 
                            className="form-input"
                            value={regMobile}
                            onChange={(e) => setRegMobile(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="gateway-input-wrapper">
                        <div className="input-icon-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        <div className="input-field-group">
                          <label className="form-label">Choose Password *</label>
                          <div style={{ position: 'relative' }}>
                            <input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="At least 6 characters" 
                              className="form-input"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              required
                            />
                            <button 
                              type="button" 
                              className="password-toggle-btn"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                  <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="gateway-input-wrapper">
                        <div className="input-icon-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </div>
                        <div className="input-field-group">
                          <label className="form-label">Email Address</label>
                          <input 
                            type="email" 
                            placeholder="e.g. anya@example.com" 
                            className="form-input"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="gateway-input-wrapper">
                        <div className="input-icon-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                        <div className="input-field-group">
                          <label className="form-label">Date of Birth</label>
                          <input 
                            type="date" 
                            className="form-input"
                            value={regDob}
                            onChange={(e) => setRegDob(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="gateway-input-wrapper">
                        <div className="input-icon-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div className="input-field-group">
                          <label className="form-label">Delivery Address</label>
                          <textarea 
                            placeholder="Enter shipping address" 
                            className="form-input"
                            style={{ height: '60px', resize: 'none', padding: '10px 16px' }}
                            value={regAddress}
                            onChange={(e) => setRegAddress(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="gateway-input-wrapper">
                        <div className="input-icon-box">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                        <div className="input-field-group">
                          <label className="form-label">Fit / Design Preferences</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Silk lining, high collar" 
                            className="form-input"
                            value={regPreferences}
                            onChange={(e) => setRegPreferences(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="auth-gradient-btn" style={{ marginTop: '10px' }}>
                      <span>Create Account</span>
                      <div className="btn-arrow-circle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </div>
                    </button>
                  </form>
                )}

                {/* OR divider */}
                <div className="auth-or-divider">
                  <span className="divider-line"></span>
                  <span className="divider-circle">OR</span>
                  <span className="divider-line"></span>
                </div>

                {/* Guest access */}
                <button 
                  type="button" 
                  className="auth-guest-pill-btn"
                  onClick={handleGuestLogin}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Continue as Guest
                </button>

                {/* Bottom switcher link */}
                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#9ca3af' }}>
                  {loginTab === 'login' ? (
                    <>
                      New to BoutiqueOS?{' '}
                      <button 
                        type="button"
                        className="auth-switch-link"
                        onClick={() => setLoginTab('register')}
                      >
                        Create Account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        type="button"
                        className="auth-switch-link"
                        onClick={() => setLoginTab('login')}
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </div>

                {/* Back-to-staff entrance Link (Only in login mode to avoid clutter) */}
                {loginTab === 'login' && (
                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <a href="#/staff" className="gateway-staff-link">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      Atelier Staff Access Portal
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flex: 1 }}>
                
                {/* Header text group */}
                <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
                  <h2 className="auth-card-title">Staff Authentication</h2>
                  <p className="auth-card-subtitle" style={{ color: 'var(--gold)' }}>Atelier Staff Access Portal</p>
                  
                  <div className="auth-separator">
                    <span className="auth-sep-line"></span>
                    <span className="auth-sep-diamond">✦</span>
                    <span className="auth-sep-line"></span>
                  </div>
                </div>

                {/* Staff credentials form */}
                <form onSubmit={handleEmployeeLogin} className="gateway-form">
                  <div className="gateway-input-wrapper">
                    <div className="input-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="input-field-group">
                      <label className="form-label">Employee ID</label>
                      <input 
                        type="text" 
                        placeholder="Enter Employee ID (e.g. EMP-001)" 
                        className="form-input"
                        value={employeeLoginId}
                        onChange={(e) => setEmployeeLoginId(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="gateway-input-wrapper">
                    <div className="input-icon-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <div className="input-field-group">
                      <label className="form-label">Security PIN / Access Password</label>
                      <input 
                        type="password" 
                        placeholder="••••" 
                        className="form-input"
                        value={employeeLoginPin}
                        onChange={(e) => setEmployeeLoginPin(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="auth-gradient-btn" style={{ marginTop: '10px' }}>
                    <span>Authenticate Staff</span>
                    <div className="btn-arrow-circle">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </button>
                </form>

                {/* Back to Client Lounge bottom Link */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <a href="#" className="gateway-staff-link" onClick={(e) => {
                    e.preventDefault();
                    window.location.hash = '';
                    setPortalMode('customer');
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                    </svg>
                    Go to Client Lounge Portal
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Intercept for premium, full-screen e-commerce customer portal
  if (currentRole === 'Customer Portal') {
    const selectedProduct = designLibrary.find(p => p.id === selectedProductId) || designLibrary[0];
    
    const dsnCatMatch = (fabricName, categoryName) => {
      const fLower = fabricName.toLowerCase();
      const cLower = categoryName.toLowerCase();
      if (cLower === 'blouse' && fLower.includes('silk')) return true;
      if (cLower === 'lehenga' && fLower.includes('velvet')) return true;
      if (cLower === 'gown' && fLower.includes('satin')) return true;
      if (cLower === 'chudidar' && fLower.includes('georgette')) return true;
      return false;
    };

    return (
      <div className="ecom-container">
        {/* Header */}
        <header className="ecom-header">
          <div className="ecom-logo" onClick={() => setEcommerceTab('shop')}>
            <Scissors className="ecom-logo-icon" size={26} />
            <span className="ecom-logo-text">BOUTIQUEOS HAUTE COUTURE</span>
          </div>

          <nav className="ecom-nav">
            <span 
              className={`ecom-nav-item ${ecommerceTab === 'shop' || ecommerceTab === 'product-detail' ? 'active' : ''}`}
              onClick={() => setEcommerceTab('shop')}
            >
              Shop Collections
            </span>
            <span 
              className={`ecom-nav-item ${ecommerceTab === 'my-passport' ? 'active' : ''}`}
              onClick={() => {
                if (!customerSession) {
                  setLoginTab('login');
                  setEcommerceTab('login');
                } else {
                  setEcommerceTab('my-passport');
                }
              }}
            >
              My Fit Passport
            </span>
            <span 
              className={`ecom-nav-item ${ecommerceTab === 'my-orders' ? 'active' : ''}`}
              onClick={() => {
                if (!customerSession) {
                  setLoginTab('login');
                  setEcommerceTab('login');
                } else {
                  setEcommerceTab('my-orders');
                }
              }}
            >
              My Orders
            </span>
            <span 
              className={`ecom-nav-item ${ecommerceTab === 'book-consultation' ? 'active' : ''}`}
              onClick={() => {
                if (!customerSession) {
                  setLoginTab('login');
                  setEcommerceTab('login');
                } else {
                  setEcommerceTab('book-consultation');
                }
              }}
            >
              Book Fitting
            </span>
          </nav>

          <div className="ecom-actions">
            {/* Theme Toggle */}
            <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Toggle Light/Dark Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Shopping Cart Button */}
            <button className="cart-icon-btn" onClick={() => setEcommerceTab('cart')} title="View Shopping Cart">
              <ShoppingCart size={18} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>

            {/* Account widget */}
            {customerSession ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="user-avatar" style={{ cursor: 'pointer' }} onClick={() => setEcommerceTab('my-passport')}>
                  {customerSession.name.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{customerSession.name}</span>
                  <span 
                    style={{ fontSize: '10px', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={handleCustomerLogout}
                  >
                    Logout
                  </span>
                </div>
              </div>
            ) : (
              <button className="btn btn-gold btn-xs" onClick={() => { setLoginTab('login'); setEcommerceTab('login'); }}>
                <User size={12} /> Sign In
              </button>
            )}
          </div>
        </header>

        {/* Tab Routing content */}
        {ecommerceTab === 'login' && (
          <div className="login-screen-wrapper">
            <div className="login-auth-card">
              <div className="login-tab-headers">
                <button 
                  className={`login-tab-btn ${loginTab === 'login' ? 'active' : ''}`}
                  onClick={() => setLoginTab('login')}
                >
                  Log In
                </button>
                <button 
                  className={`login-tab-btn ${loginTab === 'register' ? 'active' : ''}`}
                  onClick={() => setLoginTab('register')}
                >
                  New Client
                </button>
              </div>

              {loginTab === 'login' ? (
                <form onSubmit={handleEcommerceLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', color: 'var(--text-heading)' }}>Access Digital Passport</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Enter your registered mobile number to retrieve your custom measurements, trial schedules, and stitch history.
                  </p>
                  <div className="form-group">
                    <label className="form-label">Registered Mobile Number</label>
                    <div style={{ position: 'relative' }}>
                      <Smartphone size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ paddingLeft: '38px' }}
                        placeholder="e.g. 9900990099" 
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Verify & Enter Studio
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEcommerceRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', color: 'var(--text-heading)' }}>Join Haute Couture Studio</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Enter your name" 
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. 9876543210" 
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Optional)</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="name@example.com" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Date of Birth (Optional)</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Billing/Shipping Address</label>
                    <textarea 
                      className="form-input" 
                      style={{ height: '60px', resize: 'none' }}
                      placeholder="Flat/House No, Building, Street, City, Pincode" 
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Style / Fitting Preferences</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. loves high necklines, cotton linings only" 
                      value={regPreferences}
                      onChange={(e) => setRegPreferences(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                    Create Digital Studio Account
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {ecommerceTab === 'shop' && (
          <>
            {/* Hero Banner */}
            <div className="ecom-hero">
              {/* Elegant Motion Background */}
              <div className="hero-motion-bg">
                <div className="motion-blob blob-gold"></div>
                <div className="motion-blob blob-purple"></div>
                <div className="motion-blob blob-pink"></div>
              </div>

              <div className="ecom-hero-content">
                <h1 className="ecom-hero-title">
                  Bespoke Couture <br />
                  <span>Tailored Exclusively</span> For You
                </h1>
                <p className="ecom-hero-desc">
                  Browse our couture design templates. Select your favorite silhouette, choose premium fabrics, customize color accents, and configure your digital measurement passport for a custom-stitched masterpiece.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" onClick={() => {
                    const el = document.getElementById('catalog-start');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}>
                    Browse Custom Designs <ArrowRight size={14} />
                  </button>
                  {!customerSession && (
                    <button className="btn btn-secondary" onClick={() => { setLoginTab('register'); setEcommerceTab('login'); }}>
                      Create Fit Passport
                    </button>
                  )}
                </div>
              </div>
              <img className="ecom-hero-img" src="/design_bridal_lehenga.png" alt="Bespoke bridal dress stitching" />
            </div>

            {/* Catalog Grid */}
            <div className="ecom-body" id="catalog-start">
              <div className="catalog-filter-bar">
                <h2 className="catalog-section-title">Designer Templates</h2>
                
                {/* Standard Search Bar */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div className="search-input-wrapper" style={{ width: '250px' }}>
                    <Search className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search silhouettes..." 
                      className="search-input" 
                      value={designSearch || ''} 
                      onChange={(e) => setDesignSearch(e.target.value)} 
                    />
                  </div>
                  <select 
                    className="select-filter"
                    value={designFilter || ''}
                    onChange={(e) => setDesignFilter(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="Lehenga">Lehengas</option>
                    <option value="Blouse">Blouses</option>
                    <option value="Gown">Gowns</option>
                    <option value="Chudidar">Churidar Sets</option>
                  </select>
                </div>
              </div>

              {/* Designs Grid */}
              {(() => {
                const filteredList = designLibrary.filter(d => {
                  const matchesSearch = d.title.toLowerCase().includes((designSearch || '').toLowerCase()) || 
                                        d.description.toLowerCase().includes((designSearch || '').toLowerCase());
                  const matchesCat = designFilter ? d.category === designFilter : true;
                  return matchesSearch && matchesCat;
                });

                if (filteredList.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                      <Scissors size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                      <p>No designs match your search filters.</p>
                      <button className="btn btn-secondary btn-xs" style={{ marginTop: '12px' }} onClick={() => { setDesignSearch(''); setDesignFilter(''); }}>
                        Reset Filters
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="ecom-grid">
                    {filteredList.map(product => (
                      <div 
                        key={product.id} 
                        className="ecom-card"
                        onClick={() => {
                          setSelectedProductId(product.id);
                          setEcommerceTab('product-detail');
                          // Pre-fill trial/delivery default dates
                          setCustomizerTrialDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                          setCustomizerDeliveryDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                          setCustomizerColor('Royal Crimson');
                          setCustomizerFabric('Boutique Stock Fabric');
                          setCustomizerSizingMode(customerSession ? 'passport' : 'standard');
                        }}
                      >
                        <div className="ecom-card-img-wrapper">
                          <img className="ecom-card-img" src={product.image} alt={product.title} />
                          <span className="ecom-card-badge">{product.occasion}</span>
                        </div>
                        <div className="ecom-card-details">
                          <span className="ecom-card-category">{product.category}</span>
                          <h3 className="ecom-card-title">{product.title}</h3>
                          
                          <div className="ecom-card-rating">
                            <span>★</span> <span>{product.rating}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>({product.reviewsCount} reviews)</span>
                          </div>

                          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {product.description}
                          </p>

                          <div className="ecom-card-price-row">
                            <div className="ecom-card-price">
                              <span>Stitching:</span> ₹{product.basePrice.toLocaleString()}
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              Tailor Bespoke <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </>
        )}

        {ecommerceTab === 'product-detail' && selectedProduct && (
          <div className="ecom-body">
            <button className="btn btn-secondary btn-xs" style={{ marginBottom: '20px' }} onClick={() => setEcommerceTab('shop')}>
              ← Back to Catalog
            </button>

            <div className="detail-layout">
              {/* Product Info & Visual */}
              <div>
                <div className="detail-img-card">
                  <img className="detail-img" src={selectedProduct.image} alt={selectedProduct.title} />
                </div>
                <div style={{ marginTop: '24px' }}>
                  <span className="tag tag-vip" style={{ marginBottom: '10px' }}>{selectedProduct.category}</span>
                  <h1 className="page-title" style={{ fontSize: '28px', marginBottom: '8px' }}>{selectedProduct.title}</h1>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '16px' }}>★★★★★</span>
                    <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{selectedProduct.rating}</span>
                    <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({selectedProduct.reviewsCount} Verified Customer Commissions)</span>
                  </div>

                  <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-main)', marginBottom: '20px' }}>
                    {selectedProduct.description}
                  </p>

                  <div className="glass-card" style={{ padding: '16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>Boutique Bespoke Inclusions:</div>
                    <ul style={{ fontSize: '12px', color: 'var(--text-muted)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li>Master-Tailor Cutting & Hand Stitching</li>
                      <li>Double seam lining & custom margins for future self-alterations</li>
                      <li>Dedicated designer consultation meeting</li>
                      <li>Simulated Fitting Trial prior to final delivery dispatch</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bespoke Styling Options Panel */}
              <div className="glass-card" style={{ height: 'fit-content' }}>
                <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: '700', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  Tailoring & Fit Customizer
                </h3>

                {/* Fabric Option */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="custom-option-label">Fabric Specification</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button 
                      className={`sizing-mode-btn ${customizerFabric === 'Provide My Own Fabric' ? 'active' : ''}`}
                      onClick={() => setCustomizerFabric('Provide My Own Fabric')}
                    >
                      Supply My Own Fabric
                      <span style={{ display: 'block', fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>Stitching Only</span>
                    </button>
                    <button 
                      className={`sizing-mode-btn ${customizerFabric === 'Boutique Stock Fabric' ? 'active' : ''}`}
                      onClick={() => setCustomizerFabric('Boutique Stock Fabric')}
                    >
                      Boutique Stock Fabric
                      <span style={{ display: 'block', fontSize: '10px', color: 'var(--gold)', marginTop: '4px' }}>
                        +{selectedProduct.category === 'Lehenga' ? '₹5,000' : (selectedProduct.category === 'Gown' ? '₹3,000' : '₹1,500')}
                      </span>
                    </button>
                  </div>
                  
                  {customizerFabric === 'Boutique Stock Fabric' && (
                    <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', fontSize: '12px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Available Fabrics in Inventory:</span>
                      {inventory.fabrics
                        .filter(f => f.name.toLowerCase().includes(selectedProduct.category.toLowerCase()) || dsnCatMatch(f.name, selectedProduct.category))
                        .map(fab => (
                          <div key={fab.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <span>{fab.name}</span>
                            <span style={{ color: fab.quantity <= fab.minStock ? 'var(--danger)' : 'var(--success)' }}>
                              {fab.quantity <= fab.minStock ? 'Low Stock' : 'In Stock'} ({fab.quantity}m)
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Color option */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="custom-option-label">Garment Color Tone: <strong>{customizerColor}</strong></label>
                  <div className="color-picker-row">
                    {[
                      { name: 'Royal Crimson', value: '#991b1b' },
                      { name: 'Navy Blue', value: '#1e3a8a' },
                      { name: 'Emerald Green', value: '#065f46' },
                      { name: 'Champagne Gold', value: '#b45309' },
                      { name: 'Ivory Pearl', value: '#f3f4f6' }
                    ].map(col => (
                      <div 
                        key={col.name}
                        className={`color-dot ${customizerColor === col.name ? 'active' : ''}`}
                        style={{ backgroundColor: col.value }}
                        title={col.name}
                        onClick={() => setCustomizerColor(col.name)}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizing & Measurement Mode */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="custom-option-label">Sizing Specifications</label>
                  <div className="sizing-modes">
                    <button 
                      className={`sizing-mode-btn ${customizerSizingMode === 'standard' ? 'active' : ''}`}
                      onClick={() => setCustomizerSizingMode('standard')}
                    >
                      Ready Size (S-XXL)
                    </button>
                    <button 
                      className={`sizing-mode-btn ${customizerSizingMode === 'passport' ? 'active' : ''}`}
                      onClick={() => setCustomizerSizingMode('passport')}
                    >
                      Digital Passport
                    </button>
                    <button 
                      className={`sizing-mode-btn ${customizerSizingMode === 'custom' ? 'active' : ''}`}
                      onClick={() => setCustomizerSizingMode('custom')}
                    >
                      Enter Sizing Now
                    </button>
                  </div>

                  {customizerSizingMode === 'standard' && (
                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Select ready-to-wear sizing standard:</span>
                      <div className="standard-sizes">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                          <button 
                            key={sz}
                            className={`size-btn ${customizerStandardSize === sz ? 'active' : ''}`}
                            onClick={() => setCustomizerStandardSize(sz)}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {customizerSizingMode === 'passport' && (
                    <div style={{ background: 'rgba(167, 139, 250, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(167, 139, 250, 0.15)', fontSize: '12px', marginBottom: '12px' }}>
                      {customerSession ? (
                        (() => {
                          const catKey = selectedProduct.category.toLowerCase();
                          const activeMeas = customerSession.measurements[catKey]?.[0] || customerSession.measurements['blouse']?.[0];
                          
                          if (!activeMeas) {
                            return (
                              <div style={{ color: 'var(--text-muted)' }}>
                                No sizing measurements registered under your Blouse/Lehenga profiles. 
                                <span 
                                  style={{ color: 'var(--gold)', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
                                  onClick={() => setCustomizerSizingMode('custom')}
                                >
                                  Enter custom measurements manually.
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '8px', color: 'var(--primary)' }}>
                                <span>Passport Size Loaded (V{activeMeas.version})</span>
                                <span>{activeMeas.date}</span>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
                                {Object.keys(activeMeas).filter(k => k !== 'version' && k !== 'date' && k !== 'notes').map(k => (
                                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <span style={{ textTransform: 'capitalize' }}>{k}:</span>
                                    <strong>{activeMeas[k]}"</strong>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()
                      ) : (
                        <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                          You are currently styling as a Guest. 
                          <span 
                            style={{ color: 'var(--gold)', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px', fontWeight: 'bold' }}
                            onClick={() => { setLoginTab('login'); setEcommerceTab('login'); }}
                          >
                            Sign In
                          </span> to retrieve your saved passport sizing.
                        </div>
                      )}
                    </div>
                  )}

                  {customizerSizingMode === 'custom' && (
                    <div className="custom-dimensions-form">
                      <span style={{ fontSize: '11px', color: 'var(--text-heading)', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                        Provide tailoring specifications (inches):
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                        {Object.keys(customDimensions).map(field => (
                          <div key={field} className="form-group">
                            <label className="form-label" style={{ fontSize: '9px', textTransform: 'capitalize' }}>{field.replace(/([A-Z])/g, ' $1')}</label>
                            <input 
                              type="number" 
                              step="0.1" 
                              className="form-input" 
                              style={{ padding: '6px', fontSize: '11px', textAlign: 'center' }}
                              value={customDimensions[field]}
                              onChange={(e) => setCustomDimensions({
                                ...customDimensions,
                                [field]: Number(e.target.value)
                              })}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Designer Consultation */}
                <div style={{ marginBottom: '20px' }}>
                  <label className="custom-option-label">Supervising Fashion Designer</label>
                  <select 
                    className="select-filter" 
                    style={{ width: '100%' }}
                    value={customizerDesigner}
                    onChange={(e) => setCustomizerDesigner(e.target.value)}
                  >
                    {employees.filter(e => e.role === 'Designer').map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} (Fashion Consultant)</option>
                    ))}
                  </select>
                </div>

                {/* Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div className="form-group">
                    <label className="custom-option-label">Requested Fitting Trial</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={customizerTrialDate}
                      onChange={(e) => setCustomizerTrialDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="custom-option-label">Bespoke Delivery Target</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={customizerDeliveryDate}
                      onChange={(e) => setCustomizerDeliveryDate(e.target.value)}
                    />
                  </div>
                </div>

                {/* Upload Custom Design Reference */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="custom-option-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Attach Custom Design Sketch / Reference Image</span>
                    <span style={{ fontSize: '10px', color: 'var(--gold)' }}>Optional</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'var(--bg-input)' }}>
                      {customizerUploadedDesign ? (
                        <img src={customizerUploadedDesign} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Sparkles size={18} style={{ color: 'var(--text-muted)' }} />
                      )}
                    </div>
                    <label className="btn btn-secondary btn-xs" style={{ cursor: 'pointer', margin: 0, padding: '6px 12px' }}>
                      <span>{customizerUploadedDesign ? 'Change Image' : 'Upload Design'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomizerUploadedDesign(reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {customizerUploadedDesign && (
                      <button 
                        type="button"
                        className="btn btn-danger btn-xs" 
                        style={{ padding: '6px 10px' }}
                        onClick={() => setCustomizerUploadedDesign(null)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Custom notes */}
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="custom-option-label">Tailor notes / Embroidery details</label>
                  <textarea 
                    className="form-input" 
                    style={{ height: '60px', resize: 'none' }}
                    placeholder="e.g. Back hook closure, deep neck tassels, heavy gold borders on sleeves..."
                    value={customizerNotes}
                    onChange={(e) => setCustomizerNotes(e.target.value)}
                  />
                </div>

                {/* Add to Cart button */}
                <button 
                  className="btn btn-gold" 
                  style={{ width: '100%', fontSize: '15px', padding: '12px' }}
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  <ShoppingBag size={18} /> Add Bespoke Build to Fitting Cart
                </button>

              </div>
            </div>
          </div>
        )}

        {ecommerceTab === 'cart' && (
          <div className="ecom-body">
            <h1 className="page-title" style={{ fontSize: '28px', marginBottom: '24px' }}>Bespoke Styling Cart</h1>

            {cart.length === 0 ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <ShoppingCart size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Your Custom Cart is Empty</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Browse our designer library to select styling templates and customize your tailor specifications.
                </p>
                <button className="btn btn-primary" onClick={() => setEcommerceTab('shop')}>
                  Browse Collections
                </button>
              </div>
            ) : (
              <div className="cart-layout">
                {/* Cart list */}
                <div className="glass-card">
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Commission Items ({cart.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {cart.map((item) => {
                      const stitchCost = item.product.basePrice;
                      const fabricCost = item.customization.fabricCost;
                      const itemTotal = stitchCost + fabricCost;

                      return (
                        <div key={item.id} className="cart-item-card">
                          <img className="cart-item-img" src={item.product.image} alt={item.product.title} />
                          <div>
                            <h4 style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--text-heading)' }}>{item.product.title}</h4>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Category: {item.product.category}</span>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', fontSize: '12px', color: 'var(--text-main)' }}>
                              <div>🧵 Fabric: <strong>{item.customization.fabric}</strong></div>
                              <div>🎨 Color Accent: <strong>{item.customization.color}</strong></div>
                              <div>📏 Sizing: <strong>{item.customization.sizingMode === 'passport' ? 'Passport Sizing' : (item.customization.sizingMode === 'standard' ? `Standard Size ${item.customization.standardSize}` : 'Bespoke Custom Measurements')}</strong></div>
                              <div>📅 Fitting Trial: <strong>{item.customization.trialDate}</strong></div>
                            </div>
                            
                            {item.customization.notes && (
                              <div style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '6px', background: 'rgba(255,255,255,0.02)', padding: '6px', borderRadius: '4px' }}>
                                📝 Notes: {item.customization.notes}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                            <button className="btn btn-secondary btn-xs" style={{ padding: '6px' }} onClick={() => handleRemoveFromCart(item.id)} title="Remove Item">
                              <Trash2 size={14} style={{ color: 'var(--danger)' }} />
                            </button>
                            
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                Stitching: ₹{stitchCost.toLocaleString()}<br/>
                                Fabric: ₹{fabricCost.toLocaleString()}
                              </div>
                              <strong style={{ fontSize: '15px', color: 'var(--gold)' }}>₹{itemTotal.toLocaleString()}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Summary & Checkout */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="glass-card">
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Fitting Summary</h3>
                    {(() => {
                      const totalStitch = cart.reduce((sum, item) => sum + item.product.basePrice, 0);
                      const totalFabric = cart.reduce((sum, item) => sum + item.customization.fabricCost, 0);
                      const subtotal = totalStitch + totalFabric;
                      const gst = Math.floor(subtotal * 0.05);
                      const grandTotal = subtotal + gst;

                      return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Tailoring Fees:</span>
                            <span>₹{totalStitch.toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Total Fabric stock fees:</span>
                            <span>₹{totalFabric.toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Service GST (5%):</span>
                            <span>₹{gst.toLocaleString()}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '16px', fontWeight: 'bold', color: 'var(--text-heading)' }}>
                            <span>Total Bespoke Price:</span>
                            <span style={{ color: 'var(--gold)' }}>₹{grandTotal.toLocaleString()}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(52, 211, 153, 0.08)', color: 'var(--success)', padding: '8px', borderRadius: '6px', textAlign: 'center', marginTop: '6px' }}>
                            ✓ UPI checkout option will secure a 50% advance booking deposit.
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Customer Checkout Details */}
                  <div className="glass-card">
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Bespoke Order Checkout</h3>
                    
                    {customerSession ? (
                      <div>
                        <div style={{ fontSize: '13px', marginBottom: '12px' }}>
                          Ordering profile: <strong>{customerSession.name}</strong> ({customerSession.mobile})
                        </div>
                        <div className="form-group">
                          <label className="form-label">Delivery Shipping Address</label>
                          <textarea 
                            className="form-input" 
                            style={{ height: '80px', resize: 'none' }}
                            value={customerSession.address}
                            onChange={(e) => {
                              const updatedAddr = e.target.value;
                              setCustomerSession({ ...customerSession, address: updatedAddr });
                              setCustomers(customers.map(c => c.id === customerSession.id ? { ...c, address: updatedAddr } : c));
                            }}
                            required
                          />
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                            You can edit this address. It will update your styling profile.
                          </span>
                        </div>
                        <button 
                          className="btn btn-gold" 
                          style={{ width: '100%', marginTop: '16px' }}
                          onClick={handleEcommerceCheckout}
                        >
                          Checkout Custom Commission & Pay ₹{Math.floor((cart.reduce((sum, item) => sum + item.product.basePrice + item.customization.fabricCost, 0) * 1.05) / 2).toLocaleString()} Advance
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                          Place this custom order as a guest client by entering your billing details below:
                        </p>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const name = e.target.guestName.value;
                          const mobile = e.target.guestMobile.value;
                          const email = e.target.guestEmail.value;
                          const address = e.target.guestAddress.value;
                          handleEcommerceCheckout(e, { name, mobile, email, address });
                        }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '11px' }}>Full Name</label>
                            <input type="text" name="guestName" className="form-input" placeholder="e.g. Priya Sen" required />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '11px' }}>Mobile Number</label>
                            <input type="text" name="guestMobile" className="form-input" placeholder="e.g. 9900990099" required />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '11px' }}>Email Address</label>
                            <input type="email" name="guestEmail" className="form-input" placeholder="name@example.com" />
                          </div>
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '11px' }}>Bespoke Delivery Address</label>
                            <textarea name="guestAddress" className="form-input" style={{ height: '70px', resize: 'none' }} placeholder="Flat/House No, Street, City, Pincode" required></textarea>
                          </div>
                          <button type="submit" className="btn btn-gold" style={{ width: '100%', marginTop: '10px' }}>
                            Register & Submit Commission
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {ecommerceTab === 'my-passport' && customerSession && (
          <div className="ecom-body">
            {customerSession.isGuest ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '600px', margin: '40px auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <Scissors size={48} color="var(--gold)" style={{ opacity: 0.8 }} />
                <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--text-heading)' }}>Fit Passport Requires Client Profile</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '480px' }}>
                  A Fit Passport stores your master-tailor measurement profiles (blouse, lehenga, chudidar) and style preferences. 
                  Please register or log in to manage your custom styling metrics.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button className="btn btn-gold" onClick={() => { setLoginTab('login'); setEcommerceTab('login'); }}>
                    Log In Account
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setLoginTab('register'); setEcommerceTab('login'); }}>
                    Create Profile
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="page-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Your Digital Fit Passport</h1>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Your digital measurements are checked before fabric cutting to guarantee a bespoke fit. Modify your registered measurements below.
                </p>

                <div className="customer-profile-layout">
              {/* Profile Card */}
              <div className="profile-sidebar">
                <div className="glass-card profile-avatar-card">
                  <div className="profile-large-avatar">{customerSession.name.charAt(0)}</div>
                  <h2 className="profile-name">{customerSession.name}</h2>
                  <span className="profile-id">{customerSession.id}</span>
                  
                  <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', fontSize: '12px', textAlign: 'left' }}>
                    <div>📱 Mobile: <strong>{customerSession.mobile}</strong></div>
                    <div>✉ Email: <strong>{customerSession.email}</strong></div>
                    <div>📅 DOB: <strong>{customerSession.dob || 'N/A'}</strong></div>
                  </div>
                </div>

                <div className="glass-card">
                  <h4 style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '10px' }}>Styling Preferences</h4>
                  <textarea 
                    className="form-input"
                    style={{ height: '100px', fontSize: '12px', resize: 'none' }}
                    value={customerSession.designPreferences}
                    onChange={(e) => {
                      const updatedPref = e.target.value;
                      setCustomerSession({ ...customerSession, designPreferences: updatedPref });
                      setCustomers(customers.map(c => c.id === customerSession.id ? { ...c, designPreferences: updatedPref } : c));
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                    Describe your styling preferences (fabrics, neck cuts, margins).
                  </span>
                </div>
              </div>

              {/* Passport Specs Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-card">
                  <div className="card-header" style={{ marginBottom: '16px' }}>
                    <h3 className="card-title">
                      <Scissors size={18} style={{ color: 'var(--gold)' }} />
                      Registered Measurement matrix
                    </h3>
                  </div>

                  <div className="category-tabs" style={{ marginBottom: '20px' }}>
                    {['blouse', 'lehenga', 'chudidar'].map(gTab => (
                      <button 
                        key={gTab} 
                        className={`category-tab ${activeGarmentTab === gTab ? 'active' : ''}`}
                        onClick={() => setActiveGarmentTab(gTab)}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {gTab} Specifications
                      </button>
                    ))}
                  </div>

                  {(() => {
                    const history = customerSession.measurements[activeGarmentTab] || [];
                    const currentMeasObj = history[0];

                    if (!currentMeasObj) {
                      return (
                        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                          <p>No measurement matrix recorded for {activeGarmentTab} yet.</p>
                          <button 
                            className="btn btn-primary btn-xs" 
                            style={{ marginTop: '12px' }}
                            onClick={() => {
                              const standardVals = {
                                version: 1,
                                date: new Date().toISOString().split('T')[0],
                                bust: 34,
                                waist: 28,
                                shoulder: 14,
                                sleeveLength: 8,
                                armRound: 12,
                                frontNeck: 7,
                                backNeck: 7.5,
                                length: 14,
                                notes: 'Self entered via portal.'
                              };
                              const updatedCust = {
                                ...customerSession,
                                measurements: {
                                  ...customerSession.measurements,
                                  [activeGarmentTab]: [standardVals]
                                }
                              };
                              setCustomerSession(updatedCust);
                              setCustomers(customers.map(c => c.id === customerSession.id ? updatedCust : c));
                            }}
                          >
                            Initialize {activeGarmentTab} Passport
                          </button>
                        </div>
                      );
                    }

                    return (
                      <div>
                        <div style={{ background: 'rgba(255,255,255,0.01)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '16px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
                            Edit Fit specifications (values in inches):
                          </span>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                            {Object.keys(currentMeasObj)
                              .filter(k => k !== 'version' && k !== 'date' && k !== 'notes')
                              .map(key => (
                                <div key={key} className="form-group">
                                  <label className="form-label" style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                                    {key.replace(/([A-Z])/g, ' $1')}
                                  </label>
                                  <input 
                                    type="number" 
                                    step="0.1" 
                                    className="form-input" 
                                    style={{ padding: '6px', textAlign: 'center' }}
                                    value={currentMeasObj[key]}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      const updatedHistory = [...history];
                                      updatedHistory[0] = { ...currentMeasObj, [key]: val, date: new Date().toISOString().split('T')[0] };
                                      const updatedCust = {
                                        ...customerSession,
                                        measurements: {
                                          ...customerSession.measurements,
                                          [activeGarmentTab]: updatedHistory
                                        }
                                      };
                                      setCustomerSession(updatedCust);
                                      setCustomers(customers.map(c => c.id === customerSession.id ? updatedCust : c));
                                    }}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Garment styling notes</label>
                          <input 
                            type="text" 
                            className="form-input"
                            value={currentMeasObj.notes || ''}
                            onChange={(e) => {
                              const notesVal = e.target.value;
                              const updatedHistory = [...history];
                              updatedHistory[0] = { ...currentMeasObj, notes: notesVal };
                              const updatedCust = {
                                ...customerSession,
                                measurements: {
                                  ...customerSession.measurements,
                                  [activeGarmentTab]: updatedHistory
                                }
                              };
                              setCustomerSession(updatedCust);
                              setCustomers(customers.map(c => c.id === customerSession.id ? updatedCust : c));
                            }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        )}

        {ecommerceTab === 'my-orders' && customerSession && (
          <div className="ecom-body">
            <h1 className="page-title" style={{ fontSize: '28px', marginBottom: '8px' }}>Your Styling commissions</h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Track the cutting, stitching, and trial status of your bespoke commissions in real-time.
            </p>

            {(() => {
              const myOrders = orders.filter(o => o.customerId === customerSession.id);

              if (myOrders.length === 0) {
                return (
                  <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                    <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-muted)' }}>No orders placed under your account yet.</p>
                    <button className="btn btn-primary btn-xs" style={{ marginTop: '12px' }} onClick={() => setEcommerceTab('shop')}>
                      Design Your First Garment
                    </button>
                  </div>
                );
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {myOrders.map(order => {
                    const statusSteps = [
                      "Order Created",
                      "Measurement Taken",
                      "Cutting",
                      "Stitching",
                      "Trial Scheduled",
                      "Ready for Delivery",
                      "Delivered"
                    ];
                    
                    let activeIndex = 0;
                    if (order.status === 'Order Created') activeIndex = 0;
                    else if (order.status === 'Measurement Taken' || order.status === 'Design Approved') activeIndex = 1;
                    else if (order.status === 'Cutting') activeIndex = 2;
                    else if (order.status === 'Stitching') activeIndex = 3;
                    else if (order.status === 'Trial Scheduled' || order.status === 'Alteration') activeIndex = 4;
                    else if (order.status === 'Ready for Delivery') activeIndex = 5;
                    else if (order.status === 'Delivered' || order.status === 'Closed') activeIndex = 6;

                    return (
                      <div key={order.id} className="orders-commissions-card">
                        <div className="orders-header-row">
                          <div className="orders-header-field">
                            <span className="orders-field-label">Commission Reference</span>
                            <h3 className="orders-field-value" style={{ color: 'var(--gold)' }}>{order.id}</h3>
                          </div>
                          <div className="orders-header-field">
                            <span className="orders-field-label">Garment Style</span>
                            <div className="orders-field-value">{order.garmentType}</div>
                          </div>
                          <div className="orders-header-field">
                            <span className="orders-field-label">Fitting Designer</span>
                            <div className="orders-field-value">{employees.find(e => e.id === order.assignedDesigner)?.name || 'Consultant'}</div>
                          </div>
                          <div className="orders-header-field">
                            <span className="orders-field-label">Simulated Trial Target</span>
                            <div className="orders-field-value" style={{ color: 'var(--primary)' }}>{order.trialDate}</div>
                          </div>
                          <div className="orders-header-field">
                            <span className="orders-field-label">Delivery Date</span>
                            <div className="orders-field-value">{order.deliveryDate}</div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="timeline-stepper">
                          {statusSteps.map((step, idx) => {
                            let statusClass = "";
                            if (idx < activeIndex) statusClass = "completed";
                            else if (idx === activeIndex) statusClass = "active";

                            return (
                              <div key={step} className={`timeline-step ${statusClass}`}>
                                <div className="timeline-dot">
                                  {idx < activeIndex ? '✓' : idx + 1}
                                </div>
                                <div className="timeline-label">{step}</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Details summary block */}
                        <div className="orders-summary-block" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '24px', alignItems: 'start' }}>
                          <div style={{ minWidth: '200px' }}>
                            <strong style={{ color: 'var(--text-heading)' }}>Tailor Commission Specifications:</strong>
                            <p style={{ color: 'var(--text-muted)', marginTop: '6px', fontSize: '12.5px', lineHeight: '1.5' }}>{order.notes}</p>
                          </div>

                          {/* CUSTOM DESIGN UPLOAD COMPONENT FOR CUSTOMER */}
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '150px', background: 'var(--bg-card)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold' }}>Design Reference Sketch</span>
                            <div style={{ width: '70px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-input)' }}>
                              {order.referenceImage ? (
                                <img src={order.referenceImage} alt="Design Ref" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <Scissors size={20} style={{ color: 'var(--text-muted)' }} />
                              )}
                            </div>
                            <label className="btn btn-secondary btn-xs" style={{ cursor: 'pointer', margin: 0, padding: '4px 8px', fontSize: '10.5px' }}>
                              <span>{order.referenceImage ? 'Change Sketch' : 'Upload Design'}</span>
                              <input 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      const updatedOrders = orders.map(ord => {
                                        if (ord.id === order.id) {
                                          return { ...ord, referenceImage: reader.result };
                                        }
                                        return ord;
                                      });
                                      setOrders(updatedOrders);
                                      triggerWhatsApp(
                                        customerSession.name,
                                        customerSession.mobile,
                                        "Design Uploaded",
                                        `Hello, a new custom design reference image has been uploaded by ${customerSession.name} for Order ${order.id}.`,
                                        customerSession.email
                                      );
                                      alert("Custom design image uploaded successfully! It is now visible to the Owner, Tailor, and Designer.");
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>

                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
                            <div>Stitching Fee: <strong>₹{order.stitchingCost.toLocaleString()}</strong></div>
                            <div>Fabric stock Fee: <strong>₹{order.fabricCost.toLocaleString()}</strong></div>
                            <div style={{ color: 'var(--success)' }}>Advance Paid: <strong>- ₹{order.advancePaid.toLocaleString()}</strong></div>
                            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'var(--gold)', borderTop: '1px solid var(--border-color)', marginTop: '8px', paddingTop: '8px' }}>
                              Balance Due: ₹{(order.stitchingCost + order.fabricCost - order.advancePaid).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {ecommerceTab === 'book-consultation' && customerSession && (
          <div className="ecom-body" style={{ maxWidth: '650px' }}>
            {customerSession.isGuest ? (
              <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <Scissors size={48} color="var(--gold)" style={{ opacity: 0.8 }} />
                <h2 style={{ fontSize: '22px', fontFamily: 'var(--font-display)', fontWeight: 'bold', color: 'var(--text-heading)' }}>Booking Requires Client Profile</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '480px' }}>
                  To book an in-person bespoke consultation with our boutique designers, please register or log in with your mobile number.
                </p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button className="btn btn-gold" onClick={() => { setLoginTab('login'); setEcommerceTab('login'); }}>
                    Log In Account
                  </button>
                  <button className="btn btn-secondary" onClick={() => { setLoginTab('register'); setEcommerceTab('login'); }}>
                    Create Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card">
                <h2 className="catalog-section-title" style={{ fontSize: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  Book Consultation Fitting
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Schedule a styling review or custom fitting session at our Bandra West design studio. Select your consultant designer below.
                </p>

              <form onSubmit={(e) => {
                e.preventDefault();
                const aptDate = e.target.aptDate.value;
                const aptTime = e.target.aptTime.value;
                const designerId = e.target.aptDesigner.value;
                const notes = e.target.aptNotes.value;
                
                const designerObj = employees.find(emp => emp.id === designerId);

                const newApt = {
                  id: `APT-${100 + appointments.length + 1}`,
                  customerName: customerSession.name,
                  type: 'Fitting Trial',
                  date: aptDate,
                  time: aptTime,
                  designer: designerObj ? designerObj.name : 'Designer',
                  notes: notes || 'Booked online via customer portal.'
                };

                setAppointments([newApt, ...appointments]);
                triggerWhatsApp(
                  customerSession.name,
                  customerSession.mobile,
                  "Appointment Booked",
                  `Dear ${customerSession.name}, your fitting consultation with designer ${designerObj?.name || 'Designer'} is scheduled for ${aptDate} at ${aptTime}. See you at the studio!`,
                  customerSession.email
                );
                
                alert("Consultation requested! Confirmation sent via WhatsApp simulator.");
                setEcommerceTab('shop');
              }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                <div className="form-group">
                  <label className="form-label">Client Name</label>
                  <input type="text" className="form-input" value={customerSession.name} disabled />
                </div>

                <div className="form-group">
                  <label className="form-label">Styling Designer</label>
                  <select name="aptDesigner" className="select-filter" style={{ width: '100%' }}>
                    {employees.filter(e => e.role === 'Designer').map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} (Fashion Consultant)</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div className="form-group">
                    <label className="form-label">Appointment Date</label>
                    <input type="date" name="aptDate" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Requested Time Slot</label>
                    <select name="aptTime" className="select-filter" style={{ width: '100%' }}>
                      <option>10:30 AM</option>
                      <option>11:30 AM</option>
                      <option>02:30 PM</option>
                      <option>03:30 PM</option>
                      <option>04:30 PM</option>
                      <option>05:30 PM</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Styling discussion notes (Fabric, Neck cuts, etc.)</label>
                  <textarea name="aptNotes" className="form-input" style={{ height: '70px', resize: 'none' }} placeholder="e.g. discuss lehenga motif work and border trims..."></textarea>
                </div>

                <button type="submit" className="btn btn-gold" style={{ marginTop: '10px' }}>
                  Request Consultation Slot
                </button>
              </form>
              </div>
            )}
          </div>
        )}

        {/* Client Portal Role Lock - No direct role switching allowed */}

        {/* WhatsApp Simulator Slide-in notification */}
        {activeNotification && (
          <div className="whatsapp-popup">
            <div className="whatsapp-popup-header">
              <span>WhatsApp Business API Simulator</span>
              <X size={14} style={{ cursor: 'pointer' }} onClick={() => setActiveNotification(null)} />
            </div>
            <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', color: '#a7f3d0' }}>
              <span>To: {activeNotification.customerName}</span>
              <span>Trigger: {activeNotification.type}</span>
            </div>
            <div className="whatsapp-popup-body">
              {activeNotification.message}
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className={`app-container`}>
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="brand-section">
          <div className="brand-logo-container">
            <Scissors size={28} />
          </div>
          <div>
            <h1 className="brand-name">BoutiqueOS</h1>
            <p className="brand-tagline">ERP & CRM Suite</p>
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div className="staff-profile-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="user-avatar" style={{ background: 'var(--primary)' }}>
                {employeeSession?.name ? employeeSession.name.charAt(0) : 'S'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600', fontSize: '13px', color: 'var(--text-heading)', lineHeight: '1.2' }}>
                  {employeeSession?.name || 'Staff Member'}
                </span>
                <span className="role-badge" style={{ marginTop: '2px', display: 'inline-block', width: 'fit-content' }}>
                  {employeeSession?.role}
                </span>
              </div>
            </div>
            <button 
              className="btn btn-secondary btn-xs" 
              onClick={handleEmployeeLogout}
              style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <LogOut size={12} /> Log Out Staff
            </button>
          </div>
        </div>

        {/* Dynamic Nav list depending on Role */}
        <ul className="nav-list">
          {currentRole !== 'Customer Portal' ? (
            <>
              {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                <li 
                  className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('dashboard'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <TrendingUp /> Dashboard
                </li>
              )}
              
              {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                <li 
                  className={`nav-item ${currentTab === 'customers' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('customers'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <Users /> Customers
                </li>
              )}

              <li 
                className={`nav-item ${currentTab === 'orders' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('orders'); setSelectedCustomer(null); setSelectedOrder(null); }}
              >
                <Scissors /> Orders & KOT
              </li>

              {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                <li 
                  className={`nav-item ${currentTab === 'designs' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('designs'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <Sparkles /> Design Library
                </li>
              )}

              {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                <li 
                  className={`nav-item ${currentTab === 'appointments' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('appointments'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <Calendar /> Appointments
                </li>
              )}

              {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                <li 
                  className={`nav-item ${currentTab === 'billing' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('billing'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <CreditCard /> Billing & Invoices
                </li>
              )}

              {currentRole === 'Boutique Owner' && (
                <li 
                  className={`nav-item ${currentTab === 'inventory' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('inventory'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <Layers /> Inventory
                </li>
              )}

              {currentRole === 'Boutique Owner' && (
                <li 
                  className={`nav-item ${currentTab === 'employees' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('employees'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <User /> Employee Profiles
                </li>
              )}

              {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                <li 
                  className={`nav-item ${currentTab === 'whatsapp' ? 'active' : ''}`}
                  onClick={() => { setCurrentTab('whatsapp'); setSelectedCustomer(null); setSelectedOrder(null); }}
                >
                  <MessageSquare /> WhatsApp Automation
                </li>
              )}
            </>
          ) : (
            // Customer Portal Tabs
            <>
              <li 
                className={`nav-item ${currentTab === 'portal-home' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('portal-home'); }}
              >
                <ShoppingBag /> My Dashboard
              </li>
              <li 
                className={`nav-item ${currentTab === 'portal-passport' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('portal-passport'); }}
              >
                <FileText /> Digital Passport
              </li>
              <li 
                className={`nav-item ${currentTab === 'portal-wardrobe' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('portal-wardrobe'); }}
              >
                <Tag /> My Wardrobe
              </li>
              <li 
                className={`nav-item ${currentTab === 'portal-appointments' ? 'active' : ''}`}
                onClick={() => { setCurrentTab('portal-appointments'); }}
              >
                <Calendar /> Book Appointment
              </li>
            </>
          )}
        </ul>

        {/* Sidebar Footer Widget */}
        <div className="sidebar-footer">
          <div className="user-widget">
            <div className="user-avatar" style={{ background: 'var(--primary)' }}>
              {employeeSession?.name ? employeeSession.name.charAt(0) : 'S'}
            </div>
            <div className="user-info">
              <span className="user-name">{employeeSession?.name || 'Staff Member'}</span>
              <span className="user-role">{employeeSession?.role}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN APP CONTENT PANEL */}
      <main className="main-content">
        
        {/* TOP NAVBAR HEADER */}
        <header className="top-header">
          <div className="header-left">
            <span className="page-title">
              {currentRole === 'Customer Portal' ? 'Client Access Hub' : `Console - Staff Operations`}
            </span>
          </div>

          <div className="header-right">
            {currentRole === 'Customer Portal' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Acting Client:</span>
                <select 
                  className="select-filter" 
                  value={selectedPortalCustomer}
                  onChange={(e) => setSelectedPortalCustomer(e.target.value)}
                  style={{ padding: '6px 12px' }}
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button 
              className="icon-btn" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Dark/Light Mode"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {currentRole === 'Boutique Owner' && (
              <button 
                className="btn btn-danger btn-xs"
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear the database and start with a completely empty slate?")) {
                    fetch(`${API_BASE}/api/reset-database`, { method: 'POST' })
                      .then(() => {
                        localStorage.clear();
                        window.location.reload();
                      })
                      .catch(err => {
                        console.error('Failed to reset backend database:', err);
                        localStorage.clear();
                        window.location.reload();
                      });
                  }
                }}
                style={{ padding: '8px 12px' }}
              >
                Clear Database
              </button>
            )}
            
            {/* Portal Switch and Back-to-Admin Buttons Removed for strict role-isolation */}
          </div>
        </header>

        {/* PAGE CONTENT ROUTER */}
        <div className="page-container">
          
          {/* ==================== OWNER/STAFF DASHBOARD TAB ==================== */}
          {currentTab === 'dashboard' && (
            <>
              {/* Stats overview cards */}
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon-wrapper gold">
                    <TrendingUp />
                  </div>
                  <div className="stat-details">
                    <span className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
                    <span className="stat-label">Total Cash Collected</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper primary">
                    <Scissors />
                  </div>
                  <div className="stat-details">
                    <span className="stat-value">{activeOrdersCount}</span>
                    <span className="stat-label">Active Orders</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper success">
                    <CheckCircle />
                  </div>
                  <div className="stat-details">
                    <span className="stat-value">
                      {orders.filter(o => o.status === 'Delivered' || o.status === 'Closed').length}
                    </span>
                    <span className="stat-label">Completed Deliveries</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper danger">
                    <AlertTriangle />
                  </div>
                  <div className="stat-details">
                    <span className="stat-value">{lowStockCount}</span>
                    <span className="stat-label">Low Stock Alerts</span>
                  </div>
                </div>
              </div>

              {/* Charts & Quick Action Section */}
              <div className="dashboard-grid-2x1">
                {/* Custom SVG line chart */}
                <div className="glass-card">
                  <div className="card-header">
                    <h3 className="card-title"><TrendingUp size={16} color="var(--primary)" /> Monthly Revenue Trend (2026)</h3>
                  </div>
                  
                  {/* Styled SVG Chart */}
                  <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                    <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="var(--border-color)" strokeWidth="0.5" />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="var(--border-color)" strokeWidth="0.5" />
                      <line x1="40" y1="120" x2="480" y2="120" stroke="var(--border-color)" strokeWidth="0.5" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="var(--border-color)" strokeWidth="0.5" />

                      {/* Area under line */}
                      <path 
                        d="M 40,170 L 40,140 Q 120,110 160,120 T 280,60 T 400,80 T 480,30 L 480,170 Z" 
                        fill="url(#chartGradient)"
                      />

                      {/* Line Path */}
                      <path 
                        d="M 40,140 Q 120,110 160,120 T 280,60 T 400,80 T 480,30" 
                        fill="none" 
                        stroke="var(--primary)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                      />

                      {/* Dots on peak points */}
                      <circle cx="40" cy="140" r="4.5" fill="var(--gold)" />
                      <circle cx="160" cy="120" r="4.5" fill="var(--gold)" />
                      <circle cx="280" cy="60" r="4.5" fill="var(--gold)" />
                      <circle cx="400" cy="80" r="4.5" fill="var(--gold)" />
                      <circle cx="480" cy="30" r="4.5" fill="var(--gold)" />

                      {/* X labels */}
                      <text x="40" y="192" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Jan</text>
                      <text x="160" y="192" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Mar</text>
                      <text x="280" y="192" fill="var(--text-muted)" fontSize="9" textAnchor="middle">May</text>
                      <text x="400" y="192" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Jul</text>
                      <text x="480" y="192" fill="var(--text-muted)" fontSize="9" textAnchor="middle">Sep</text>

                      {/* Y Labels */}
                      <text x="32" y="24" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹50K</text>
                      <text x="32" y="74" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹30K</text>
                      <text x="32" y="124" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹15K</text>
                      <text x="32" y="174" fill="var(--text-muted)" fontSize="8" textAnchor="end">₹0</text>
                    </svg>
                  </div>
                </div>

                {/* Operations & Quick Actions */}
                <div className="glass-card">
                  <div className="card-header">
                    <h3 className="card-title"><Sparkles size={16} color="var(--gold)" /> Fast Tools</h3>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setShowAddOrderModal(true)}
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Plus size={16} /> New Order & KOT Entry
                    </button>
                    <button 
                      className="btn btn-gold" 
                      onClick={() => setShowAddCustModal(true)}
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Plus size={16} /> Register New Customer
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setShowAddAptModal(true)}
                      style={{ width: '100%', justifyContent: 'flex-start' }}
                    >
                      <Calendar size={16} /> Book Trial/Consultation
                    </button>
                  </div>

                  {/* Stock Alert Summary */}
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                      <AlertTriangle size={14} /> Critical Inventory Level Warnings
                    </div>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                      {inventory.fabrics.filter(f => f.quantity <= f.minStock).map(f => (
                        <li key={f.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                          <span>{f.name}</span>
                          <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{f.quantity}m left</span>
                        </li>
                      ))}
                      {inventory.accessories.filter(a => a.quantity <= a.minStock).map(a => (
                        <li key={a.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', padding: '4px 0' }}>
                          <span>{a.name}</span>
                          <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{a.quantity} units left</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Active Trials and Deliveries */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title"><Clock size={16} color="var(--primary)" /> Urgent Order Tasks & Trial Timelines</h3>
                </div>
                
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Client</th>
                        <th>Garment</th>
                        <th>Trial Date</th>
                        <th>Delivery Date</th>
                        <th>Assigned Tailor</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map(o => (
                        <tr key={o.id}>
                          <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{o.id}</td>
                          <td>{o.customerName}</td>
                          <td>{o.garmentType}</td>
                          <td>{o.trialDate}</td>
                          <td>{o.deliveryDate}</td>
                          <td>
                            {employees.find(e => e.id === o.assignedTailor)?.name || 'Tailor Not Assigned'}
                          </td>
                          <td>
                            <span className={`status-badge status-${STATUS_LIST.indexOf(o.status) + 1}`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==================== MODULE 1: CUSTOMERS MANAGEMENT TAB ==================== */}
          {currentTab === 'customers' && !selectedCustomer && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><Users /> Boutique Registered Client Base</h3>
                <button className="btn btn-primary btn-xs" onClick={() => setShowAddCustModal(true)}>
                  <Plus size={14} /> Add Customer
                </button>
              </div>

              {/* Customer Filters */}
              <div className="filter-bar">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by ID, Name or Contact Number..." 
                    className="search-input" 
                    value={custSearch}
                    onChange={(e) => setCustSearch(e.target.value)}
                  />
                </div>

                <select 
                  className="select-filter" 
                  value={custTagFilter}
                  onChange={(e) => setCustTagFilter(e.target.value)}
                >
                  <option value="">All Segment Tags</option>
                  <option value="VIP">VIP</option>
                  <option value="Bridal">Bridal</option>
                  <option value="Regular">Regular</option>
                  <option value="New Customer">New Customer</option>
                </select>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Customer ID</th>
                      <th>Name</th>
                      <th>Mobile Number</th>
                      <th>Email</th>
                      <th>DOB</th>
                      <th>Tags</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map(cust => (
                      <tr key={cust.id}>
                        <td style={{ fontWeight: 'bold' }}>{cust.id}</td>
                        <td style={{ fontWeight: '600', color: 'var(--text-heading)' }}>{cust.name}</td>
                        <td>{cust.mobile}</td>
                        <td>{cust.email}</td>
                        <td>{cust.dob}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {cust.tags.map(t => (
                              <span 
                                key={t} 
                                className={`tag ${
                                  t === 'VIP' ? 'tag-vip' : 
                                  t === 'Bridal' ? 'tag-bridal' : 
                                  t === 'Regular' ? 'tag-regular' : 'tag-new'
                                }`}
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn btn-gold btn-xs"
                            onClick={() => {
                              setSelectedCustomer(cust);
                              // Reset version comparers
                              setCompVersion1('');
                              setCompVersion2('');
                            }}
                          >
                            <Eye size={12} /> Passport & History
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CUSTOMER PROFILE DETAILS (PASSPORT & WARDROBE DETAIL VIEW) */}
          {currentTab === 'customers' && selectedCustomer && (
            <div>
              <button 
                className="btn btn-secondary btn-xs" 
                onClick={() => setSelectedCustomer(null)}
                style={{ marginBottom: '16px' }}
              >
                ← Back to Clients List
              </button>

              <div className="customer-profile-layout">
                {/* Customer sidebar details card */}
                <div className="profile-sidebar">
                  <div className="glass-card profile-avatar-card">
                    <div className="profile-large-avatar">
                      {selectedCustomer.name.charAt(0)}
                    </div>
                    <h3 className="profile-name">{selectedCustomer.name}</h3>
                    <span className="profile-id">{selectedCustomer.id}</span>
                    <div className="profile-tags">
                      {selectedCustomer.tags.map(t => (
                        <span key={t} className={`tag tag-${t.toLowerCase().replace(/\s/g, '')}`}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card">
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 'bold' }}>Contact Credentials</h4>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="info-label">Mobile / Whatsapp</span>
                        <span className="info-val">{selectedCustomer.mobile}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Email Address</span>
                        <span className="info-val">{selectedCustomer.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Address</span>
                        <span className="info-val">{selectedCustomer.address}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Birth Date</span>
                        <span className="info-val">{selectedCustomer.dob}</span>
                      </div>
                      {selectedCustomer.anniversary && (
                        <div className="info-item">
                          <span className="info-label">Anniversary Date</span>
                          <span className="info-val">{selectedCustomer.anniversary}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Design Preferences preferences card */}
                  <div className="glass-card">
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 'bold' }}>Design Preferences</h4>
                    <p style={{ fontSize: '13px', lineHeight: '1.5', fontStyle: 'italic' }}>
                      "{selectedCustomer.designPreferences}"
                    </p>
                  </div>
                </div>

                {/* Main Client Profile Tabs (Passport, Wardrobe, Orders) */}
                <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Passport Tab Selector */}
                  <div className="tab-nav">
                    <span 
                      className={`tab-nav-item ${activeGarmentTab === 'blouse' ? 'active' : ''}`}
                      onClick={() => { setActiveGarmentTab('blouse'); setCompVersion1(''); setCompVersion2(''); }}
                    >
                      Blouse Passport
                    </span>
                    <span 
                      className={`tab-nav-item ${activeGarmentTab === 'chudidar' ? 'active' : ''}`}
                      onClick={() => { setActiveGarmentTab('chudidar'); setCompVersion1(''); setCompVersion2(''); }}
                    >
                      Chudidar Passport
                    </span>
                    <span 
                      className={`tab-nav-item ${activeGarmentTab === 'lehenga' ? 'active' : ''}`}
                      onClick={() => { setActiveGarmentTab('lehenga'); setCompVersion1(''); setCompVersion2(''); }}
                    >
                      Lehenga Passport
                    </span>
                    <span 
                      className={`tab-nav-item ${activeGarmentTab === 'gown' ? 'active' : ''}`}
                      onClick={() => { setActiveGarmentTab('gown'); setCompVersion1(''); setCompVersion2(''); }}
                    >
                      Gown Passport
                    </span>
                  </div>

                  {/* DIGITAL PASSPORT MODULE CONTENT */}
                  <div className="measurements-container">
                    
                    {/* Measurement details card */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)' }}>
                        Garment Dimensions: {activeGarmentTab.toUpperCase()}
                      </h4>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {selectedCustomer.measurements[activeGarmentTab]?.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Compare Versions:</span>
                            <select 
                              className="select-filter" 
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              value={compVersion1}
                              onChange={(e) => setCompVersion1(e.target.value)}
                            >
                              <option value="">Version A</option>
                              {selectedCustomer.measurements[activeGarmentTab].map(v => (
                                <option key={v.version} value={v.version}>V{v.version} ({v.date})</option>
                              ))}
                            </select>
                            <span style={{ color: 'var(--text-muted)' }}>vs</span>
                            <select 
                              className="select-filter" 
                              style={{ padding: '4px 8px', fontSize: '11px' }}
                              value={compVersion2}
                              onChange={(e) => setCompVersion2(e.target.value)}
                            >
                              <option value="">Version B</option>
                              {selectedCustomer.measurements[activeGarmentTab].map(v => (
                                <option key={v.version} value={v.version}>V{v.version} ({v.date})</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Compare Section Panel if version selected */}
                    {compVersion1 && compVersion2 ? (
                      <div className="comparison-grid">
                        <div className="comparison-card">
                          <h5 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Dimension Comparison V{compVersion1} vs V{compVersion2}</h5>
                          {activeGarmentTab === 'gown' ? (
                            <div>
                              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Gown fits use unstructured text models:</p>
                              <div style={{ marginTop: '10px' }}>
                                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>V{compVersion1}:</div>
                                <div style={{ fontStyle: 'italic', fontSize: '12px' }}>
                                  {selectedCustomer.measurements[activeGarmentTab].find(v => v.version === Number(compVersion1))?.fullMeasurements}
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '8px' }}>V{compVersion2}:</div>
                                <div style={{ fontStyle: 'italic', fontSize: '12px' }}>
                                  {selectedCustomer.measurements[activeGarmentTab].find(v => v.version === Number(compVersion2))?.fullMeasurements}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <table style={{ width: '100%', fontSize: '12px' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                  <th style={{ padding: '6px' }}>Part</th>
                                  <th style={{ padding: '6px' }}>V{compVersion1}</th>
                                  <th style={{ padding: '6px' }}>V{compVersion2}</th>
                                  <th style={{ padding: '6px', textAlign: 'right' }}>Difference</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(selectedCustomer.measurements[activeGarmentTab][0] || {})
                                  .filter(k => k !== 'version' && k !== 'date' && k !== 'notes')
                                  .map(field => {
                                    const comp = getMeasurementComparisonVal(field);
                                    if (!comp) return null;
                                    return (
                                      <tr key={field} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '6px', textTransform: 'capitalize', fontWeight: 'bold' }}>{field.replace(/([A-Z])/g, ' $1')}</td>
                                        <td style={{ padding: '6px' }}>{comp.val1}"</td>
                                        <td style={{ padding: '6px' }}>{comp.val2}"</td>
                                        <td style={{ padding: '6px', textAlign: 'right' }} className={comp.diff > 0 ? 'comparison-diff-up' : comp.diff < 0 ? 'comparison-diff-down' : ''}>
                                          {comp.diff > 0 ? `+${comp.diff}"` : comp.diff < 0 ? `${comp.diff}"` : '0"'}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    ) : (
                      // Standard Display
                      <div>
                        {selectedCustomer.measurements[activeGarmentTab]?.length > 0 ? (
                          (() => {
                            const latest = selectedCustomer.measurements[activeGarmentTab][0];
                            return (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '8px 16px', borderRadius: '8px' }}>
                                  <span>Viewing Latest V{latest.version} Measurements</span>
                                  <span>Measured On: {latest.date}</span>
                                </div>

                                {activeGarmentTab === 'gown' ? (
                                  <div style={{ backgroundColor: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
                                    <h5 style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--gold)', marginBottom: '8px' }}>Gown Specification Log</h5>
                                    <p style={{ fontSize: '13px', lineHeight: '1.6' }}>{latest.fullMeasurements}</p>
                                  </div>
                                ) : (
                                  <div className="measurement-grid">
                                    {Object.keys(latest)
                                      .filter(key => key !== 'version' && key !== 'date' && key !== 'notes')
                                      .map(key => (
                                        <div className="measurement-box" key={key}>
                                          <span className="measurement-val">{latest[key]}"</span>
                                          <span className="measurement-label" style={{ textTransform: 'capitalize' }}>
                                            {key.replace(/([A-Z])/g, ' $1')}
                                          </span>
                                        </div>
                                      ))
                                    }
                                  </div>
                                )}

                                <div style={{ borderLeft: '3px solid var(--primary)', padding: '10px 14px', backgroundColor: 'rgba(167, 139, 250, 0.04)', borderRadius: '0 8px 8px 0', fontSize: '12px' }}>
                                  <strong>Fit Notes:</strong> {latest.notes}
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                            <AlertTriangle style={{ margin: '0 auto 12px', display: 'block' }} />
                            No digital passport specifications logged for {activeGarmentTab.toUpperCase()} yet.
                          </div>
                        )}
                      </div>
                    )}

                    {/* New Version Submission Widget */}
                    <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                      <h4 style={{ fontSize: '14px', marginBottom: '12px', fontFamily: 'var(--font-display)', color: 'var(--text-heading)' }}>
                        Record New Dimension Version
                      </h4>
                      <form className="form-grid" onSubmit={handleAddMeasurement}>
                        {activeGarmentTab === 'gown' ? (
                          <div className="form-group full-width">
                            <label className="form-label">Full Gown Specs (e.g. Bust:34, Waist:28, Length:56)</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="Enter comma separated spec values" 
                              value={newMeasLength}
                              onChange={(e) => setNewMeasLength(e.target.value)}
                              required
                            />
                          </div>
                        ) : (
                          <>
                            <div className="form-group">
                              <label className="form-label">{activeGarmentTab === 'chudidar' ? 'Chest (inches)' : 'Bust (inches)'}</label>
                              <input type="number" step="0.25" className="form-input" value={newMeasBust} onChange={(e) => setNewMeasBust(e.target.value)} required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Waist (inches)</label>
                              <input type="number" step="0.25" className="form-input" value={newMeasWaist} onChange={(e) => setNewMeasWaist(e.target.value)} required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">{activeGarmentTab === 'lehenga' ? 'Hip (inches)' : 'Shoulder (inches)'}</label>
                              <input type="number" step="0.25" className="form-input" value={newMeasShoulder} onChange={(e) => setNewMeasShoulder(e.target.value)} required />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Sleeve Length (inches)</label>
                              <input type="number" step="0.25" className="form-input" value={newMeasSleeveLen} onChange={(e) => setNewMeasSleeveLen(e.target.value)} required />
                            </div>
                            {activeGarmentTab === 'blouse' && (
                              <>
                                <div className="form-group">
                                  <label className="form-label">Arm Round (inches)</label>
                                  <input type="number" step="0.25" className="form-input" value={newMeasArmRound} onChange={(e) => setNewMeasArmRound(e.target.value)} />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Front/Back Neck (inches)</label>
                                  <input type="number" step="0.25" className="form-input" value={newMeasFrontNeck} onChange={(e) => setNewMeasFrontNeck(e.target.value)} />
                                </div>
                              </>
                            )}
                            <div className="form-group">
                              <label className="form-label">Length (inches)</label>
                              <input type="number" step="0.25" className="form-input" value={newMeasLength} onChange={(e) => setNewMeasLength(e.target.value)} required />
                            </div>
                          </>
                        )}
                        <div className="form-group full-width">
                          <label className="form-label">Alteration / Stitching Instructions</label>
                          <input type="text" className="form-input" placeholder="Tight bust, loose cuffs, specific embroidery pattern info, etc." value={newMeasNotes} onChange={(e) => setNewMeasNotes(e.target.value)} />
                        </div>
                        <div className="form-group full-width" style={{ marginTop: '8px' }}>
                          <button type="submit" className="btn btn-primary" style={{ width: 'fit-content' }}>
                            Update Digital Passport
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* DIGITAL WARDROBE SUBSECTION */}
                    <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
                      <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-heading)', marginBottom: '16px' }}>
                        Customer Wardrobe History (Past Stitched Styles)
                      </h4>

                      {/* Display grid of Wardrobe */}
                      <div className="wardrobe-grid">
                        {orders.filter(o => o.customerId === selectedCustomer.id && (o.status === 'Delivered' || o.status === 'Ready for Delivery' || o.status === 'Stitching')).map(ord => (
                          <div className="wardrobe-card" key={ord.id}>
                            <div className="wardrobe-image-wrapper">
                              {ord.referenceImage ? (
                                <img src={ord.referenceImage} className="wardrobe-image" alt="Stitched look" />
                              ) : (
                                <Scissors size={40} color="var(--border-color)" />
                              )}
                            </div>
                            <div className="wardrobe-info">
                              <div className="wardrobe-title">{ord.garmentType} - {ord.id}</div>
                              <div className="wardrobe-meta-row">
                                <span>Fabric: {ord.fabricUsed.slice(0, 15)}...</span>
                                <span className="wardrobe-cost">₹{ord.stitchingCost}</span>
                              </div>
                              <div className="wardrobe-meta-row">
                                <span>Date: {ord.deliveryDate}</span>
                              </div>
                              <button 
                                className="btn btn-gold btn-xs" 
                                style={{ width: '100%', marginTop: '8px' }}
                                onClick={() => handleOneClickReorder(ord.garmentType, ord.stitchingCost, ord.referenceImage)}
                              >
                                <RefreshCw size={11} /> One-Click Reorder
                              </button>
                            </div>
                          </div>
                        ))}
                        {orders.filter(o => o.customerId === selectedCustomer.id).length === 0 && (
                          <div style={{ gridColumn: '1/-1', color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>
                            This customer has no previous orders logged.
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 3: ORDER / KOT MANAGEMENT TAB ==================== */}
          {currentTab === 'orders' && !selectedOrder && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><Scissors /> Order & Job Ticket Management</h3>
                {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                  <button className="btn btn-primary btn-xs" onClick={() => setShowAddOrderModal(true)}>
                    <Plus size={14} /> New Order Form
                  </button>
                )}
              </div>

              {/* Order filters */}
              <div className="filter-bar">
                <div className="search-input-wrapper">
                  <Search className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search orders by ID, garment type or customer name..." 
                    className="search-input" 
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                  />
                </div>

                <select 
                  className="select-filter" 
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  {STATUS_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Kanban Column View or Table List View */}
              {/* Show Kanban if Boutique Owner/Designer/Receptionist */}
              {currentRole !== 'Tailor' ? (
                <div className="kanban-container">
                  {STATUS_LIST.map((status, index) => {
                    const columnOrders = filteredOrders.filter(o => o.status === status);
                    // Filter orders assigned to designer if Designer is looking
                    const finalColOrders = currentRole === 'Designer' 
                      ? columnOrders.filter(o => o.assignedDesigner === 'EMP-003') 
                      : columnOrders;

                    return (
                      <div className="kanban-column" key={status}>
                        <div className="kanban-column-header">
                          <span className="kanban-column-title">{status}</span>
                          <span className="kanban-column-count">{finalColOrders.length}</span>
                        </div>
                        
                        <div className="kanban-cards-list">
                          {finalColOrders.map(ord => (
                            <div 
                              className="kanban-card" 
                              key={ord.id}
                              onClick={() => setSelectedOrder(ord)}
                            >
                              <div className="kanban-card-header">
                                <span className="kanban-card-id">{ord.id}</span>
                                <span className={`kanban-card-priority priority-${ord.priority.toLowerCase()}`}>
                                  {ord.priority}
                                </span>
                              </div>
                              <h4 className="kanban-card-title">{ord.garmentType}</h4>
                              <span className="kanban-card-cust">{ord.customerName}</span>
                              
                              <div className="kanban-card-footer">
                                <span className="kanban-card-date">
                                  <Clock size={10} /> {ord.deliveryDate}
                                </span>
                                {ord.stitchingCost && (
                                  <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>₹{ord.stitchingCost}</span>
                                )}
                              </div>
                              
                              {/* status control button */}
                              {index < STATUS_LIST.length - 1 && (
                                <button 
                                  className="btn btn-secondary btn-xs"
                                  style={{ marginTop: '8px', fontSize: '9px', padding: '3px 6px' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleUpdateOrderStatus(ord.id, STATUS_LIST[index + 1]);
                                  }}
                                >
                                  Advance → {STATUS_LIST[index + 1]}
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Tailor Simplified Work orders Table view
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Your Assigned Stitching Tasks (Ramesh Tailor)</h4>
                  <div className="table-responsive">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>Task ID</th>
                          <th>Client Name</th>
                          <th>Garment Type</th>
                          <th>Trial Schedule</th>
                          <th>Delivery Date</th>
                          <th>Current Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.filter(o => o.assignedTailor === 'EMP-002').map(ord => (
                          <tr key={ord.id}>
                            <td style={{ fontWeight: 'bold' }}>{ord.id}</td>
                            <td>{ord.customerName}</td>
                            <td>{ord.garmentType}</td>
                            <td>{ord.trialDate}</td>
                            <td>{ord.deliveryDate}</td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}>
                                {ord.status}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  className="btn btn-gold btn-xs"
                                  onClick={() => setSelectedOrder(ord)}
                                >
                                  Open Job Ticket (KOT)
                                </button>
                                {ord.status === 'Cutting' && (
                                  <button 
                                    className="btn btn-primary btn-xs"
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Stitching')}
                                  >
                                    Mark: Stitching Started
                                  </button>
                                )}
                                {ord.status === 'Stitching' && (
                                  <button 
                                    className="btn btn-primary btn-xs"
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Trial Scheduled')}
                                  >
                                    Mark: Ready for Trial
                                  </button>
                                )}
                                {ord.status === 'Alteration' && (
                                  <button 
                                    className="btn btn-primary btn-xs"
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'Ready for Delivery')}
                                  >
                                    Mark: Alteration Completed
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SINGLE ORDER VIEW / KOT TICKET OVERVIEW */}
          {currentTab === 'orders' && selectedOrder && (
            <div>
              <button 
                className="btn btn-secondary btn-xs" 
                onClick={() => setSelectedOrder(null)}
                style={{ marginBottom: '16px' }}
              >
                ← Back to Order Board
              </button>

              <div className="customer-profile-layout">
                {/* Order Meta details sidebar */}
                <div className="profile-sidebar">
                  <div className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold' }}>{selectedOrder.id}</span>
                      <span className={`tag priority-${selectedOrder.priority.toLowerCase()}`}>{selectedOrder.priority}</span>
                    </div>

                    <h3 className="profile-name" style={{ fontSize: '18px', marginBottom: '4px' }}>{selectedOrder.garmentType}</h3>
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 'bold' }}>For: {selectedOrder.customerName}</span>
                    
                    <div style={{ marginTop: '16px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status:</span>
                      <select 
                        className="select-filter" 
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                        style={{ width: '100%', marginTop: '6px' }}
                      >
                        {STATUS_LIST.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="glass-card">
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 'bold' }}>Stitching & Design Team</h4>
                    <div className="info-list">
                      <div className="info-item">
                        <span className="info-label">Assigned Tailor / Stitcher</span>
                        <span className="info-val">
                          {employees.find(e => e.id === selectedOrder.assignedTailor)?.name || 'None Assigned'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Assigned Designer / Consultation</span>
                        <span className="info-val">
                          {employees.find(e => e.id === selectedOrder.assignedDesigner)?.name || 'None Assigned'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Trial Schedule</span>
                        <span className="info-val">{selectedOrder.trialDate}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Promise Delivery Date</span>
                        <span className="info-val">{selectedOrder.deliveryDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* KOT Action buttons */}
                  <div className="glass-card">
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 'bold' }}>Quick Commands</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button 
                        className="btn btn-gold" 
                        style={{ width: '100%' }}
                        onClick={() => setShowKOTPrint(true)}
                      >
                        <Printer size={14} /> Print KOT (Tailor Sheet)
                      </button>
                      
                      {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                        <button 
                          className="btn btn-primary" 
                          style={{ width: '100%' }}
                          onClick={() => {
                            const finalCost = selectedOrder.stitchingCost + selectedOrder.fabricCost;
                            setPrintInvoiceData({
                              invoiceId: `INV-${selectedOrder.id.split('-')[1]}-${Date.now().toString().slice(-3)}`,
                              orderId: selectedOrder.id,
                              customerName: selectedOrder.customerName,
                              garmentType: selectedOrder.garmentType,
                              stitchingCost: selectedOrder.stitchingCost,
                              fabricCost: selectedOrder.fabricCost,
                              total: finalCost,
                              advancePaid: selectedOrder.advancePaid,
                              balance: finalCost - selectedOrder.advancePaid,
                              method: selectedOrder.paymentMethod,
                              date: new Date().toLocaleDateString()
                            });
                            setShowInvoicePrint(true);
                          }}
                        >
                          <FileText size={14} /> Generate Invoice Receipt
                        </button>
                      )}

                      {(currentRole === 'Boutique Owner' || currentRole === 'Receptionist') && (
                        <button 
                          className="btn btn-secondary" 
                          style={{ width: '100%' }}
                          onClick={() => setShowPaymentModal(true)}
                        >
                          <CreditCard size={14} /> Record Bill Payment
                        </button>
                      )}

                      <button 
                        className="btn btn-secondary" 
                        style={{ width: '100%', borderColor: '#25D366', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onClick={() => {
                          const customerObj = customers.find(c => c.id === selectedOrder.customerId);
                          const phone = customerObj ? customerObj.mobile : '9900990099';
                          
                          let msg = '';
                          if (selectedOrder.status === 'Order Created') {
                            msg = `Dear ${selectedOrder.customerName}, thank you for placing a custom order ${selectedOrder.id} for a ${selectedOrder.garmentType}. Your trial is set for ${selectedOrder.trialDate}.`;
                          } else if (selectedOrder.status === 'Design Approved') {
                            msg = `Hi ${selectedOrder.customerName}, your design draft for order ${selectedOrder.id} has been approved by the designer and cutting has commenced.`;
                          } else if (selectedOrder.status === 'Stitching') {
                            msg = `Hello ${selectedOrder.customerName}, tailoring work has started on your garment ${selectedOrder.id}.`;
                          } else if (selectedOrder.status === 'Trial Scheduled') {
                            msg = `Hi ${selectedOrder.customerName}, your trial schedule for order ${selectedOrder.id} is set for ${selectedOrder.trialDate}. Please visit the boutique.`;
                          } else if (selectedOrder.status === 'Ready for Delivery') {
                            msg = `Congratulations ${selectedOrder.customerName}! Your custom garment is finished and ready for pickup.`;
                          } else {
                            msg = `Hello ${selectedOrder.customerName}, your order ${selectedOrder.id} status has been updated to: ${selectedOrder.status.toUpperCase()}.`;
                          }
                          
                          const cleanPhone = phone.replace(/\D/g, '');
                          const waUrl = `https://api.whatsapp.com/send?phone=91${cleanPhone}&text=${encodeURIComponent(msg)}`;
                          window.open(waUrl, '_blank');
                        }}
                      >
                        <MessageSquare size={14} /> Send Free WhatsApp Alert
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Order / KOT Specifications Sheet */}
                <div className="glass-card">
                  <div className="card-header">
                    <h3 className="card-title"><FileText /> Karigar Job Instruction Sheet (KOT)</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '20px' }}>
                      <div>
                        <h4 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Special Tailoring Instructions</h4>
                        <p style={{ fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-line', borderLeft: '3px solid var(--gold)', paddingLeft: '12px' }}>
                          {selectedOrder.notes || 'No specific notes logged.'}
                        </p>
                      </div>

                      {/* Design Thumbnail */}
                      <div style={{ width: '150px', height: '150px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selectedOrder.referenceImage ? (
                          <img src={selectedOrder.referenceImage} alt="Ref draft" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No design attached</span>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      <h4 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Client Measurements Used for this Style</h4>
                      {/* Read customer measurements */}
                      {(() => {
                        const cust = customers.find(c => c.id === selectedOrder.customerId);
                        const garmentKey = selectedOrder.garmentType.toLowerCase();
                        const latestMeas = cust?.measurements[garmentKey]?.[0] || cust?.measurements['blouse']?.[0];

                        if (!latestMeas) {
                          return (
                            <p style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
                              No specifications saved in the passport. Using standard sizes.
                            </p>
                          );
                        }

                        return (
                          <div className="measurement-grid">
                            {Object.keys(latestMeas)
                              .filter(k => k !== 'version' && k !== 'date' && k !== 'notes')
                              .map(key => (
                                <div className="measurement-box" key={key}>
                                  <span className="measurement-val">{latestMeas[key]}"</span>
                                  <span className="measurement-label" style={{ textTransform: 'capitalize' }}>
                                    {key.replace(/([A-Z])/g, ' $1')}
                                  </span>
                                </div>
                              ))
                            }
                          </div>
                        );
                      })()}
                    </div>

                    <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                      <h4 style={{ color: 'var(--text-heading)', marginBottom: '12px' }}>Billing Summary Details</h4>
                      <table style={{ width: '100%', fontSize: '13px' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Tailoring Charges</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>₹{selectedOrder.stitchingCost}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '8px 0', color: 'var(--text-muted)' }}>Boutique Fabric Cost</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold' }}>₹{selectedOrder.fabricCost}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '8px 0', color: 'var(--text-heading)', fontWeight: 'bold' }}>Gross Invoice Amount</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--gold)' }}>
                              ₹{selectedOrder.stitchingCost + selectedOrder.fabricCost}
                            </td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '8px 0', color: 'var(--success)' }}>Advance/Partial Paid Amount</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--success)' }}>
                              - ₹{selectedOrder.advancePaid}
                            </td>
                          </tr>
                          <tr>
                            <td style={{ padding: '8px 0', color: 'var(--danger)', fontWeight: 'bold' }}>Balance Amount Pending</td>
                            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 'bold', color: 'var(--danger)' }}>
                              ₹{selectedOrder.stitchingCost + selectedOrder.fabricCost - selectedOrder.advancePaid}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 5: DESIGN LIBRARY TAB ==================== */}
          {currentTab === 'designs' && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><Sparkles /> Creative Style Catalogs</h3>
                <button className="btn btn-primary btn-xs" onClick={() => alert('Simulated upload feature! Pre-populated mock images are configured.')}>
                  <Plus size={14} /> Upload New Design
                </button>
              </div>

              <div className="designs-grid">
                {designLibrary.map(dsn => (
                  <div className="design-card" key={dsn.id}>
                    <div className="design-image-container">
                      <img src={dsn.image} className="design-img" alt={dsn.title} />
                    </div>
                    <div className="design-details">
                      <div className="design-title">{dsn.title}</div>
                      <div className="design-specs">
                        <span className="spec-badge">{dsn.category}</span>
                        <span className="spec-badge">Neck: {dsn.neckType}</span>
                        <span className="spec-badge">Sleeve: {dsn.sleeveType}</span>
                        <span className="spec-badge">{dsn.occasion}</span>
                        <span className="spec-badge" style={{ color: 'var(--gold)' }}>{dsn.budget}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== MODULE 6: APPOINTMENTS TAB ==================== */}
          {currentTab === 'appointments' && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><Calendar /> Consultation & Fitting Appointments</h3>
                <button className="btn btn-primary btn-xs" onClick={() => setShowAddAptModal(true)}>
                  <Plus size={14} /> Book Appointment Slot
                </button>
              </div>

              <div className="dashboard-grid-2x1">
                {/* Calendar Layout */}
                <div style={{ backgroundColor: 'var(--bg-input)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ color: 'var(--text-heading)', fontSize: '15px' }}>July 2026</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Summer Bridal Bookings</span>
                  </div>

                  {/* Calendar Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center', fontSize: '11px' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                      <div key={d} style={{ fontWeight: 'bold', color: 'var(--text-muted)', paddingBottom: '6px' }}>{d}</div>
                    ))}
                    
                    {/* Empty slots for offset */}
                    <div style={{ padding: '8px' }}></div>
                    <div style={{ padding: '8px' }}></div>
                    <div style={{ padding: '8px' }}></div>
                    
                    {/* Calendar Days */}
                    {Array.from({ length: 30 }, (_, i) => {
                      const dayNum = i + 1;
                      const hasApt = appointments.some(apt => {
                        const day = Number(apt.date.split('-')[2]);
                        return day === dayNum;
                      });

                      return (
                        <div 
                          key={dayNum} 
                          style={{ 
                            padding: '10px', 
                            borderRadius: '8px', 
                            backgroundColor: hasApt ? 'var(--primary-bg)' : 'rgba(255,255,255,0.01)',
                            border: hasApt ? '1px solid var(--primary)' : '1px solid transparent',
                            color: hasApt ? 'var(--primary)' : 'var(--text-main)',
                            fontWeight: hasApt ? 'bold' : 'normal',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            if (hasApt) {
                              const dayApts = appointments.filter(apt => Number(apt.date.split('-')[2]) === dayNum);
                              alert(`Appointments on July ${dayNum}:\n` + dayApts.map(a => `- ${a.customerName} (${a.type}) at ${a.time}`).join('\n'));
                            } else {
                              alert(`No appointments booked on July ${dayNum}. Click 'Book Appointment' to add.`);
                            }
                          }}
                        >
                          {dayNum}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Appointment Queue List */}
                <div>
                  <h4 style={{ color: 'var(--gold)', marginBottom: '12px', fontSize: '14px' }}>Upcoming Schedule Queue</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {appointments.map(apt => (
                      <div 
                        key={apt.id}
                        style={{ 
                          padding: '14px', 
                          borderRadius: '10px', 
                          border: '1px solid var(--border-color)', 
                          backgroundColor: 'var(--bg-input)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 'bold', color: 'var(--text-heading)', fontSize: '13px' }}>
                            {apt.customerName} - <span style={{ color: 'var(--gold)' }}>{apt.type}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {apt.date} at {apt.time} | Consultant: {apt.designer}
                          </div>
                          <div style={{ fontSize: '11px', fontStyle: 'italic', marginTop: '6px' }}>
                            "{apt.notes}"
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 7: BILLING & PAYMENTS TAB ==================== */}
          {currentTab === 'billing' && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><CreditCard /> Invoice Ledger & Cash Flow</h3>
                <button 
                  className="btn btn-primary btn-xs"
                  onClick={() => {
                    if (orders.length === 0) {
                      alert('Create an order first to generate an invoice.');
                      return;
                    }
                    setShowAddInvoiceModal(true);
                  }}
                >
                  <Plus size={14} /> Create Quick Invoice
                </button>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Client Name</th>
                      <th>Garment Details</th>
                      <th>Stitching Charges</th>
                      <th>Fabric Charges</th>
                      <th>Total Due</th>
                      <th>Paid So Far</th>
                      <th>Balance Pending</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(ord => {
                      const finalTotal = ord.stitchingCost + ord.fabricCost;
                      const bal = finalTotal - ord.advancePaid;
                      return (
                        <tr key={ord.id}>
                          <td style={{ fontWeight: 'bold' }}>{ord.id}</td>
                          <td style={{ fontWeight: '600' }}>{ord.customerName}</td>
                          <td>{ord.garmentType}</td>
                          <td>₹{ord.stitchingCost}</td>
                          <td>₹{ord.fabricCost}</td>
                          <td style={{ color: 'var(--gold)', fontWeight: 'bold' }}>₹{finalTotal}</td>
                          <td style={{ color: 'var(--success)' }}>₹{ord.advancePaid}</td>
                          <td style={{ color: bal > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold' }}>
                            ₹{bal}
                          </td>
                          <td>
                            <button 
                              className="btn btn-secondary btn-xs"
                              onClick={() => {
                                setPrintInvoiceData({
                                  invoiceId: `INV-${ord.id.split('-')[1]}-${Date.now().toString().slice(-3)}`,
                                  orderId: ord.id,
                                  customerName: ord.customerName,
                                  garmentType: ord.garmentType,
                                  stitchingCost: ord.stitchingCost,
                                  fabricCost: ord.fabricCost,
                                  total: finalTotal,
                                  advancePaid: ord.advancePaid,
                                  balance: bal,
                                  method: ord.paymentMethod,
                                  date: new Date().toLocaleDateString()
                                });
                                setShowInvoicePrint(true);
                              }}
                            >
                              Print Bill
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== MODULE 12: INVENTORY MANAGEMENT TAB ==================== */}
          {currentTab === 'inventory' && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><Layers /> Fabric Raw Material & Accessories Stock</h3>
                <button className="btn btn-primary btn-xs" onClick={() => setShowInventoryModal(true)}>
                  <Plus size={14} /> Add Stock Entry
                </button>
              </div>

              {/* Fabrics Table */}
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Stitching Fabrics Logs</h4>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Material ID</th>
                        <th>Name</th>
                        <th>Color Tone</th>
                        <th>Supplier Shop</th>
                        <th>Available Stock</th>
                        <th>Status Alert</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.fabrics.map(f => (
                        <tr key={f.id}>
                          <td>{f.id}</td>
                          <td style={{ fontWeight: '600' }}>{f.name}</td>
                          <td>{f.color}</td>
                          <td>{f.supplier}</td>
                          <td style={{ fontWeight: 'bold' }}>{f.quantity} meters</td>
                          <td>
                            {f.quantity <= f.minStock ? (
                              <span style={{ color: 'var(--danger)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={12} /> Low Stock Alert
                              </span>
                            ) : (
                              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Check size={12} /> Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Accessories Table */}
              <div>
                <h4 style={{ color: 'var(--gold)', marginBottom: '12px' }}>Tailoring Trim & Accessories</h4>
                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Accessory ID</th>
                        <th>Item Description</th>
                        <th>Category Type</th>
                        <th>Available Stock</th>
                        <th>Status Alert</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventory.accessories.map(a => (
                        <tr key={a.id}>
                          <td>{a.id}</td>
                          <td style={{ fontWeight: '600' }}>{a.name}</td>
                          <td>{a.type}</td>
                          <td style={{ fontWeight: 'bold' }}>{a.quantity} units</td>
                          <td>
                            {a.quantity <= a.minStock ? (
                              <span style={{ color: 'var(--danger)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={12} /> Low Stock Alert
                              </span>
                            ) : (
                              <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Check size={12} /> Normal
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== MODULE 11: EMPLOYEE MANAGEMENT TAB ==================== */}
          {currentTab === 'employees' && (
            <div className="glass-card">
              <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="card-title"><Users /> Studio Employees & Performance Scorecard</h3>
                {currentRole === 'Boutique Owner' && (
                  <button className="btn btn-primary btn-xs" onClick={() => setShowAddEmpModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={14} /> Add Studio Employee
                  </button>
                )}
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Contact details</th>
                      <th>Workload (Active)</th>
                      <th>Tasks Completed</th>
                      <th>Stitching Delay Rate</th>
                      <th>Alteration rate</th>
                      <th>Status</th>
                      {currentRole === 'Boutique Owner' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(emp => (
                      <tr key={emp.id} style={{ opacity: emp.active === false ? 0.6 : 1 }}>
                        <td>{emp.id}</td>
                        <td style={{ fontWeight: '600' }}>{emp.name}</td>
                        <td>
                          <span className="status-badge" style={{ backgroundColor: 'var(--gold-bg)', color: 'var(--gold)' }}>
                            {emp.role}
                          </span>
                        </td>
                        <td>{emp.contact}</td>
                        <td>
                          {emp.role === 'Tailor' || emp.role === 'Designer' ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${(emp.assigned || 0) * 20}%`, height: '100%', backgroundColor: 'var(--primary)' }}></div>
                              </div>
                              <span style={{ fontSize: '11px' }}>{emp.assigned || 0} active</span>
                            </div>
                          ) : 'N/A'}
                        </td>
                        <td>{emp.completed || 0} items</td>
                        <td>
                          {emp.delayPercentage !== undefined ? (
                            <span style={{ color: emp.delayPercentage > 5 ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold' }}>
                              {emp.delayPercentage}%
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td>
                          {emp.alterationPercentage !== undefined ? (
                            <span style={{ color: emp.alterationPercentage > 8 ? 'var(--danger)' : 'var(--success)', fontWeight: 'bold' }}>
                              {emp.alterationPercentage}%
                            </span>
                          ) : 'N/A'}
                        </td>
                        <td>
                          {emp.active !== false ? (
                            <span className="status-badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>Active</span>
                          ) : (
                            <span className="status-badge" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>Inactive</span>
                          )}
                        </td>
                        {currentRole === 'Boutique Owner' && (
                          <td>
                            {emp.id !== 'EMP-001' ? (
                              <button 
                                className={`btn ${emp.active !== false ? 'btn-danger' : 'btn-success'} btn-xs`}
                                onClick={() => handleToggleEmployeeActive(emp.id)}
                              >
                                {emp.active !== false ? 'Deactivate' : 'Activate'}
                              </button>
                            ) : (
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Admin Account</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== MODULE 8: WHATSAPP AUTOMATION LOGS & CRM ==================== */}
          {currentTab === 'whatsapp' && (
            <>
              {/* WhatsApp notification logs */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title"><MessageSquare color="var(--success)" /> Live WhatsApp / SMS Trigger Notification Logs</h3>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Log ID</th>
                        <th>Timestamp</th>
                        <th>Recipient</th>
                        <th>Trigger Event</th>
                        <th>Message Template Content</th>
                        <th>Gateway Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {whatsappLogs.length > 0 ? (
                        whatsappLogs.map(log => (
                          <tr key={log.id}>
                            <td style={{ fontWeight: 'bold' }}>{log.id}</td>
                            <td>{log.timestamp}</td>
                            <td>
                              <div><strong>{log.customerName}</strong></div>
                              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{log.mobile}</div>
                            </td>
                            <td style={{ color: 'var(--gold)', fontWeight: 'bold' }}>{log.type}</td>
                            <td style={{ maxWidth: '300px', fontSize: '11px', whiteSpace: 'pre-line' }}>
                              {log.message}
                            </td>
                            <td>
                              <span className="status-badge" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                            No WhatsApp templates triggered in this session yet. Perform actions like creating an order, updating order status, or recording payments to trigger SMS/WhatsApp automations!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Module 13 - CRM Campaigns segment */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title"><MessageSquare color="var(--primary)" /> CRM Broadcast & Segment Promotions</h3>
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Select Target Client Segment</label>
                    <select 
                      className="select-filter" 
                      value={crmSegment} 
                      onChange={(e) => setCrmSegment(e.target.value)}
                    >
                      <option value="VIP">VIP Customers</option>
                      <option value="Bridal">Bridal Customers</option>
                      <option value="Regular">Regular Customers</option>
                      <option value="All">All Registered Customers</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Broadcast Channel</label>
                    <select 
                      className="select-filter" 
                      value={crmChannel} 
                      onChange={(e) => setCrmChannel(e.target.value)}
                    >
                      <option value="WhatsApp">WhatsApp Business API</option>
                      <option value="SMS">SMS Gateway</option>
                      <option value="Email">Email Service</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Marketing Content / Campaign Text</label>
                    <textarea 
                      className="form-input" 
                      style={{ height: '80px', fontFamily: 'inherit', resize: 'none' }}
                      value={crmMessage}
                      onChange={(e) => setCrmMessage(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <button className="btn btn-primary" style={{ width: 'fit-content' }} onClick={handleCrmBroadcast}>
                      Dispatch Campaign Broadcast
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ==================== MODULE 10: CUSTOMER PORTAL TAB ==================== */}
          {currentTab === 'portal-home' && (
            <>
              {/* Welcome client card */}
              <div className="portal-hero">
                <div className="portal-hero-text">
                  <h2 className="portal-welcome">Welcome back, {portalCustObj?.name}!</h2>
                  <p className="portal-subtitle">Track your designer fittings, view your measurements history, and reorder from your digital wardrobe.</p>
                </div>
                <div style={{ color: 'var(--gold)' }}>
                  <Sparkles size={48} />
                </div>
              </div>

              {/* Active fitting/order timeline tracker */}
              <div className="glass-card">
                <div className="card-header">
                  <h3 className="card-title"><Clock /> Active Custom Order Tracker</h3>
                </div>

                {activePortalOrder ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px' }}>
                      <span>Order Ref: <strong>{activePortalOrder.id}</strong> ({activePortalOrder.garmentType})</span>
                      <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>Promise Delivery: {activePortalOrder.deliveryDate}</span>
                    </div>

                    {/* Horizontal progress steps tracker */}
                    <div className="timeline-stepper">
                      <div className="timeline-step completed">
                        <div className="timeline-dot">1</div>
                        <span className="timeline-label">Order Created</span>
                      </div>
                      <div className={`timeline-step ${
                        ['Measurement Taken', 'Design Approved', 'Cutting', 'Stitching', 'Trial Scheduled', 'Alteration', 'Ready for Delivery', 'Delivered'].includes(activePortalOrder.status) ? 'completed' : 
                        activePortalOrder.status === 'Order Created' ? 'active' : ''
                      }`}>
                        <div className="timeline-dot">2</div>
                        <span className="timeline-label">Measure taken</span>
                      </div>
                      <div className={`timeline-step ${
                        ['Design Approved', 'Cutting', 'Stitching', 'Trial Scheduled', 'Alteration', 'Ready for Delivery', 'Delivered'].includes(activePortalOrder.status) ? 'completed' : 
                        activePortalOrder.status === 'Measurement Taken' ? 'active' : ''
                      }`}>
                        <div className="timeline-dot">3</div>
                        <span className="timeline-label">Design Approved</span>
                      </div>
                      <div className={`timeline-step ${
                        ['Stitching', 'Trial Scheduled', 'Alteration', 'Ready for Delivery', 'Delivered'].includes(activePortalOrder.status) ? 'completed' : 
                        ['Cutting'].includes(activePortalOrder.status) ? 'active' : ''
                      }`}>
                        <div className="timeline-dot">4</div>
                        <span className="timeline-label">Stitching</span>
                      </div>
                      <div className={`timeline-step ${
                        ['Trial Scheduled', 'Alteration', 'Ready for Delivery', 'Delivered'].includes(activePortalOrder.status) ? 'completed' : 
                        activePortalOrder.status === 'Stitching' ? 'active' : ''
                      }`}>
                        <div className="timeline-dot">5</div>
                        <span className="timeline-label">Ready for Trial</span>
                      </div>
                      <div className={`timeline-step ${
                        ['Delivered'].includes(activePortalOrder.status) ? 'completed' : 
                        ['Ready for Delivery'].includes(activePortalOrder.status) ? 'active' : ''
                      }`}>
                        <div className="timeline-dot">6</div>
                        <span className="timeline-label">Ready for Delivery</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-input)', padding: '14px', borderRadius: '8px', borderLeft: '3px solid var(--primary)', fontSize: '12px' }}>
                      <strong>Latest Status details:</strong> {activePortalOrder.notes}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                    No pending custom orders. Book a consultation below to get started!
                  </div>
                )}
              </div>

              {/* Quick portal navigation cards */}
              <div className="portal-grid-3x1">
                <div 
                  className="glass-card" 
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => setCurrentTab('portal-passport')}
                >
                  <FileText size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Digital Passport</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>View recorded chest, sleeve, neck dimensions for blouses and lehengas.</p>
                </div>
                <div 
                  className="glass-card" 
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => setCurrentTab('portal-wardrobe')}
                >
                  <Tag size={32} color="var(--gold)" style={{ marginBottom: '12px' }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '6px' }}>My Stitched Wardrobe</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Re-order any previously designed garments with single click sizing.</p>
                </div>
                <div 
                  className="glass-card" 
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                  onClick={() => setCurrentTab('portal-appointments')}
                >
                  <Calendar size={32} color="var(--success)" style={{ marginBottom: '12px' }} />
                  <h4 style={{ fontFamily: 'var(--font-display)', marginBottom: '6px' }}>Book Fitting trial</h4>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Schedule a designer consultation, measurement, or trial slots.</p>
                </div>
              </div>
            </>
          )}

          {/* CUSTOMER PORTAL DIGITAL PASSPORT SPEC VIEW */}
          {currentTab === 'portal-passport' && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><FileText /> Digital Measurement Passport</h3>
              </div>

              <div className="tab-nav">
                <span 
                  className={`tab-nav-item ${activeGarmentTab === 'blouse' ? 'active' : ''}`}
                  onClick={() => { setActiveGarmentTab('blouse'); }}
                >
                  Blouse Size
                </span>
                <span 
                  className={`tab-nav-item ${activeGarmentTab === 'chudidar' ? 'active' : ''}`}
                  onClick={() => { setActiveGarmentTab('chudidar'); }}
                >
                  Chudidar Size
                </span>
                <span 
                  className={`tab-nav-item ${activeGarmentTab === 'lehenga' ? 'active' : ''}`}
                  onClick={() => { setActiveGarmentTab('lehenga'); }}
                >
                  Lehenga Size
                </span>
                <span 
                  className={`tab-nav-item ${activeGarmentTab === 'gown' ? 'active' : ''}`}
                  onClick={() => { setActiveGarmentTab('gown'); }}
                >
                  Gown Size
                </span>
              </div>

              {portalCustObj && portalCustObj.measurements && portalCustObj.measurements[activeGarmentTab]?.length > 0 ? (
                (() => {
                  const latest = portalCustObj.measurements[activeGarmentTab][0];
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>Passport V{latest.version} (Active Specification)</span>
                        <span>Logged date: {latest.date}</span>
                      </div>

                      {activeGarmentTab === 'gown' ? (
                        <div style={{ backgroundColor: 'var(--bg-input)', padding: '16px', borderRadius: '8px' }}>
                          <p style={{ fontSize: '13px' }}>{latest.fullMeasurements}</p>
                        </div>
                      ) : (
                        <div className="measurement-grid">
                          {Object.keys(latest)
                            .filter(k => k !== 'version' && k !== 'date' && k !== 'notes')
                            .map(key => (
                              <div className="measurement-box" key={key}>
                                <span className="measurement-val">{latest[key]}"</span>
                                <span className="measurement-label" style={{ textTransform: 'capitalize' }}>
                                  {key.replace(/([A-Z])/g, ' $1')}
                                </span>
                              </div>
                            ))
                          }
                        </div>
                      )}

                      <div style={{ fontSize: '12px', borderLeft: '3px solid var(--gold)', paddingLeft: '12px', color: 'var(--text-muted)' }}>
                        <strong>Stitcher Notes:</strong> {latest.notes}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No specifications registered for {activeGarmentTab.toUpperCase()} under your passport.
                </div>
              )}
            </div>
          )}

          {/* CUSTOMER PORTAL DIGITAL WARDROBE TAB */}
          {currentTab === 'portal-wardrobe' && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><Tag /> My Personal Fashion Wardrobe</h3>
              </div>

              <div className="wardrobe-grid">
                {portalCustOrders.map(ord => (
                  <div className="wardrobe-card" key={ord.id}>
                    <div className="wardrobe-image-wrapper">
                      {ord.referenceImage ? (
                        <img src={ord.referenceImage} className="wardrobe-image" alt="Stitched design" />
                      ) : (
                        <Scissors size={40} color="var(--border-color)" />
                      )}
                    </div>
                    <div className="wardrobe-info">
                      <div className="wardrobe-title">{ord.garmentType}</div>
                      <div className="wardrobe-meta-row">
                        <span>Paid amount: <strong style={{ color: 'var(--gold)' }}>₹{ord.stitchingCost}</strong></span>
                      </div>
                      <div className="wardrobe-meta-row" style={{ marginTop: '4px' }}>
                        <span>Stitched in: {ord.deliveryDate}</span>
                      </div>

                      {/* One click Reorder action in portal */}
                      <button 
                        className="btn btn-primary btn-xs"
                        style={{ marginTop: '12px', width: '100%' }}
                        onClick={() => {
                          const today = new Date();
                          const trial = new Date();
                          trial.setDate(today.getDate() + 10);
                          const del = new Date();
                          del.setDate(today.getDate() + 14);

                          const newReorder = {
                            id: `ORD-${100 + orders.length + 1}`,
                            customerId: portalCustObj.id,
                            customerName: portalCustObj.name,
                            garmentType: ord.garmentType,
                            quantity: 1,
                            deliveryDate: del.toISOString().split('T')[0],
                            trialDate: trial.toISOString().split('T')[0],
                            assignedTailor: ord.assignedTailor,
                            assignedDesigner: ord.assignedDesigner,
                            priority: 'Medium',
                            status: 'Order Created',
                            notes: `One-Click Reorder requested from Customer Portal Wardrobe.`,
                            referenceImage: ord.referenceImage,
                            fabricUsed: 'Selected from studio fabric stock',
                            fabricQuantity: 'Standard',
                            stitchingCost: ord.stitchingCost,
                            fabricCost: 0,
                            advancePaid: 0,
                            paymentMethod: 'UPI'
                          };

                          setOrders([newReorder, ...orders]);
                          triggerWhatsApp(
                            portalCustObj.name,
                            portalCustObj.whatsapp,
                            "Reorder Requested",
                            `Hello ${portalCustObj.name}, we have received your one-click wardrobe reorder request for ${ord.garmentType}. Your new order is ${newReorder.id}. Our designer will contact you for details shortly.`,
                            portalCustObj.email
                          );
                          alert(`Success! Reorder created. Order ID: ${newReorder.id}`);
                        }}
                      >
                        Request One-Click Reorder
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOMER PORTAL APPOINTMENT BOOKING TAB */}
          {currentTab === 'portal-appointments' && (
            <div className="glass-card">
              <div className="card-header">
                <h3 className="card-title"><Calendar /> Schedule a Fit trial / Consultation</h3>
              </div>

              <form className="form-grid" onSubmit={handleAddAppointment}>
                <div className="form-group">
                  <label className="form-label">Booking Action Type</label>
                  <select 
                    className="select-filter"
                    value={newAptType}
                    onChange={(e) => setNewAptType(e.target.value)}
                  >
                    <option value="Consultation">Design Consultation</option>
                    <option value="Measurement">Take New Measurements</option>
                    <option value="Trial">Garment Trial / Fitting</option>
                    <option value="Pickup">Stitched Outfit Pickup</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={newAptDate}
                    onChange={(e) => setNewAptDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Time Slot</label>
                  <select 
                    className="select-filter"
                    value={newAptTime}
                    onChange={(e) => setNewAptTime(e.target.value)}
                  >
                    <option value="10:30 AM">10:30 AM - 11:30 AM</option>
                    <option value="11:30 AM">11:30 AM - 12:30 PM</option>
                    <option value="02:30 PM">02:30 PM - 03:30 PM</option>
                    <option value="04:30 PM">04:30 PM - 05:30 PM</option>
                    <option value="06:00 PM">06:00 PM - 07:00 PM</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Designer</label>
                  <select 
                    className="select-filter"
                    value={newAptDesigner}
                    onChange={(e) => setNewAptDesigner(e.target.value)}
                  >
                    <option value="Anjali Malhotra">Anjali Malhotra (Senior designer)</option>
                    <option value="Vikram Rathore">Vikram Rathore (Couturier)</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Special instructions / Outfit details</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="E.g., Fitting trial for ORD-101 lehenga, or discuss bridal neck shapes"
                    value={newAptNotes}
                    onChange={(e) => setNewAptNotes(e.target.value)}
                  />
                </div>

                <div className="form-group full-width" style={{ display: 'none' }}>
                  <input type="hidden" value={newAptCust} />
                </div>

                <div className="form-group full-width" style={{ marginTop: '8px' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{ width: 'fit-content' }}
                    onClick={() => setNewAptCust(portalCustObj?.id || '')}
                  >
                    Schedule Booking Slot
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* ==================== GLOBAL APP MODALS SECTION ==================== */}
      
      {/* 1. ADD NEW CUSTOMER MODAL */}
      {showAddCustModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Register New Customer</span>
              <button className="modal-close-btn" onClick={() => setShowAddCustModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddCustomer}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" className="form-input" placeholder="Client name" value={newCustName} onChange={(e) => setNewCustName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number *</label>
                    <input type="text" className="form-input" placeholder="+91 xxxxx xxxxx" value={newCustMobile} onChange={(e) => setNewCustMobile(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email ID</label>
                    <input type="email" className="form-input" placeholder="mail@example.com" value={newCustEmail} onChange={(e) => setNewCustEmail(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Client Group Segment</label>
                    <select className="select-filter" value={newCustTags} onChange={(e) => setNewCustTags(e.target.value)}>
                      <option value="Regular">Regular Customer</option>
                      <option value="VIP">VIP Customer</option>
                      <option value="Bridal">Bridal client</option>
                      <option value="New Customer">New Customer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Birth Date</label>
                    <input type="date" className="form-input" value={newCustDob} onChange={(e) => setNewCustDob(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Anniversary Date</label>
                    <input type="date" className="form-input" value={newCustAnniversary} onChange={(e) => setNewCustAnniversary(e.target.value)} />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Billing/Delivery Address</label>
                    <input type="text" className="form-input" placeholder="Full residential location" value={newCustAddress} onChange={(e) => setNewCustAddress(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddCustModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. CREATE NEW ORDER & KOT MODAL */}
      {showAddOrderModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Create Tailor Order & KOT Sheet</span>
              <button className="modal-close-btn" onClick={() => setShowAddOrderModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddOrder}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Select Client *</label>
                    <select className="select-filter" value={newOrdCust} onChange={(e) => setNewOrdCust(e.target.value)} required>
                      <option value="">Choose Client Profile</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Garment Category *</label>
                    <select className="select-filter" value={newOrdGarment} onChange={(e) => setNewOrdGarment(e.target.value)}>
                      <option value="Blouse">Blouse</option>
                      <option value="Chudidar">Chudidar Set</option>
                      <option value="Lehenga">Lehenga Choli</option>
                      <option value="Gown">Evening Gown</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Order Quantity</label>
                    <input type="number" min="1" className="form-input" value={newOrdQty} onChange={(e) => setNewOrdQty(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority fitting status</label>
                    <select className="select-filter" value={newOrdPriority} onChange={(e) => setNewOrdPriority(e.target.value)}>
                      <option value="Low">Low Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="High">High Priority (Bridal/Express)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Trial Schedule Date *</label>
                    <input type="date" className="form-input" value={newOrdTrialDate} onChange={(e) => setNewOrdTrialDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Delivery Date Promise *</label>
                    <input type="date" className="form-input" value={newOrdDelDate} onChange={(e) => setNewOrdDelDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign Tailor (Master Cutter)</label>
                    <select className="select-filter" value={newOrdTailor} onChange={(e) => setNewOrdTailor(e.target.value)}>
                      <option value="">Select Tailor</option>
                      {employees.filter(e => e.role === 'Tailor').map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign Fashion Designer</label>
                    <select className="select-filter" value={newOrdDesigner} onChange={(e) => setNewOrdDesigner(e.target.value)}>
                      <option value="">Select Designer</option>
                      {employees.filter(e => e.role === 'Designer').map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tailoring Fee (₹) *</label>
                    <input type="number" className="form-input" value={newOrdStitchCost} onChange={(e) => setNewOrdStitchCost(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Boutique Fabric Cost (₹)</label>
                    <input type="number" className="form-input" value={newOrdFabricCost} onChange={(e) => setNewOrdFabricCost(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Advance Deposited Amount (₹)</label>
                    <input type="number" className="form-input" value={newOrdAdvance} onChange={(e) => setNewOrdAdvance(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Channel</label>
                    <select className="select-filter" value={newOrdPayMethod} onChange={(e) => setNewOrdPayMethod(e.target.value)}>
                      <option value="UPI">UPI Transfer</option>
                      <option value="Cash">Cash payment</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Bank Transfer">NEFT Bank Transfer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Sample Reference Look</label>
                    <select className="select-filter" value={newOrdImage} onChange={(e) => setNewOrdImage(e.target.value)}>
                      <option value="/design_bridal_lehenga.png">Royal Bridal Lehenga</option>
                      <option value="/design_designer_blouse.png">Navy Cutwork Blouse</option>
                      <option value="/design_party_gown.png">Satin Emerald Gown</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Tailoring Notes & Material Cut Specs</label>
                    <textarea className="form-input" style={{ height: '60px', resize: 'none' }} placeholder="Specify custom linings, borders, neck cuts or design elements." value={newOrdNotes} onChange={(e) => setNewOrdNotes(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddOrderModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order Job</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. ADD APPOINTMENT MODAL */}
      {showAddAptModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Book Appointments Slot</span>
              <button className="modal-close-btn" onClick={() => setShowAddAptModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddAppointment}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Choose Client *</label>
                    <select className="select-filter" value={newAptCust} onChange={(e) => setNewAptCust(e.target.value)} required>
                      <option value="">Select Customer</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Consultation Reason</label>
                    <select className="select-filter" value={newAptType} onChange={(e) => setNewAptType(e.target.value)}>
                      <option value="Trial">Fitting Trial</option>
                      <option value="Consultation">Design Consultation</option>
                      <option value="Measurement">Take New Measurements</option>
                      <option value="Pickup">Outfit Delivery Pickup</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Booking Date *</label>
                    <input type="date" className="form-input" value={newAptDate} onChange={(e) => setNewAptDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time Block Slot</label>
                    <select className="select-filter" value={newAptTime} onChange={(e) => setNewAptTime(e.target.value)}>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="01:30 PM">01:30 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:30 PM">05:30 PM</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Assign Consultant designer</label>
                    <select className="select-filter" value={newAptDesigner} onChange={(e) => setNewAptDesigner(e.target.value)}>
                      {employees.filter(e => e.role === 'Designer').map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">Client Request Notes</label>
                    <input type="text" className="form-input" placeholder="Discuss sleeve trims or check neck borders" value={newAptNotes} onChange={(e) => setNewAptNotes(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddAptModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Lock Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. INVENTORY STOCK ENTRY MODAL */}
      {showInventoryModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Inventory Purchase Log Entry</span>
              <button className="modal-close-btn" onClick={() => setShowInventoryModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddInventoryStock}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Item Material Class</label>
                    <select className="select-filter" value={invType} onChange={(e) => setInvType(e.target.value)}>
                      <option value="fabric">Boutique Fabric (Silk, Satin, etc.)</option>
                      <option value="accessory">Trims & Accessories (Zipper, Lace, etc.)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Item/Material Name *</label>
                    <input type="text" className="form-input" placeholder="E.g. Pure Georgette red" value={invItemName} onChange={(e) => setInvItemName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{invType === 'fabric' ? 'Color tone' : 'Accessory Type'}</label>
                    <input type="text" className="form-input" placeholder="Crimson red, hooks, zari border" value={invColorType} onChange={(e) => setInvColorType(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock quantity to Add</label>
                    <input type="number" className="form-input" value={invQty} onChange={(e) => setInvQty(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier / Wholesale Shop</label>
                    <input type="text" className="form-input" value={invSupplier} onChange={(e) => setInvSupplier(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min Stock Threshold (Alert level)</label>
                    <input type="number" className="form-input" value={invMinStock} onChange={(e) => setInvMinStock(e.target.value)} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowInventoryModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save stock entry</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. RECORD PAYMENT MODAL */}
      {showPaymentModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Record Bill Payment: {selectedOrder.id}</span>
              <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            <form onSubmit={handleRecordPayment}>
              <div className="modal-body">
                <div style={{ marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '8px', fontSize: '13px' }}>
                  Total Invoiced: <strong>₹{selectedOrder.stitchingCost + selectedOrder.fabricCost}</strong><br/>
                  Total Paid: <strong>₹{selectedOrder.advancePaid}</strong><br/>
                  Balance Due: <strong style={{ color: 'var(--danger)' }}>₹{selectedOrder.stitchingCost + selectedOrder.fabricCost - selectedOrder.advancePaid}</strong>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount Collected (₹) *</label>
                  <input 
                    type="number" 
                    max={selectedOrder.stitchingCost + selectedOrder.fabricCost - selectedOrder.advancePaid}
                    className="form-input" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)} 
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Channel</label>
                  <select 
                    className="select-filter" 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="UPI">UPI App (GPay/PhonePe)</option>
                    <option value="Cash">Cash cash drawer</option>
                    <option value="Credit Card">Credit Card Terminal</option>
                    <option value="Bank Transfer">Direct Bank NEFT</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save payment receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. CREATE BILLING QUICK INVOICE FORM */}
      {showAddInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Create Quick Invoice</span>
              <button className="modal-close-btn" onClick={() => setShowAddInvoiceModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Select an active client order below to automatically configure invoice details.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map(o => (
                  <div 
                    key={o.id}
                    style={{ 
                      padding: '14px', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color)', 
                      backgroundColor: 'var(--bg-input)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onClick={() => {
                      const total = o.stitchingCost + o.fabricCost;
                      setPrintInvoiceData({
                        invoiceId: `INV-${o.id.split('-')[1]}-${Date.now().toString().slice(-3)}`,
                        orderId: o.id,
                        customerName: o.customerName,
                        garmentType: o.garmentType,
                        stitchingCost: o.stitchingCost,
                        fabricCost: o.fabricCost,
                        total: total,
                        advancePaid: o.advancePaid,
                        balance: total - o.advancePaid,
                        method: o.paymentMethod,
                        date: new Date().toLocaleDateString()
                      });
                      setShowAddInvoiceModal(false);
                      setShowInvoicePrint(true);
                    }}
                  >
                    <div>
                      <strong>{o.id} - {o.customerName}</strong><br/>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Garment: {o.garmentType} | Total Charges: ₹{o.stitchingCost + o.fabricCost}</span>
                    </div>
                    <ChevronRight size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. KOT PRINT PREVIEW MODAL */}
      {showKOTPrint && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <span className="modal-title">Karigar KOT Job Print preview</span>
              <button className="modal-close-btn" onClick={() => setShowKOTPrint(false)}>×</button>
            </div>
            <div className="modal-body" style={{ backgroundColor: '#f3f4f6' }}>
              <div className="kot-sheet">
                <div className="kot-header">
                  <div className="kot-shop-name">BOUTIQUEOS ATELIER</div>
                  <div style={{ fontSize: '10px', marginTop: '4px' }}>Stitching & Fitting Job Slip</div>
                </div>

                <div className="kot-meta-row">
                  <span><strong>Slip ID:</strong> KOT-{selectedOrder.id}</span>
                  <span><strong>Date:</strong> {selectedOrder.trialDate}</span>
                </div>
                <div className="kot-meta-row">
                  <span><strong>Client:</strong> {selectedOrder.customerName}</span>
                  <span><strong>Style:</strong> {selectedOrder.garmentType}</span>
                </div>

                <div className="kot-divider"></div>

                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>MEASUREMENT MATRIX</div>
                {(() => {
                  const cust = customers.find(c => c.id === selectedOrder.customerId);
                  const latestMeas = cust?.measurements[selectedOrder.garmentType.toLowerCase()]?.[0] || cust?.measurements['blouse']?.[0];
                  
                  if (!latestMeas) return <div>No registered passport specs.</div>;

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
                      {Object.keys(latestMeas)
                        .filter(k => k !== 'version' && k !== 'date' && k !== 'notes')
                        .map(key => (
                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6' }}>
                            <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <strong>{latestMeas[key]}"</strong>
                          </div>
                        ))}
                    </div>
                  );
                })()}

                <div className="kot-divider"></div>

                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>STITCHING FIT NOTES</div>
                <div className="kot-notes">
                  {selectedOrder.notes || 'Handle with care. Satin lining.'}
                </div>

                <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '16px', color: '#6b7280' }}>
                  Assigned Tailor Master: {employees.find(e => e.id === selectedOrder.assignedTailor)?.name || 'N/A'}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowKOTPrint(false)}>Close</button>
              <button className="btn btn-primary" onClick={() => alert('Sending to local label printer spooler... (Simulated)')}>Print Ticket</button>
            </div>
          </div>
        </div>
      )}

      {/* 8. INVOICE PRINT PREVIEW MODAL */}
      {showInvoicePrint && printInvoiceData && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <div className="modal-header">
              <span className="modal-title">Invoice Bill Slip</span>
              <button className="modal-close-btn" onClick={() => { setShowInvoicePrint(false); setPrintInvoiceData(null); }}>×</button>
            </div>
            <div className="modal-body" style={{ backgroundColor: '#f3f4f6' }}>
              
              {/* Receipt Body */}
              <div style={{ backgroundColor: '#ffffff', color: '#111827', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-md)', fontFamily: 'serif' }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '1px', fontFamily: 'var(--font-serif)' }}>BOUTIQUEOS HAUTE COUTURE</h2>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', fontFamily: 'var(--font-sans)' }}>
                    GSTIN: 27AAAAA1111A1Z1 | Bandra West, Mumbai<br/>
                    Email: billing@boutiqueos.com | Contact: +91 99009 90099
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'var(--font-sans)', color: '#4b5563', marginBottom: '20px' }}>
                  <div>
                    <strong>INVOICE TO:</strong><br/>
                    {printInvoiceData.customerName}<br/>
                    GST Custom Order Ref: {printInvoiceData.orderId}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong>INVOICE DETAIL:</strong><br/>
                    Inv Num: {printInvoiceData.invoiceId}<br/>
                    Date: {printInvoiceData.date}
                  </div>
                </div>

                {/* Table for Invoice Details */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', fontFamily: 'var(--font-sans)', marginBottom: '20px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #111827', color: '#111827', fontWeight: 'bold' }}>
                      <th style={{ textAlign: 'left', padding: '8px 0' }}>Garment & Service Description</th>
                      <th style={{ textAlign: 'right', padding: '8px 0' }}>Fee (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 0' }}>
                        Custom Styling & Tailoring ({printInvoiceData.garmentType})<br/>
                        <span style={{ fontSize: '10px', color: '#6b7280' }}>Digital Passport specifications sizing</span>
                      </td>
                      <td style={{ textAlign: 'right', padding: '10px 0', fontWeight: 'bold' }}>₹{printInvoiceData.stitchingCost}</td>
                    </tr>
                    {printInvoiceData.fabricCost > 0 && (
                      <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '10px 0' }}>Boutique Supplied Fabric Materials</td>
                        <td style={{ textAlign: 'right', padding: '10px 0', fontWeight: 'bold' }}>₹{printInvoiceData.fabricCost}</td>
                      </tr>
                    )}
                    {/* GST Calc */}
                    <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '10px 0' }}>SGST (2.5%) & CGST (2.5%) Service Tax</td>
                      <td style={{ textAlign: 'right', padding: '10px 0', fontWeight: 'bold' }}>
                        ₹{Math.floor(printInvoiceData.stitchingCost * 0.05)}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Financial Summary */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', fontFamily: 'var(--font-sans)' }}>
                  <div style={{ width: '220px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                      <span>Gross Total:</span>
                      <strong>₹{printInvoiceData.total + Math.floor(printInvoiceData.stitchingCost * 0.05)}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', color: '#059669' }}>
                      <span>Amount Received ({printInvoiceData.method}):</span>
                      <strong>- ₹{printInvoiceData.advancePaid}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '2px solid #111827', fontSize: '14px', fontWeight: 'bold' }}>
                      <span>Balance Outstanding:</span>
                      <span style={{ color: printInvoiceData.balance > 0 ? '#dc2626' : '#059669' }}>
                        ₹{printInvoiceData.balance > 0 ? printInvoiceData.balance + Math.floor(printInvoiceData.stitchingCost * 0.05) : 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '30px', fontSize: '10px', textAlign: 'center', color: '#6b7280', borderTop: '1px dashed #e5e7eb', paddingTop: '16px', fontFamily: 'var(--font-sans)' }}>
                  Thank you for shopping with BoutiqueOS Haute Couture.<br/>
                  * Standard alteration claims must be requested within 7 days of garment delivery *
                </div>
              </div>

            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setShowInvoicePrint(false); setPrintInvoiceData(null); }}>Close</button>
              <button className="btn btn-primary" onClick={() => alert('Downloading Invoice PDF... (Simulated)')}>
                <Download size={14} /> Download Receipt PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. ADD NEW EMPLOYEE MODAL */}
      {showAddEmpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <span className="modal-title">Register New Studio Employee</span>
              <button className="modal-close-btn" onClick={() => setShowAddEmpModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddEmployee}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Employee ID (e.g. EMP-002) *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. EMP-002" 
                      value={newEmpId} 
                      onChange={(e) => setNewEmpId(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Ramesh Kumar" 
                      value={newEmpName} 
                      onChange={(e) => setNewEmpName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role *</label>
                    <select 
                      className="select-filter" 
                      value={newEmpRole} 
                      onChange={(e) => setNewEmpRole(e.target.value)}
                    >
                      <option value="Tailor">Tailor</option>
                      <option value="Designer">Designer</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="Boutique Owner">Boutique Owner</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Details *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="+91 xxxxx xxxxx" 
                      value={newEmpContact} 
                      onChange={(e) => setNewEmpContact(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="form-group full-width">
                    <label className="form-label">PIN / Access Password *</label>
                    <input 
                      type="password" 
                      className="form-input" 
                      placeholder="Enter security access password" 
                      value={newEmpPassword} 
                      onChange={(e) => setNewEmpPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddEmpModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Employee Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. SIMULATED WHATSAPP SLIDE-IN POPUP */}
      {activeNotification && (
        <div className="whatsapp-popup">
          <div className="whatsapp-popup-header">
            <span>WhatsApp Business API Simulator</span>
            <X size={14} style={{ cursor: 'pointer' }} onClick={() => setActiveNotification(null)} />
          </div>
          <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', color: '#a7f3d0' }}>
            <span>To: {activeNotification.customerName}</span>
            <span>Trigger: {activeNotification.type}</span>
          </div>
          <div className="whatsapp-popup-body">
            {activeNotification.message}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
