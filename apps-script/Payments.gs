/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Payments.gs
 * Payment Methods & Verification Control
 * ============================================================
 */

function handleAdminUpdatePaymentStatus(data, session) {
  var orderId = data.orderId;
  var newPaymentStatus = data.paymentStatus;

  if (!orderId || !newPaymentStatus) {
    return createResponse(false, null, 'INVALID_INPUT', 'অর্ডার আইডি ও পেমেন্ট স্ট্যাটাস আবশ্যক');
  }

  if (CONFIG.PAYMENT_STATUSES.indexOf(newPaymentStatus) === -1) {
    return createResponse(false, null, 'INVALID_STATUS', 'অবৈধ পেমেন্ট স্ট্যাটাস');
  }

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var orders = getRowsAsObjects(ordersSheet);
  var order = orders.find(function(o) { return o.OrderID === orderId; });

  if (!order) return createResponse(false, null, 'NOT_FOUND', 'অর্ডার খুঁজে পাওয়া যায়নি');

  var oldStatus = order.PaymentStatus;
  order.PaymentStatus = newPaymentStatus;
  order.UpdatedAt = formatDhakaDate();
  order.UpdatedBy = session.username;

  updateRowInSheet(ordersSheet, order._rowIndex, order);

  logOrderAudit(orderId, session.username, 'PAYMENT_STATUS_CHANGE', 'PaymentStatus', oldStatus, newPaymentStatus, data.reason || '');

  return createResponse(true, { message: 'পেমেন্ট স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে', order: order });
}
