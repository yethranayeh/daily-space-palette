// ? The WordPress route takes YYMMDD, while the rest of the app speaks YYYY-MM-DD
export function toApiDate(date: string) {
  return date.replace(/-/g, "").slice(2);
}

const SRCSET_WIDTHS = [640, 960, 1280, 1600];

function withWidth(url: URL, width: number) {
  const next = new URL(url.toString());
  // ? Dropping h/crop keeps the aspect ratio the card renders, which is the
  //   same trade the old single-width cap made
  next.search = `?w=${width}&fit=clip`;
  return next.toString();
}

// ? Only /dynamicimage/ paths honor ?w=; every other asset URL passes through
export function capImageWidth(url: string, maxWidth: number) {
  if (!url) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith("/dynamicimage/")) {
      return url;
    }

    const requested = Number(parsed.searchParams.get("w"));
    if (!Number.isFinite(requested) || requested <= maxWidth) {
      return url;
    }

    return withWidth(parsed, maxWidth);
  } catch {
    return url;
  }
}

// ? The same CDN rule applies to srcset: only /dynamicimage/ can serve other
//   widths, so anything else falls back to a single src
export function buildImageSrcSet(url: string, widths = SRCSET_WIDTHS) {
  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.pathname.startsWith("/dynamicimage/")) {
      return undefined;
    }

    return widths.map((width) => `${withWidth(parsed, width)} ${width}w`).join(", ");
  } catch {
    return undefined;
  }
}
