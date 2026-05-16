import { generatePalette } from "./lib/generatePalette";
import { getPicture } from "./lib/getPicture";
import { SpacePaletteLayout } from "./components/SpacePaletteLayout";

export const revalidate = 86400;

function getTodayPST(): string {
  const now = new Date();
  const pst = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  const year = pst.getFullYear();
  const month = String(pst.getMonth() + 1).padStart(2, "0");
  const day = String(pst.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function Home() {
  const [apod, palette] = await Promise.all([getPicture(), generatePalette()]);
  const today = getTodayPST();

  return <SpacePaletteLayout apod={apod} palette={palette} date={today} />;
}
