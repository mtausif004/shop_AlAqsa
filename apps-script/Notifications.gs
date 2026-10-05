/**
 * ============================================================
 * AL AQSA BURMESE SHOP | আল আকসা বার্মিজ শপ
 * Google Apps Script - Notifications.gs
 * Secure Telegram Bot Alerts for Orders and System Events
 * ============================================================
 */

function sendTelegramOrderAlert(orderData) {
  var botToken = getProperty("TELEGRAM_BOT_TOKEN", "");
  var chatId = getProperty("TELEGRAM_CHAT_ID", "");

  if (!botToken || !chatId) {
    Logger.log("Telegram Bot Token or Chat ID not configured in Script Properties. Skipping alert.");
    return false;
  }

  try {
    var itemsText = (orderData.items || []).map(function(item, idx) {
      return "  " + (idx + 1) + ". " + item;
    }).join("\n");

    var message = "🛍️ *নতুন অর্ডার রিসিভ হয়েছে!* (Al Aqsa Burmese Shop)\n\n" +
      "🆔 *অর্ডার আইডি:* `" + orderData.orderId + "`\n" +
      "🧾 *ইনভয়েস:* `" + orderData.invoiceId + "`\n" +
      "👤 *গ্রাহক:* " + orderData.customerName + "\n" +
      "📞 *ফোন:* `" + orderData.phone + "`\n" +
      "📍 *ঠিকানা:* " + orderData.address + "\n\n" +
      "📦 *পণ্য তালিকা:*\n" + (itemsText || "  পণ্য তথ্য পাওয়া যায়নি") + "\n\n" +
      "💰 *সাবটোটাল:* ৳" + orderData.subtotal + "\n" +
      "🚚 *ডেলিভারি চার্জ:* ৳" + orderData.deliveryCharge + "\n" +
      (orderData.discount > 0 ? "🏷️ *ডিসকাউন্ট:* -৳" + orderData.discount + "\n" : "") +
      "💵 *সর্বমোট প্রদেয়:* ৳" + orderData.grandTotal + "\n" +
      "💳 *পেমেন্ট পদ্ধতি:* " + orderData.paymentMethod + "\n" +
      "⏰ *তারিখ:* " + formatDhakaDate() + "\n\n" +
      "👉 *অ্যাডমিন প্যানেল:* https://alaqsaburmeseshop.com/SecurePanel-Aqsa";

    var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
    var payload = {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
      disable_web_page_preview: true
    };

    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var resCode = response.getResponseCode();
    if (resCode >= 200 && resCode < 300) {
      return true;
    } else {
      Logger.log("Telegram API returned HTTP " + resCode + ": " + response.getContentText());
      return false;
    }
  } catch (e) {
    Logger.log("Error sending Telegram alert: " + e.toString());
    return false;
  }
}

function handleAdminTestTelegram(data, session) {
  var botToken = getProperty("TELEGRAM_BOT_TOKEN", "");
  var chatId = getProperty("TELEGRAM_CHAT_ID", "");

  if (!botToken || !chatId) {
    return createResponse(false, {
      configured: false
    }, 'TELEGRAM_NOT_CONFIGURED', 'টেলিগ্রাম বট টোকেন অথবা চ্যাট আইডি স্ক্রিপ্ট প্রোপার্টিজে কনফিগার করা নেই। Apps Script Settings থেকে সেট করুন।');
  }

  try {
    var url = "https://api.telegram.org/bot" + botToken + "/sendMessage";
    var payload = {
      chat_id: chatId,
      text: "✅ *Al Aqsa Burmese Shop*\nটেলিগ্রাম নোটিফিকেশন সিস্টেম সফলভাবে সংযুক্ত হয়েছে!\nঅ্যাডমিন: " + session.username + "\nসময়: " + formatDhakaDate(),
      parse_mode: "Markdown"
    };

    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(url, options);
    var resCode = response.getResponseCode();

    if (resCode === 200) {
      return createResponse(true, { configured: true, message: 'টেলিগ্রামে টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে।' });
    } else {
      return createResponse(false, { configured: true, httpStatus: resCode }, 'TELEGRAM_ERROR', 'টেলিগ্রাম বার্তা পাঠাতে ত্রুটি হয়েছে। দয়া করে Bot Token এবং Chat ID যাচাই করুন।');
    }
  } catch (e) {
    return createResponse(false, null, 'TELEGRAM_EXCEPTION', e.message);
  }
}
