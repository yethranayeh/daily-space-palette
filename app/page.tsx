import { generatePalette } from "./lib/generatePalette";
import { AstronomyPicture } from "./components/AstronomyPicture/AstronomyPicture";
import { PaletteContainer } from "./components/Palette/PaletteContainer";

export const revalidate = 86400;

export default async function Home() {
	const palette = await generatePalette();

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
			<div className='lg:col-span-2'>
				<AstronomyPicture />
			</div>

			<div className='space-y-6'>{palette && <PaletteContainer />}</div>
		</div>
	);
}
