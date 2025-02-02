import { Vibrant } from "node-vibrant/node";
import { getPicture } from "./getPicture";

// TODO: make a `withPalette` HOC
export async function generatePalette() {
	const picture = await getPicture();

	if (picture == null) {
		return null;
	}

	try {
		const palette = await Vibrant.from(picture.url).getPalette();
		return palette;
	} catch (error) {
		console.error("::GENERATE_PALETTE -", error);
		return null;
	}
}
