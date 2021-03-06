/** @format */
import { Link } from "../styles/Link";
import { ProjectTitleStyled } from "../styles/ProjectTitleStyled";
import { ProjectDescriptionStyled } from "../styles/ProjectDescriptionStyled";

export const HeroSection = () => (
	<section
		style={{
			textAlign: "center"
		}}>
		<ProjectTitleStyled>Daily Space Palette</ProjectTitleStyled>
		<ProjectDescriptionStyled>
			Your daily dose of palettes generated from the colors of NASA's{" "}
			<Link className='link link-light spicy-link' href='https://apod.nasa.gov/apod/astropix.html' target='_blank'>
				Astronomy Picture of the Day
			</Link>
		</ProjectDescriptionStyled>
	</section>
);
