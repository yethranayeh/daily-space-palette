import type { ReactNode } from "react";

import { Fragment, createElement } from "react";

import { decodeEntities } from "@/app/lib/nasaHtml";

const ALLOWED_TAGS = new Set(["a", "b", "br", "em", "strong"]);
const TOKEN = /<(\/?)([a-z][a-z0-9]*)([^>]*)>|([^<]+)/gi;

type Frame = {
  tag: string;
  props: Record<string, string>;
  children: ReactNode[];
};

function linkProps(rawAttrs: string): Record<string, string> {
  const href = rawAttrs.match(/href\s*=\s*"([^"]*)"/i)?.[1] ?? rawAttrs.match(/href\s*=\s*'([^']*)'/i)?.[1];

  // ? Everything else in NASA's markup is dropped, so only http(s) links survive
  if (!href || !/^https?:\/\//i.test(href)) {
    return {};
  }

  return { href, target: "_blank", rel: "noopener noreferrer" };
}

// ? NASA ships a handful of inline tags and no scripts. This walks the markup
//   and rebuilds only the allowlisted elements, so no raw HTML reaches the page
export function NasaRichText({ html }: { html: string }) {
  const root: ReactNode[] = [];
  const stack: Frame[] = [{ tag: "", props: {}, children: root }];
  let key = 0;

  const current = () => stack[stack.length - 1];

  for (const match of html.matchAll(TOKEN)) {
    const [, closing, rawTag, rawAttrs, text] = match;

    if (text) {
      current().children.push(decodeEntities(text));
      continue;
    }

    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) {
      continue;
    }

    if (closing) {
      if (current().tag !== tag) {
        continue;
      }

      const frame = stack.pop();
      if (!frame) {
        continue;
      }

      current().children.push(
        createElement(frame.tag, { key: key++, ...frame.props }, ...frame.children),
      );
      continue;
    }

    if (tag === "br") {
      current().children.push(createElement("br", { key: key++ }));
      continue;
    }

    stack.push({ tag, props: tag === "a" ? linkProps(rawAttrs ?? "") : {}, children: [] });
  }

  while (stack.length > 1) {
    const frame = stack.pop();
    if (!frame) {
      break;
    }

    current().children.push(
      createElement(frame.tag, { key: key++, ...frame.props }, ...frame.children),
    );
  }

  return <Fragment>{root}</Fragment>;
}
