import Image from "next/image";
import { getPicture } from "./utils/getPicture";
import { generatePalette } from "../lib/generatePalette";

export async function Picture() {
	const res = await getPicture();
	if (res == null) {
		return <div>Could not get Astronomy Picture of the Day</div>;
	}
	const palette = await generatePalette(res.url);

	return (
		<div className='flex flex-col gap-1'>
			<div className='relative'>
				<Image src={res.url} alt={res.title} width={1280} height={720} />

				{/* TODO: consider using this only for mobile as it is simpler */}
				{palette && (
					<div className='flex gap-4 absolute bottom-5 w-full justify-center'>
						{Object.entries(palette).map(([shade, value]) => {
							if (value == null) {
								return null;
							}

							return (
								<div
									key={shade}
									className='w-20 h-20 border-2 border-white rounded-full'
									style={{
										backgroundColor: value.hex
									}}
								/>
							);
						})}
					</div>
				)}
			</div>

			<span className='text-xs opacity-50'>© · {res.copyright}</span>
			<p className='max-w-screen-sm'>{res.explanation}</p>
		</div>
	);
}
