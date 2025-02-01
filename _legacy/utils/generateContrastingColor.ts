/** @format */

const BLACK = "#000000";
const WHITE = "#FFFFFF";

function hexToRgb(hex: string) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
		  }
		: null;
}

export default function generateContrastingColor(color: string): string {
	const rgb = hexToRgb(color);
	if (!rgb) return WHITE;
	const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	return yiq >= 128 ? BLACK : WHITE;
}
