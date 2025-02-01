/** @format */

import { getColors } from "./getColors";

// Extending "window" so TypeScript can recognize Vibrant as a global variable
declare global {
	interface Window {
		Vibrant: any;
	}
}

export async function generate_palette(img_url: string) {
	// Development
	// const fetchUrl = `https://cors-anywhere.herokuapp.com/${img_url}`;
	// const fetchUrl = "../../dev/image.jpg";

	// Production
	const fetchUrl = `https://aa-corsproxy.herokuapp.com/${img_url}`;

	const vibrant = window.Vibrant.from(fetchUrl);
	const palette = await vibrant.getPalette((err: any, palette: any) => {
		if (err) {
			throw new Error(`Error generating palette:\n${err}`);
		}
		return palette;
	});

	return getColors(palette);
}
