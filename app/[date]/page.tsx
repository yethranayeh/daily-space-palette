import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { generatePalette } from "@/app/lib/generatePalette";
import { getPicture } from "@/app/lib/getPicture";
import { isValidDate } from "@/app/utils/validateDate";
import { SITE_NAME, SITE_URL } from "@/app/lib/site";

import { SpacePaletteLayout } from "@/app/components/SpacePaletteLayout";

export const revalidate = 86400;

export async function generateStaticParams() {
  return [];
}

interface DatePageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: DatePageProps): Promise<Metadata> {
  const { date } = await params;

  if (!isValidDate(date)) {
    return {
      title: "Date Not Found",
    };
  }

  const apod = await getPicture(date);

  const dateLabel = apod?.date
    ? new Date(apod.date + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : date;

  return {
    title: `${dateLabel} · ${SITE_NAME}`,
    description: apod?.explanation
      ? apod.explanation.slice(0, 155) + "..."
      : `Color palette from NASA's Astronomy Picture of the Day on ${dateLabel}.`,
    openGraph: {
      title: `${dateLabel} · ${SITE_NAME}`,
      description: apod?.explanation
        ? apod.explanation.slice(0, 155) + "..."
        : `Color palette from NASA's Astronomy Picture of the Day on ${dateLabel}.`,
      images: apod?.url
        ? [{ url: apod.url, alt: apod.title }]
        : [{ url: `${SITE_URL}/og-default.jpg` }],
      type: "article",
      publishedTime: apod?.date,
    },
    alternates: {
      canonical: `/${date}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function DatePage({ params }: DatePageProps) {
  const { date } = await params;

  if (!isValidDate(date)) {
    notFound();
  }

  const [apod, palette] = await Promise.all([getPicture(date), generatePalette(date)]);

  if (apod == null || "code" in apod) {
    notFound();
  }

  return <SpacePaletteLayout apod={apod} palette={palette} date={date} />;
}
