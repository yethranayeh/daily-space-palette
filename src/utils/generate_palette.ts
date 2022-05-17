/** @format */

import Vibrant from "node-vibrant";

export async function generate_palette(img_url: string) {
	// Development
	// const fetchUrl = `https://cors-anywhere.herokuapp.com/${img_url}`;
	// const fetchUrl = "../../dev/ss.png";
	// console.info("Generating palette from:", img_url);

	// Production
	const fetchUrl = `https://aa-corsproxy.herokuapp.com/${img_url}`;

	const vibrant = Vibrant.from(fetchUrl);
	const palette = await vibrant.getPalette((err, palette) => {
		if (err) {
			throw new Error(`Error generating palette: ${err}`);
		}
		return palette;
	});
	return palette;
}
