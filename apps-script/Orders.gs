/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Orders.gs
 * Server-Authoritative Order Creation, Calculations & Status Management
 * ============================================================
 */

function generateOrderId() {
  var todayStr = formatDhakaDateOnly();
  var prefix = "AQ-" + todayStr;

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var rows = sheet ? getRowsAsObjects(sheet) : [];

  var count = 1;
  rows.forEach(function(r) {
    if (r.OrderID && String(r.OrderID).indexOf(prefix) === 0) {
      count++;
    }
  });

  var padded = ("0000" + count).slice(-4);
  return prefix + "-" + padded;
}

function handleCreateOrder(payload) {
  if (!payload || !payload.customer || !payload.items || !payload.items.length) {
    return createResponse(false, null, 'INVALID_ORDER_DATA', 'অর্ডার সম্পন্ন করার জন্য প্রয়োজনীয় তথ্য অসম্পূর্ণ');
  }

  var customer = payload.customer;
  var rawPhone = customer.phone || customer.phoneNumber;

  if (!customer.name || !sanitizeInput(customer.name)) {
    return createResponse(false, null, 'INVALID_NAME', 'গ্রাহকের সঠিক নাম প্রদান করুন');
  }

  if (!isValidBangladeshPhone(rawPhone)) {
    return createResponse(false, null, 'INVALID_PHONE', 'সঠিক ১১ ডিজিটের বাংলাদেশি ফোন নম্বর প্রদান করুন (যেমন: 01861007427)');
  }

  var phone = normalizeBangladeshPhone(rawPhone);
  var altPhone = customer.altPhone ? normalizeBangladeshPhone(customer.altPhone) : "";
  var address = sanitizeInput(customer.address);
  var district = sanitizeInput(customer.district || "Cox's Bazar");
  var area = sanitizeInput(customer.area || "");
  var deliveryZone = sanitizeInput(customer.deliveryZone || "outside_cox");
  var note = sanitizeInput(customer.note || "");
  var paymentMethod = sanitizeInput(customer.paymentMethod || "COD");

  // Acquire Lock to guarantee atomic order creation and prevent stock races
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000); // 15 seconds max wait
  } catch (e) {
    return createResponse(false, null, 'CONCURRENCY_TIMEOUT', 'সিস্টেম বর্তমানে ব্যস্ত রয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর পুনরায় চেষ্টা করুন।');
  }

  try {
    var ss = getSpreadsheet();
    var productsSheet = ss.getSheetByName(CONFIG.SHEETS.PRODUCTS);
    var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
    var orderItemsSheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_ITEMS);
    var historySheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_STATUS_HISTORY);

    var allProducts = getRowsAsObjects(productsSheet);

    // SERVER RECALCULATION & STOCK VERIFICATION
    var validatedItems = [];
    var calculatedSubtotal = 0;

    for (var i = 0; i < payload.items.length; i++) {
      var itemReq = payload.items[i];
      var pid = itemReq.productId || itemReq.id;
      var qty = Math.max(1, parseInt(itemReq.quantity, 10) || 1);

      var dbProduct = allProducts.find(function(p) {
        return String(p.ProductID).toLowerCase() === String(pid).toLowerCase();
      });

      if (!dbProduct) {
        lock.releaseLock();
        return createResponse(false, null, 'PRODUCT_NOT_FOUND', 'পণ্য পাওয়া যায়নি: ' + pid);
      }

      var currentStock = parseInt(dbProduct.Stock, 10) || 0;
      if (currentStock < qty) {
        lock.releaseLock();
        return createResponse(false, null, 'OUT_OF_STOCK', dbProduct.BengaliName + ' বর্তমানে পর্যাপ্ত স্টকে নেই। অবশিষ্ট স্টক: ' + currentStock);
      }

      var serverPrice = Number(dbProduct.Price) || 0;
      var serverDiscount = Number(dbProduct.Discount) || 0;
      var effectiveUnitPrice = Math.max(0, serverPrice - serverDiscount);
      var itemSubtotal = effectiveUnitPrice * qty;

      calculatedSubtotal += itemSubtotal;

      validatedItems.push({
        product: dbProduct,
        quantity: qty,
        unitPrice: effectiveUnitPrice,
        originalPrice: serverPrice,
        discount: serverDiscount,
        itemSubtotal: itemSubtotal
      });
    }

    // SERVER DELIVERY CALCULATION (Cox's Bazar vs Outside)
    var isCoxsBazar = deliveryZone === "cox_bazar" || district.toLowerCase().indexOf("cox") !== -1 || district.indexOf("কক্সবাজার") !== -1;
    var serverDeliveryCharge = 0;

    if (isCoxsBazar) {
      serverDeliveryCharge = calculatedSubtotal < CONFIG.DELIVERY_RULES.COX_BAZAR_THRESHOLD ? CONFIG.DELIVERY_RULES.COX_BAZAR_FEE : 0;
    } else {
      serverDeliveryCharge = calculatedSubtotal < CONFIG.DELIVERY_RULES.OUTSIDE_THRESHOLD ? CONFIG.DELIVERY_RULES.OUTSIDE_FEE : 0;
    }

    // Server Coupon verification if present
    var couponDiscount = 0;
    if (payload.couponCode) {
      var couponRes = verifyCouponInternal(payload.couponCode, calculatedSubtotal, phone);
      if (couponRes.valid) {
        couponDiscount = couponRes.discount;
      }
    }

    var grandTotal = Math.max(0, calculatedSubtotal - couponDiscount + serverDeliveryCharge);
    var orderId = generateOrderId();
    var invoiceId = "INV-" + orderId.replace("AQ-", "");
    var nowTimestamp = formatDhakaDate();

    // Deduct inventory atomically
    validatedItems.forEach(function(item) {
      var newStock = Math.max(0, (parseInt(item.product.Stock, 10) || 0) - item.quantity);
      item.product.Stock = newStock;
      item.product.UpdatedAt = nowTimestamp;
      updateRowInSheet(productsSheet, item.product._rowIndex, item.product);

      // Save Order Item Snapshot
      appendObjectToSheet(orderItemsSheet, {
        OrderID: orderId,
        ProductID: item.product.ProductID,
        ProductNameSnapshot: item.product.BengaliName,
        SKU: item.product.SKU || item.product.ProductID,
        Quantity: item.quantity,
        UnitPriceSnapshot: item.unitPrice,
        DiscountSnapshot: item.discount,
        Subtotal: item.itemSubtotal,
        Weight: item.product.Weight || "",
        CreatedAt: nowTimestamp
      });
    });

    // Save Main Order Record
    var orderRecord = {
      OrderID: orderId,
      InvoiceID: invoiceId,
      CreatedAt: nowTimestamp,
      UpdatedAt: nowTimestamp,
      CustomerName: customer.name,
      Phone: phone,
      AlternativePhone: altPhone,
      Address: address,
      District: district,
      Area: area,
      DeliveryZone: isCoxsBazar ? "Cox's Bazar" : "Outside Cox's Bazar",
      Subtotal: calculatedSubtotal,
      Discount: couponDiscount,
      CouponDiscount: couponDiscount,
      DeliveryCharge: serverDeliveryCharge,
      GrandTotal: grandTotal,
      PaymentMethod: paymentMethod,
      PaymentStatus: "Pending",
      OrderStatus: "New",
      ShippingStatus: "Unfulfilled",
      CourierID: "",
      TrackingNumber: "",
      TrackingURL: "",
      ShippingDate: "",
      EstimatedDeliveryDate: "",
      CustomerNote: note,
      AdminNote: "",
      CreatedBy: "CUSTOMER_WEB",
      UpdatedBy: "CUSTOMER_WEB"
    };

    appendObjectToSheet(ordersSheet, orderRecord);

    // Log Initial Order Status History
    appendObjectToSheet(historySheet, {
      OrderID: orderId,
      OldStatus: "-",
      NewStatus: "New",
      Timestamp: nowTimestamp,
      Admin: "CUSTOMER",
      Note: "অর্ডার ওয়েবসাইট থেকে সফলভাবে তৈরি হয়েছে"
    });

    // Send Telegram Alert safely
    sendTelegramOrderAlert({
      orderId: orderId,
      invoiceId: invoiceId,
      customerName: customer.name,
      phone: phone,
      address: address + (district ? ", " + district : ""),
      items: validatedItems.map(function(vi) {
        return vi.product.BengaliName + " (" + vi.quantity + "x @ ৳" + vi.unitPrice + ")";
      }),
      subtotal: calculatedSubtotal,
      deliveryCharge: serverDeliveryCharge,
      discount: couponDiscount,
      grandTotal: grandTotal,
      paymentMethod: paymentMethod
    });

    logSecurityEvent('ORDER_CREATED', { orderId: orderId, grandTotal: grandTotal, phone: phone });

    // Return safe customer response
    return createResponse(true, {
      orderId: orderId,
      invoiceId: invoiceId,
      customerName: customer.name,
      phone: phone,
      subtotal: calculatedSubtotal,
      deliveryCharge: serverDeliveryCharge,
      discount: couponDiscount,
      grandTotal: grandTotal,
      paymentMethod: paymentMethod,
      orderStatus: "New",
      createdAt: nowTimestamp
    });

  } finally {
    lock.releaseLock();
  }
}

// ADMIN ORDER MANAGEMENT
function handleAdminGetOrders(params, session) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  if (!sheet) return createResponse(true, []);

  var rows = getRowsAsObjects(sheet);
  // Sort descending by CreatedAt
  rows.reverse();

  // Search filter if provided
  if (params && params.search) {
    var query = String(params.search).toLowerCase().trim();
    rows = rows.filter(function(r) {
      return (
        String(r.OrderID).toLowerCase().indexOf(query) !== -1 ||
        String(r.InvoiceID).toLowerCase().indexOf(query) !== -1 ||
        String(r.CustomerName).toLowerCase().indexOf(query) !== -1 ||
        String(r.Phone).indexOf(query) !== -1 ||
        String(r.TrackingNumber).toLowerCase().indexOf(query) !== -1
      );
    });
  }

  return createResponse(true, rows);
}

function handleAdminGetOrderById(data, session) {
  var orderId = data.orderId || data.id;
  if (!orderId) return createResponse(false, null, 'INVALID_ID', 'অর্ডার আইডি আবশ্যক');

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var itemsSheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_ITEMS);
  var historySheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_STATUS_HISTORY);

  var orders = getRowsAsObjects(ordersSheet);
  var order = orders.find(function(o) { return o.OrderID === orderId; });

  if (!order) return createResponse(false, null, 'NOT_FOUND', 'অর্ডার খুঁজে পাওয়া যায়নি');

  var allItems = getRowsAsObjects(itemsSheet);
  var orderItems = allItems.filter(function(i) { return i.OrderID === orderId; });

  var allHistory = getRowsAsObjects(historySheet);
  var history = allHistory.filter(function(h) { return h.OrderID === orderId; });

  return createResponse(true, {
    order: order,
    items: orderItems,
    history: history
  });
}

function handleAdminUpdateOrderStatus(data, session) {
  var orderId = data.orderId;
  var newStatus = data.newStatus;
  var note = data.note || "";

  if (!orderId || !newStatus) {
    return createResponse(false, null, 'INVALID_INPUT', 'অর্ডার আইডি ও নতুন স্ট্যাটাস আবশ্যক');
  }

  if (CONFIG.ORDER_STATUSES.indexOf(newStatus) === -1) {
    return createResponse(false, null, 'INVALID_STATUS', 'অবৈধ অর্ডার স্ট্যাটাস');
  }

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var historySheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_STATUS_HISTORY);

  var orders = getRowsAsObjects(ordersSheet);
  var order = orders.find(function(o) { return o.OrderID === orderId; });

  if (!order) return createResponse(false, null, 'NOT_FOUND', 'অর্ডার খুঁজে পাওয়া যায়নি');

  var oldStatus = order.OrderStatus;
  order.OrderStatus = newStatus;
  order.UpdatedAt = formatDhakaDate();
  order.UpdatedBy = session.username;

  updateRowInSheet(ordersSheet, order._rowIndex, order);

  appendObjectToSheet(historySheet, {
    OrderID: orderId,
    OldStatus: oldStatus,
    NewStatus: newStatus,
    Timestamp: formatDhakaDate(),
    Admin: session.username,
    Note: note
  });

  logOrderAudit(orderId, session.username, 'STATUS_CHANGE', 'OrderStatus', oldStatus, newStatus, note);

  return createResponse(true, { message: 'অর্ডার স্ট্যাটাস সফলভাবে আপডেট হয়েছে', order: order });
}

function handleAdminUpdateOrder(data, session) {
  var orderId = data.orderId;
  if (!orderId) return createResponse(false, null, 'INVALID_ID', 'অর্ডার আইডি আবশ্যক');

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var orders = getRowsAsObjects(ordersSheet);
  var order = orders.find(function(o) { return o.OrderID === orderId; });

  if (!order) return createResponse(false, null, 'NOT_FOUND', 'অর্ডার খুঁজে পাওয়া যায়নি');

  var edits = data.edits || {};
  var auditChanges = [];

  // Allowed editable fields
  var allowedFields = [
    'CustomerName', 'Phone', 'AlternativePhone', 'Address', 'District', 'Area',
    'DeliveryZone', 'CustomerNote', 'AdminNote', 'DeliveryCharge', 'Discount',
    'PaymentStatus', 'ShippingStatus', 'CourierID', 'TrackingNumber', 'TrackingURL',
    'ShippingDate', 'EstimatedDeliveryDate'
  ];

  allowedFields.forEach(function(field) {
    if (edits[field] !== undefined && edits[field] !== order[field]) {
      auditChanges.push({ field: field, oldVal: order[field], newVal: edits[field] });
      order[field] = edits[field];
    }
  });

  // Recalculate Grand Total if delivery charge or discount changed
  var subtotal = Number(order.Subtotal) || 0;
  var discount = Number(order.Discount) || 0;
  var delivery = Number(order.DeliveryCharge) || 0;
  order.GrandTotal = Math.max(0, subtotal - discount + delivery);

  order.UpdatedAt = formatDhakaDate();
  order.UpdatedBy = session.username;

  updateRowInSheet(ordersSheet, order._rowIndex, order);

  auditChanges.forEach(function(ch) {
    logOrderAudit(orderId, session.username, 'ORDER_EDIT', ch.field, ch.oldVal, ch.newVal, data.reason || 'Admin manual edit');
  });

  return createResponse(true, { message: 'অর্ডার সফলভাবে হালনাগাদ হয়েছে', order: order });
}
