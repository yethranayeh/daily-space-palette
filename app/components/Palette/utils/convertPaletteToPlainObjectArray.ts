import type { Palette, Swatch } from "@vibrant/color";

/**
 * When passing the generated palette directly to client component, this error is thrown:
 * `[ Server ] Only plain objects can be passed to Client Components from Server Components. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.`
 *
 * So, before passing the generated `Palette` object itself,
 *  it will be converted into an array of plain objects with only necessary values.
 */

export type PlainPalette = {
	name: string;
	hex: string;
	rgb: Record<"r" | "g" | "b", number>;
	hsl: Record<"h" | "s" | "l", number>;
};

const getReadableName = (shadeCode: string) => shadeCode.replace(/([A-Z])/g, " $1").trim();

export function convertPaletteToPlainObjectArray(palette: Palette) {
	const validColors = Object.entries(palette).filter((p) => p[1] != null) as Array<[string, Swatch]>;

	const colors: Array<PlainPalette> = validColors.map(([shade, value]) => ({
		name: getReadableName(shade),
		hex: value.hex,
		rgb: { r: value.r, g: value.g, b: value.b },
		hsl: { h: value.hsl[0], s: value.hsl[1], l: value.hsl[2] }
	}));

	return colors;
}
