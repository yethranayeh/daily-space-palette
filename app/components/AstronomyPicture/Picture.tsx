import type { Apod } from "@/app/lib/getPicture";
import Image from "next/image";

export const Picture = (props: Apod) =>
	props.media_type === "video" ? (
		<embed src={props.url} className='w-full h-full object-cover' />
	) : (
		<Image fill priority sizes="(max-width: 768px) 100vw, (max-width: 1440px) 60vw, 880px" src={props.url} alt={`${props.title} | © · ${props.copyright}`} className='object-cover' />
	);
