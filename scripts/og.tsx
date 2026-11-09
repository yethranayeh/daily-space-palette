import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

import { SITE_NAME } from "../src/lib/site.ts";

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const FALLBACK_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export interface OgInput {
  title: string;
  date: string;
  colors: string[];
  imageDataUrl?: string;
}

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 700;
  style: "normal";
};

let fontsPromise: Promise<OgFont[]> | null = null;

function loadFonts() {
  fontsPromise ??= Promise.all([
    readFile(fileURLToPath(new URL("./fonts/Inter-Regular.woff", import.meta.url))),
    readFile(fileURLToPath(new URL("./fonts/Inter-Bold.woff", import.meta.url))),
    readFile(fileURLToPath(new URL("./fonts/JetBrainsMono-Regular.woff", import.meta.url))),
  ]).then(
    ([regular, bold, mono]): OgFont[] => [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: bold, weight: 700, style: "normal" },
      { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
    ],
  );

  return fontsPromise;
}

function OgCard({
  title,
  dateLabel,
  colors,
  imageDataUrl,
}: {
  title: string;
  dateLabel: string;
  colors: string[];
  imageDataUrl?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d0f18",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Inter",
      }}
    >
      {imageDataUrl && (
        <img
          src={imageDataUrl}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
            filter: "blur(2px)",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(13,15,24,0.7) 0%, rgba(13,15,24,0.85) 40%, rgba(13,15,24,0.95) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "60px 70px",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "22px",
              fontWeight: 700,
              color: "#c4b5fd",
              letterSpacing: "0.02em",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#a78bfa",
              }}
            />
            {SITE_NAME}
          </div>

          {title && (
            <div
              style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.15,
                maxWidth: "800px",
                letterSpacing: "-0.01em",
              }}
            >
              {title}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", gap: "8px", borderRadius: "12px", overflow: "hidden" }}>
            {colors.map((color, index) => (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: "56px",
                  backgroundColor: color,
                  borderRadius:
                    index === 0
                      ? "12px 0 0 12px"
                      : index === colors.length - 1
                        ? "0 12px 12px 0"
                        : "0",
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                gap: "14px",
                fontSize: "16px",
                fontFamily: "JetBrains Mono",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.05em",
              }}
            >
              {colors.map((color, index) => (
                <span key={index}>{color}</span>
              ))}
            </div>

            {dateLabel && (
              <div
                style={{
                  fontSize: "16px",
                  fontFamily: "JetBrains Mono",
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {dateLabel}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function renderOgImage(input: OgInput): Promise<Buffer> {
  const colors = input.colors.length > 0 ? input.colors : FALLBACK_COLORS;
  const dateLabel = new Date(input.date + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const fonts = await loadFonts();

  const svg = await satori(
    <OgCard
      title={input.title}
      dateLabel={dateLabel}
      colors={colors}
      imageDataUrl={input.imageDataUrl}
    />,
    { width: OG_WIDTH, height: OG_HEIGHT, fonts },
  );

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: OG_WIDTH } });
  return resvg.render().asPng();
}
