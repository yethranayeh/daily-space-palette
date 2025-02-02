import { BACKGROUND_COLOR_SHADES } from "@/app/config";
import { generatePalette } from "../../lib/generatePalette";

// TODO: refactor?
function getMultipliedShadows(shadowConfig: NonNullable<Awaited<ReturnType<typeof generatePalette>>>) {
	let shadow = "";
	let i = 0;

	for (const key of Object.keys(shadowConfig).filter((k) => !BACKGROUND_COLOR_SHADES.includes(k))) {
		const color = shadowConfig[key];

		if (color) {
			const [r, g, b] = color.rgb;

			shadow += (shadow ? "," : "") + i * 1 + "px " + i * 1 + `px 3px rgb(${r}, ${g}, ${b})`;
			i++;
		}
	}

	return shadow;
}

export async function Branding() {
	const palette = await generatePalette();
	return (
		<header className='flex flex-col items-start'>
			<a href='https://spacepalette.design'>
				<h1
					className='font-bold text-5xl leading-[1.1em] text-white outline-none select-none'
					style={{
						textShadow: palette ? getMultipliedShadows(palette) : undefined
					}}>
					Daily Space Palette
				</h1>
			</a>

			<p style={{ color: palette ? palette.DarkVibrant?.titleTextColor : "var(--foreground)" }}>
				Color inspirations from the universe
			</p>
		</header>
	);
}
