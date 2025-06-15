import { PlainPalette } from "./convertPaletteToPlainObjectArray";

const baseUrl = "https://spacepalette.design/";
const attributionText = `
/*
 * Generated with Daily Space Palette — ${baseUrl}
 * Use freely in your project. Attribution appreciated!
 */
`;

export type ExportFormat = "css" | "tailwind" | "json";

function generateCssContent(colors: Array<PlainPalette>) {
	const variables = colors
		.map((color) => `  --space-${color.name.toLowerCase().replace(/\s+/g, "-")}: ${color.hex};`)
		.join("\n");

	return `:root {
${variables}
}`;
}
function generateTailwindConfig(colors: Array<PlainPalette>) {
	const variables = colors
		.map((color) => `\t\t\t\t'${color.name.toLowerCase().replace(/\s+/g, "-")}': '${color.hex}',`)
		.join("\n");

	return `
module.exports = {
theme: {
  extend: {
    colors: {
      "space-palette": {
${variables}
      }
    }
  }
}
}`;
}

export function exportPalette(
	format: ExportFormat,
	colors: Array<PlainPalette>,
	onSuccess: (exportedFileName: string) => void
) {
	let content = attributionText + "\n";
	let filename = "";

	switch (format) {
		case "css":
			content += generateCssContent(colors);
			filename = "space-palette.css";
			break;
		case "tailwind":
			content += generateTailwindConfig(colors);
			filename = "tailwind.config.js";
			break;
		case "json":
			content = JSON.stringify(
				{
					name: "Space Palette",
					description: "Color palette extracted from NASA's Astronomy Picture of the Day",
					url: baseUrl,
					_comment: attributionText.replaceAll("*", "").replaceAll("\n", ""),
					colors
				},
				null,
				2
			);
			filename = `space-palette_${new Date().toISOString().split("T")[0]}.json`;
			break;
	}

	const blob = new Blob([content], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	onSuccess(filename);
}
