import { Fragment } from "react";
import { generatePalette } from "../lib/generatePalette";

export async function Palette() {
	const palette = await generatePalette();

	if (palette == null) {
		return <div>Could not generate palette</div>;
	}

	return (
		<div className='hidden lg:flex flex-col w-full'>
			{Object.entries(palette).map(([shade, value]) => {
				if (value == null) {
					return <Fragment key={shade} />;
				}

				return (
					<div
						key={shade}
						className='flex flex-col items-center justify-center p-4 flex-1'
						style={{
							backgroundColor: value.hex
						}}>
						<span className='text-lg font-semibold select-none' style={{ color: value.titleTextColor }}>
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
