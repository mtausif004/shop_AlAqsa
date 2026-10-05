# Al Aqsa Burmese Shop | আল আকসা বার্মিজ শপ
## 100% Free Production Architecture & Deployment Guide

This project provides an enterprise-grade, zero-cost e-commerce platform designed specifically for **Al Aqsa Burmese Shop (Cox's Bazar, Bangladesh)**, operating entirely on 100% FREE services:
- **Frontend Hosting:** GitHub Pages (Static SPA with Deep-Link 404 Routing)
- **Domain:** `https://alaqsaburmeseshop.com`
- **Backend API:** Google Apps Script Web App (Server Authority & LockService)
- **Database:** Google Spreadsheet (16 Production Sheets)
- **Alerts:** Telegram Bot API
- **Invoices:** Client print / Save as PDF (`window.print()`)

---

### 1. Google Sheets Database Schema (16 Sheets)

Create a new Google Spreadsheet and name it `Al Aqsa Burmese Shop Database`. It contains 16 sheets with the following exact columns:

1. **`Orders`**: `OrderID`, `InvoiceID`, `CreatedAt`, `UpdatedAt`, `CustomerName`, `Phone`, `AlternativePhone`, `Address`, `District`, `Area`, `DeliveryZone`, `Subtotal`, `Discount`, `CouponDiscount`, `DeliveryCharge`, `GrandTotal`, `PaymentMethod`, `PaymentStatus`, `OrderStatus`, `ShippingStatus`, `CourierID`, `TrackingNumber`, `TrackingURL`, `ShippingDate`, `EstimatedDeliveryDate`, `CustomerNote`, `AdminNote`, `CreatedBy`, `UpdatedBy`
2. **`OrderItems`**: `OrderID`, `ProductID`, `ProductNameSnapshot`, `SKU`, `Quantity`, `UnitPriceSnapshot`, `DiscountSnapshot`, `Subtotal`, `Weight`, `CreatedAt`
3. **`Products`**: `ProductID`, `BengaliName`, `EnglishName`, `Brand`, `CategoryID`, `SubcategoryID`, `Description`, `ShortDescription`, `Price`, `MRP`, `Discount`, `Stock`, `SKU`, `Weight`, `Unit`, `Ingredients`, `Origin`, `Image1`, `Image2`, `Image3`, `Image4`, `Featured`, `BestSeller`, `Offer`, `Active`, `SEO_Title`, `SEO_Description`, `SEO_Keywords`, `CreatedAt`, `UpdatedAt`
4. **`Settings`**: `Key`, `Value`, `Description`, `UpdatedAt`
5. **`Admins`**: `AdminID`, `Username`, `PasswordHash`, `Role`, `Active`, `CreatedAt`, `UpdatedAt`, `LastLoginAt`
6. **`Coupons`**: `Code`, `Type`, `Amount`, `MinimumOrder`, `MaximumDiscount`, `UsageLimit`, `PerCustomerLimit`, `StartDate`, `EndDate`, `Active`
7. **`Banners`**: `BannerID`, `Title`, `Subtitle`, `CTA`, `Link`, `Image`, `Active`, `Order`, `Style`
8. **`Categories`**: `CategoryID`, `BengaliName`, `EnglishName`, `Slug`, `Subcategories`, `Image`, `Active`, `Order`
9. **`Offers`**: `OfferID`, `Title`, `Type`, `DiscountValue`, `ApplicableTo`, `Active`, `StartDate`, `EndDate`
10. **`Combos`**: `ComboID`, `Name`, `Description`, `ProductIDs`, `OriginalPrice`, `ComboPrice`, `Discount`, `Image`, `Active`
11. **`Reviews`**: `ReviewID`, `ProductID`, `CustomerName`, `Phone`, `Rating`, `Comment`, `Status`, `CreatedAt`
12. **`Couriers`**: `CourierID`, `CourierName`, `Website`, `TrackingUrlTemplate`, `Phone`, `Active`, `CreatedAt`, `UpdatedAt`
13. **`OrderStatusHistory`**: `OrderID`, `OldStatus`, `NewStatus`, `Timestamp`, `Admin`, `Note`
14. **`OrderAuditLog`**: `AuditID`, `OrderID`, `AdminID`, `Timestamp`, `Action`, `Field`, `OldValue`, `NewValue`, `Reason`
15. **`SecurityEvents`**: `EventID`, `EventType`, `Timestamp`, `Details`
16. **`LoginAttempts`**: `AttemptID`, `Username`, `IP`, `Status`, `Timestamp`

*Tip: You can automatically create all 16 sheets with headers by running `handleInitializeDatabase()` from Google Apps Script editor.*

---

### 2. Google Apps Script Web App Deployment

1. Open your Google Spreadsheet and go to **Extensions > Apps Script**.
2. Add the `.gs` files located in the `apps-script/` folder:
   - `Code.gs`
   - `Config.gs`
   - `Utils.gs`
   - `Security.gs`
   - `Auth.gs`
   - `Products.gs`
   - `Orders.gs`
   - `Delivery.gs`
   - `Tracking.gs`
   - `Couriers.gs`
   - `Coupons.gs`
   - `Reviews.gs`
   - `Settings.gs`
   - `Notifications.gs`
   - `Invoice.gs`
   - `Payments.gs`
3. In Apps Script, click the **Gear icon (Project Settings)**:
   - Scroll down to **Script Properties**
   - Click **Add script property** and add:
     - `SPREADSHEET_ID`: (Your Google Sheet ID from URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`)
     - `TELEGRAM_BOT_TOKEN`: `[YOUR_TELEGRAM_BOT_TOKEN]`
     - `TELEGRAM_CHAT_ID`: `[YOUR_TELEGRAM_CHANNEL_OR_GROUP_CHAT_ID]`
4. Click **Deploy > New deployment**:
   - Select type: **Web app**
   - Description: `Al Aqsa Burmese Shop API v2.0`
   - Execute as: **Me** (`your-email@gmail.com`)
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (`https://script.google.com/macros/s/.../exec`).

---

### 3. Frontend & GitHub Pages Deployment

1. In `.env` or in Admin Diagnostics at `/SecurePanel-Aqsa`:
   - Set `VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec`
2. Build the static distribution:
   ```bash
   npm run build
   ```
3. Push to your GitHub repository:
   - Go to **Settings > Pages**
   - Source: Deploy from branch `gh-pages` or `main` (folder `/dist` or root).
4. Custom Domain:
   - In GitHub Pages settings, enter custom domain: `alaqsaburmeseshop.com`
   - Configure DNS at your domain registrar:
     - CNAME: `alaqsaburmeseshop.com` pointing to `[username].github.io`
     - Or 4 A Records:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`
   - Enable **Enforce HTTPS**.

---

### 4. Admin Access & Initial Credentials

- Route: `/SecurePanel-Aqsa` (e.g. `https://alaqsaburmeseshop.com/SecurePanel-Aqsa`)
- Initial Username: `mtausif004`
- Initial Password: `fkfk004`
- **Important:** Once logged in, navigate to **অ্যাডমিন প্রোফাইল ও নিরাপত্তা** and change your password. Old sessions are immediately invalidated upon credential changes.

---

### 5. Telegram Bot Setup

1. Open Telegram and search for `@BotFather`.
2. Type `/newbot` and follow instructions to get your `TELEGRAM_BOT_TOKEN`.
3. Create a Telegram channel or group for order alerts (e.g. `Al Aqsa Orders`), add your bot as administrator.
4. Get your `TELEGRAM_CHAT_ID` by messaging `@userinfobot` or checking `https://api.telegram.org/bot<TOKEN>/getUpdates`.
5. Enter both values in Apps Script **Script Properties**.
