/** @format */

import { useEffect, useState } from "react";
import { Palette } from "./Palette";
import { generate_palette } from "../utils/generate_palette";
import { Grid, Text } from "@nextui-org/react";
import { Loading } from "./Loading";
import { ErrorCard } from "./ErrorCard";

export function PaletteSection({ img_url = "/" }: { img_url: string | undefined }) {
	const [palette, setPalette] = useState<null | any>(null);
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
	const MainContent = (
		<Grid.Container as='main' justify='center' gap={1}>
			<Palette colors={palette} main />
			{/* Derivate palettes will be generated from the main palette */}
		</Grid.Container>
	);

	return error ? ErrorContent : palette ? MainContent : LoadingContent;
}
