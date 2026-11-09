# AGENTS.md

This file provides guidance to coding agents working in this repository.

## Commands

```bash
npm run dev        # Vite dev server (localhost:5173)
npm run build      # vite build, then scripts/prerender.ts
npm run preview    # serve dist locally
npm run lint       # ESLint 9 flat config
npm run typecheck  # tsc --noEmit
npm test           # Node test runner over tests/*.test.ts, via tsx
npm run deploy     # wrangler deploy (needs wrangler login)
```

`npm run build` calls NASA, so it needs network access. It does not need credentials.

## Tech stack

| Package | Version | Notes |
|---|---|---|
| Vite | **8** | Static build. No SSR and no server runtime. |
| React | **19.2** | Client-only. `StrictMode` is on. |
| React Router | **7** | Declarative `BrowserRouter`, `Routes`, `Link`, `useParams`. |
| Tailwind CSS | **4** | CSS-first config via `@theme inline` in `src/styles/globals.css`. No `tailwind.config.*`. The Vite plugin is `@tailwindcss/vite`. |
| TypeScript | **5** | `moduleResolution: bundler`, `allowImportingTsExtensions` for the tests. |
| ESLint | **9** (flat config) | `eslint.config.mjs` uses `typescript-eslint` and `eslint-plugin-react-hooks`. |
| node-vibrant | **4** | `node-vibrant/browser` in the app, `node-vibrant/node` in the prerender script. |
| Satori + `@resvg/resvg-js` | **0.63 / 2.6** | Per-date OG images, generated at build time. |
| Cloudflare Workers static assets | - | `wrangler.jsonc`, `not_found_handling: "single-page-application"`. |

### Tailwind CSS 4 — working rules

- **No JS config file.** `tailwind.config.*` does not exist and must not be created.
- **Entry point.** `@import "tailwindcss"` in `src/styles/globals.css`.
- **Content scanning is automatic** — no `content` array.
- **Adding design tokens.** Add to the `@theme inline` block. Use `inline` because the values reference runtime CSS variables that change with the theme.
- **Adding custom utilities.** Use `@utility` at the top level, not `@layer utilities`.
- **Utility renames in v4**: `rounded-sm`→`rounded-xs`, `shadow-sm`→`shadow-xs`, `outline-none`→`outline-hidden`. The bare `ring` class is 1px — use `ring-3` for the old 3px default.
- **Opacity modifiers** (`bg-surface/50`, `text-ink/50`) still work via `color-mix()`.

## Code style

Grounded in readability over cleverness. No "l33tcoder" patterns. Match the look of the existing codebase — a human wrote it, not an assistant narrating itself.

- **No em dashes (`—`) in code comments.** Use a hyphen `-` or restructure the sentence. Em dashes in prose/documentation are fine.
- **No single-line guard returns.** Always brace the body on its own line:
  ```ts
  // bad
  if (!apod) return null;

  // good
  if (!apod) {
    return null;
  }
  ```
- **Comments explain *why*, not *what*.** If the code already says it, delete the comment.
  - Bad: `// palette generation failed - show the picture without colors` under a `catch {}` that is self-evident.
  - Good: `// Only /dynamicimage/ paths honor ?w=`, `// ? NASA APOD updates at midnight Eastern Time`.
  - Keep the existing marker style (`// TODO:`, `// ?`, `// !`) for notes and caveats.
  - No JSX comments that narrate the obvious.
- **Import order:** `import type` lines first, blank line, then value imports grouped (external, then `@/`, then relative).
- **No AI tells in the diff.** No "Here's the updated code…", no end-of-file summary comments, no restating the change in a comment. The commit message carries the narrative.

### Final review step (mandatory)

Before declaring work done, re-read **every changed hunk** and verify none of the following slipped in:

1. em dashes inside code comments,
2. single-line `if (x) return …;` guards,
3. comments that restate what the code already does,
4. verbose JSX comments that label the obvious,
5. AI-tell phrasing anywhere in the diff,
6. `import type` placed after value imports.

Then run `npm run lint` and `npm run typecheck`. Both must pass. If a failure is **pre-existing** and not from your change, call it out explicitly — do not silently "fix" unrelated issues.

## Architecture

**Shades of Space** is a static SPA that shows NASA's Astronomy Picture of the Day (APOD) for a date and a color palette extracted from the image.

### Data flow

1. `index.html` loads `src/main.tsx`, which mounts `App`.
2. `App` renders `BrowserRouter` with three routes: `/`, `/:date`, `*`.
3. `/` reads the embedded record (if the page was prerendered) or today's date in `America/New_York`, then redirects to `/:date` with `replace`.
4. `DateRoute` validates the date, then:
   - uses `window.__RECORD__` when the prerendered record matches the date,
   - otherwise reads `localStorage`,
   - otherwise reads `/data/latest.json` (the recent window from the build),
   - otherwise fetches NASA and extracts the palette in the browser.
5. `SpacePaletteLayout` renders the picture card, the palette, the date pagination and the error alerts.
6. `applyRecordMeta` keeps the document title, description and canonical link correct during client-side navigation.

### The source

- APOD: `https://science.nasa.gov/wp-json/wp/v2/apod-basic/{YYMMDD}`, keyless, CORS-enabled, 25 entries per page max.
- Images: `assets.science.nasa.gov`, CORS `*`. `?w=` is honored **only** on `/dynamicimage/` paths; `/content/dam/` returns the full original, so `buildImageSrcSet` only adds a srcset for `/dynamicimage/`.
- Videos: the real source lives in `basic_html`; `hdurl` is the poster.

### Build-time prerender

`scripts/prerender.ts` runs after `vite build`:

1. Fetches the latest 25 entries.
2. Fetches each image, extracts a palette with `node-vibrant/node` at `maxDimension(400)`.
3. Writes `dist/{date}.html` with per-date title, description, OG/Twitter tags, canonical, image preload and `window.__RECORD__`.
4. Writes `dist/og/{date}.png` with Satori + `@resvg/resvg-js` (1200×630, fonts in `scripts/fonts/`).
5. Writes `dist/data/latest.json`, `dist/sitemap.xml`, and `dist/index.html` for the newest record.

If the script fails, the workflow fails and the previous deployment stays live. Individual image or OG failures are logged and degrade to the fallback image; they do not fail the build.

### Key details

- `node-vibrant/browser` is a dynamic import, so only archive dates download the extraction chunk.
- `localStorage` cache (`src/lib/cache.ts`): past dates never expire, today expires after 5 minutes, failures after 60 seconds, capped at 100 entries.
- `src/lib/latest.ts` fetches `/data/latest.json` once per session so navigation inside the prerendered window does not call NASA.
- `public/robots.txt` points at `https://shadesof.space/sitemap.xml`.
- `src/lib/meta.ts` updates meta tags on the client; the prerender script writes the same tags for crawlers.
- The SPA always returns HTTP 200 for HTML. Invalid dates render the 404 view (soft 404). A validation Worker is the deliberate next step if that matters.
- `wrangler.jsonc` has no `main`; it is assets-only. `html_handling: "drop-trailing-slash"` makes `/date` serve `date.html` without a redirect.

## Environment

No API key is used. `NASA_API` in `.env.local` is a leftover and is not read.

```
VITE_CF_BEACON_TOKEN=optional_cloudflare_web_analytics_token
```

The token is public (it ends up in the HTML) and is injected by `src/lib/analytics.ts`. Without it, analytics is skipped.

## Deployment

See `DEPLOY.md` for the Cloudflare token, the GitHub secrets/variables, the first deploy and the custom domain.
