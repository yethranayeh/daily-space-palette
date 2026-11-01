import assert from "node:assert/strict";
import { describe, it } from "node:test";

// ? Node's native TypeScript support requires the extension; tsc allows it
//   through allowImportingTsExtensions
import { splitExplanation } from "../app/lib/nasaHtml.ts";

const TEASER = "<br><br><strong>Tomorrow's picture: </strong>";

describe("splitExplanation", () => {
  it("strips the Explanation label and splits the teaser", () => {
    const { body, nextPicture } = splitExplanation(
      `<strong>Explanation:</strong> A colorful Moon.${TEASER}<a href="https://apod.com/fap/ap261102.html">open space</a>`,
    );

    assert.equal(body, "A colorful Moon.");
    assert.deepEqual(nextPicture, {
      text: "open space",
      href: "https://apod.com/fap/ap261102.html",
    });
  });

  it("handles the label with a trailing space", () => {
    const { body } = splitExplanation("<strong>Explanation: </strong> A colorful Moon.");

    assert.equal(body, "A colorful Moon.");
  });

  it("handles a curly apostrophe in the teaser", () => {
    const { nextPicture } = splitExplanation(
      `A colorful Moon.<br><br><strong>Tomorrow’s picture: </strong><a href="https://example.com">many moons</a>`,
    );

    assert.equal(nextPicture?.text, "many moons");
  });

  it("handles self-closing line breaks", () => {
    const { body, nextPicture } = splitExplanation(
      `Text.<br /><br /><strong>Tomorrow's picture: </strong><a href="https://example.com">next</a>`,
    );

    assert.equal(body, "Text.");
    assert.equal(nextPicture?.href, "https://example.com");
  });

  it("returns teaser text without a link", () => {
    const { body, nextPicture } = splitExplanation(`A spooky night.${TEASER}many moons`);

    assert.equal(body, "A spooky night.");
    assert.deepEqual(nextPicture, { text: "many moons", href: null });
  });

  it("keeps the body when there is no teaser", () => {
    const { body, nextPicture } = splitExplanation(
      "<strong>Explanation:</strong> Just the picture.",
    );

    assert.equal(body, "Just the picture.");
    assert.equal(nextPicture, null);
  });

  it("decodes entities in the teaser text", () => {
    const { nextPicture } = splitExplanation(
      `Text.${TEASER}<a href="https://example.com">Moons &amp; &#039;stars&#039;</a>`,
    );

    assert.equal(nextPicture?.text, "Moons & 'stars'");
  });

  it("trims whitespace from the body", () => {
    const { body } = splitExplanation("<strong>Explanation:</strong>\n  Text.\n  ");

    assert.equal(body, "Text.");
  });

  it("returns an empty body for an empty string", () => {
    const { body, nextPicture } = splitExplanation("");

    assert.equal(body, "");
    assert.equal(nextPicture, null);
  });
});
