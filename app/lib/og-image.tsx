import { ImageResponse } from "next/og";
import { getDailyRecord } from "@/app/lib/getDailyRecord";
import { SITE_NAME } from "@/app/lib/site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

interface ApodImageData {
  dataUrl?: string;
  colors?: string[];
  title: string;
  date: string;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchImageDataUrl(url: string): Promise<{ dataUrl: string } | null> {
  try {
    const imgRes = await fetchWithTimeout(url, 8000);
    if (!imgRes.ok) {
      return null;
    }

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const mimeType = imgRes.headers.get("content-type") ?? "image/jpeg";
    const dataUrl = `data:${mimeType};base64,${buffer.toString("base64")}`;
    return { dataUrl };
  } catch {
    return null;
  }
}

export async function fetchApodImage(date: string): Promise<ApodImageData | null> {
  try {
    const { picture, palette } = await getDailyRecord(date);
    if (!picture) {
      return null;
    }

    const metadata: ApodImageData = {
      title: picture.title,
      date: picture.date,
      colors: palette?.map((color) => color.hex),
    };

    if (!picture.imageUrl) {
      return metadata;
    }

    const image = await fetchImageDataUrl(picture.imageUrl);
    if (!image) {
      return metadata; // keep metadata, drop image
    }

    return { ...metadata, ...image };
  } catch {
    return null;
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
    if (apod.colors?.length) {
      colors = apod.colors;
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
        // eslint-disable-next-line @next/next/no-img-element -- this tree is rendered by Satori, next/image cannot run there
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
