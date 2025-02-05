import type { Metadata } from "next";

import "./globals.css";
import { Geist_Mono, Josefin_Sans } from "next/font/google";

import { Navbar } from "./components/Navbar/Navbar";
import { Stars } from "./components/Stars";

const geistSans = Josefin_Sans({
	variable: "--font-josefin-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "Daily Space Palette",
	description:
		"Discover stunning color palettes auto-generated from NASA's Astronomy Picture of the Day. Daily Space Palette transforms the universe into beautiful color schemes for designers, artists, and space enthusiasts.",
	keywords: "NASA,space,color palettes,astronomy,daily space palette,color inspiration,design,art,cosmos".split(","),
	authors: [{ name: "Alper Aktaş", url: "https://www.aktasalper.com" }],
	creator: "Alper Aktaş",
	publisher: "Alper Aktaş",
	robots: "index, follow"
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<head>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />

				<meta property='og:title' content="Daily Space Palette - Color Palettes from NASA's Astronomy Pictures" />
				<meta
					property='og:description'
					content="Transform the cosmos into color! Daily Space Palette creates unique color schemes inspired by NASA's Astronomy Picture of the Day."
				/>
				<meta property='og:image' content='https://spacepalette.design/social/og.jpg' />
				<meta property='og:url' content='https://spacepalette.design' />
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content="Daily Space Palette - Color Palettes from NASA's Astronomy Pictures" />
				<meta
					name='twitter:description'
					content="Discover stunning color palettes auto-generated from NASA's Astronomy Picture of the Day. Daily Space Palette transforms the universe into beautiful color schemes for designers, artists, and space enthusiasts."
				/>
				<meta name='twitter:image' content='https://spacepalette.design/social/twitter.jpg' />
				<title>Daily Space Palette - Color Palettes from the Astronomy Picture of the Day</title>
				<link rel='canonical' href='https://spacepalette.design'></link>

				<link rel='apple-touch-icon' sizes='180x180' href='icons/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='icons/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='icons/favicon-16x16.png' />
				<link rel='mask-icon' href='icons/safari-pinned-tab.svg' color='#5bbad5' />
				<meta name='apple-mobile-web-app-title' content='Daily Space Palette' />
				<meta name='application-name' content='Daily Space Palette' />
				<meta name='msapplication-config' content='icons/browserconfig.xml' />
				<meta name='msapplication-TileColor' content='#603cba' />
				<meta name='theme-color' content='#20004b' />
				<link rel='manifest' href='site.webmanifest' />

				<link rel='shortcut icon' href='icons/favicon.ico' />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-josefin-sans)] min-h-screen py-4 px-4 flex flex-col gap-4`}>
				<Stars />
				<Navbar />
				{children}
			</body>
		</html>
	);
}
