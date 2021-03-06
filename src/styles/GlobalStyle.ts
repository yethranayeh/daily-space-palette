/** @format */

import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
:root {
    --light: #fff;
}

html {
	position: relative;
	min-height: 100%;
}

body {
	min-height: 100vh;
	overflow-x: hidden;
	font-family: "Josefin Sans", sans-serif !important;
	color: var(--light)
}

html,
body {
	background: linear-gradient(324deg, #20004b, #0c0058, #14002f);
	background-size: 600% 600%;

	-webkit-animation: gradient-shift 30s ease infinite;
	-moz-animation: gradient-shift 30s ease infinite;
	-o-animation: gradient-shift 30s ease infinite;
	animation: gradient-shift 30s ease infinite;
}

h1, h2, h3, p {
	cursor: default;
}

@-webkit-keyframes gradient-shift {
	0% {
		background-position: 1% 0%;
	}
	50% {
		background-position: 99% 100%;
	}
	100% {
		background-position: 1% 0%;
	}
}
@-moz-keyframes gradient-shift {
	0% {
		background-position: 1% 0%;
	}
	50% {
		background-position: 99% 100%;
	}
	100% {
		background-position: 1% 0%;
	}
}
@-o-keyframes gradient-shift {
	0% {
		background-position: 1% 0%;
	}
	50% {
		background-position: 99% 100%;
	}
	100% {
		background-position: 1% 0%;
	}
}
@keyframes gradient-shift {
	0% {
		background-position: 1% 0%;
	}
	50% {
		background-position: 99% 100%;
	}
	100% {
		background-position: 1% 0%;
	}
}
`;
