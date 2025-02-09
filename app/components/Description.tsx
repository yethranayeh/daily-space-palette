import React from "react";
import { getPicture } from "../lib/getPicture";
import { generatePalette } from "../lib/generatePalette";

export async function Description() {
	const picture = await getPicture();
	const palette = await generatePalette();

	if (picture == null) {
		return null;
	}

	return (
		<div
			className='flex flex-col gap-4 justify-between py-2 px-4 max-w-[1176px] bg-white/5 backdrop-blur-md rounded-md'
			style={{ color: palette?.DarkMuted?.bodyTextColor ?? "white" }}>
			<h1 className='text-lg font-bold'>{picture.title}</h1>
			<p>{picture.explanation}</p>
			{picture.copyright && (
				<span className='font-[family-name:var(--font-geist-mono)] text-sm'>© Copyright · {picture.copyright}</span>
			)}
		</div>
	);
}
