/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Couriers.gs
 * Courier Management & Tracking URL Templates
 * ============================================================
 */

function handleAdminGetCouriers(data, session) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.COURIERS);
  if (!sheet) return createResponse(true, []);
  var rows = getRowsAsObjects(sheet);
  return createResponse(true, rows);
}

function handleAdminSaveCourier(data, session) {
  var courier = data.courier;
  if (!courier || !courier.CourierName) {
    return createResponse(false, null, 'INVALID_INPUT', 'কুরিয়ারের নাম আবশ্যক');
  }

  // Validate HTTPS
  if (courier.TrackingUrlTemplate && courier.TrackingUrlTemplate.indexOf("https://") !== 0) {
    return createResponse(false, null, 'INVALID_URL', 'ট্র্যাকিং টেমপ্লেট অবশ্যই https:// দিয়ে শুরু হতে হবে');
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.COURIERS);
  var rows = getRowsAsObjects(sheet);

  var isUpdate = Boolean(courier.CourierID);
  var courierId = isUpdate ? courier.CourierID : "CUR-" + ("00" + (rows.length + 1)).slice(-2);

  var rowData = {
    CourierID: courierId,
    CourierName: sanitizeInput(courier.CourierName),
    Website: sanitizeInput(courier.Website || ""),
    TrackingUrlTemplate: sanitizeInput(courier.TrackingUrlTemplate || ""),
    Phone: sanitizeInput(courier.Phone || ""),
    Active: courier.Active !== undefined ? Boolean(courier.Active) : true,
    UpdatedAt: formatDhakaDate()
  };

  if (isUpdate) {
    var existing = rows.find(function(r) { return r.CourierID === courierId; });
    if (!existing) return createResponse(false, null, 'NOT_FOUND', 'কুরিয়ার পাওয়া যায়নি');
    rowData.CreatedAt = existing.CreatedAt;
    updateRowInSheet(sheet, existing._rowIndex, rowData);
  } else {
    rowData.CreatedAt = formatDhakaDate();
    appendObjectToSheet(sheet, rowData);
  }

  logSecurityEvent('COURIER_SAVED', { courierId: courierId, admin: session.username });
  return createResponse(true, { courierId: courierId, message: 'কুরিয়ার সফলভাবে সংরক্ষণ করা হয়েছে' });
}
