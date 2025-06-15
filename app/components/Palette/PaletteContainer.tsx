import { generatePalette } from "@/app/lib/generatePalette";
import { Palette } from "./Palette";
import { convertPaletteToPlainObjectArray } from "./utils/convertPaletteToPlainObjectArray";
import { SwatchBook } from "lucide-react";

export async function PaletteContainer() {
	const palette = await generatePalette();
	if (palette == null) {
		return <div>Could not generate palette</div>;
	}

	return (
		<div className='bg-space-card/80 backdrop-blur-sm rounded-xl p-6 border border-space-border/30'>
			<h2 className='text-xl text-indigo-400 font-semibold mb-4 flex items-start '>
				<SwatchBook className='mr-2' /> Color Palette
			</h2>
			<Palette colors={convertPaletteToPlainObjectArray(palette)} />
		</div>
	);
}
