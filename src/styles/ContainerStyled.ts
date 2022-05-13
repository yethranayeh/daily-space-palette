/** @format */

import styled from "styled-components";

export const ContainerStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	width: 100%;
	margin: 0 auto;
	transition: padding 250ms ease-in-out;

	@media (min-width: 1601px) {
		padding: 0 12rem;
	}

	@media (max-width: 1600px) {
		padding: 0 10rem;
	}

	@media (max-width: 1200px) {
		padding: 0 6rem;
	}

	@media (max-width: 992px) {
		padding: 0 3rem;
	}

	@media (max-width: 768px) {
		padding: 0 1.5rem;
	}

	@media (max-width: 576px) {
		padding: 0 0.5rem;
	}
`;
