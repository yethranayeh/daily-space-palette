# Deploying Shades of Space

The site is a static Vite build served by Cloudflare Workers static assets. There are no Functions, no server runtime, and no secrets in the browser bundle.

## What runs where

- `npm run build` runs `vite build` and then `scripts/prerender.ts`.
- The prerender script fetches the latest 25 APOD entries, extracts their palettes, and writes:
  - `dist/index.html` (today's page),
  - `dist/{YYYY-MM-DD}.html` (one per recent date, with its own title, description, OG tags, preloaded image and embedded record),
  - `dist/og/{YYYY-MM-DD}.png` (the per-date social card),
  - `dist/data/latest.json` (the same records, for client-side navigation),
  - `dist/sitemap.xml`.
- `wrangler deploy` uploads `dist/` to Cloudflare. `wrangler.jsonc` sets `html_handling: "drop-trailing-slash"` so `/2026-11-09` serves `2026-11-09.html` without a redirect, and `not_found_handling: "single-page-application"` so any unknown path gets the SPA shell and React Router decides what to render.
- The GitHub Actions workflow runs on every push to `master`/`main`, daily at 05:30 UTC, and on manual dispatch.

## 1. Create the Cloudflare API token

1. Open the Cloudflare dashboard.
2. Go to **My Profile → API Tokens → Create Token**.
3. Use the **Edit Cloudflare Workers** template, or create a custom token with:
   - Account → Workers Scripts → Edit
   - Account → Account Settings → Read
   - Zone → Workers Routes → Edit (only needed for the custom domain)
   - Zone → Zone → Read (only needed for the custom domain)
4. Scope it to your account (and to `shadesof.space` if you use zone permissions).
   **Set the Workers resource to All Workers, not a list of existing scripts.**
   A token scoped to specific Workers can list scripts but returns
   `401 Unauthorized` on the assets upload, which is the step this site needs.
5. Create the token and copy it once. It is not shown again.

## 2. Find the account ID

- Dashboard → **Workers & Pages** → the account ID is in the right sidebar, or
- run `npx wrangler whoami` locally after `npx wrangler login`.

## 3. Put the values in GitHub

Repository → **Settings → Secrets and variables → Actions**.

### Repository secrets

These are sensitive and must be secrets:

| Name | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | The token from step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | The account ID from step 2 |

Add them under **Secrets → New repository secret**.

### Repository variable (optional)

This one is public because it ends up in the HTML, so it belongs under **Variables → New repository variable**:

| Name | Value |
| --- | --- |
| `CF_WEB_ANALYTICS_TOKEN` | The token from Cloudflare Web Analytics (step 4) |

If the variable is empty, the site simply does not load the analytics beacon. The build still works.

## 4. Cloudflare Web Analytics (optional)

1. Dashboard → **Analytics & Logs → Web Analytics**.
2. **Add a site**, enter `shadesof.space`, and choose the automatic setup.
3. Copy the beacon token.
4. Add it to GitHub as the `CF_WEB_ANALYTICS_TOKEN` variable (step 3).

The beacon is injected in `src/lib/analytics.ts` only when the token is present at build time. It is a plain static script, not a Worker.

## 5. First deploy

1. Push to `master` (or run the workflow manually from **Actions → deploy → Run workflow**).
2. The workflow runs lint, typecheck, tests, the build and `wrangler deploy`.
3. The first deploy prints a URL like `https://shades-of-space.<account>.workers.dev`. Open it and check:
   - `/` redirects to the latest date,
   - `/2026-11-09` shows the picture and palette,
   - `/og/2026-11-09.png` is the social card,
   - `/sitemap.xml` and `/robots.txt` resolve,
   - a garbage path renders the 404 view.

If the build step fails, the previous deployment stays live because the deploy step never runs. Fix and push again.

### If the deploy fails with 401 Unauthorized

```
POST /accounts/.../workers/assets/upload?base64=true -> 401 Unauthorized
```

The token is valid but cannot upload assets for this Worker. This happens when
the token is scoped to specific existing Workers, or when it has read-only
Workers access. Recreate the token with **Account → Workers Scripts → Edit** and
**All Workers** as the resource, then replace the `CLOUDFLARE_API_TOKEN` secret.

A token that can list scripts and read the account is not necessarily able to
deploy. The assets upload is the check that matters.

## 6. Custom domain

1. Dashboard → **Workers & Pages → shades-of-space → Settings → Domains & Routes → Add custom domain**.
2. Enter `shadesof.space`. Cloudflare creates the DNS record.
3. If `shadesof.space` is not already using Cloudflare DNS, add the site to Cloudflare and change the nameservers at your registrar (Porkbun) to the pair Cloudflare gives you. Cloudflare scans and imports the existing records, including MX if you use email on the domain.
4. Add `www.shadesof.space` too, or create a Redirect Rule from `www` to the apex.
5. Wait for the certificate to issue, then verify HTTPS.

Keep the Vercel deployment alive until the Cloudflare domain is verified. The `next-vercel` branch is the old app if you need to roll back.

## 7. Daily updates

The workflow's cron is `30 5 * * *` UTC:

- 00:30 EST during standard time,
- 01:30 EDT during daylight saving time.

NASA publishes at midnight Eastern, so this leaves a buffer. If a build runs before the new entry appears, the site keeps the previous day's picture and the next run picks it up. Use **Run workflow** to refresh manually.

## Local commands

```bash
npm run dev        # Vite dev server
npm run build      # static build + prerender (calls NASA)
npm run preview    # serve dist locally
npm run lint
npm run typecheck
npm test
npm run deploy     # wrangler deploy, after wrangler login
```

`npm run build` needs network access to `science.nasa.gov` and `assets.science.nasa.gov`. It does not need any API key.
