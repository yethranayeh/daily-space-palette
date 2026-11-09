import type { DailyRecord } from "./types";

import { toPlainText } from "./nasaHtml";
import { SITE_NAME, SITE_URL } from "./site";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }

  element.href = url;
}

// ? Prerendered pages already carry these tags; this keeps client-side
//   navigation from leaving the previous date's title and description behind
export function applyRecordMeta(date: string, record: DailyRecord | null) {
  const picture = record?.picture;
  const dateLabel = picture?.date
    ? new Date(picture.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : date;
  const title = `${dateLabel} · ${SITE_NAME}`;
  const description = picture?.explanation
    ? toPlainText(picture.explanation).slice(0, 155) + "..."
    : `Color palette from NASA's Astronomy Picture of the Day on ${dateLabel}.`;
  const url = `${SITE_URL}/${date}`;

  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);
  setCanonical(url);
}
