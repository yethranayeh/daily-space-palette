/** @format */

import styled from "styled-components";

export const ContainerStyled = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 1rem;
	width: 100%;
	margin: 0 auto 100px;
	transition: padding 250ms ease-in-out;

	@media (min-width: 1601px) {
		padding: 1rem 12rem;
	}

	@media (max-width: 1600px) {
		padding: 1rem 10rem;
	}

	@media (max-width: 1200px) {
		padding: 1rem 6rem;
	}

	@media (max-width: 992px) {
		padding: 1rem 3rem;
	}

	@media (max-width: 768px) {
		padding: 1rem 1.5rem;
	}

	@media (max-width: 576px) {
		padding: 1rem 0.5rem;
	}
`;
