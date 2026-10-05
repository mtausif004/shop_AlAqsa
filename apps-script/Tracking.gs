/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Tracking.gs
 * Public Verified Order Tracking & Admin Custom Tracking Logic
 * ============================================================
 */

function handleTrackOrder(data) {
  var rawOrderId = data.orderId || data.OrderID || data.id;
  var rawPhone = data.phone || data.Phone || data.phoneNumber;

  if (!rawOrderId || !rawPhone) {
    return createResponse(false, null, 'MISSING_VERIFICATION_FIELDS', 'অর্ডার ট্র্যাকিংয়ের জন্য অর্ডার আইডি এবং ফোন নম্বর উভয়ই প্রদান করা আবশ্যক।');
  }

  var orderId = String(rawOrderId).trim().toUpperCase();
  var phone = normalizeBangladeshPhone(String(rawPhone).trim());

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var historySheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_STATUS_HISTORY);
  var couriersSheet = ss.getSheetByName(CONFIG.SHEETS.COURIERS);

  if (!ordersSheet) {
    return createResponse(false, null, 'DATABASE_UNAVAILABLE', 'ডাটাবেজ সংযোগে সমস্যা');
  }

  var orders = getRowsAsObjects(ordersSheet);
  var found = orders.find(function(o) {
    return String(o.OrderID).toUpperCase() === orderId;
  });

  if (!found) {
    return createResponse(false, null, 'ORDER_NOT_FOUND', 'প্রদত্ত তথ্য অনুযায়ী কোনো অর্ডার পাওয়া যায়নি।');
  }

  // Strict Phone verification: Must match normalized phone number
  var orderPhone = normalizeBangladeshPhone(String(found.Phone));
  if (orderPhone !== phone) {
    logSecurityEvent('SUSPICIOUS_TRACKING_ATTEMPT', { orderId: orderId, inputPhone: phone });
    return createResponse(false, null, 'ORDER_NOT_FOUND', 'প্রদত্ত তথ্য অনুযায়ী কোনো অর্ডার পাওয়া যায়নি।');
  }

  // Calculate Tracking URL based on priority
  // Priority: 1. Admin Custom Tracking URL, 2. Courier-generated Tracking URL, 3. Empty
  var effectiveTrackingUrl = "";
  var courierName = "";

  if (found.TrackingURL && String(found.TrackingURL).trim().indexOf("https://") === 0) {
    // 1. Admin Custom URL has highest priority
    effectiveTrackingUrl = String(found.TrackingURL).trim();
  }

  // Lookup courier
  if (found.CourierID && couriersSheet) {
    var couriers = getRowsAsObjects(couriersSheet);
    var courier = couriers.find(function(c) { return c.CourierID === found.CourierID; });
    if (courier) {
      courierName = courier.CourierName || "";
      // If no custom URL set, build from courier template if tracking number exists
      if (!effectiveTrackingUrl && found.TrackingNumber && courier.TrackingUrlTemplate) {
        effectiveTrackingUrl = courier.TrackingUrlTemplate.replace("[TRACKING_NUMBER]", encodeURIComponent(found.TrackingNumber));
      }
    }
  }

  // Status timeline from OrderStatusHistory
  var history = [];
  if (historySheet) {
    var allHistory = getRowsAsObjects(historySheet);
    history = allHistory.filter(function(h) { return h.OrderID === orderId; }).map(function(h) {
      return {
        status: h.NewStatus,
        timestamp: h.Timestamp,
        note: h.Note || ""
      };
    });
  }

  // Safe Public Response - NEVER EXPOSE admin notes, internal spreadsheet IDs or customer private notes
  return createResponse(true, {
    orderId: found.OrderID,
    invoiceId: found.InvoiceID,
    createdAt: found.CreatedAt,
    orderStatus: found.OrderStatus,
    paymentStatus: found.PaymentStatus,
    shippingStatus: found.ShippingStatus,
    customerName: found.CustomerName,
    maskedPhone: phone.substring(0, 3) + "****" + phone.substring(phone.length - 3),
    deliveryZone: found.DeliveryZone,
    subtotal: Number(found.Subtotal) || 0,
    deliveryCharge: Number(found.DeliveryCharge) || 0,
    discount: Number(found.Discount) || 0,
    grandTotal: Number(found.GrandTotal) || 0,
    courierName: courierName,
    trackingNumber: found.TrackingNumber || "",
    trackingUrl: effectiveTrackingUrl,
    shippingDate: found.ShippingDate || "",
    estimatedDeliveryDate: found.EstimatedDeliveryDate || "",
    statusTimeline: history
  });
}

// ADMIN SEARCH ORDERS BY PHONE (Only accessible to authenticated admins)
function handleAdminSearchOrdersByPhone(data, session) {
  var phone = normalizeBangladeshPhone(data.phone || data.searchPhone);
  if (!phone) {
    return createResponse(false, null, 'INVALID_PHONE', 'ফোন নম্বর প্রদান করুন');
  }

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var orders = getRowsAsObjects(ordersSheet);

  var matches = orders.filter(function(o) {
    var p = normalizeBangladeshPhone(o.Phone);
    var alt = normalizeBangladeshPhone(o.AlternativePhone || "");
    return p.indexOf(phone) !== -1 || (alt && alt.indexOf(phone) !== -1);
  });

  return createResponse(true, matches);
}

// ADMIN SET CUSTOM TRACKING URL
function handleAdminSetCustomTracking(data, session) {
  var orderId = data.orderId;
  var trackingUrl = String(data.trackingUrl || "").trim();
  var trackingNumber = String(data.trackingNumber || "").trim();
  var courierId = String(data.courierId || "").trim();

  if (!orderId) {
    return createResponse(false, null, 'INVALID_ORDER_ID', 'অর্ডার আইডি আবশ্যক');
  }

  // Enforce HTTPS
  if (trackingUrl && trackingUrl.indexOf("https://") !== 0) {
    return createResponse(false, null, 'INVALID_URL', 'ট্র্যাকিং লিঙ্ক অবশ্যই সুরক্ষিত https:// দিয়ে শুরু হতে হবে।');
  }

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var orders = getRowsAsObjects(ordersSheet);
  var order = orders.find(function(o) { return o.OrderID === orderId; });

  if (!order) {
    return createResponse(false, null, 'ORDER_NOT_FOUND', 'অর্ডার খুঁজে পাওয়া যায়নি');
  }

  var oldUrl = order.TrackingURL;
  order.TrackingURL = trackingUrl;
  if (trackingNumber) order.TrackingNumber = trackingNumber;
  if (courierId) order.CourierID = courierId;
  order.UpdatedAt = formatDhakaDate();
  order.UpdatedBy = session.username;

  updateRowInSheet(ordersSheet, order._rowIndex, order);

  logOrderAudit(orderId, session.username, 'SET_TRACKING_URL', 'TrackingURL', oldUrl, trackingUrl, data.note || 'Admin custom tracking assigned');

  return createResponse(true, {
    message: 'কাস্টম ট্র্যাকিং লিঙ্ক সফলভাবে সংরক্ষণ করা হয়েছে',
    orderId: orderId,
    trackingUrl: trackingUrl
  });
}
