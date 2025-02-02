/** @format */

import styled from "styled-components";

export const Link = styled.a`
	color: var(--light);
	text-shadow: rgb(255, 55, 255) 0px 0px 3px, rgb(30, 0, 246) 2px 2px 1px;
	text-decoration: none;
	position: relative;
	white-space: nowrap;

	&::before {
		content: "";
		transform-origin: 100% 50%;
		transform: scale3d(0, 1, 1);
		transition: transform 0.3s;
	}

	&:hover::before {
		transform-origin: 0% 50%;
		transform: scale3d(1, 1, 1);
	}

	&::before,
	&::after {
		position: absolute;
		width: 100%;
		height: 1px;
		background: currentColor;
		top: 100%;
		left: 0;
		pointer-events: none;
	}
`;
