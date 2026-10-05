/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Security.gs
 * Rate Limiting, Input Sanitization, Audit Logging & Security Events
 * ============================================================
 */

function sanitizeInput(val) {
  if (val === null || val === undefined) return "";
  var str = String(val).trim();
  // Strip dangerous html script / events
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  str = str.replace(/javascript:/gi, "");
  str = str.replace(/vbscript:/gi, "");
  str = str.replace(/onload\s*=/gi, "");
  str = str.replace(/onerror\s*=/gi, "");
  return str;
}

function checkRateLimit(clientIdentifier, action) {
  try {
    var cache = CacheService.getScriptCache();
    var key = "rate_" + clientIdentifier + "_" + action;
    var count = cache.get(key);
    var num = count ? parseInt(count, 10) : 0;

    // Strict limits for sensitive endpoints
    var limit = 30; // 30 req/min default
    if (action === 'adminLogin') limit = 6; // max 6 attempts per minute
    if (action === 'createOrder') limit = 10;
    if (action === 'trackOrder') limit = 20;

    if (num >= limit) {
      return false;
    }

    cache.put(key, String(num + 1), 60); // 60 seconds TTL
    return true;
  } catch (e) {
    // If cache service is unavailable, do not block users
    return true;
  }
}

function logSecurityEvent(eventType, details) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG.SHEETS.SECURITY_EVENTS);
    if (!sheet) return;

    var sanitizedDetails = Object.assign({}, details);
    // Never log sensitive credentials
    delete sanitizedDetails.password;
    delete sanitizedDetails.token;
    delete sanitizedDetails.bot_token;

    appendObjectToSheet(sheet, {
      EventID: "SEC-" + Utilities.getUuid().substring(0, 8),
      EventType: eventType,
      Timestamp: formatDhakaDate(),
      Details: JSON.stringify(sanitizedDetails)
    });
  } catch (e) {
    Logger.log("Failed to log security event: " + e.toString());
  }
}

function logOrderAudit(orderId, adminId, action, field, oldValue, newValue, reason) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName(CONFIG.SHEETS.ORDER_AUDIT_LOG);
    if (!sheet) return;

    appendObjectToSheet(sheet, {
      AuditID: "AUD-" + Utilities.getUuid().substring(0, 8),
      OrderID: orderId,
      AdminID: adminId || "system",
      Timestamp: formatDhakaDate(),
      Action: action,
      Field: field,
      OldValue: String(oldValue),
      NewValue: String(newValue),
      Reason: reason || ""
    });
  } catch (e) {
    Logger.log("Failed to log order audit: " + e.toString());
  }
}
