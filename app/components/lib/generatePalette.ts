import { Vibrant } from "node-vibrant/node";

export async function generatePalette(src: string) {
	try {
		const palette = await Vibrant.from(src).getPalette();
		// console.log(JSON.stringify(palette, null, 2));
		return palette;
	} catch (error) {
		console.error("::GENERATE_PALETTE -", error);
		return null;
	}
}
