import type { ApodEntry } from "../src/lib/fetchApod.ts";
import type { DailyRecord, Picture } from "../src/lib/types.ts";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { Vibrant } from "node-vibrant/node";

import { buildImageSrcSet } from "../src/lib/apod.ts";
import { APOD_API_URL } from "../src/lib/config.ts";
import { convertPaletteToPlainObjectArray } from "../src/components/Palette/utils/convertPaletteToPlainObjectArray.ts";
import { getFormattedDate } from "../src/lib/getFormattedDate.ts";
import { toPlainText } from "../src/lib/nasaHtml.ts";
import { SITE_NAME, SITE_URL } from "../src/lib/site.ts";
import { toPicture } from "../src/lib/fetchApod.ts";

import { renderOgImage } from "./og.tsx";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");
const WINDOW_SIZE = 25;
const IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1440px) 60vw, 880px";
const OG_FALLBACK = `${SITE_URL}/social/og.jpg`;
const FETCH_TIMEOUT_MS = 20000;

function resizeUrl(url: string, width: number) {
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith("/dynamicimage/")) {
      return url;
    }

    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("fit", "clip");
    return parsed.toString();
  } catch {
    return url;
  }
}

async function fetchBuffer(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`Image fetch failed: ${res.status} ${url}`);
  }

  return {
    buffer: Buffer.from(await res.arrayBuffer()),
    contentType: res.headers.get("content-type") ?? "image/jpeg",
  };
}

async function fetchEntries(): Promise<ApodEntry[]> {
  const params = new URLSearchParams({
    per_page: String(WINDOW_SIZE),
    _fields:
      "date,title,explanation,permalink,media_type,credit,copyright,alt,url,hdurl,basic_html",
  });
  const res = await fetch(`${APOD_API_URL}?${params}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`APOD listing failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as ApodEntry[];
}

async function extractPalette(picture: Picture) {
  try {
    const { buffer } = await fetchBuffer(resizeUrl(picture.imageUrl, 400));
    const palette = await Vibrant.from(buffer).maxDimension(400).getPalette();
    return convertPaletteToPlainObjectArray(palette);
  } catch (error) {
    console.error("::PRERENDER_PALETTE -", picture.date, error);
    return null;
  }
}

async function buildRecord(entry: ApodEntry, today: string): Promise<DailyRecord> {
  const picture = toPicture(entry);
  const palette = await extractPalette(picture);

  return {
    picture,
    error: null,
    palette,
    paletteFailed: palette == null,
    isLatest: picture.date >= today,
  };
}

async function buildOgImage(record: DailyRecord): Promise<string> {
  const picture = record.picture;
  if (!picture) {
    return OG_FALLBACK;
  }

  try {
    const { buffer, contentType } = await fetchBuffer(resizeUrl(picture.imageUrl, 1200));
    const png = await renderOgImage({
      title: picture.title,
      date: picture.date,
      colors: record.palette?.map((color) => color.hex) ?? [],
      imageDataUrl: `data:${contentType};base64,${buffer.toString("base64")}`,
    });

    await writeFile(join(DIST, "og", `${picture.date}.png`), png);
    return `${SITE_URL}/og/${picture.date}.png`;
  } catch (error) {
    console.error("::PRERENDER_OG -", picture.date, error);
    return OG_FALLBACK;
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildMeta(record: DailyRecord, canonical: string, ogImage: string) {
  const picture = record.picture;
  if (!picture) {
    return "";
  }

  const dateLabel = formatDate(picture.date);
  const title = `${dateLabel} · ${SITE_NAME}`;
  const description = picture.explanation
    ? toPlainText(picture.explanation).slice(0, 155) + "..."
    : `Color palette from NASA's Astronomy Picture of the Day on ${dateLabel}.`;

  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="article:published_time" content="${picture.date}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${ogImage}" />
  `;
}

function injectPage(shell: string, record: DailyRecord, canonical: string, ogImage: string) {
  const picture = record.picture;
  if (!picture) {
    return shell;
  }

  const meta = buildMeta(record, canonical, ogImage);
  let html = shell.replace(
    /<!-- META_START -->[\s\S]*?<!-- META_END -->/,
    `<!-- META_START -->${meta}<!-- META_END -->`,
  );

  const srcSet = buildImageSrcSet(picture.imageUrl);
  const preload = picture.imageUrl
    ? `<link rel="preload" as="image" href="${escapeHtml(picture.imageUrl)}"${
        srcSet ? ` imagesrcset="${escapeHtml(srcSet)}" imagesizes="${IMAGE_SIZES}"` : ""
      } fetchpriority="high" />`
    : "";

  html = html.replace("</head>", `    ${preload}\n  </head>`);

  const payload = JSON.stringify(record).replace(/</g, "\\u003c");
  html = html.replace("</body>", `    <script>window.__RECORD__ = ${payload};</script>\n  </body>`);

  return html;
}

async function writePage(date: string, html: string) {
  const dir = join(DIST, date);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), html);
}

function buildSitemap(records: DailyRecord[], newest: string) {
  const urls = [
    `<url><loc>${SITE_URL}/</loc><lastmod>${newest}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    ...records
      .filter((record) => record.picture)
      .map((record) => {
        const date = record.picture!.date;
        return `<url><loc>${SITE_URL}/${date}</loc><lastmod>${date}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`;
      }),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

async function main() {
  const today = getFormattedDate();
  const shell = await readFile(join(DIST, "index.html"), "utf8");

  if (!shell.includes("<!-- META_START -->")) {
    throw new Error("dist/index.html is missing the META_START marker");
  }

  const entries = await fetchEntries();
  if (entries.length === 0) {
    throw new Error("APOD listing returned no entries");
  }

  const records: DailyRecord[] = [];
  for (const entry of entries) {
    const record = await buildRecord(entry, today);
    records.push(record);
    console.log(`::PRERENDER - ${record.picture?.date} palette=${record.palette?.length ?? 0}`);
  }

  await mkdir(join(DIST, "og"), { recursive: true });

  const ogImages = new Map<string, string>();
  for (const record of records) {
    const picture = record.picture;
    if (!picture) {
      continue;
    }

    const ogImage = await buildOgImage(record);
    ogImages.set(picture.date, ogImage);

    const canonical = `${SITE_URL}/${picture.date}`;
    await writePage(picture.date, injectPage(shell, record, canonical, ogImage));
  }

  const newest = records.find((record) => record.picture);
  if (!newest?.picture) {
    throw new Error("APOD listing returned no usable picture");
  }

  const newestOg = ogImages.get(newest.picture.date) ?? OG_FALLBACK;
  await writeFile(
    join(DIST, "index.html"),
    injectPage(shell, newest, `${SITE_URL}/${newest.picture.date}`, newestOg),
  );

  await mkdir(join(DIST, "data"), { recursive: true });
  await writeFile(join(DIST, "data", "latest.json"), JSON.stringify(records));
  await writeFile(join(DIST, "sitemap.xml"), buildSitemap(records, newest.picture.date));

  console.log(`::PRERENDER - wrote ${records.length} pages, root -> ${newest.picture.date}`);
}

main().catch((error) => {
  console.error("::PRERENDER - failed:", error);
  process.exit(1);
});
