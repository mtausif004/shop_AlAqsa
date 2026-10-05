/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Products.gs
 * Product Catalog, Server ID Generation & Inventory Logic
 * ============================================================
 */

function generateProductId(category) {
  var cat = String(category || "").toLowerCase();
  var prefix = CONFIG.CATEGORY_PREFIXES.default;

  if (cat.indexOf("pickle") !== -1 || cat.indexOf("আচার") !== -1 || cat.indexOf("চাটনি") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.pickle;
  } else if (cat.indexOf("tamarind") !== -1 || cat.indexOf("তেঁতুল") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.tamarind;
  } else if (cat.indexOf("balachaw") !== -1 || cat.indexOf("বালাচাও") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.balachaw;
  } else if (cat.indexOf("chocolate") !== -1 || cat.indexOf("চকলেট") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.chocolate;
  } else if (cat.indexOf("skin") !== -1 || cat.indexOf("স্কিন") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.skincare;
  } else if (cat.indexOf("thanaka") !== -1 || cat.indexOf("চন্দন") !== -1 || cat.indexOf("থানাকা") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.thanaka;
  } else if (cat.indexOf("balm") !== -1 || cat.indexOf("বাম") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.balm;
  } else if (cat.indexOf("coffee") !== -1 || cat.indexOf("কফি") !== -1 || cat.indexOf("হেলথ") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.coffee;
  } else if (cat.indexOf("dry") !== -1 || cat.indexOf("বাদাম") !== -1 || cat.indexOf("প্লাম") !== -1) {
    prefix = CONFIG.CATEGORY_PREFIXES.dryfoods;
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  var rows = sheet ? getRowsAsObjects(sheet) : [];

  var count = 1;
  rows.forEach(function(row) {
    if (row.ProductID && String(row.ProductID).indexOf(prefix + "-") === 0) {
      count++;
    }
  });

  var padded = ("0000" + count).slice(-4);
  return prefix + "-" + padded;
}

function handleGetProducts(params) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) return createResponse(true, []);

  var all = getRowsAsObjects(sheet);

  // Filter public: Active only
  var activeProducts = all.filter(function(p) {
    return p.Active === true || p.Active === "true" || p.Active === 1 || p.Active === "TRUE";
  });

  // Optional category filter
  if (params && params.category) {
    activeProducts = activeProducts.filter(function(p) {
      return String(p.CategoryID).toLowerCase() === String(params.category).toLowerCase();
    });
  }

  // Sanitize fields before sending to public client
  var sanitized = activeProducts.map(function(p) {
    return formatProductForClient(p);
  });

  return createResponse(true, sanitized);
}

function handleGetProductById(productId) {
  if (!productId) {
    return createResponse(false, null, 'INVALID_ID', 'প্রডাক্ট আইডি প্রদান করা হয়নি');
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) return createResponse(false, null, 'NOT_FOUND', 'পণ্য পাওয়া যায়নি');

  var all = getRowsAsObjects(sheet);
  var found = all.find(function(p) {
    return String(p.ProductID).toLowerCase() === String(productId).toLowerCase();
  });

  if (!found || (found.Active !== true && found.Active !== "true" && found.Active !== 1 && found.Active !== "TRUE")) {
    return createResponse(false, null, 'NOT_FOUND', 'পণ্যটি বর্তমানে উপলভ্য নয়');
  }

  return createResponse(true, formatProductForClient(found));
}

function formatProductForClient(p) {
  return {
    productId: p.ProductID,
    bengaliName: p.BengaliName || "",
    englishName: p.EnglishName || "",
    brand: p.Brand || "Al Aqsa Burmese",
    categoryId: p.CategoryID || "",
    subcategoryId: p.SubcategoryID || "",
    description: p.Description || "",
    shortDescription: p.ShortDescription || "",
    price: Number(p.Price) || 0,
    mrp: Number(p.MRP) || Number(p.Price) || 0,
    discount: Number(p.Discount) || 0,
    stock: Number(p.Stock) || 0,
    sku: p.SKU || "",
    weight: p.Weight || "",
    unit: p.Unit || "gm",
    ingredients: p.Ingredients || "",
    origin: p.Origin || "Myanmar (Burma)",
    images: [p.Image1, p.Image2, p.Image3, p.Image4].filter(function(img) { return Boolean(img); }),
    featured: Boolean(p.Featured === true || p.Featured === "true" || p.Featured === 1),
    bestSeller: Boolean(p.BestSeller === true || p.BestSeller === "true" || p.BestSeller === 1),
    offer: Boolean(p.Offer === true || p.Offer === "true" || p.Offer === 1),
    seoTitle: p.SEO_Title || p.BengaliName,
    seoDescription: p.SEO_Description || p.ShortDescription,
    seoKeywords: p.SEO_Keywords || ""
  };
}

// ADMIN PRODUCT HANDLERS
function handleAdminGetProducts(data, session) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  if (!sheet) return createResponse(true, []);
  var rows = getRowsAsObjects(sheet);
  return createResponse(true, rows);
}

function handleAdminSaveProduct(data, session) {
  var product = data.product;
  if (!product || !product.BengaliName) {
    return createResponse(false, null, 'INVALID_INPUT', 'পণ্যের বাংলা নাম আবশ্যক');
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  var rows = getRowsAsObjects(sheet);

  var isUpdate = Boolean(product.ProductID);
  var productId = isUpdate ? product.ProductID : generateProductId(product.CategoryID || product.category);

  var images = Array.isArray(product.images) ? product.images : [product.Image1, product.Image2, product.Image3, product.Image4];

  var rowData = {
    ProductID: productId,
    BengaliName: sanitizeInput(product.BengaliName),
    EnglishName: sanitizeInput(product.EnglishName || ""),
    Brand: sanitizeInput(product.Brand || "Al Aqsa"),
    CategoryID: sanitizeInput(product.CategoryID || product.categoryId || ""),
    SubcategoryID: sanitizeInput(product.SubcategoryID || product.subcategoryId || ""),
    Description: sanitizeInput(product.Description || ""),
    ShortDescription: sanitizeInput(product.ShortDescription || ""),
    Price: Number(product.Price) || 0,
    MRP: Number(product.MRP) || Number(product.Price) || 0,
    Discount: Number(product.Discount) || 0,
    Stock: Math.max(0, parseInt(product.Stock, 10) || 0),
    SKU: sanitizeInput(product.SKU || productId),
    Weight: sanitizeInput(product.Weight || ""),
    Unit: sanitizeInput(product.Unit || "gm"),
    Ingredients: sanitizeInput(product.Ingredients || ""),
    Origin: sanitizeInput(product.Origin || "Myanmar"),
    Image1: images[0] || "",
    Image2: images[1] || "",
    Image3: images[2] || "",
    Image4: images[3] || "",
    Featured: Boolean(product.Featured),
    BestSeller: Boolean(product.BestSeller),
    Offer: Boolean(product.Offer),
    Active: product.Active !== undefined ? Boolean(product.Active) : true,
    SEO_Title: sanitizeInput(product.SEO_Title || product.BengaliName),
    SEO_Description: sanitizeInput(product.SEO_Description || product.ShortDescription),
    SEO_Keywords: sanitizeInput(product.SEO_Keywords || ""),
    UpdatedAt: formatDhakaDate()
  };

  if (isUpdate) {
    var existing = rows.find(function(r) { return r.ProductID === productId; });
    if (!existing) {
      return createResponse(false, null, 'NOT_FOUND', 'হালনাগাদ করার জন্য পণ্যটি খুঁজে পাওয়া যায়নি');
    }
    rowData.CreatedAt = existing.CreatedAt;
    updateRowInSheet(sheet, existing._rowIndex, rowData);
    logSecurityEvent('PRODUCT_UPDATED', { productId: productId, admin: session.username });
  } else {
    rowData.CreatedAt = formatDhakaDate();
    appendObjectToSheet(sheet, rowData);
    logSecurityEvent('PRODUCT_CREATED', { productId: productId, admin: session.username });
  }

  return createResponse(true, { productId: productId, message: 'পণ্য সফলভাবে সংরক্ষিত হয়েছে' });
}

function handleAdminDeleteProduct(data, session) {
  var productId = data.productId;
  if (!productId) return createResponse(false, null, 'INVALID_ID', 'প্রডাক্ট আইডি আবশ্যক');

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
  var rows = getRowsAsObjects(sheet);
  var found = rows.find(function(r) { return r.ProductID === productId; });

  if (!found) return createResponse(false, null, 'NOT_FOUND', 'পণ্য পাওয়া যায়নি');

  // Soft delete / Hide for audit integrity
  found.Active = false;
  found.UpdatedAt = formatDhakaDate();
  updateRowInSheet(sheet, found._rowIndex, found);

  logSecurityEvent('PRODUCT_DEACTIVATED', { productId: productId, admin: session.username });
  return createResponse(true, { message: 'পণ্যটি সফলভাবে নিষ্ক্রিয় করা হয়েছে' });
}
