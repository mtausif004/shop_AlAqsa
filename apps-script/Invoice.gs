/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Invoice.gs
 * Server-Authorized Invoice Generator & Data Supplier
 * ============================================================
 */

function handleGetPublicInvoice(data) {
  var rawId = data.invoiceId || data.orderId || data.id;
  var rawPhone = data.phone || data.Phone;

  if (!rawId || !rawPhone) {
    return createResponse(false, null, 'MISSING_INVOICE_QUERY', 'ইনভয়েস দেখার জন্য ইনভয়েস/অর্ডার আইডি এবং গ্রাহকের ফোন নম্বর আবশ্যক।');
  }

  var searchId = String(rawId).trim().toUpperCase();
  var phone = normalizeBangladeshPhone(String(rawPhone).trim());

  var ss = getSpreadsheet();
  var ordersSheet = ss.getSheetByName(CONFIG.SHEETS.ORDERS);
  var itemsSheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_ITEMS);
  var couriersSheet = ss.getSheetByName(CONFIG.SHEETS.COURIERS);

  var orders = getRowsAsObjects(ordersSheet);
  var order = orders.find(function(o) {
    return String(o.OrderID).toUpperCase() === searchId || String(o.InvoiceID).toUpperCase() === searchId;
  });

  if (!order) {
    return createResponse(false, null, 'INVOICE_NOT_FOUND', 'ইনভয়েস পাওয়া যায়নি।');
  }

  // Verify Phone
  if (normalizeBangladeshPhone(order.Phone) !== phone) {
    logSecurityEvent('UNAUTHORIZED_INVOICE_ACCESS', { id: searchId, phone: phone });
    return createResponse(false, null, 'INVOICE_NOT_FOUND', 'ইনভয়েস পাওয়া যায়নি।');
  }

  var allItems = getRowsAsObjects(itemsSheet);
  var orderItems = allItems.filter(function(i) {
    return i.OrderID === order.OrderID;
  });

  var courierName = "";
  if (order.CourierID && couriersSheet) {
    var couriers = getRowsAsObjects(couriersSheet);
    var courier = couriers.find(function(c) { return c.CourierID === order.CourierID; });
    if (courier) courierName = courier.CourierName;
  }

  return createResponse(true, {
    shop: {
      name: CONFIG.SHOP_NAME,
      domain: CONFIG.OFFICIAL_DOMAIN,
      email: CONFIG.EMAIL,
      hotline: CONFIG.HOTLINE,
      bkash: CONFIG.BKASH_NUMBER,
      nagad: CONFIG.NAGAD_NUMBER,
      address: CONFIG.ADDRESS,
      location: CONFIG.LOCATION
    },
    invoice: {
      invoiceId: order.InvoiceID,
      orderId: order.OrderID,
      createdAt: order.CreatedAt,
      customerName: order.CustomerName,
      phone: order.Phone,
      alternativePhone: order.AlternativePhone || "",
      address: order.Address,
      district: order.District,
      area: order.Area,
      deliveryZone: order.DeliveryZone,
      customerNote: order.CustomerNote,
      paymentMethod: order.PaymentMethod,
      paymentStatus: order.PaymentStatus,
      orderStatus: order.OrderStatus,
      shippingStatus: order.ShippingStatus,
      subtotal: Number(order.Subtotal) || 0,
      deliveryCharge: Number(order.DeliveryCharge) || 0,
      discount: Number(order.Discount) || 0,
      grandTotal: Number(order.GrandTotal) || 0,
      courierName: courierName,
      trackingNumber: order.TrackingNumber || "",
      trackingUrl: order.TrackingURL || "",
      shippingDate: order.ShippingDate || "",
      estimatedDeliveryDate: order.EstimatedDeliveryDate || "",
      items: orderItems.map(function(item) {
        return {
          productId: item.ProductID,
          productName: item.ProductNameSnapshot,
          sku: item.SKU,
          quantity: Number(item.Quantity),
          unitPrice: Number(item.UnitPriceSnapshot),
          discount: Number(item.DiscountSnapshot),
          subtotal: Number(item.Subtotal),
          weight: item.Weight
        };
      })
    }
  });
}
