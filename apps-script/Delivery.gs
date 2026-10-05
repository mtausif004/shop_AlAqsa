/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Delivery.gs
 * Delivery Charge Calculation Rules & Admin Overrides
 * ============================================================
 */

function calculateServerDeliveryFee(deliveryZone, district, subtotal) {
  var isCox = deliveryZone === "cox_bazar" ||
              (district && (district.toLowerCase().indexOf("cox") !== -1 || district.indexOf("কক্সবাজার") !== -1));

  if (isCox) {
    return subtotal < CONFIG.DELIVERY_RULES.COX_BAZAR_THRESHOLD ? CONFIG.DELIVERY_RULES.COX_BAZAR_FEE : 0;
  } else {
    return subtotal < CONFIG.DELIVERY_RULES.OUTSIDE_THRESHOLD ? CONFIG.DELIVERY_RULES.OUTSIDE_FEE : 0;
  }
}
