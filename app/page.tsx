import { Description } from "./components/Description";
import { generatePalette } from "./components/lib/generatePalette";
import { Palette } from "./components/Palette/Palette";
import { Picture } from "./components/Picture/Picture";
import { Rings } from "./components/Rings";

export default async function Home() {
	const palette = await generatePalette();

	return (
		<div className='flex flex-wrap items-start gap-y-4'>
			<div className='flex rounded-lg overflow-hidden'>
				<Picture />
				{palette && <Palette />}
			</div>
			<div className='block lg:hidden'>
				<Rings />
			</div>
			<Description />
		</div>
	);
}
