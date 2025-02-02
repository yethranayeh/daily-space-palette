/** @format */

import { Text } from "@nextui-org/react";
import styled from "styled-components";

export const DataCopyrightStyled = styled(Text)`
	margin-top: 0.5em;
	font-weight: 700;
	font-size: 2rem;
	color: var(--light);
	text-shadow: rgb(255, 55, 255) -1px 0px 6px, rgba(30, 0, 246, 0.8) 2px 2px 1px;

	@media (max-width: 1600px) {
		font-size: 2rem;
	}

	@media (max-width: 1200px) {
		font-size: 1.9rem;
	}

	@media (max-width: 992px) {
		font-size: 1.6rem;
	}

	@media (max-width: 768px) {
		font-size: 1.3rem;
	}

	@media (max-width: 576px) {
		font-size: 0.9rem;
	}
`;
