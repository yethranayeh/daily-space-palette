/** @format */

import { GlobalStyle } from "./styles/GlobalStyle";
import { ContainerStyled } from "./styles/ContainerStyled";
import { HeroSection } from "./components/HeroSection";

function App() {
	return (
		<>
			<GlobalStyle />
			<ContainerStyled>
				<HeroSection />
			</ContainerStyled>
		</>
	);
}

export default App;
