function getMultipliedShadows(amount: number) {
	let shadow = "";
	for (let i = 0; i < amount; i++) {
		shadow += (shadow ? "," : "") + i * 1 + "px " + i * 1 + `px 3px rgb(${255 - i * 45}, ${55 - i * 10}, ${255 - i})`;
	}
	return shadow;
}

export function Branding() {
	return (
		<header className='flex flex-col justify-start'>
			<a href='https://www.aktasalper.com/daily-space-palette'>
				<h1
					className='font-bold text-5xl leading-[1.1em] text-white outline-none select-none'
					style={{
						textShadow: getMultipliedShadows(5)
					}}>
					Daily Space Palette
				</h1>
			</a>

			<p>Color inspirations from the universe</p>
		</header>
	);
}
