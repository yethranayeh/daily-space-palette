"use client";

import { useEffect } from "react";

export function Stars() {
	useEffect(() => {
		const starCount = 250;
		const starContainer = document.createElement("div");
		starContainer.classList.add("star-container");
		document.body.appendChild(starContainer);
		starContainer.classList.add("max-w-screen", "max-h-screen", "overflow-hidden");

		for (let i = 0; i < starCount; i++) {
			const star = document.createElement("div");
			star.classList.add("star");

			const size = Math.random() * 2 + 1; // Random size between 1px and 4px
			const x = Math.random() * 98; // Random horizontal position
			const y = Math.random() * 98; // Random vertical position
			const duration = Math.random() * 20 + 20; // Random animation duration between 20s and 40s
			const delay = Math.random() * 10; // Random delay to stagger animations

			star.style.width = `${size}px`;
			star.style.height = `${size}px`;
			star.style.left = `${x}%`;
			star.style.top = `${y}%`;
			star.style.animationDuration = `${duration}s`;
			star.style.animationDelay = `${delay}s`; // Ensures smooth staggered movement

			if (Math.round(Math.random())) {
				star.style.boxShadow = "0px 0px 15px 1px white";
			}

			starContainer.appendChild(star);
		}
	}, []);
	return null;
}
