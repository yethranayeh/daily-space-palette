import { getPicture } from "../../lib/getPicture";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Picture } from "./Picture";
import { Description } from "./Description";

export async function AstronomyPicture() {
	const res = await getPicture();
	if (res == null) {
		return <div>Could not get Astronomy Picture of the Day</div>;
	}

	return (
		<div className='bg-space-card/80 backdrop-blur-sm rounded-xl overflow-hidden border border-space-border/30'>
			<div className='relative aspect-video md:aspect-auto md:h-[500px] overflow-hidden group'>
				<Picture {...res} />

				{res.hdurl && (
					<div className='absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
						<Button asChild size='sm' className='bg-black/50 hover:bg-black/70 text-white border-white/20'>
							<a href={res.hdurl} target='_blank' rel='noopener noreferrer' className='flex items-center gap-2'>
								<ExternalLink className='h-4 w-4' />
								View HD
							</a>
						</Button>
					</div>
				)}
			</div>

			<Description {...res} />
		</div>
	);
}
