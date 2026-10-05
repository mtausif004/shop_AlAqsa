/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Reviews.gs
 * Product Reviews & Moderation
 * ============================================================
 */

function handleGetReviews(productId) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.REVIEWS);
  if (!sheet) return createResponse(true, []);

  var rows = getRowsAsObjects(sheet);
  // Only APPROVED reviews are public
  var approved = rows.filter(function(r) {
    var isApproved = r.Status === "Approved" || r.Status === "approved";
    var matchesProduct = !productId || String(r.ProductID).toLowerCase() === String(productId).toLowerCase();
    return isApproved && matchesProduct;
  });

  var sanitized = approved.map(function(r) {
    return {
      reviewId: r.ReviewID,
      productId: r.ProductID,
      customerName: r.CustomerName,
      rating: Number(r.Rating) || 5,
      comment: r.Comment,
      createdAt: r.CreatedAt
    };
  });

  return createResponse(true, sanitized);
}

function handleSubmitReview(data) {
  if (!data || !data.productId || !data.customerName || !data.rating) {
    return createResponse(false, null, 'INVALID_INPUT', 'পর্যালোচনার জন্য নাম, রেটিং ও পণ্য নির্বাচন করুন');
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEETS.REVIEWS);
  if (!sheet) return createResponse(false, null, 'ERROR', 'ডাটাবেজ সমস্যা');

  var newReview = {
    ReviewID: "REV-" + Utilities.getUuid().substring(0, 8),
    ProductID: sanitizeInput(data.productId),
    CustomerName: sanitizeInput(data.customerName),
    Phone: data.phone ? normalizeBangladeshPhone(data.phone) : "",
    Rating: Math.min(5, Math.max(1, parseInt(data.rating, 10) || 5)),
    Comment: sanitizeInput(data.comment || ""),
    Status: "Pending", // Requires Admin Approval
    CreatedAt: formatDhakaDate()
  };

  appendObjectToSheet(sheet, newReview);
  return createResponse(true, { message: 'আপনার মূল্যবান মতামত জমা হয়েছে। অ্যাডমিন কর্তৃক যাচাইয়ের পর এটি প্রদর্শিত হবে।' });
}
