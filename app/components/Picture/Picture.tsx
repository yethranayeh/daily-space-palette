import Image from "next/image";
import { getPicture } from "../../lib/getPicture";
import { Maximize } from "lucide-react";

export async function Picture() {
	const res = await getPicture();
	if (res == null) {
		return <div>Could not get Astronomy Picture of the Day</div>;
	}

	if (res.media_type === "video") {
		return <embed src={res.url} width={576} height={570} />;
	}

	return (
		<>
			<Image src={res.url} alt={`${res.title} | © · ${res.copyright}`} width={576} height={250} />

			{res.hdurl && (
				<a
					href={res.hdurl}
					target='_blank'
					className='inline-flex items-center gap-1 text-white absolute left-2 top-2 px-2 py-1 border rounded-md bg-white/5 backdrop-blur-sm group leading-none'>
					<Maximize className='w-4 h-4' />{" "}
					<span className='w-0 group-hover:w-7 overflow-hidden transition-all'>See</span> <span>HD</span>{" "}
					<span className='w-0 group-hover:w-14 overflow-hidden transition-all'>Version</span>
				</a>
			)}
		</>
	);
}
