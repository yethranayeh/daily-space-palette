import { Fragment } from "react";
import { generatePalette } from "../lib/generatePalette";
import { getPicture } from "../Picture/utils/getPicture";

export async function Palette() {
	const photo = await getPicture();

	if (photo == null) {
		return <div>Could fetch photo</div>;
	}

	const palette = await generatePalette(photo.url);

	if (palette == null) {
		return <div>Could not generate palette</div>;
	}

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
			{Object.entries(palette).map(([shade, value]) => {
				if (value == null) {
					return <Fragment key={shade} />;
				}

				return (
					<div key={shade} className='flex flex-col items-center justify-center p-4 rounded-lg shadow-lg'>
						<div className='w-24 h-24 rounded-full mb-2' style={{ backgroundColor: value.hex }}></div>
						<span className='text-lg font-semibold'>{shade}</span>
						<span className='text-sm text-gray-600'>
							RGB: {value.rgb[0]}, {value.rgb[1]}, {value.rgb[2]}
						</span>
						<span className='text-sm text-gray-500'>Population: {value.population}</span>
					</div>
				);
			})}
		</div>
	);
}
