import Image from "next/image";
import { getPicture } from "../lib/getPicture";

export async function Picture() {
	const res = await getPicture();
	if (res == null) {
		return <div>Could not get Astronomy Picture of the Day</div>;
	}
	return <Image src={res.url} alt={`${res.title} | © · ${res.copyright}`} width={576} height={250} />;
}
