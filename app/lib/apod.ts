// ? The WordPress route takes YYMMDD, while the rest of the app speaks YYYY-MM-DD
export function toApiDate(date: string) {
  return date.replace(/-/g, "").slice(2);
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

    parsed.search = `?w=${maxWidth}&fit=clip`;
    return parsed.toString();
  } catch {
    return url;
  }
}
