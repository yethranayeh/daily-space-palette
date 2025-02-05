import Image from "next/image";
import { getPicture } from "../../lib/getPicture";

export async function Picture() {
	const res = await getPicture();
	if (res == null) {
		return <div>Could not get Astronomy Picture of the Day</div>;
	}

	if (res.media_type === "video") {
		return <embed src={res.url} width={576} height={570} />;
	}

	return <Image src={res.url} alt={`${res.title} | © · ${res.copyright}`} width={576} height={250} />;
}
