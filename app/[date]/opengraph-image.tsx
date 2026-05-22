import { fetchApodImage, buildImageResponse, ogSize, ogContentType } from "@/app/lib/og-image";
import { SITE_NAME } from "@/app/lib/site";

export const runtime = "nodejs";
export const alt = `${SITE_NAME} — Daily color palette from NASA's APOD`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return buildImageResponse(await fetchApodImage(date));
}
