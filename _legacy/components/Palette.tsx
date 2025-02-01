/** @format */
import { useState } from "react";
import { Grid, Card, Divider, Button, Radio } from "@nextui-org/react";
import { ColorValue } from "../styles/ColorValue";
import { RadioStyled } from "../styles/RadioStyled";
import generateContrastingColor from "../utils/generateContrastingColor";

interface Props {
	colors: { hex: string[]; rgb: number[][] };
	main?: boolean;
}

export function Palette({ colors, main }: Props) {
	const [isHex, setIsHex] = useState(true);

	const gridBreakpoints = {
		md: 12,
		lg: main ? 12 : 6,
		xl: main ? 12 : 4
	};

	return (
		<Grid {...gridBreakpoints} as='section' justify='center'>
			<Card
				bordered
				as='article'
				css={{
					background: `linear-gradient(324deg, ${colors.hex.join(",")})`,
					backgroundSize: main ? "300% 300%" : "150% 150%",
					animation: main ? "gradient-shift 30s ease infinite" : "none",
					color: "var(--light)",
					padding: "0",
					width: "auto"
				}}>
				<Card.Header
					as='section'
					css={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						padding: "0.2rem"
					}}>
					<Button.Group color='gradient' ghost>
						<Radio.Group
							initialValue='hex'
							row
							onChange={(value) => setIsHex(value === "hex")}
							color='error'
							textColor='error'>
							<RadioStyled value='hex'>HEX</RadioStyled>
							<RadioStyled value='rgb'>RGB</RadioStyled>
						</Radio.Group>
					</Button.Group>
				</Card.Header>
				<Divider />
				<Card.Body
					as='section'
					css={{
						padding: "0.5rem",
						flexDirection: "row",
						justifyContent: "center",
						flexWrap: "wrap",
						gap: "0.5rem"
					}}>
					{(() => {
						return isHex ? colors.hex : colors.rgb;
					})().map((color, index) => {
						return (
							<Card
								key={`${color}-${index}`}
								hoverable
								clickable
								bordered
								borderWeight='light'
								css={{
									width: "max-content",
									height: "max-content",
									display: "flex"
								}}
								onClick={() => navigator.clipboard.writeText(color.toString())}>
								<Card.Body
									css={{
										backgroundColor: colors.hex[index],
										color: generateContrastingColor(colors.hex[index]),
										width: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										textAlign: "center",
										overflow: "hidden",
										padding: "1rem 0.5rem"
									}}>
									{isHex ? (
										<ColorValue>{color}</ColorValue>
									) : (
										<ColorValue>{`${colors.rgb[index][0]}, ${colors.rgb[index][1]}, ${colors.rgb[index][2]}`}</ColorValue>
									)}
								</Card.Body>
							</Card>
						);
					})}
				</Card.Body>
			</Card>
		</Grid>
	);
}
