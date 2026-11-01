const ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  lt: "<",
  nbsp: " ",
  quot: '"',
};

// ? APOD text arrives as HTML with entities, so anything shown as plain text
//   needs decoding first or the page renders literal &#039;
export function decodeEntities(text: string) {
  return text.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity: string) => {
    if (entity.startsWith("#")) {
      const isHex = entity[1].toLowerCase() === "x";
      const code = Number.parseInt(isHex ? entity.slice(2) : entity.slice(1), isHex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

export function toPlainText(html: string) {
  const withoutTags = html.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "");
  return decodeEntities(withoutTags).replace(/\s+/g, " ").trim();
}

const EXPLANATION_PREFIX = /^\s*<strong>\s*Explanation:\s*<\/strong>\s*/i;
const NEXT_PICTURE = /<br\s*\/?>\s*<br\s*\/?>\s*<strong>\s*Tomorrow['’]s picture:\s*<\/strong>\s*([\s\S]*)$/i;
const LEADING_LINK = /^<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i;

export type NextPicture = { text: string; href: string | null };

// ? Every entry ends with a "Tomorrow's picture" link. It is navigation, not
//   part of the description, so it gets split out for a future affordance
export function splitExplanation(raw: string): { body: string; nextPicture: NextPicture | null } {
  const withoutPrefix = raw.replace(EXPLANATION_PREFIX, "");
  const match = withoutPrefix.match(NEXT_PICTURE);

  if (!match || match.index === undefined) {
    return { body: withoutPrefix.trim(), nextPicture: null };
  }

  const body = withoutPrefix.slice(0, match.index).trim();
  const tail = match[1].trim();
  const link = tail.match(LEADING_LINK);
  const nextPicture = link
    ? { text: toPlainText(link[2]), href: link[1] }
    : { text: toPlainText(tail), href: null };

  return { body, nextPicture };
}
