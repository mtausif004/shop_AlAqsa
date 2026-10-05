/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script Web App - Code.gs
 * Complete Backend Router & API Dispatcher
 * ============================================================
 */

function doGet(e) {
  return handleRequest(e, 'GET');
}

function doPost(e) {
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  // CORS & Output headers setup
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var params = e && e.parameter ? e.parameter : {};
    var postData = null;

    if (e && e.postData && e.postData.contents) {
      try {
        postData = JSON.parse(e.postData.contents);
      } catch (err) {
        return createResponse(false, null, 'INVALID_JSON_PAYLOAD', 'অনুরোধের ডেটা সঠিক ফরম্যাটে নেই');
      }
    }

    var action = params.action || (postData && postData.action);

    if (!action) {
      return createResponse(false, null, 'MISSING_ACTION', 'কোন অ্যাকশন নির্দেশ করা হয়নি');
    }

    // IP or Identifier tracking for basic rate check
    var clientIdentifier = params.client_id || 'anonymous';
    if (!checkRateLimit(clientIdentifier, action)) {
      logSecurityEvent('RATE_LIMITED', { action: action, client: clientIdentifier });
      return createResponse(false, null, 'RATE_LIMITED', 'অতিরিক্ত অনুরোধের কারণে সাময়িক বিরতি দেওয়া হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।');
    }

    // -------------------------------------------------------------
    // ROUTE DISPATCHER
    // -------------------------------------------------------------
    switch (action) {
      // 1. PUBLIC ROUTES
      case 'ping':
        return createResponse(true, { message: 'Al Aqsa Burmese Shop API is live', time: new Date().toISOString() });

      case 'getPublicConfig':
        return handleGetPublicConfig();

      case 'getProducts':
        return handleGetProducts(params);

      case 'getProductById':
        return handleGetProductById(params.id || (postData && postData.id));

      case 'getCategories':
        return handleGetCategories();

      case 'getBanners':
        return handleGetBanners();

      case 'getOffers':
        return handleGetOffers();

      case 'getCombos':
        return handleGetCombos();

      case 'getReviews':
        return handleGetReviews(params.productId || (postData && postData.productId));

      case 'validateCoupon':
        return handleValidateCoupon(postData || params);

      case 'createOrder':
        return handleCreateOrder(postData);

      case 'trackOrder':
        return handleTrackOrder(postData || params);

      case 'getPublicInvoice':
        return handleGetPublicInvoice(postData || params);

      case 'submitReview':
        return handleSubmitReview(postData);

      // 2. ADMIN AUTHENTICATION
      case 'adminLogin':
        return handleAdminLogin(postData);

      case 'adminVerifySession':
        return handleAdminVerifySession(postData || params);

      case 'adminLogout':
        return handleAdminLogout(postData);

      case 'adminChangePassword':
        return requireAdminAuth(postData, handleChangeAdminCredentials);

      // 3. ADMIN PRODUCT MANAGEMENT
      case 'adminGetProducts':
        return requireAdminAuth(postData || params, handleAdminGetProducts);

      case 'adminSaveProduct':
        return requireAdminAuth(postData, handleAdminSaveProduct);

      case 'adminDeleteProduct':
        return requireAdminAuth(postData, handleAdminDeleteProduct);

      // 4. ADMIN ORDER MANAGEMENT
      case 'adminGetOrders':
        return requireAdminAuth(postData || params, handleAdminGetOrders);

      case 'adminGetOrderById':
        return requireAdminAuth(postData || params, handleAdminGetOrderById);

      case 'adminUpdateOrder':
        return requireAdminAuth(postData, handleAdminUpdateOrder);

      case 'adminUpdateOrderStatus':
        return requireAdminAuth(postData, handleAdminUpdateOrderStatus);

      case 'adminSearchOrdersByPhone':
        return requireAdminAuth(postData || params, handleAdminSearchOrdersByPhone);

      case 'adminSetCustomTracking':
        return requireAdminAuth(postData, handleAdminSetCustomTracking);

      // 5. ADMIN COURIERS & SETTINGS
      case 'adminGetCouriers':
        return requireAdminAuth(postData || params, handleAdminGetCouriers);

      case 'adminSaveCourier':
        return requireAdminAuth(postData, handleAdminSaveCourier);

      case 'adminGetAuditLogs':
        return requireAdminAuth(postData || params, handleAdminGetAuditLogs);

      case 'adminGetSecurityEvents':
        return requireAdminAuth(postData || params, handleAdminGetSecurityEvents);

      case 'adminGetSettings':
        return requireAdminAuth(postData || params, handleAdminGetSettings);

      case 'adminSaveSettings':
        return requireAdminAuth(postData, handleAdminSaveSettings);

      case 'adminTestTelegram':
        return requireAdminAuth(postData, handleAdminTestTelegram);

      case 'adminGetDiagnostics':
        return requireAdminAuth(postData || params, handleAdminGetDiagnostics);

      case 'setupInitializeDatabase':
        return handleInitializeDatabase(postData || params);

      default:
        return createResponse(false, null, 'UNKNOWN_ACTION', 'অনুরোধকৃত অ্যাকশনটি পাওয়া যায়নি: ' + action);
    }
  } catch (error) {
    Logger.log('Critical Error: ' + error.toString());
    return createResponse(false, null, 'SERVER_ERROR', 'সার্ভারে সাময়িক সমস্যা দেখা দিয়েছে: ' + error.message);
  }
}
