https://chanhdai.com/blog/tips-for-creating-beautiful-image-borders

Could help with image borders

---

## Areas for Improvement

- Derivative color palettes based on original picture theme
- "Tomorrow's picture" affordance
  - Shipped as a strip under the description, linking to `/{nextDay}`
  - Older entries have no teaser in the WordPress feed, and the latest page hides it, so it only appears on recent dated pages
- Displaying previous pictures (last week, this month, etc.)
  - switching theme when in specific picture page
- User login
  - saving favorites
- Placeholder entries: some early dates (e.g. 1995-06-16, 2000-01-01) return a generic `news-thumbnail.png`, so their palette is meaningless. Detect and show "no image available" instead.
- `/content/dam/` images ignore `?w=`, so those dates download full originals. A resizing proxy would fix the bandwidth, but adds a dependency.

## Deferred Decisions

- Real 404s (A)
  - The SPA always returns 200 for HTML, so invalid dates are soft 404s
  - A ~20-line Cloudflare Worker could validate `YYYY-MM-DD` and return 404
  - Revisit only if Search Console reports soft-404 noise
- Archive metadata snapshot (B)
  - 459 paginated requests, ~31 MB raw / ~9 MB gzipped, no palettes
  - Would make old dates work when NASA is down and allow per-date HTML for the whole archive
  - Not worth it for the current scope; the recent window plus client extraction covers the site
- Full-archive prerender (C)
  - 11.5k HTML files plus the snapshot; under the 20k file limit on the free Workers plan
  - Only worth it if archive SEO becomes a goal
- Cloudflare Pages instead of Workers static assets
  - Both are static; Workers leaves the door open for the validation Worker without changing hosts
