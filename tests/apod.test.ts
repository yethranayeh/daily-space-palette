import assert from "node:assert/strict";
import { describe, it } from "node:test";

// ? Node's native TypeScript support requires the extension; tsc allows it
//   through allowImportingTsExtensions
import { buildImageSrcSet, capImageWidth, toApiDate } from "../src/lib/apod.ts";

describe("toApiDate", () => {
  it("formats a dated URL segment as YYMMDD", () => {
    assert.equal(toApiDate("2026-11-01"), "261101");
  });

  it("keeps two-digit years from the archive", () => {
    assert.equal(toApiDate("1995-06-16"), "950616");
  });
});

describe("capImageWidth", () => {
  const maxWidth = 1600;
  const prefix =
    "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/";

  it("caps wide dynamic images and drops the other size params", () => {
    const url = `${prefix}CepheusFlare_Tondinelli.jpg?w=6000&h=4076&fit=clip&crop=faces%2Cfocalpoint`;

    assert.equal(
      capImageWidth(url, maxWidth),
      `${prefix}CepheusFlare_Tondinelli.jpg?w=1600&fit=clip`,
    );
  });

  it("leaves images at or below the cap untouched", () => {
    const url = `${prefix}MoonColors_Pace_960.jpg?w=960&h=991&fit=clip`;

    assert.equal(capImageWidth(url, maxWidth), url);
  });

  it("leaves an image exactly at the cap untouched", () => {
    const url = `${prefix}image.jpg?w=1600`;

    assert.equal(capImageWidth(url, maxWidth), url);
  });

  it("leaves /content/dam/ URLs untouched even when wide", () => {
    const url =
      "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/image.jpg?w=6000";

    assert.equal(capImageWidth(url, maxWidth), url);
  });

  it("ignores a non-numeric width", () => {
    const url = `${prefix}image.jpg?w=wide`;

    assert.equal(capImageWidth(url, maxWidth), url);
  });

  it("does nothing when the URL has no width", () => {
    const url = `${prefix}image.jpg?h=4076`;

    assert.equal(capImageWidth(url, maxWidth), url);
  });

  it("returns empty and invalid URLs as-is", () => {
    assert.equal(capImageWidth("", maxWidth), "");
    assert.equal(capImageWidth("not a url", maxWidth), "not a url");
  });
});

describe("buildImageSrcSet", () => {
  const prefix =
    "https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/october/";

  it("builds one entry per width and drops the other size params", () => {
    const url = `${prefix}CepheusFlare_Tondinelli.jpg?w=6000&h=4076&fit=clip`;

    assert.equal(
      buildImageSrcSet(url, [640, 1280]),
      `${prefix}CepheusFlare_Tondinelli.jpg?w=640&fit=clip 640w, ${prefix}CepheusFlare_Tondinelli.jpg?w=1280&fit=clip 1280w`,
    );
  });

  it("returns undefined for /content/dam/ images", () => {
    const url =
      "https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/image.jpg?w=6000";

    assert.equal(buildImageSrcSet(url), undefined);
  });

  it("returns undefined for empty and invalid URLs", () => {
    assert.equal(buildImageSrcSet(""), undefined);
    assert.equal(buildImageSrcSet("not a url"), undefined);
  });
});
