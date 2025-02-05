import { generatePalette } from "../../lib/generatePalette";
import { ShapeLetter } from "./Branding/ShapeLetter/ShapeLetter";

export async function Branding() {
	const palette = await generatePalette();
	return (
		<header className='flex flex-col items-start'>
			<a href='https://spacepalette.design' className='inline-flex'>
				{"Daily Space Palette".split("").map((letter, i) => (
					<ShapeLetter key={letter + i} letter={letter} />
				))}
			</a>

			<p style={{ color: palette ? palette.DarkVibrant?.titleTextColor : "var(--foreground)" }}>
				Color inspirations from the universe
			</p>
		</header>
	);
}
