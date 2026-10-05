/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Auth.gs
 * Server-Side Admin Authentication, Password Hashing & Session Management
 * ============================================================
 */

function hashPassword(password, salt) {
  var raw = (salt || "ALAQSA_BURMESE_SALT_2026") + ":" + password;
  var signature = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, raw, Utilities.Charset.UTF_8);
  return signature.map(function(byte) {
    var v = (byte < 0 ? byte + 256 : byte).toString(16);
    return v.length === 1 ? "0" + v : v;
  }).join("");
}

function handleAdminLogin(data) {
  if (!data || !data.username || !data.password) {
    return createResponse(false, null, 'INVALID_CREDENTIALS', 'ব্যবহারকারীর নাম ও পাসওয়ার্ড উভয়ই প্রদান করুন');
  }

  var username = String(data.username).trim();
  var password = String(data.password).trim();

  var ss = getSpreadsheet();
  var adminSheet = ss.getSheetByName(CONFIG.SHEETS.ADMINS);

  // If Admins sheet is empty or does not exist, initialize with default
  var admins = adminSheet ? getRowsAsObjects(adminSheet) : [];
  if (admins.length === 0) {
    // Seed initial admin: mtausif004 / fkfk004
    var initialHash = hashPassword("fkfk004");
    if (adminSheet) {
      appendObjectToSheet(adminSheet, {
        AdminID: "ADM-0001",
        Username: "mtausif004",
        PasswordHash: initialHash,
        Role: "SUPER_ADMIN",
        Active: true,
        CreatedAt: formatDhakaDate(),
        UpdatedAt: formatDhakaDate(),
        LastLoginAt: ""
      });
      admins = getRowsAsObjects(adminSheet);
    }
  }

  // Find matching active admin
  var admin = admins.find(function(a) {
    return String(a.Username).toLowerCase() === username.toLowerCase() && (a.Active === true || a.Active === "true" || a.Active === 1);
  });

  if (!admin) {
    logSecurityEvent('LOGIN_FAILED_UNKNOWN_USER', { username: username });
    return createResponse(false, null, 'AUTH_FAILED', 'ভুল ব্যবহারকারীর নাম অথবা পাসওয়ার্ড');
  }

  var inputHash = hashPassword(password);
  if (admin.PasswordHash !== inputHash) {
    logSecurityEvent('LOGIN_FAILED_BAD_PASSWORD', { username: username, adminId: admin.AdminID });
    return createResponse(false, null, 'AUTH_FAILED', 'ভুল ব্যবহারকারীর নাম অথবা পাসওয়ার্ড');
  }

  // Generate strong random session token
  var token = Utilities.getUuid() + "-" + Utilities.getUuid();
  var sessionKey = "session_" + token;
  var sessionData = {
    adminId: admin.AdminID,
    username: admin.Username,
    role: admin.Role || "ADMIN",
    createdAt: new Date().getTime(),
    expiresAt: new Date().getTime() + (CONFIG.SESSION_DURATION_HOURS * 3600 * 1000)
  };

  // Cache session for up to 6 hours (21600 seconds) in CacheService
  var cache = CacheService.getScriptCache();
  cache.put(sessionKey, JSON.stringify(sessionData), 21600);

  // Update LastLoginAt in sheet
  if (admin._rowIndex && adminSheet) {
    admin.LastLoginAt = formatDhakaDate();
    updateRowInSheet(adminSheet, admin._rowIndex, admin);
  }

  logSecurityEvent('LOGIN_SUCCESS', { adminId: admin.AdminID, username: admin.Username });

  return createResponse(true, {
    token: token,
    adminId: admin.AdminID,
    username: admin.Username,
    role: admin.Role || "ADMIN",
    expiresAt: sessionData.expiresAt
  });
}

function validateSession(token) {
  if (!token) return null;
  try {
    var cache = CacheService.getScriptCache();
    var sessionJson = cache.get("session_" + token);
    if (!sessionJson) return null;
    var session = JSON.parse(sessionJson);
    if (new Date().getTime() > session.expiresAt) {
      cache.remove("session_" + token);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
}

function handleAdminVerifySession(data) {
  var token = data && (data.token || data.adminToken);
  var session = validateSession(token);
  if (!session) {
    return createResponse(false, null, 'SESSION_EXPIRED', 'অ্যাডমিন সেশনের মেয়াদ শেষ হয়েছে। পুনরায় লগইন করুন।');
  }
  return createResponse(true, {
    valid: true,
    adminId: session.adminId,
    username: session.username,
    role: session.role
  });
}

function handleAdminLogout(data) {
  var token = data && (data.token || data.adminToken);
  if (token) {
    CacheService.getScriptCache().remove("session_" + token);
  }
  return createResponse(true, { message: 'সফলভাবে লগআউট সম্পন্ন হয়েছে' });
}

function requireAdminAuth(data, callback) {
  var token = data && (data.token || data.adminToken);
  var session = validateSession(token);
  if (!session) {
    logSecurityEvent('UNAUTHORIZED_ACCESS_ATTEMPT', { action: (data && data.action) || 'unknown' });
    return createResponse(false, null, 'UNAUTHORIZED', 'এই কাজটি সম্পাদনের জন্য অ্যাডমিন লগইন প্রয়োজন');
  }
  return callback(data, session);
}

function handleChangeAdminCredentials(data, session) {
  if (!data || !data.newPassword) {
    return createResponse(false, null, 'INVALID_INPUT', 'নতুন পাসওয়ার্ড প্রদান করুন');
  }

  var newPassword = String(data.newPassword).trim();
  var newUsername = data.newUsername ? String(data.newUsername).trim() : null;

  if (newPassword.length < 6) {
    return createResponse(false, null, 'WEAK_PASSWORD', 'পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে');
  }

  var ss = getSpreadsheet();
  var adminSheet = ss.getSheetByName(CONFIG.SHEETS.ADMINS);
  var admins = getRowsAsObjects(adminSheet);
  var admin = admins.find(function(a) { return a.AdminID === session.adminId; });

  if (!admin) {
    return createResponse(false, null, 'ADMIN_NOT_FOUND', 'অ্যাডমিন অ্যাকাউন্ট খুঁজে পাওয়া যায়নি');
  }

  var oldUsername = admin.Username;
  admin.PasswordHash = hashPassword(newPassword);
  if (newUsername) {
    admin.Username = newUsername;
  }
  admin.UpdatedAt = formatDhakaDate();

  updateRowInSheet(adminSheet, admin._rowIndex, admin);

  // Invalidate all sessions by clearing current token
  CacheService.getScriptCache().remove("session_" + data.token);

  logSecurityEvent('CREDENTIALS_CHANGED', { adminId: admin.AdminID, oldUsername: oldUsername, newUsername: admin.Username });

  return createResponse(true, { message: 'ক্রেডেনশিয়াল সফলভাবে পরিবর্তন হয়েছে। অনুগ্রহ করে নতুন তথ্য দিয়ে লগইন করুন।' });
}
