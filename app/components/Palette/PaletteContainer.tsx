import type { Palette as VibrantPalette } from "@vibrant/color";

import { Palette } from "./Palette";
import { convertPaletteToPlainObjectArray } from "./utils/convertPaletteToPlainObjectArray";

export async function PaletteContainer({ palette }: { palette: VibrantPalette }) {
  if (palette == null) {
    return <div className="font-mono text-ink-muted p-10">Could not generate palette</div>;
  }

  const colors = convertPaletteToPlainObjectArray(palette);
  const count = colors.length.toString().padStart(2, "0");

  return (
    <aside
      aria-label="Extracted palette"
      className="flex flex-col gap-4 p-4 bg-surface-card border border-line rounded-ui-lg shadow-ui sticky top-5"
    >
      <div className="flex items-center justify-between border-b pb-2 border-line">
        <span className="font-mono text-xs tracking-widest uppercase text-ink-muted">
          Extracted Palette
        </span>
        <div className="font-mono text-[10.5px] tracking-[0.1em] text-ink-subtle">
          <span className="text-accent font-medium">{count}</span> swatches
        </div>
      </div>

      <Palette colors={colors} />
    </aside>
  );
}
