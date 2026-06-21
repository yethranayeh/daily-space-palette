import type { Metadata } from "next";
import type { Apod } from "@/app/lib/getPicture";
import type { PlainPalette } from "@/app/components/Palette/utils/convertPaletteToPlainObjectArray";

import { notFound } from "next/navigation";

import { generatePalette } from "@/app/lib/generatePalette";
import { getPicture } from "@/app/lib/getPicture";
import { isValidDate, MIN_DATE } from "@/app/utils/validateDate";
import { SITE_NAME } from "@/app/lib/site";

import { SpacePaletteLayout } from "@/app/components/SpacePaletteLayout";

export async function generateStaticParams() {
  return [{ date: MIN_DATE }];
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

  let apod: Apod | null = null;
  try {
    apod = await getPicture(date);
  } catch {
    return { title: "Date Not Found" };
  }

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

  let apod: Apod;
  try {
    apod = await getPicture(date);
  } catch {
    notFound();
  }

  let palette: PlainPalette[] | null = null;
  try {
    palette = await generatePalette(apod);
  } catch {
    // palette generation failed — show APOD without colors
  }

  return <SpacePaletteLayout apod={apod} palette={palette} date={date} />;
}
