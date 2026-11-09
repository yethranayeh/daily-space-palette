import type { ReactNode } from "react";

type PaletteShellProps = {
  children: ReactNode;
  count?: number;
};

export function PaletteShell({ children, count }: PaletteShellProps) {
  const countLabel = count != null ? count.toString().padStart(2, "0") : null;

  return (
    <aside
      aria-label="Extracted palette"
      className="flex flex-col gap-4 p-4 bg-surface-card border border-line rounded-ui-lg shadow-ui lg:sticky lg:top-5"
    >
      <div className="flex items-center justify-between border-b pb-2 border-line">
        <span className="font-mono text-xs tracking-widest uppercase text-ink-muted">
          Extracted Palette
        </span>
        {countLabel && (
          <div className="font-mono text-[10.5px] tracking-widest text-ink-subtle">
            <span className="text-accent font-medium">{countLabel}</span> swatches
          </div>
        )}
      </div>

      {children}
    </aside>
  );
}
