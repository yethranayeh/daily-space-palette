/** @format */

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
