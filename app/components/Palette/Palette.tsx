import { Fragment } from "react";
import { generatePalette } from "../../lib/generatePalette";
import { ClickToCopyOverlay } from "./ClickToCopyOverlay";

export async function Palette() {
	const palette = await generatePalette();

	if (palette == null) {
		return <div>Could not generate palette</div>;
	}

	return (
		<div className='hidden lg:flex flex-col min-w-[600px]'>
			{Object.entries(palette).map(([shade, value]) => {
				if (value == null) {
					return <Fragment key={shade} />;
				}

				return (
					<div
						key={shade}
						className='relative flex justify-between items-end py-2 px-4 flex-1 cursor-pointer group hover:flex-[3] transition-all'
						style={{
							backgroundColor: value.hex
						}}>
						<ClickToCopyOverlay value={value.hex} contrastColor={value.titleTextColor} />

						<span className='text-lg font-semibold select-none' style={{ color: value.titleTextColor }}>
							{shade}
						</span>

						<div className='flex justify-between min-w-[150px]'>
							<div className='flex flex-col justify-around select-none' style={{ color: value.titleTextColor }}>
								<span>HEX</span>
								<span>RGB</span>
								<span>HSL</span>
							</div>
							<div className='flex flex-col justify-around'>
								<span className='text-sm' style={{ color: value.titleTextColor }}>
									{value.hex.toUpperCase()}
								</span>
								<span className='text-sm' style={{ color: value.titleTextColor }}>
									{value.rgb.map((v) => v.toFixed(0)).join(" ")}
								</span>
								<span className='text-sm' style={{ color: value.titleTextColor }}>
									{value.hsl.map((v) => v.toFixed(0)).join(" ")}
								</span>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
