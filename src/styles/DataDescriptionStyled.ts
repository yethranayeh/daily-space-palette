/** @format */

import { Text } from "@nextui-org/react";
import styled from "styled-components";

export const DataDescriptionStyled = styled(Text)`
	color: var(--light);
	line-height: 1.1;
	font-size: 1rem;
	font-weight: 300;

	@media (min-width: 992px) {
		font-size: 1.2rem;
		line-height: 1.2;
	}

	@media (min-width: 1200px) {
		font-size: 1.3rem;
		line-height: 1.3;
	}
`;
