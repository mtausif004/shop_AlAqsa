import { Product, Order, Courier, Review, AdminSession, AuditLog, SecurityEvent, Combo, Category, Banner } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_COURIERS, INITIAL_COMBOS, INITIAL_COUPONS } from '../data/initialData';

// Public Apps Script API URL from environment or Admin Configuration
const STORAGE_API_KEY = 'alaqsa_custom_api_url';
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_API_KEY);
    if (saved && saved.trim()) return saved.trim();
  }
  return (import.meta.env.VITE_APPS_SCRIPT_URL as string) || '';
}

export function setApiBaseUrl(url: string) {
  if (typeof window !== 'undefined') {
    if (!url) localStorage.removeItem(STORAGE_API_KEY);
    else localStorage.setItem(STORAGE_API_KEY, url.trim());
  }
}

// -------------------------------------------------------------
// LOCAL ZERO-TRUST SIMULATION DATABASE (Fallback / Offline / Dev)
// -------------------------------------------------------------
const LS_KEYS = {
  PRODUCTS: 'alaqsa_db_products',
  ORDERS: 'alaqsa_db_orders',
  ITEMS: 'alaqsa_db_order_items',
  HISTORY: 'alaqsa_db_order_history',
  AUDIT: 'alaqsa_db_audit_logs',
  SECURITY: 'alaqsa_db_security_events',
  COURIERS: 'alaqsa_db_couriers',
  SETTINGS: 'alaqsa_db_settings',
  ADMIN_SESSION: 'alaqsa_admin_session',
  ADMIN_CREDENTIALS: 'alaqsa_admin_credentials'
};

function initLocalDatabase() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(LS_KEYS.PRODUCTS)) {
    localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(LS_KEYS.COURIERS)) {
    localStorage.setItem(LS_KEYS.COURIERS, JSON.stringify(INITIAL_COURIERS));
  }
  if (!localStorage.getItem(LS_KEYS.ADMIN_CREDENTIALS)) {
    // Initial credentials: mtausif004 / fkfk004
    localStorage.setItem(LS_KEYS.ADMIN_CREDENTIALS, JSON.stringify({
      username: 'mtausif004',
      password: 'fkfk004',
      role: 'SUPER_ADMIN'
    }));
  }
  if (!localStorage.getItem(LS_KEYS.ORDERS)) {
    // Seed one completed sample order for testing tracking & invoice
    const sampleOrder: Order = {
      orderId: 'AQ-20261005-0001',
      invoiceId: 'INV-20261005-0001',
      createdAt: '2026-10-05 10:15:00',
      updatedAt: '2026-10-05 11:30:00',
      customerName: 'মোহাম্মদ তাওসিফ',
      phone: '01861007427',
      address: 'দোকান # ০৬, ছাতা মার্কেট, লাবণী পয়েন্ট',
      district: "Cox's Bazar",
      deliveryZone: "Cox's Bazar",
      subtotal: 1040,
      discount: 0,
      couponDiscount: 0,
      deliveryCharge: 0, // Free as subtotal > 1000
      grandTotal: 1040,
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      shippingStatus: 'Processing',
      courierId: 'CUR-01',
      trackingNumber: 'STF-889210',
      trackingUrl: 'https://steadfast.com.bd/t/STF-889210',
      customerNote: 'প্যাকেজিং একটু শক্ত করে দেবেন',
      items: [
        {
          orderId: 'AQ-20261005-0001',
          productId: 'PICK-0001',
          productNameSnapshot: 'বার্মিজ স্পেশাল তেঁতুলের মিষ্টি ও ঝাল আচার',
          sku: 'PICK-BUR-01',
          quantity: 1,
          unitPriceSnapshot: 280,
          discountSnapshot: 70,
          subtotal: 280,
          weight: '400'
        },
        {
          orderId: 'AQ-20261005-0001',
          productId: 'BAL-0001',
          productNameSnapshot: 'কক্সবাজার স্পেশাল ক্রিস্পি চিংড়ি বালাচাও',
          sku: 'BAL-SHRIMP-01',
          quantity: 2,
          unitPriceSnapshot: 380,
          discountSnapshot: 70,
          subtotal: 760,
          weight: '250'
        }
      ],
      history: [
        {
          orderId: 'AQ-20261005-0001',
          oldStatus: '-',
          newStatus: 'New',
          timestamp: '2026-10-05 10:15:00',
          admin: 'CUSTOMER',
          note: 'অর্ডার ওয়েবসাইট থেকে প্লেস করা হয়েছে'
        },
        {
          orderId: 'AQ-20261005-0001',
          oldStatus: 'New',
          newStatus: 'Confirmed',
          timestamp: '2026-10-05 11:30:00',
          admin: 'mtausif004',
          note: 'ফোন কলে অর্ডার কনফার্ম করা হয়েছে'
        }
      ]
    };
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify([sampleOrder]));
  }
}

// Call init once
initLocalDatabase();

// -------------------------------------------------------------
// HELPER FOR REAL APPS SCRIPT WEB APP CALLS
// -------------------------------------------------------------
async function callAppsScript(action: string, payload: any = {}): Promise<any> {
  const url = getApiBaseUrl();
  if (!url) return null;

  try {
    const postData = { action, ...payload };
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8' // Avoid CORS preflight in Google Apps Script
      },
      body: JSON.stringify(postData)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.warn(`Apps Script request failed for ${action}:`, err.message);
    return null;
  }
}

// -------------------------------------------------------------
// PUBLIC API METHODS
// -------------------------------------------------------------

export async function fetchProducts(category?: string): Promise<Product[]> {
  const remote = await callAppsScript('getProducts', { category });
  if (remote && remote.success) return remote.data;

  // Fallback to local
  const raw = localStorage.getItem(LS_KEYS.PRODUCTS);
  const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  const active = products.filter(p => p.active);
  if (category) {
    return active.filter(p => p.categoryId === category);
  }
  return active;
}

export async function fetchProductById(productId: string): Promise<Product | null> {
  const remote = await callAppsScript('getProductById', { id: productId });
  if (remote && remote.success) return remote.data;

  const raw = localStorage.getItem(LS_KEYS.PRODUCTS);
  const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;
  const found = products.find(p => p.productId.toLowerCase() === productId.toLowerCase());
  return (found && found.active) ? found : null;
}

export async function fetchCategories(): Promise<Category[]> {
  const remote = await callAppsScript('getCategories');
  if (remote && remote.success && remote.data.length > 0) return remote.data;
  return INITIAL_CATEGORIES.filter(c => c.active);
}

export async function fetchBanners(): Promise<Banner[]> {
  const remote = await callAppsScript('getBanners');
  if (remote && remote.success && remote.data.length > 0) return remote.data;
  return INITIAL_BANNERS.filter(b => b.active);
}

export async function fetchCombos(): Promise<Combo[]> {
  const remote = await callAppsScript('getCombos');
  if (remote && remote.success && remote.data.length > 0) return remote.data;
  return INITIAL_COMBOS.filter(c => c.active);
}

export async function validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; discount: number; message: string }> {
  const remote = await callAppsScript('validateCoupon', { couponCode: code, subtotal });
  if (remote) {
    return {
      valid: remote.success,
      discount: remote.data?.discount || 0,
      message: remote.data?.message || remote.error || 'কুপন যাচাইকরণে ত্রুটি'
    };
  }

  // Local simulation
  const clean = code.trim().toUpperCase();
  const found = INITIAL_COUPONS.find(c => c.code === clean && c.active);
  if (!found) {
    return { valid: false, discount: 0, message: 'অবৈধ কুপন কোড' };
  }
  if (subtotal < found.minimumOrder) {
    return { valid: false, discount: 0, message: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳${found.minimumOrder} টাকার অর্ডার প্রয়োজন` };
  }

  let discount = 0;
  if (found.type === 'percentage') {
    discount = Math.round((subtotal * found.amount) / 100);
    if (found.maximumDiscount) discount = Math.min(discount, found.maximumDiscount);
  } else {
    discount = Math.min(found.amount, subtotal);
  }

  return { valid: true, discount, message: `কুপন প্রয়োগ হয়েছে! ছাড়: ৳${discount}` };
}

/**
 * Server-authoritative order creation.
 * NEVER trusts prices, stock, delivery fee or totals sent by client.
 */
export async function createOrder(payload: {
  customer: {
    name: string;
    phone: string;
    altPhone?: string;
    address: string;
    district: string;
    area?: string;
    deliveryZone: 'cox_bazar' | 'outside_cox';
    note?: string;
    paymentMethod: 'COD' | 'bKash' | 'Nagad';
  };
  items: { productId: string; quantity: number }[];
  couponCode?: string;
}): Promise<{ success: boolean; orderId?: string; invoiceId?: string; error?: string; data?: any }> {
  const remote = await callAppsScript('createOrder', payload);
  if (remote) {
    if (remote.success) return { success: true, orderId: remote.data.orderId, invoiceId: remote.data.invoiceId, data: remote.data };
    return { success: false, error: remote.error || 'অর্ডার সম্পন্ন করতে সমস্যা হয়েছে' };
  }

  // Zero-trust Local Simulation
  try {
    const rawProducts = localStorage.getItem(LS_KEYS.PRODUCTS);
    const allProducts: Product[] = rawProducts ? JSON.parse(rawProducts) : INITIAL_PRODUCTS;

    // 1. Recalculate Subtotal & Verify Stock
    let calculatedSubtotal = 0;
    const itemSnapshots: any[] = [];

    for (const reqItem of payload.items) {
      const dbProd = allProducts.find(p => p.productId === reqItem.productId);
      if (!dbProd) return { success: false, error: `পণ্য পাওয়া যায়নি: ${reqItem.productId}` };
      if (dbProd.stock < reqItem.quantity) {
        return { success: false, error: `${dbProd.bengaliName} পর্যাপ্ত স্টকে নেই। বর্তমান স্টক: ${dbProd.stock}` };
      }

      const effectiveUnitPrice = Math.max(0, dbProd.price - dbProd.discount);
      const sub = effectiveUnitPrice * reqItem.quantity;
      calculatedSubtotal += sub;

      itemSnapshots.push({
        productId: dbProd.productId,
        productNameSnapshot: dbProd.bengaliName,
        sku: dbProd.sku,
        quantity: reqItem.quantity,
        unitPriceSnapshot: effectiveUnitPrice,
        discountSnapshot: dbProd.discount,
        subtotal: sub,
        weight: dbProd.weight
      });
    }

    // 2. Server Delivery Calculation
    const isCox = payload.customer.deliveryZone === 'cox_bazar' ||
                  payload.customer.district.toLowerCase().includes('cox') ||
                  payload.customer.district.includes('কক্সবাজার');

    const deliveryCharge = isCox
      ? (calculatedSubtotal < 1000 ? 100 : 0)
      : (calculatedSubtotal < 1500 ? 150 : 0);

    // 3. Coupon Calculation
    let couponDiscount = 0;
    if (payload.couponCode) {
      const cRes = await validateCoupon(payload.couponCode, calculatedSubtotal);
      if (cRes.valid) couponDiscount = cRes.discount;
    }

    const grandTotal = Math.max(0, calculatedSubtotal - couponDiscount + deliveryCharge);

    // 4. Generate Order ID: AQ-YYYYMMDD-XXXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const ordersRaw = localStorage.getItem(LS_KEYS.ORDERS);
    const ordersList: Order[] = ordersRaw ? JSON.parse(ordersRaw) : [];
    const count = ordersList.filter(o => o.orderId.includes(`AQ-${dateStr}`)).length + 1;
    const orderId = `AQ-${dateStr}-${String(count).padStart(4, '0')}`;
    const invoiceId = `INV-${dateStr}-${String(count).padStart(4, '0')}`;

    // 5. Deduct Stock
    for (const reqItem of payload.items) {
      const pIndex = allProducts.findIndex(p => p.productId === reqItem.productId);
      if (pIndex !== -1) {
        allProducts[pIndex].stock = Math.max(0, allProducts[pIndex].stock - reqItem.quantity);
      }
    }
    localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(allProducts));

    const newOrder: Order = {
      orderId,
      invoiceId,
      createdAt: now.toISOString().replace('T', ' ').slice(0, 19),
      updatedAt: now.toISOString().replace('T', ' ').slice(0, 19),
      customerName: payload.customer.name,
      phone: payload.customer.phone,
      alternativePhone: payload.customer.altPhone,
      address: payload.customer.address,
      district: payload.customer.district,
      area: payload.customer.area,
      deliveryZone: isCox ? "Cox's Bazar" : "Outside Cox's Bazar",
      subtotal: calculatedSubtotal,
      discount: couponDiscount,
      couponDiscount,
      deliveryCharge,
      grandTotal,
      paymentMethod: payload.customer.paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'New',
      shippingStatus: 'Unfulfilled',
      customerNote: payload.customer.note,
      items: itemSnapshots.map(i => ({ ...i, orderId })),
      history: [
        {
          orderId,
          oldStatus: '-',
          newStatus: 'New',
          timestamp: now.toISOString().replace('T', ' ').slice(0, 19),
          admin: 'CUSTOMER',
          note: 'অর্ডার ওয়েবসাইট থেকে প্লেস করা হয়েছে'
        }
      ]
    };

    ordersList.unshift(newOrder);
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(ordersList));

    return {
      success: true,
      orderId,
      invoiceId,
      data: newOrder
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'অর্ডার প্রসেসিংয়ে সমস্যা হয়েছে' };
  }
}

/**
 * Public verified order tracking (Order ID + Phone Number)
 */
export async function trackOrder(orderId: string, phone: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const remote = await callAppsScript('trackOrder', { orderId, phone });
  if (remote) {
    if (remote.success) return { success: true, data: remote.data };
    return { success: false, error: remote.error || 'অর্ডার পাওয়া যায়নি' };
  }

  // Local Simulation
  const ordersRaw = localStorage.getItem(LS_KEYS.ORDERS);
  const ordersList: Order[] = ordersRaw ? JSON.parse(ordersRaw) : [];

  const cleanId = orderId.trim().toUpperCase();
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').slice(-11);

  const found = ordersList.find(o => o.orderId.toUpperCase() === cleanId);
  if (!found) {
    return { success: false, error: 'প্রদত্ত তথ্য অনুযায়ী কোনো অর্ডার পাওয়া যায়নি।' };
  }

  const orderPhoneClean = found.phone.replace(/[\s\-\(\)]/g, '').slice(-11);
  if (orderPhoneClean !== cleanPhone) {
    return { success: false, error: 'অর্ডার আইডি অথবা ফোন নম্বর সঠিক নয়।' };
  }

  // Calculate Tracking URL priority: 1. Admin Custom Tracking URL, 2. Courier link, 3. None
  let effectiveTrackingUrl = '';
  if (found.trackingUrl && found.trackingUrl.startsWith('https://')) {
    effectiveTrackingUrl = found.trackingUrl;
  } else if (found.trackingNumber && found.courierId) {
    const couriersRaw = localStorage.getItem(LS_KEYS.COURIERS);
    const couriers: Courier[] = couriersRaw ? JSON.parse(couriersRaw) : INITIAL_COURIERS;
    const cur = couriers.find(c => c.courierId === found.courierId);
    if (cur?.trackingUrlTemplate) {
      effectiveTrackingUrl = cur.trackingUrlTemplate.replace('[TRACKING_NUMBER]', encodeURIComponent(found.trackingNumber));
    }
  }

  return {
    success: true,
    data: {
      orderId: found.orderId,
      invoiceId: found.invoiceId,
      createdAt: found.createdAt,
      orderStatus: found.orderStatus,
      paymentStatus: found.paymentStatus,
      shippingStatus: found.shippingStatus,
      customerName: found.customerName,
      maskedPhone: cleanPhone.slice(0, 3) + '****' + cleanPhone.slice(-3),
      deliveryZone: found.deliveryZone,
      subtotal: found.subtotal,
      deliveryCharge: found.deliveryCharge,
      discount: found.discount,
      grandTotal: found.grandTotal,
      courierName: found.courierId || 'Assigning soon',
      trackingNumber: found.trackingNumber || '',
      trackingUrl: effectiveTrackingUrl,
      statusTimeline: (found.history || []).map(h => ({
        status: h.newStatus,
        timestamp: h.timestamp,
        note: h.note || ''
      }))
    }
  };
}

/**
 * Get Public Invoice (Order ID or Invoice ID + Phone verification)
 */
export async function fetchInvoice(invoiceOrOrderId: string, phone: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const remote = await callAppsScript('getPublicInvoice', { invoiceId: invoiceOrOrderId, phone });
  if (remote) {
    if (remote.success) return { success: true, data: remote.data };
    return { success: false, error: remote.error || 'ইনভয়েস পাওয়া যায়নি' };
  }

  // Local Simulation
  const ordersRaw = localStorage.getItem(LS_KEYS.ORDERS);
  const ordersList: Order[] = ordersRaw ? JSON.parse(ordersRaw) : [];
  const cleanId = invoiceOrOrderId.trim().toUpperCase();
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '').slice(-11);

  const found = ordersList.find(o => o.orderId.toUpperCase() === cleanId || o.invoiceId.toUpperCase() === cleanId);
  if (!found) {
    return { success: false, error: 'ইনভয়েস পাওয়া যায়নি।' };
  }

  const orderPhoneClean = found.phone.replace(/[\s\-\(\)]/g, '').slice(-11);
  if (orderPhoneClean !== cleanPhone) {
    return { success: false, error: 'ইনভয়েস দেখার অনুমতি নেই।' };
  }

  return {
    success: true,
    data: {
      shop: {
        name: 'Al Aqsa Burmese Shop | আল আকসা বার্মিজ শপ',
        domain: 'https://alaqsaburmeseshop.com',
        email: 'shop@alaqsaburmeseshop.com',
        hotline: '+8801861007427',
        bkash: '01861007427',
        nagad: '01861007427',
        address: 'দোকান # ০৬, ছাতা # ০১, ছাতা মার্কেট ( ঝিনুক মার্কেট), লাবণী পয়েন্ট, কক্সবাজার সদর, কক্সবাজার',
        location: "Cox's Bazar, Bangladesh"
      },
      invoice: {
        invoiceId: found.invoiceId,
        orderId: found.orderId,
        createdAt: found.createdAt,
        customerName: found.customerName,
        phone: found.phone,
        alternativePhone: found.alternativePhone,
        address: found.address,
        district: found.district,
        area: found.area,
        deliveryZone: found.deliveryZone,
        customerNote: found.customerNote,
        paymentMethod: found.paymentMethod,
        paymentStatus: found.paymentStatus,
        orderStatus: found.orderStatus,
        shippingStatus: found.shippingStatus,
        subtotal: found.subtotal,
        deliveryCharge: found.deliveryCharge,
        discount: found.discount,
        grandTotal: found.grandTotal,
        courierName: found.courierId,
        trackingNumber: found.trackingNumber,
        trackingUrl: found.trackingUrl,
        items: found.items || []
      }
    }
  };
}

// -------------------------------------------------------------
// ADMIN PROTECTED API METHODS (/SecurePanel-Aqsa)
// -------------------------------------------------------------

export async function adminLogin(username: string, password: string): Promise<{ success: boolean; session?: AdminSession; error?: string }> {
  const remote = await callAppsScript('adminLogin', { username, password });
  if (remote) {
    if (remote.success) {
      const sess: AdminSession = {
        token: remote.data.token,
        adminId: remote.data.adminId,
        username: remote.data.username,
        role: remote.data.role,
        expiresAt: remote.data.expiresAt
      };
      sessionStorage.setItem(LS_KEYS.ADMIN_SESSION, JSON.stringify(sess));
      return { success: true, session: sess };
    }
    return { success: false, error: remote.error || 'ভুল তথ্য' };
  }

  // Local Simulation: initial credentials mtausif004 / fkfk004
  const rawCreds = localStorage.getItem(LS_KEYS.ADMIN_CREDENTIALS);
  const creds = rawCreds ? JSON.parse(rawCreds) : { username: 'mtausif004', password: 'fkfk004', role: 'SUPER_ADMIN' };

  if (username.trim().toLowerCase() === creds.username.toLowerCase() && password.trim() === creds.password) {
    const session: AdminSession = {
      token: 'LOCAL_SIM_TOKEN_' + Math.random().toString(36).substring(2),
      adminId: 'ADM-0001',
      username: creds.username,
      role: creds.role,
      expiresAt: Date.now() + 12 * 3600 * 1000 // 12 hours
    };
    sessionStorage.setItem(LS_KEYS.ADMIN_SESSION, JSON.stringify(session));
    return { success: true, session };
  }

  return { success: false, error: 'ভুল ব্যবহারকারীর নাম অথবা পাসওয়ার্ড' };
}

export function getActiveAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(LS_KEYS.ADMIN_SESSION);
  if (!raw) return null;
  try {
    const sess: AdminSession = JSON.parse(raw);
    if (Date.now() > sess.expiresAt) {
      sessionStorage.removeItem(LS_KEYS.ADMIN_SESSION);
      return null;
    }
    return sess;
  } catch (e) {
    return null;
  }
}

export function adminLogout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(LS_KEYS.ADMIN_SESSION);
  }
}

export async function adminChangeCredentials(newPassword: string, newUsername?: string): Promise<{ success: boolean; message?: string; error?: string }> {
  const session = getActiveAdminSession();
  if (!session) return { success: false, error: 'সেশন পাওয়া যায়নি' };

  const remote = await callAppsScript('adminChangePassword', { token: session.token, newPassword, newUsername });
  if (remote) {
    if (remote.success) return { success: true, message: remote.data.message };
    return { success: false, error: remote.error };
  }

  // Local Simulation
  const rawCreds = localStorage.getItem(LS_KEYS.ADMIN_CREDENTIALS);
  const creds = rawCreds ? JSON.parse(rawCreds) : { username: 'mtausif004', password: 'fkfk004', role: 'SUPER_ADMIN' };
  creds.password = newPassword.trim();
  if (newUsername?.trim()) creds.username = newUsername.trim();
  localStorage.setItem(LS_KEYS.ADMIN_CREDENTIALS, JSON.stringify(creds));
  adminLogout();

  return { success: true, message: 'ক্রেডেনশিয়াল সফলভাবে পরিবর্তন করা হয়েছে। নতুন পাসওয়ার্ড দিয়ে পুনরায় লগইন করুন।' };
}

export async function adminGetOrders(searchQuery?: string): Promise<Order[]> {
  const session = getActiveAdminSession();
  const remote = await callAppsScript('adminGetOrders', { token: session?.token, search: searchQuery });
  if (remote && remote.success) return remote.data;

  const raw = localStorage.getItem(LS_KEYS.ORDERS);
  let list: Order[] = raw ? JSON.parse(raw) : [];
  if (searchQuery?.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(o =>
      o.orderId.toLowerCase().includes(q) ||
      o.invoiceId.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }
  return list;
}

export async function adminUpdateOrderStatus(orderId: string, newStatus: string, note?: string): Promise<boolean> {
  const session = getActiveAdminSession();
  const remote = await callAppsScript('adminUpdateOrderStatus', { token: session?.token, orderId, newStatus, note });
  if (remote && remote.success) return true;

  const raw = localStorage.getItem(LS_KEYS.ORDERS);
  const list: Order[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex(o => o.orderId === orderId);
  if (idx !== -1) {
    const old = list[idx].orderStatus;
    list[idx].orderStatus = newStatus as any;
    list[idx].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    list[idx].history = list[idx].history || [];
    list[idx].history.push({
      orderId,
      oldStatus: old,
      newStatus,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      admin: session?.username || 'admin',
      note: note || ''
    });
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(list));
    return true;
  }
  return false;
}

/**
 * Admin Custom Tracking URL Setter (Highest Priority for Customer Tracking)
 */
export async function adminSetCustomTracking(payload: {
  orderId: string;
  trackingUrl: string;
  trackingNumber?: string;
  courierId?: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  const session = getActiveAdminSession();
  if (payload.trackingUrl && !payload.trackingUrl.startsWith('https://')) {
    return { success: false, error: 'ট্র্যাকিং লিঙ্ক অবশ্যই সুরক্ষিত https:// দিয়ে শুরু হতে হবে।' };
  }

  const remote = await callAppsScript('adminSetCustomTracking', { token: session?.token, ...payload });
  if (remote) {
    if (remote.success) return { success: true, message: remote.data?.message };
    return { success: false, error: remote.error };
  }

  // Local Simulation
  const raw = localStorage.getItem(LS_KEYS.ORDERS);
  const list: Order[] = raw ? JSON.parse(raw) : [];
  const idx = list.findIndex(o => o.orderId === payload.orderId);
  if (idx !== -1) {
    list[idx].trackingUrl = payload.trackingUrl.trim();
    if (payload.trackingNumber) list[idx].trackingNumber = payload.trackingNumber.trim();
    if (payload.courierId) list[idx].courierId = payload.courierId.trim();
    list[idx].updatedAt = new Date().toISOString().replace('T', ' ').slice(0, 19);
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(list));
    return { success: true, message: 'কাস্টম ট্র্যাকিং লিঙ্ক সফলভাবে সংরক্ষণ করা হয়েছে!' };
  }
  return { success: false, error: 'অর্ডার পাওয়া যায়নি' };
}

export async function adminSaveProduct(product: Partial<Product>): Promise<{ success: boolean; productId?: string; error?: string }> {
  const session = getActiveAdminSession();
  const remote = await callAppsScript('adminSaveProduct', { token: session?.token, product });
  if (remote) {
    if (remote.success) return { success: true, productId: remote.data?.productId };
    return { success: false, error: remote.error };
  }

  // Local Simulation
  const raw = localStorage.getItem(LS_KEYS.PRODUCTS);
  const products: Product[] = raw ? JSON.parse(raw) : INITIAL_PRODUCTS;

  if (product.productId) {
    const idx = products.findIndex(p => p.productId === product.productId);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...product, updatedAt: new Date().toISOString() } as Product;
      localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(products));
      return { success: true, productId: product.productId };
    }
  }

  // Create new with server ID prefix
  const cat = (product.categoryId || '').toLowerCase();
  let prefix = 'PRD';
  if (cat.includes('pickle') || cat.includes('আচার')) prefix = 'PICK';
  else if (cat.includes('tamarind') || cat.includes('তেঁতুল')) prefix = 'SWT';
  else if (cat.includes('balachaw') || cat.includes('বালাচাও')) prefix = 'BAL';
  else if (cat.includes('choco')) prefix = 'CHOCO';
  else if (cat.includes('skin')) prefix = 'SKIN';
  else if (cat.includes('than') || cat.includes('চন্দন')) prefix = 'THAN';
  else if (cat.includes('balm')) prefix = 'BALM';
  else if (cat.includes('coffee') || cat.includes('কফি')) prefix = 'COF';
  else if (cat.includes('dry') || cat.includes('বাদাম')) prefix = 'DRY';

  const count = products.filter(p => p.productId.startsWith(prefix)).length + 1;
  const newId = `${prefix}-${String(count).padStart(4, '0')}`;

  const newProduct: Product = {
    productId: newId,
    bengaliName: product.bengaliName || '',
    englishName: product.englishName || '',
    brand: product.brand || 'Al Aqsa Burmese',
    categoryId: product.categoryId || 'pickle-chutney',
    subcategoryId: product.subcategoryId || '',
    shortDescription: product.shortDescription || '',
    description: product.description || '',
    price: Number(product.price) || 0,
    mrp: Number(product.mrp) || Number(product.price) || 0,
    discount: Number(product.discount) || 0,
    stock: Number(product.stock) || 0,
    sku: product.sku || newId,
    weight: product.weight || '250',
    unit: product.unit || 'gm',
    ingredients: product.ingredients || '',
    origin: product.origin || 'Myanmar (Burma)',
    images: product.images && product.images.length > 0 ? product.images.slice(0, 4) : ['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'],
    featured: Boolean(product.featured),
    bestSeller: Boolean(product.bestSeller),
    offer: Boolean(product.offer),
    active: product.active !== undefined ? Boolean(product.active) : true,
    createdAt: new Date().toISOString()
  };

  products.unshift(newProduct);
  localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(products));
  return { success: true, productId: newId };
}

export async function adminGetCouriers(): Promise<Courier[]> {
  const session = getActiveAdminSession();
  const remote = await callAppsScript('adminGetCouriers', { token: session?.token });
  if (remote && remote.success) return remote.data;

  const raw = localStorage.getItem(LS_KEYS.COURIERS);
  return raw ? JSON.parse(raw) : INITIAL_COURIERS;
}

export async function adminSaveCourier(courier: Partial<Courier>): Promise<{ success: boolean; courierId?: string; error?: string }> {
  const session = getActiveAdminSession();
  if (courier.trackingUrlTemplate && !courier.trackingUrlTemplate.startsWith('https://')) {
    return { success: false, error: 'ট্র্যাকিং লিঙ্ক অবশ্যই https:// দিয়ে শুরু হতে হবে' };
  }

  const remote = await callAppsScript('adminSaveCourier', { token: session?.token, courier });
  if (remote && remote.success) return { success: true, courierId: remote.data?.courierId };

  const raw = localStorage.getItem(LS_KEYS.COURIERS);
  const couriers: Courier[] = raw ? JSON.parse(raw) : INITIAL_COURIERS;

  if (courier.courierId) {
    const idx = couriers.findIndex(c => c.courierId === courier.courierId);
    if (idx !== -1) {
      couriers[idx] = { ...couriers[idx], ...courier } as Courier;
      localStorage.setItem(LS_KEYS.COURIERS, JSON.stringify(couriers));
      return { success: true, courierId: courier.courierId };
    }
  }

  const newId = `CUR-0${couriers.length + 1}`;
  const newC: Courier = {
    courierId: newId,
    courierName: courier.courierName || 'New Courier',
    website: courier.website || '',
    trackingUrlTemplate: courier.trackingUrlTemplate || '',
    phone: courier.phone || '',
    active: courier.active !== undefined ? Boolean(courier.active) : true
  };
  couriers.push(newC);
  localStorage.setItem(LS_KEYS.COURIERS, JSON.stringify(couriers));
  return { success: true, courierId: newId };
}
