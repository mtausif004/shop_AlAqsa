# Al Aqsa Burmese Shop — GitHub Pages Production Deployment

## What changed

The previous white-screen problem came from publishing the Vite/React **source**
files directly to GitHub Pages. Browsers cannot execute `src/main.tsx` as a
production application.

This rebuild uses:

**GitHub source → GitHub Actions → Vite build → dist/ → GitHub Pages → custom domain**

The Apps Script backend remains separate and is NOT hosted on localhost.

## 1. Keep your existing Apps Script

Do not delete the Google Spreadsheet or Apps Script project.

The frontend only needs the deployed Apps Script Web App URL.

## 2. Apps Script deployment

In Apps Script:

1. Deploy > New deployment.
2. Type: Web app.
3. Execute as: Me.
4. Access: Anyone.
5. Copy the `/exec` URL.

Example:

`https://script.google.com/macros/s/DEPLOYMENT_ID/exec`

Do not put Telegram bot tokens or passwords into the frontend.

## 3. GitHub Pages source

Push this entire project to the `main` branch.

Do NOT manually publish the repository root as the website.

The workflow `.github/workflows/deploy-pages.yml` builds `dist/` automatically.

## 4. Add the public API URL

GitHub repository:

Settings → Secrets and variables → Actions → Variables → New repository variable

Name:

`VITE_APPS_SCRIPT_URL`

Value:

your Apps Script `/exec` URL.

This URL is public configuration, not a secret.

## 5. Enable GitHub Pages

GitHub:

Settings → Pages

Build and deployment → Source:

**GitHub Actions**

Do not select “Deploy from a branch”.

## 6. Custom domain

Set the custom domain to:

`alaqsaburmeseshop.com`

The repository already contains:

`public/CNAME`

with the domain.

At your domain registrar, use the DNS records recommended by GitHub Pages.

## 7. Push

```bash
git add .
git commit -m "production: deploy via GitHub Pages"
git push origin main
```

Then open:

Actions

and wait for:

**Build and Deploy to GitHub Pages**

to finish successfully.

## 8. Important distinction

The website is NOT localhost.

After deployment:

- Customers use the public domain.
- Product data comes from Apps Script/Google Sheets when configured.
- Admin changes made through the backend can appear on the storefront on the next API fetch.
- Cart and UI preferences may use browser storage.
- Local browser storage is NOT the product database.

## 9. Demo products

The source still contains a small initial catalog as a safe read-only fallback so a temporary
API outage does not create a totally blank storefront.

For real production data, the Apps Script API is the authority.

When the API returns live products, the storefront uses the live data.

Do not treat the demo catalog as the real inventory.

## 10. Test after deployment

Check:

- `/`
- `/home`
- `/product/PICK-0001`
- `/category/pickle-chutney`
- `/cart`
- `/checkout`
- `/track-order`
- `/SecurePanel-Aqsa`

Also refresh each deep URL directly.

The GitHub Pages 404 fallback must return the app instead of a permanent 404.

## 11. If the site is still blank

Open browser DevTools → Console.

The first red error is the important one.

Also check:

GitHub → Actions → latest workflow → Build

and confirm:

`Production build verified.`

## 12. Security

Never store:

- Telegram bot token
- admin password
- password hash
- private spreadsheet credentials
- session secrets

in the frontend or GitHub repository.

Admin authentication must come from Apps Script.
