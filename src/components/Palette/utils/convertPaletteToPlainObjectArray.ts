import type { Palette, Swatch } from "@vibrant/color";

/**
 * The generated `Palette` carries `toJSON` methods and nested color objects.
 * It is converted to plain values so it can be cached in localStorage and
 * passed through React without surprises.
 */

export type PlainPalette = {
  name: string;
  hex: string;
  rgb: Record<"r" | "g" | "b", number>;
  hsl: Record<"h" | "s" | "l", number>;
};

const getReadableName = (shadeCode: string) => shadeCode.replace(/([A-Z])/g, " $1").trim();

export function convertPaletteToPlainObjectArray(palette: Palette) {
  const validColors = Object.entries(palette).filter((p) => p[1] != null) as Array<
    [string, Swatch]
  >;

  const colors: Array<PlainPalette> = validColors
    .filter(([, value]) => value.hsl != null)
    .map(([shade, value]) => ({
      name: getReadableName(shade),
      hex: value.hex,
      rgb: { r: value.r, g: value.g, b: value.b },
      hsl: { h: value.hsl[0], s: value.hsl[1], l: value.hsl[2] },
    }));

  return colors;
}
