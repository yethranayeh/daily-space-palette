import { ImageResponse } from "next/og";
import { APOD_URL } from "@/app/config";
import { SITE_NAME } from "@/app/lib/site";
import { Vibrant } from "node-vibrant/node";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

interface ApodImageData {
  dataUrl?: string;
  buffer?: Buffer;
  title: string;
  date: string;
}

async function fetchImageBuffer(url: string): Promise<{ dataUrl: string; buffer: Buffer } | null> {
  try {
    const imgRes = await fetch(url);
    if (!imgRes.ok) {
      return null;
    }

    const imgBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(imgBuffer);
    const base64 = buffer.toString("base64");
    const mimeType = imgRes.headers.get("content-type") ?? "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${base64}`;
    return { dataUrl, buffer };
  } catch {
    return null;
  }
}

function resolveImageUrl(json: {
  media_type: string;
  url?: string;
  thumbnail_url?: string;
}): string | null {
  if (json.media_type !== "video") return json.url ?? null;

  // Prefer an explicit thumbnail from the API
  if (json.thumbnail_url) return json.thumbnail_url;

  // For YouTube, derive the thumbnail URL
  const url = json.url ?? "";
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return `https://i1.ytimg.com/vi/${url.split("/").at(-1)}/maxresdefault.jpg`;
  }

  // Self-hosted video with no thumbnail — nothing we can fetch
  return null;
}

export async function fetchApodImage(date: string): Promise<ApodImageData | null> {
  try {
    const res = await fetch(`${APOD_URL}?api_key=${process.env.NASA_API}&date=${date}`);
    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    if (json.code) {
      return null;
    }

    const metadata: ApodImageData = {
      title: json.title ?? "",
      date: json.date ?? "",
    };

    const imageUrl = resolveImageUrl(json);
    if (!imageUrl) {
      return metadata; // title/date intact, no image
    }

    const img = await fetchImageBuffer(imageUrl);
    if (!img) {
      return metadata; // same. keep metadata, drop image
    }

    return { ...metadata, ...img };
  } catch {
    return null;
  }
}

export async function extractPalette(buffer: Buffer): Promise<string[]> {
  try {
    const palette = await Vibrant.from(buffer).getPalette();
    const swatches = [
      palette.Vibrant,
      palette.Muted,
      palette.DarkVibrant,
      palette.DarkMuted,
      palette.LightVibrant,
    ]
      .filter((s) => s != null)
      .map((s) => s!.hex)
      .slice(0, 5);
    return swatches;
  } catch {
    return [];
  }
}

const FALLBACK_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

export async function buildImageResponse(apod: ApodImageData | null): Promise<ImageResponse> {
  let bgImage: string | undefined;
  let colors: string[] = [];
  let apodTitle = "";
  let dateLabel = "";

  if (apod) {
    bgImage = apod.dataUrl;
    apodTitle = apod.title;
    dateLabel = apod.date
      ? new Date(apod.date + "T00:00:00").toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";
    if (apod.buffer) {
      colors = await extractPalette(apod.buffer);
    }
  }

  if (colors.length === 0) {
    colors = FALLBACK_COLORS;
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0d0f18",
        position: "relative",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {bgImage && (
        <img
          src={bgImage}
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

          {apodTitle && (
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
              {apodTitle}
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ display: "flex", gap: "8px", borderRadius: "12px", overflow: "hidden" }}>
            {colors.map((color, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: "56px",
                  backgroundColor: color,
                  borderRadius:
                    i === 0 ? "12px 0 0 12px" : i === colors.length - 1 ? "0 12px 12px 0" : "0",
                }}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "14px",
                fontSize: "16px",
                fontFamily: "monospace",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.05em",
              }}
            >
              {colors.map((c, i) => (
                <span key={i}>{c}</span>
              ))}
            </div>

            {dateLabel && (
              <div
                style={{
                  fontSize: "16px",
                  fontFamily: "monospace",
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
    </div>,
    { width: 1200, height: 630 },
  );
}
