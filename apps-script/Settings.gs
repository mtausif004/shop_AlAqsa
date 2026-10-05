/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Settings.gs
 * Store Configuration, Diagnostics & Auto Database Initializer
 * ============================================================
 */

function handleGetPublicConfig() {
  return createResponse(true, {
    shopName: CONFIG.SHOP_NAME,
    domain: CONFIG.OFFICIAL_DOMAIN,
    email: CONFIG.EMAIL,
    hotline: CONFIG.HOTLINE,
    whatsapp: CONFIG.WHATSAPP,
    bkash: CONFIG.BKASH_NUMBER,
    nagad: CONFIG.NAGAD_NUMBER,
    address: CONFIG.ADDRESS,
    location: CONFIG.LOCATION,
    deliveryRules: CONFIG.DELIVERY_RULES,
    facebook: "https://www.facebook.com/share/14vuvr483L1/",
    messenger: "https://m.me/61593972884460",
    tiktok: "https://tiktok.com/@alaqsaburmeshop"
  });
}

function handleGetCategories() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.CATEGORIES);
  if (!sheet) return createResponse(true, []);
  var rows = getRowsAsObjects(sheet);
  var active = rows.filter(function(r) { return r.Active === true || r.Active === "true" || r.Active === 1; });
  return createResponse(true, active);
}

function handleGetBanners() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.BANNERS);
  if (!sheet) return createResponse(true, []);
  var rows = getRowsAsObjects(sheet);
  var active = rows.filter(function(r) { return r.Active === true || r.Active === "true" || r.Active === 1; });
  return createResponse(true, active);
}

function handleGetOffers() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.OFFERS);
  if (!sheet) return createResponse(true, []);
  var rows = getRowsAsObjects(sheet);
  return createResponse(true, rows);
}

function handleGetCombos() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.COMBOS);
  if (!sheet) return createResponse(true, []);
  var rows = getRowsAsObjects(sheet);
  return createResponse(true, rows);
}

function handleAdminGetDiagnostics(data, session) {
  var botToken = getProperty("TELEGRAM_BOT_TOKEN", "");
  var chatId = getProperty("TELEGRAM_CHAT_ID", "");
  var sheetId = getProperty("SPREADSHEET_ID", "");

  var ssConnected = false;
  var sheetsFound = [];
  try {
    var ss = getSpreadsheet();
    if (ss) {
      ssConnected = true;
      sheetsFound = ss.getSheets().map(function(s) { return s.getName(); });
    }
  } catch (e) {
    ssConnected = false;
  }

  return createResponse(true, {
    version: "2.0.0-PROD",
    serverTime: formatDhakaDate(),
    spreadsheetConnected: ssConnected,
    spreadsheetIdSet: Boolean(sheetId),
    telegramConfigured: Boolean(botToken && chatId),
    sheetsAvailable: sheetsFound,
    nodeEnvironment: "Google Apps Script V8 Engine"
  });
}

// AUTOMATIC SPREADSHEET INITIALIZER
// Creates all 16 Sheets with exact production column schemas
function handleInitializeDatabase(data) {
  var ss = getSpreadsheet();

  var schemas = {
    Orders: [
      "OrderID", "InvoiceID", "CreatedAt", "UpdatedAt", "CustomerName", "Phone",
      "AlternativePhone", "Address", "District", "Area", "DeliveryZone", "Subtotal",
      "Discount", "CouponDiscount", "DeliveryCharge", "GrandTotal", "PaymentMethod",
      "PaymentStatus", "OrderStatus", "ShippingStatus", "CourierID", "TrackingNumber",
      "TrackingURL", "ShippingDate", "EstimatedDeliveryDate", "CustomerNote", "AdminNote",
      "CreatedBy", "UpdatedBy"
    ],
    OrderItems: [
      "OrderID", "ProductID", "ProductNameSnapshot", "SKU", "Quantity",
      "UnitPriceSnapshot", "DiscountSnapshot", "Subtotal", "Weight", "CreatedAt"
    ],
    Products: [
      "ProductID", "BengaliName", "EnglishName", "Brand", "CategoryID", "SubcategoryID",
      "Description", "ShortDescription", "Price", "MRP", "Discount", "Stock", "SKU",
      "Weight", "Unit", "Ingredients", "Origin", "Image1", "Image2", "Image3", "Image4",
      "Featured", "BestSeller", "Offer", "Active", "SEO_Title", "SEO_Description",
      "SEO_Keywords", "CreatedAt", "UpdatedAt"
    ],
    Settings: ["Key", "Value", "Description", "UpdatedAt"],
    Admins: ["AdminID", "Username", "PasswordHash", "Role", "Active", "CreatedAt", "UpdatedAt", "LastLoginAt"],
    Coupons: ["Code", "Type", "Amount", "MinimumOrder", "MaximumDiscount", "UsageLimit", "PerCustomerLimit", "StartDate", "EndDate", "Active"],
    Banners: ["BannerID", "Title", "Subtitle", "CTA", "Link", "Image", "Active", "Order", "Style"],
    Categories: ["CategoryID", "BengaliName", "EnglishName", "Slug", "Subcategories", "Image", "Active", "Order"],
    Offers: ["OfferID", "Title", "Type", "DiscountValue", "ApplicableTo", "Active", "StartDate", "EndDate"],
    Combos: ["ComboID", "Name", "Description", "ProductIDs", "OriginalPrice", "ComboPrice", "Discount", "Image", "Active"],
    Reviews: ["ReviewID", "ProductID", "CustomerName", "Phone", "Rating", "Comment", "Status", "CreatedAt"],
    Couriers: ["CourierID", "CourierName", "Website", "TrackingUrlTemplate", "Phone", "Active", "CreatedAt", "UpdatedAt"],
    OrderStatusHistory: ["OrderID", "OldStatus", "NewStatus", "Timestamp", "Admin", "Note"],
    OrderAuditLog: ["AuditID", "OrderID", "AdminID", "Timestamp", "Action", "Field", "OldValue", "NewValue", "Reason"],
    SecurityEvents: ["EventID", "EventType", "Timestamp", "Details"],
    LoginAttempts: ["AttemptID", "Username", "IP", "Status", "Timestamp"]
  };

  var createdSheets = [];

  for (var sheetName in schemas) {
    var sheet = ss.getSheetByName(sheetName);
    var cols = schemas[sheetName];
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.getRange(1, 1, 1, cols.length).setValues([cols]);
      sheet.getRange(1, 1, 1, cols.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
      createdSheets.push(sheetName);
    }
  }

  // Ensure default admin exists: mtausif004 / fkfk004
  var adminSheet = ss.getSheetByName("Admins");
  if (adminSheet && adminSheet.getLastRow() <= 1) {
    var initHash = hashPassword("fkfk004");
    appendObjectToSheet(adminSheet, {
      AdminID: "ADM-0001",
      Username: "mtausif004",
      PasswordHash: initHash,
      Role: "SUPER_ADMIN",
      Active: true,
      CreatedAt: formatDhakaDate(),
      UpdatedAt: formatDhakaDate(),
      LastLoginAt: ""
    });
  }

  return createResponse(true, {
    message: "ডাটাবেজের সকল ১৬টি শীট সফলভাবে তৈরি ও সক্রিয় করা হয়েছে!",
    createdSheets: createdSheets
  });
}
