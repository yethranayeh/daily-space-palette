/** @format */
import { getRoundedRGBArray } from "./getRoundedRGBArray";

export function getColors(palette: any) {
	const colorKeys = Object.keys(palette);
	const hexColors = colorKeys.map((key) => {
		const colorVariant: any = palette[key as keyof typeof palette];
		return colorVariant.hex;
	});

	const rgbColors = colorKeys.map((key) => {
		const colorVariant: any = palette[key as keyof typeof palette];
		return getRoundedRGBArray(colorVariant.rgb);
	});

	const colors = { hex: hexColors, rgb: rgbColors };

	return colors;
}
