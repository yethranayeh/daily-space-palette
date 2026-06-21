import type { Metadata } from "next";
import type { Apod } from "@/app/lib/getPicture";

import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getPicture } from "@/app/lib/getPicture";
import { isValidDate } from "@/app/utils/validateDate";
import { SITE_NAME } from "@/app/lib/site";

import { PaletteView } from "@/app/components/PaletteView";
import Loading from "@/app/loading";

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
    apod = (await getPicture(date)).apod;
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

  return (
    <Suspense fallback={<Loading />}>
      <PaletteView date={date} />
    </Suspense>
  );
}
