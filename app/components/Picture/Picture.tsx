import Image from "next/image";
import { getPicture } from "./utils/getPicture";

export async function Picture() {
	const res = await getPicture();

	if (res == null) {
		return <div>Could not get Astronomy Picture of the Day</div>;
	}

	return (
		<div>
			<div className='flex gap-1'>
				<Image src={res.url} alt={res.title} width={360} height={360} />
				<p className='max-w-screen-sm'>{res.explanation}</p>
			</div>
			<p className='opacity-50'>© · {res.copyright}</p>
		</div>
	);
}
