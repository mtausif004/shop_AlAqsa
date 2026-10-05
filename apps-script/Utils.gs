/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Utils.gs
 * Helpers for Response formatting, Date, Data sanitization
 * ============================================================
 */

function createResponse(success, data, code, errorMsg) {
  var payload = {
    success: Boolean(success),
    timestamp: new Date().toISOString()
  };

  if (success) {
    payload.data = data;
  } else {
    payload.error = errorMsg || 'অনাকাঙ্ক্ষিত সমস্যা দেখা দিয়েছে';
    payload.code = code || 'ERROR';
  }

  var output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

function getSheetHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

function getRowsAsObjects(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  var data = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

  return data.map(function(row, rowIndex) {
    var obj = { _rowIndex: rowIndex + 2 };
    for (var i = 0; i < headers.length; i++) {
      var key = headers[i];
      if (key) {
        obj[key] = row[i];
      }
    }
    return obj;
  });
}

function appendObjectToSheet(sheet, obj) {
  var headers = getSheetHeaders(sheet);
  if (headers.length === 0) return false;

  var row = headers.map(function(header) {
    return obj[header] !== undefined ? obj[header] : "";
  });

  sheet.appendRow(row);
  return true;
}

function updateRowInSheet(sheet, rowIndex, obj) {
  var headers = getSheetHeaders(sheet);
  var rowValues = headers.map(function(header) {
    return obj[header] !== undefined ? obj[header] : "";
  });
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([rowValues]);
}

function formatDhakaDate(date) {
  return Utilities.formatDate(date || new Date(), "GMT+6", "yyyy-MM-dd HH:mm:ss");
}

function formatDhakaDateOnly(date) {
  return Utilities.formatDate(date || new Date(), "GMT+6", "yyyyMMdd");
}

// Bangladesh Phone Validator
function isValidBangladeshPhone(phone) {
  if (!phone) return false;
  var cleaned = String(phone).replace(/[\s\-\(\)]/g, "");
  // Matches 01XXXXXXXXX or +8801XXXXXXXXX or 8801XXXXXXXXX
  var regex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return regex.test(cleaned);
}

function normalizeBangladeshPhone(phone) {
  var cleaned = String(phone).replace(/[\s\-\(\)]/g, "");
  if (cleaned.indexOf("+88") === 0) cleaned = cleaned.substring(3);
  else if (cleaned.indexOf("88") === 0 && cleaned.length === 13) cleaned = cleaned.substring(2);
  return cleaned;
}
