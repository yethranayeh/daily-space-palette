import type { PlainPalette } from "@/components/Palette/utils/convertPaletteToPlainObjectArray";

export interface Picture {
  date: string;
  title: string;
  explanation: string;
  alt: string;
  credit: string;
  mediaType: "image" | "video";
  imageUrl: string;
  downloadUrl: string;
  permalink: string;
  videoUrl: string | null;
  embedUrl: string | null;
  nextPicture: { text: string; href: string | null } | null;
}

// ? Distinguishes a NASA outage from a bad date so the UI can say which is which
//   unreachable: timed out or network error
//   upstream:    NASA answered with a server error or rate limit (5xx / 429)
//   not-found:   NASA has no picture for that date
//   unknown:     anything else
export type PictureErrorReason = "unreachable" | "upstream" | "not-found" | "unknown";

export interface DailyRecord {
  picture: Picture | null;
  error: PictureErrorReason | null;
  palette: PlainPalette[] | null;
  paletteFailed: boolean;
  isLatest: boolean;
}
