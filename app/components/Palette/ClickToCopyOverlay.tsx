"use client";

import { useState } from "react";

export function ClickToCopyOverlay({ value, contrastColor }: { value: string; contrastColor: string }) {
	const [text, setText] = useState("Click to copy");

	return (
		<div
			className='absolute inset-0 p-2 border border-white opacity-0 flex items-start justify-end group-hover:opacity-100 transition-opacity'
			onClick={() => {
				navigator.clipboard.writeText(value);
				setText("Copied!");
				setTimeout(() => {
					setText("Click to copy");
				}, 2000);
			}}>
			<span style={{ color: contrastColor }}>{text}</span>
		</div>
	);
}
