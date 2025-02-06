"use client";

import { useState } from "react";

interface Props {
	value: string;
	contrastColor: string;

	// FIXME: How to implement this using `first:` or `last:` of tailwind, or directly in css
	isFirst: boolean;
	isLast: boolean;
}

export function ClickToCopyOverlay({ value, contrastColor, isFirst, isLast }: Props) {
	const [text, setText] = useState("Click to copy");

	return (
		<div
			className={`absolute inset-0 px-3 py-2 border border-white opacity-0 flex items-start justify-start overflow-hidden group-hover:opacity-100 transition-opacity ${
				isFirst ? "rounded-tr-lg" : ""
			} ${isLast ? "rounded-br-lg" : ""}`}
			onClick={() => {
				navigator.clipboard.writeText(value);
				setText("Copied!");
				setTimeout(() => {
					setText("Click to copy");
				}, 2000);
			}}>
			<span
				className='text-xs select-none -translate-y-10 group-hover:translate-y-0 transition-all'
				style={{ color: contrastColor }}>
				{text}
			</span>
		</div>
	);
}
