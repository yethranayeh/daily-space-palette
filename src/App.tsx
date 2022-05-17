/** @format */

import { useEffect, useState } from "react";
import "@fontsource/josefin-sans/300.css";
import "@fontsource/josefin-sans/500.css";
import "@fontsource/josefin-sans/500-italic.css";
import "@fontsource/josefin-sans/700.css";
import { Text, Spacer } from "@nextui-org/react";
import { GlobalStyle } from "./styles/GlobalStyle";
import { ContainerStyled } from "./styles/ContainerStyled";
import { HeroSection } from "./components/HeroSection";
import { DataSection } from "./components/DataSection";
import { PaletteSection } from "./components/PaletteSection";
import { Loading } from "./components/Loading";
import { ApodDataInterface } from "./interfaces/ApodDataInterface";
import axios from "axios";
import { ErrorCard } from "./components/ErrorCard";

function App() {
	const [data, setData] = useState<null | ApodDataInterface>(null);
	const [error, setError] = useState<null | string>(null);

	async function fetchData() {
		const response = await axios.get("https://aa-api-proxy.herokuapp.com/nasa");

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error("Failed to fetch data");
		}
	}

	useEffect(() => {
		if (data === null) {
			fetchData()
				.then((data) => setData(data))
				.catch((err) => setError(String(err)));
		}
	}, [data]);

	const ErrorContent = (
		<ErrorCard
			buttonFunc={() => {
				setError(null);
				fetchData()
					.then((data) => setData(data))
					.catch((err) => setError(String(err)));
			}}>
			<Text
				css={{
					color: "var(--light)"
				}}>
				Failed to fetch Astronomy Picture of the Day.
			</Text>
		</ErrorCard>
	);

	const LoadingContent = <Loading type='points-opacity'>Fetching image...</Loading>;

	return (
		<>
			<GlobalStyle />
			<ContainerStyled>
				<HeroSection />
				<Spacer y={2} />
				{error ? ErrorContent : data ? <DataSection data={data} /> : LoadingContent}
				{data && <PaletteSection img_url={data.media_type === "image" ? data.url : data.thumbnail_url} />}
			</ContainerStyled>
		</>
	);
}

export default App;
