/** @format */

import "@fontsource/josefin-sans/300.css";
import "@fontsource/josefin-sans/500-italic.css";
import "@fontsource/josefin-sans/700.css";
import { GlobalStyle } from "./styles/GlobalStyle";
import { ContainerStyled } from "./styles/ContainerStyled";
import { HeroSection } from "./components/HeroSection";
import { DataSection } from "./components/DataSection";

function App() {
	return (
		<>
			<GlobalStyle />
			<ContainerStyled>
				<HeroSection />
				<DataSection />
			</ContainerStyled>
		</>
	);
}

export default App;
