import type { Apod, ApodErrorReason } from "@/app/lib/getPicture";
import type { PlainPalette } from "./Palette/utils/convertPaletteToPlainObjectArray";
import type { LucideIcon } from "lucide-react";

import { Suspense } from "react";
import { CalendarX2, Clapperboard, Droplets, SatelliteDish, TriangleAlert } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { APODCard } from "./AstronomyPicture/APODCard";
import { PaletteShell } from "./Palette/PaletteShell";
import { Palette } from "./Palette/Palette";
import { DatePagination } from "./Pagination/DatePagination";

type SpacePaletteLayoutProps = {
  apod: Apod | null;
  apodError: ApodErrorReason | null;
  palette: PlainPalette[] | null;
  date: string;
};

type AlertContent = {
  variant: "default" | "destructive";
  icon: LucideIcon;
  title: string;
  description: string;
};

function isSelfHostedVideo(apod: Apod) {
  if (apod.media_type !== "video") {
    return false;
  }
  const isYouTube = apod.url.includes("youtube.com") || apod.url.includes("youtu.be");
  return !isYouTube && !apod.thumbnail_url;
}

function formatDate(date: string) {
  const parsed = new Date(date + "T00:00:00");
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function pictureAlert(reason: ApodErrorReason | null, date: string): AlertContent {
  switch (reason) {
    case "unreachable":
      return {
        variant: "destructive",
        icon: SatelliteDish,
        title: "NASA APOD is unreachable",
        description:
          "NASA's Astronomy Picture of the Day service didn't respond in time. You may try again in a little while.",
      };
    case "upstream":
      return {
        variant: "destructive",
        icon: TriangleAlert,
        title: "NASA returned an error",
        description: "The APOD service answered with an error or hit a rate limit.",
      };
    case "not-found":
      return {
        variant: "default",
        icon: CalendarX2,
        title: "No picture for this date",
        description: `NASA doesn't have an Astronomy Picture of the Day for ${formatDate(date)}.`,
      };
    default:
      return {
        variant: "destructive",
        icon: TriangleAlert,
        title: "Could not load the picture",
        description: "Something went wrong while loading the Astronomy Picture of the Day.",
      };
  }
}

function paletteAlert(
  apod: Apod | null,
  apodError: ApodErrorReason | null,
  date: string,
): AlertContent {
  if (!apod) {
    // ? When the picture itself failed, mirror that reason rather than blaming the palette.
    return pictureAlert(apodError, date);
  }

  if (isSelfHostedVideo(apod)) {
    return {
      variant: "default",
      icon: Clapperboard,
      title: "Palette unavailable",
      description:
        "Palette generation works with images and YouTube video thumbnails. Videos hosted by NASA are not currently supported.",
    };
  }

  return {
    variant: "destructive",
    icon: Droplets,
    title: "Couldn't extract colors",
    description: "We loaded the picture but couldn't read a color palette from it.",
  };
}

function StatusAlert({ variant, icon: Icon, title, description }: AlertContent) {
  return (
    <Alert variant={variant}>
      <Icon className="size-4 mt-0.5 shrink-0" />
      <div className="flex flex-col gap-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </div>
    </Alert>
  );
}

export function SpacePaletteLayout({ apod, apodError, palette, date }: SpacePaletteLayoutProps) {
  return (
    <main className="relative z-2 px-5 sm:px-8 lg:px-10 pt-5 pb-15 grid grid-cols-1 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,1fr)] gap-6 lg:gap-7 max-w-360 mx-auto">
      {apod ? <APODCard data={apod} /> : <StatusAlert {...pictureAlert(apodError, date)} />}
      <div className="flex flex-col gap-4">
        <Suspense fallback={null}>
          <DatePagination date={date} />
        </Suspense>
        <PaletteShell count={palette?.length}>
          {palette ? (
            <Palette colors={palette} />
          ) : (
            <StatusAlert {...paletteAlert(apod, apodError, date)} />
          )}
        </PaletteShell>
      </div>
    </main>
  );
}
