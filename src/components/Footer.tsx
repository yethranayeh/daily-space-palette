/** @format */

import { FooterStyled } from "../styles/FooterStyled";
import { Button } from "@nextui-org/react";
import { SiBuymeacoffee } from "react-icons/si";
import { BsGithub } from "react-icons/bs";

export function Footer() {
	return (
		<FooterStyled>
			<Button.Group color='gradient' ghost>
				<Button
					icon={<BsGithub />}
					onPress={() => {
						window.location.href = "https://github.com/yethranayeh/daily-space-palette/";
					}}>
					GitHub
				</Button>
				<Button
					icon={<SiBuymeacoffee />}
					onPress={() => {
						window.location.href = "https://www.buymeacoffee.com/aktasalper";
					}}>
					Buy me a coffee
				</Button>
			</Button.Group>
		</FooterStyled>
	);
}
