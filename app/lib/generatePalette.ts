import { Vibrant } from "node-vibrant/node";
import { getPicture } from "./getPicture";

export async function generatePalette() {
	const data = await getPicture();

	if (data == null) {
		return null;
	} else if (data.code) {
		if (data.code === 400) {
			console.error("::GENERATE_PALETTE - 400 -", data?.msg);
		}
		return null;
	}

	// TODO: refactor
	const src =
		data.media_type === "video"
			? data.thumbnail_url ?? `https://i1.ytimg.com/vi/${data?.url.split("/").at(-1)}/maxresdefault.jpg`
			: data.url;

	try {
		const palette = await Vibrant.from(src).getPalette();
		return palette;
	} catch (error) {
		console.error("::GENERATE_PALETTE -", error);
		return null;
	}
}
