import { Palette } from "./components/Palette/Palette";
import { Picture } from "./components/Picture/Picture";
import { Rings } from "./components/Rings";

export default function Home() {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex rounded-lg shadow-lg'>
				<Picture />
				<Palette />
			</div>
			<div className='block lg:hidden'>
				<Rings />
			</div>
		</div>
	);
}
