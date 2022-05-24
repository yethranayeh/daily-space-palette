/** @format */

import { Palette } from "../interfaces/PaletteInterface";

function convertToHex(rgbArray: number[]) {
	const hexArray = [];

	for (const color of rgbArray) {
		const hex = color.toString(16);
		hexArray.push(hex.length === 1 ? `0${hex}` : hex);
	}

	return `#${hexArray.join("")}`;
}

function generateShades(rgbArray: number[], shade: number) {
	const [r, g, b] = rgbArray;

	// Shade generation code by 11thdimension on stackoverflow:
	// https://stackoverflow.com/a/40619637/16806945
	const max = Math.max(Math.max(r, Math.max(g, b)), 1);
	const step = 255 / (max * 10);

	const shadeOfRed = Math.round(r * step * shade);
	const shadeOfGreen = Math.round(g * step * shade);
	const shadeOfBlue = Math.round(b * step * shade);

	return [shadeOfRed, shadeOfGreen, shadeOfBlue];
}

export function getPaletteShades(rgbColorsArray: number[][]) {
	const palettes = [] as Palette[];
	const shades = [2, 3, 4, 6, 8, 10];

	for (const rgbArray of rgbColorsArray) {
		const palette = { hex: [], rgb: [] } as Palette;

		for (const shade of shades) {
			const shadeOfRgbArray = generateShades(rgbArray, shade);
			palette.hex.push(convertToHex(shadeOfRgbArray));
			palette.rgb.push(shadeOfRgbArray);
		}
		palettes.push(palette);
	}

	return palettes;
}
