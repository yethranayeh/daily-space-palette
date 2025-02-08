import { Description } from "./components/Description";
import { generatePalette } from "./lib/generatePalette";
import { Palette } from "./components/Palette/Palette";
import { Picture } from "./components/Picture/Picture";
import { Rings } from "./components/Rings";

export const revalidate = 86400;

export default async function Home() {
	const palette = await generatePalette();

	return (
		<div className='flex flex-col items-center gap-y-4 w-full'>
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
