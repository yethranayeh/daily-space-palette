import { generatePalette } from "../../../lib/generatePalette";
import { ShapeWord } from "./Branding/ShapeWord";

export async function Branding() {
	const palette = await generatePalette();
	return (
		<header className='flex flex-col items-center sm:items-start'>
			<div className='flex flex-wrap justify-center gap-x-10 gap-y-2 select-none'>
				<ShapeWord word='Daily' />
				<ShapeWord word='Space' />
				<ShapeWord word='Palette' />
			</div>

			<p style={{ color: palette ? palette.DarkVibrant?.titleTextColor : "var(--foreground)" }}>
				Color inspirations from the universe
			</p>
		</header>
	);
}
