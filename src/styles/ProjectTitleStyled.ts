/** @format */

import styled from "styled-components";

function getMultipliedShadows(amount: number) {
	let shadow = "";
	for (let i = 0; i < amount; i++) {
		shadow += (shadow ? "," : "") + i * 1 + "px " + i * 1 + `px 3px rgb(${255 - i * 45}, ${55 - i * 10}, ${255 - i})`;
	}
	return shadow;
}

export const ProjectTitleStyled = styled.h1`
	font-weight: 700;
	font-size: 6em;
	line-height: 1.1em;
	position: relative;
	color: #fff;
	outline: none;
	width: 100%;
	text-align: center;
	text-shadow: ${getMultipliedShadows(5)};
`;
