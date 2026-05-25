import type { Metadata } from "next";

import "./globals.css";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import Providers from "./providers";

import { Navbar } from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "./lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "NASA",
    "space",
    "color palettes",
    "astronomy",
    "shades of space",
    "daily space palette",
    "color inspiration",
    "design",
    "art",
    "cosmos",
  ],
  authors: [{ name: "Alper Halil", url: "https://www.aktasalper.com" }],
  creator: "Alper Halil",
  publisher: "Alper Halil",
  robots: "index, follow",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} | Color Palettes from NASA's Astronomy Pictures`,
    description:
      "A daily color palette extracted from NASA's Astronomy Picture of the Day. Discover the hues the universe chose for today.",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Color Palettes from NASA's Astronomy Pictures`,
    description:
      "A daily color palette extracted from NASA's Astronomy Picture of the Day. Discover the hues the universe chose for today.",
    images: [`${SITE_URL}/social/twitter.jpg`],
  },
  other: {
    "apple-mobile-web-app-title": SITE_NAME,
    "application-name": SITE_NAME,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Alper Halil",
      url: "https://www.aktasalper.com",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Sync theme from localStorage before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{(function(){var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){window.__themeInit=t}else{window.__themeInit=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'}document.documentElement.classList.toggle('light',window.__themeInit==='light');document.documentElement.classList.toggle('dark',window.__themeInit==='dark')})()}catch{window.__themeInit='dark'}`,
          }}
        />
      </head>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <div className="starfield" aria-hidden="true" />
          <Navbar />
          <div className="relative z-[2]">{children}</div>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
