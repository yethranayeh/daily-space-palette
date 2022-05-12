/** @format */
import { Link } from "../styles/Link";
import { ProjectTitleStyled } from "../styles/ProjectTitleStyled";
import { ProjectDescriptionStyled } from "../styles/ProjectDescriptionStyled";

export const HeroSection = () => (
	<>
		<ProjectTitleStyled>Daily Space Palette</ProjectTitleStyled>
		<ProjectDescriptionStyled>
			Your daily dose of palette(s) generated from the colors of NASA's current{" "}
			<Link className='link link-light spicy-link' href='https://apod.nasa.gov/apod/astropix.html' target='_blank'>
				Astronomy Picture of the Day
			</Link>
		</ProjectDescriptionStyled>
	</>
);
