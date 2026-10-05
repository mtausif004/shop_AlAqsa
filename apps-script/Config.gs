/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Config.gs
 * Centralized Settings, Constants & Sheet Names
 * ============================================================
 */

var CONFIG = {
  SHOP_NAME: "Al Aqsa Burmese Shop | আল আকসা বার্মিজ শপ",
  OFFICIAL_DOMAIN: "https://alaqsaburmeseshop.com",
  EMAIL: "shop@alaqsaburmeseshop.com",
  HOTLINE: "+8801861007427",
  WHATSAPP: "+8801861007427",
  BKASH_NUMBER: "01861007427",
  NAGAD_NUMBER: "01861007427",
  ADDRESS: "দোকান # ০৬, ছাতা # ০১, ছাতা মার্কেট ( ঝিনুক মার্কেট), লাবণী পয়েন্ট, কক্সবাজার সদর, কক্সবাজার",
  LOCATION: "Cox's Bazar, Bangladesh",
  
  // Default delivery thresholds
  DELIVERY_RULES: {
    COX_BAZAR_THRESHOLD: 1000,
    COX_BAZAR_FEE: 100,
    OUTSIDE_THRESHOLD: 1500,
    OUTSIDE_FEE: 150
  },

  // 16 Standard Sheets
  SHEETS: {
    ORDERS: "Orders",
    ORDER_ITEMS: "OrderItems",
    PRODUCTS: "Products",
    SETTINGS: "Settings",
    ADMINS: "Admins",
    COUPONS: "Coupons",
    BANNERS: "Banners",
    CATEGORIES: "Categories",
    OFFERS: "Offers",
    COMBOS: "Combos",
    REVIEWS: "Reviews",
    COURIERS: "Couriers",
    ORDER_STATUS_HISTORY: "OrderStatusHistory",
    ORDER_AUDIT_LOG: "OrderAuditLog",
    SECURITY_EVENTS: "SecurityEvents",
    LOGIN_ATTEMPTS: "LoginAttempts"
  },

  // Valid Order Status Lifecycle
  ORDER_STATUSES: [
    "New",
    "Confirmed",
    "Processing",
    "Ready to Ship",
    "Shipped",
    "In Transit",
    "Out for Delivery",
    "Delivered",
    "Delivery Failed",
    "Returned",
    "Cancelled"
  ],

  // Valid Payment Statuses
  PAYMENT_STATUSES: [
    "Pending",
    "Paid",
    "Partially Paid",
    "Refunded",
    "Failed"
  ],

  // Product ID Prefixes by Category
  CATEGORY_PREFIXES: {
    "pickle": "PICK",
    "tamarind": "SWT",
    "balachaw": "BAL",
    "chocolate": "CHOCO",
    "skincare": "SKIN",
    "thanaka": "THAN",
    "balm": "BALM",
    "coffee": "COF",
    "dryfoods": "DRY",
    "default": "PRD"
  },

  SESSION_DURATION_HOURS: 12
};

// Safe access to Script Properties (Secret Management)
function getProperty(key, fallback) {
  try {
    var val = PropertiesService.getScriptProperties().getProperty(key);
    return val !== null && val !== undefined && val !== "" ? val : fallback;
  } catch (e) {
    return fallback;
  }
}

function getSpreadsheet() {
  var sheetId = getProperty("SPREADSHEET_ID", "");
  if (!sheetId) {
    try {
      return SpreadsheetApp.getActiveSpreadsheet();
    } catch (e) {
      throw new Error("SPREADSHEET_ID Script Property is not configured");
    }
  }
  return SpreadsheetApp.openById(sheetId);
}
