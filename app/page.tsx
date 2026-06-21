import { Suspense } from "react";

import { PaletteView } from "./components/PaletteView";
import Loading from "./loading";

export default function Home() {
  return (
    <Suspense fallback={<Loading />}>
      <PaletteView />
    </Suspense>
  );
}
