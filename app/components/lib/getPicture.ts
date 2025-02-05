import { APOD_URL } from "@/app/config";
import { getFormattedDate } from "@/app/utils/getFormattedDate";

export interface Apod {
	title: string;
	explanation: string;
	copyright: string;
	date: string;

	url: string;
	hdurl: string;
	media_type: "image" | "video";
	thumbnail_url?: string; // Only if "media_type" is "video"

	resource?: Record<"image_set" | "planet", string>;
	concepts?: Record<number, string>;
	service_version: string;
}

export async function getPicture() {
	try {
		const res = await fetch(`${APOD_URL}?api_key=${process.env.NASA_API}&date=${getFormattedDate()}`);
		const json = (await res.json()) as Apod;

		return json;
	} catch (error) {
		console.error("::FETCH_APOD -", error);
		return null;
	}
}
