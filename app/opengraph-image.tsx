import { fetchApodImage, buildImageResponse, ogSize, ogContentType } from "@/app/lib/og-image";
import { SITE_NAME } from "@/app/lib/site";
import { getFormattedDate } from "@/app/utils/getFormattedDate";

export const runtime = "nodejs";
export const revalidate = 86400;
export const alt = `${SITE_NAME} generated palette from NASA's APOD`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return buildImageResponse(await fetchApodImage(getFormattedDate()));
}
