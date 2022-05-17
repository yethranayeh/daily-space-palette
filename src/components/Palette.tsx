/** @format */
import { useState } from "react";
import { Grid, Card, Divider, Button, Radio } from "@nextui-org/react";
import { ColorValue } from "../styles/ColorValue";
import { RadioStyled } from "../styles/RadioStyled";

interface Props {
	colors: object;
	main?: boolean;
}

export function Palette({ colors, main }: Props) {
	const [isHex, setIsHex] = useState(true);

	const colorKeys = Object.keys(colors);
	const hexColors = colorKeys.map((key) => {
		const colorVariant: any = colors[key as keyof typeof colors];
		return colorVariant.hex;
	});
	const rgbColors = colorKeys.map((key) => {
		const colorVariant: any = colors[key as keyof typeof colors];
		return colorVariant.rgb;
	});

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
					background: `linear-gradient(324deg, ${hexColors.join(",")})`,
					backgroundSize: "300% 300%",
					animation: "gradient-shift 30s ease infinite",
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
						return isHex ? hexColors : rgbColors;
					})().map((color, index) => {
						return (
							<Card
								key={color + index}
								hoverable
								clickable
								bordered
								shadow
								borderWeight='light'
								css={{
									width: "max-content",
									height: "max-content",
									display: "flex"
								}}
								onClick={() => navigator.clipboard.writeText(color)}>
								<Card.Body
									css={{
										backgroundColor: hexColors[index],
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
										<ColorValue>{`${rgbColors[index][0]}, ${rgbColors[index][1]}, ${rgbColors[index][2]}`}</ColorValue>
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
