import { generatePalette } from "./lib/generatePalette";

export async function Rings() {
	const palette = await generatePalette();

	if (palette == null) {
		return <div>Could not generate palette</div>;
	}

	return (
		<div className='flex gap-1 md:gap-4 w-full justify-center'>
			{Object.entries(palette).map(([shade, value]) => {
				if (value == null) {
					return null;
				}

				return (
					<div
						key={shade}
						className='w-12 h-12 md:w-20 md:h-20 border-2 border-white rounded-full'
						style={{
							backgroundColor: value.hex
						}}
					/>
				);
			})}
		</div>
	);
}
