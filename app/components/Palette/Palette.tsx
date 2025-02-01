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
		<div className='flex flex-col rounded-lg shadow-lg w-full'>
			{Object.entries(palette).map(([shade, value]) => {
				if (value == null) {
					return <Fragment key={shade} />;
				}

				return (
					<div
						key={shade}
						className='flex flex-col items-center justify-center p-4 select-none'
						style={{
							backgroundColor: value.hex
						}}>
						<span className='text-lg font-semibold' style={{ color: value.titleTextColor }}>
							{shade}
						</span>
						<span className='text-sm' style={{ color: value.titleTextColor }}>
							{value.hex.toUpperCase()}
						</span>
					</div>
				);
			})}
		</div>
	);
}
