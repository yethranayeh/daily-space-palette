import type { Metadata } from "next";

import "./globals.css";
import { Geist_Mono, Josefin_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Navbar } from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";

const geistSans = Josefin_Sans({
	variable: "--font-josefin-sans",
	subsets: ["latin"]
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "Shades of Space",
	description:
		"A daily color palette extracted from NASA's Astronomy Picture of the Day. Discover the hues generated from daily space palettes.",
	keywords: "NASA,space,color palettes,astronomy,shades of space,daily space palette,color inspiration,design,art,cosmos".split(","),
	authors: [{ name: "Alper Halil", url: "https://www.aktasalper.com" }],
	creator: "Alper Halil",
	publisher: "Alper Halil",
	robots: "index, follow"
};

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' className='dark'>
			<head>
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />

				<meta property='og:title' content="Shades of Space - Color Palettes from NASA's Astronomy Pictures" />
				<meta
					property='og:description'
					content="A daily color palette extracted from NASA's Astronomy Picture of the Day. Discover the hues the universe chose for today."
				/>
				<meta property='og:image' content='https://shadesof.space/social/og.jpg' />
				<meta property='og:url' content='https://shadesof.space' />
				<meta name='twitter:card' content='summary_large_image' />
				<meta name='twitter:title' content="Shades of Space - Color Palettes from NASA's Astronomy Pictures" />
				<meta
					name='twitter:description'
					content="A daily color palette extracted from NASA's Astronomy Picture of the Day. Discover the hues the universe chose for today."
				/>
				<meta name='twitter:image' content='https://shadesof.space/social/twitter.jpg' />
				<title>Shades of Space - Color Palettes from the Astronomy Picture of the Day</title>
				<link rel='canonical' href='https://shadesof.space'></link>

				<link rel='apple-touch-icon' sizes='180x180' href='icons/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='icons/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='icons/favicon-16x16.png' />
				<link rel='mask-icon' href='icons/safari-pinned-tab.svg' color='#5bbad5' />
				<meta name='apple-mobile-web-app-title' content='Shades of Space' />
				<meta name='application-name' content='Shades of Space' />
				<meta name='msapplication-config' content='icons/browserconfig.xml' />
				<meta name='msapplication-TileColor' content='#603cba' />
				<meta name='theme-color' content='#20004b' />
				<link rel='manifest' href='site.webmanifest' />
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-josefin-sans)]`}>
				{/* <Stars /> */}

				<main className='min-h-screen bg-space-dark text-white relative overflow-hidden'>
					{/* Grid background */}
					<div className='absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]' />

					<div className='container mx-auto px-4 py-8 relative z-10'>
						<Navbar />
						{children}
					</div>
				</main>

				<Toaster />
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
