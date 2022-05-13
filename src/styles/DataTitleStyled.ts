/** @format */

import { Text } from "@nextui-org/react";
import styled from "styled-components";

export const DataTitleStyled = styled(Text)`
	margin: 0.2em auto;
	font-weight: 300;
	font-size: 3.8rem;
	text-transform: uppercase;
	color: var(--light);
	font-style: italic;
	text-shadow: #fff 0px 0px 2px, rgb(255, 55, 255) -1px 0px 6px, rgba(105, 0, 249, 0.8) 1px -3px 10px,
		rgba(30, 0, 246, 0.8) 2px 2px 1px, 2px 3px 1px rgba(255, 255, 255, 0.1), 3px 4px 0px rgba(255, 255, 255, 0.1);

	@media (max-width: 1600px) {
		font-size: 3.6rem;
	}

	@media (max-width: 1200px) {
		font-size: 3.2rem;
	}

	@media (max-width: 992px) {
		font-size: 2.8rem;
	}

	@media (max-width: 768px) {
		font-size: 2.2rem;
	}

	@media (max-width: 576px) {
		font-size: 1.4rem;
	}
`;
