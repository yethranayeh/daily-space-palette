import type { Apod } from "@/app/lib/getPicture";

const MediaTypeBadge = ({ type }: { type: Apod["media_type"] }) => (
	<span
		className='text-xs capitalize select-none px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
		title="The APOD data received from NASA can be either in 'image' or 'video' format">
		{type}
	</span>
);

export const Description = (props: Apod) => (
	<div className='p-4 md:p-6'>
		<div className='mb-4'>
			<div className='flex items-center justify-between'>
				<h2 className='text-xl md:text-2xl font-bold'>{props.title}</h2>
				<MediaTypeBadge type={props.media_type} />
			</div>
			<p className='text-zinc-400 text-sm'>{props.date}</p>
		</div>

		<div className='text-zinc-300 text-sm md:text-base leading-relaxed'>
			<p>{props.explanation}</p>
		</div>

		{props.copyright && (
			<span className='font-[family-name:var(--font-geist-mono)] text-zinc-400 text-xs'>
				© Copyright · {props.copyright}
			</span>
		)}
	</div>
);
