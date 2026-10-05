/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Coupons.gs
 * Server-Authoritative Coupon Verification & Discount Logic
 * ============================================================
 */

function verifyCouponInternal(code, orderSubtotal, phone) {
  if (!code) return { valid: false, discount: 0, reason: "কুপন কোড প্রদান করুন" };

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.COUPONS);
  if (!sheet) return { valid: false, discount: 0, reason: "কুপন পাওয়া যায়নি" };

  var cleanCode = String(code).trim().toUpperCase();
  var coupons = getRowsAsObjects(sheet);

  var coupon = coupons.find(function(c) {
    return String(c.Code).toUpperCase() === cleanCode && (c.Active === true || c.Active === "true" || c.Active === 1);
  });

  if (!coupon) {
    return { valid: false, discount: 0, reason: "অবৈধ কুপন কোড" };
  }

  var minOrder = Number(coupon.MinimumOrder) || 0;
  if (orderSubtotal < minOrder) {
    return { valid: false, discount: 0, reason: "এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳" + minOrder + " টাকার অর্ডার প্রয়োজন" };
  }

  var discountAmount = 0;
  var couponType = String(coupon.Type || "percentage").toLowerCase();
  var val = Number(coupon.Amount) || 0;
  var maxDisc = Number(coupon.MaximumDiscount) || 999999;

  if (couponType === "percentage" || couponType === "percent") {
    discountAmount = Math.round((orderSubtotal * val) / 100);
    if (discountAmount > maxDisc) discountAmount = maxDisc;
  } else {
    // Fixed amount
    discountAmount = Math.min(val, orderSubtotal);
  }

  return {
    valid: true,
    code: cleanCode,
    type: couponType,
    discount: discountAmount,
    message: "কুপন সফলভাবে প্রয়োগ করা হয়েছে! ছাড়: ৳" + discountAmount
  };
}

function handleValidateCoupon(data) {
  var code = data.code || data.couponCode;
  var subtotal = Number(data.subtotal) || 0;
  var phone = data.phone || "";

  var res = verifyCouponInternal(code, subtotal, phone);
  if (!res.valid) {
    return createResponse(false, null, 'INVALID_COUPON', res.reason);
  }

  return createResponse(true, {
    code: res.code,
    discount: res.discount,
    message: res.message
  });
}
