import { getDailyRecord } from "@/app/lib/getDailyRecord";
import { SpacePaletteLayout } from "@/app/components/SpacePaletteLayout";

export async function PaletteView({ date }: { date: string }) {
  const { picture, error, palette, isLatest } = await getDailyRecord(date);

  // ? Fall back to the requested date so navigation survives a failed fetch.
  return (
    <SpacePaletteLayout
      picture={picture}
      pictureError={error}
      palette={palette}
      date={picture?.date ?? date}
      isLatest={isLatest}
    />
  );
}
