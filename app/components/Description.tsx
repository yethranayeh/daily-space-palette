import React from "react";
import { getPicture } from "./lib/getPicture";
import { generatePalette } from "./lib/generatePalette";

export async function Description() {
	const picture = await getPicture();
	const palette = await generatePalette();

	if (picture == null) {
		return null;
	}

	return (
		<div
			className='flex flex-col justify-between py-2 px-4 max-w-[1176px]'
			style={{ color: palette?.DarkMuted?.bodyTextColor ?? "white" }}>
			<p>{picture.explanation}</p>
			{picture.copyright && <span>© · {picture.copyright}</span>}
		</div>
	);
}
