/** @format */

import { useEffect, useState } from "react";
import { Palette } from "./Palette";
import { generate_palette } from "../utils/generate_palette";
import { Grid, Text } from "@nextui-org/react";
import { Loading } from "./Loading";
import { ErrorCard } from "./ErrorCard";
import { getPaletteShades } from "../utils/getPaletteShades";
import { Palette as PaletteInterface } from "../interfaces/PaletteInterface";

export function PaletteSection({ img_url = "/" }: { img_url: string | undefined }) {
	const [palette, setPalette] = useState<null | PaletteInterface>(null);
	const [error, setError] = useState<null | string>(null);

	async function get_palette() {
		setError(null);
		try {
			const result = await generate_palette(img_url);
			setPalette(result);
		} catch (err) {
			setError(String(err));
		}
	}

	useEffect(() => {
		let is_mounted = true;
		if (is_mounted) {
			get_palette();
		}

		return () => {
			is_mounted = false;
		};
	}, []);

	const ErrorContent = (
		<ErrorCard buttonFunc={get_palette}>
			<Text
				css={{
					color: "var(--light)"
				}}>
				Failed to generate color palette from image: {error}
			</Text>
		</ErrorCard>
	);

	const LoadingContent = <Loading type='points'>Generating palette...</Loading>;
	const MainContent = palette ? (
		<Grid.Container as='main' justify='center' gap={1}>
			<Palette colors={palette} main />

			{getPaletteShades(palette.rgb).map((palette, index) => {
				return <Palette colors={palette} key={`derivative-palette-${index}`} />;
			})}
		</Grid.Container>
	) : null;

	return error ? ErrorContent : palette ? MainContent : LoadingContent;
}
