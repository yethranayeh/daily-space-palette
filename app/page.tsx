import { Palette } from "./components/Palette/Palette";
import { Picture } from "./components/Picture/Picture";

export default function Home() {
	return (
		<div className='flex'>
			<Picture />
			<Palette />
		</div>
	);
}
