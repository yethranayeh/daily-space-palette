"use client";

import type { PlainPalette } from "./utils/convertPaletteToPlainObjectArray";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";

import { toast } from "@/app/hooks/use-toast";
import { ExportFormat, exportPalette } from "./utils/exportPalette";
import { rgbToOKLCH } from "./utils/rgbToOkLch";

const colorFormats = ["hex", "rgb", "hsl", "oklch"] as const;
type ColorFormat = (typeof colorFormats)[number];

function getColorValue(color: PlainPalette, format: ColorFormat): string {
  if (format === "hex") {
    return color.hex;
  }

  if (format === "rgb") {
    return `rgb(${Math.round(color.rgb.r)}, ${Math.round(color.rgb.g)}, ${Math.round(color.rgb.b)})`;
  }

  if (format === "hsl") {
    return `hsl(${Math.round(color.hsl.h * 360)}, ${Math.round(color.hsl.s * 100)}%, ${Math.round(color.hsl.l * 100)}%)`;
  }

  const oklch = rgbToOKLCH(color.rgb.r, color.rgb.g, color.rgb.b);
  return `oklch(${(oklch.l * 100).toFixed(1)}% ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`;
}

export function Palette({ colors }: { colors: Array<PlainPalette> }) {
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "Color copied!", description: `${text} copied to clipboard.`, duration: 2000 });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const exportHandler = (fmt: ExportFormat) => () =>
    exportPalette(fmt, colors, (filename) =>
      toast({
        title: "Palette exported!",
        description: `Exported as "${filename}".`,
        duration: 3000,
      }),
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-px bg-line border border-line rounded-ui-md overflow-hidden mb-[18px]">
        {colors.map((color, i) => {
          const value = getColorValue(color, format);
          const isCopied = copiedIndex === i;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => copy(value, i)}
              className="grid grid-cols-[44px_1fr_auto_auto] items-center gap-2 px-3 py-3 bg-surface-inset hover:bg-surface-card border-none text-left text-inherit w-full cursor-pointer"
            >
              {/* Color chip */}
              <span
                className="w-11 h-8 rounded-[10px] shrink-0 border border-black/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                style={{ backgroundColor: color.hex }}
              />
              {/* Color value */}
              <span className="font-mono text-[12.5px] tracking-[0.06em] text-ink overflow-hidden text-ellipsis whitespace-nowrap">
                {value}
              </span>
              <span className="inline-flex items-center">
                {/* Swatch name */}
                <span className="font-mono text-[10.5px] tracking-tighter text-ink-subtle uppercase whitespace-nowrap">
                  {color.name}
                </span>
                {/* Copy indicator */}
                <div
                  className="w-7 h-7 grid place-items-center rounded-ui-sm transition-all duration-150 shrink-0"
                  style={{ color: isCopied ? "var(--accent)" : "var(--ink-subtle)" }}
                >
                  {isCopied ? <Check size={13} /> : <Copy size={13} />}
                </div>
              </span>
            </button>
          );
        })}
      </div>

      <div
        role="tablist"
        aria-label="Color format"
        className="grid grid-cols-4 bg-surface-inset border border-line rounded-ui-md p-1"
      >
        {colorFormats.map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={format === f}
            type="button"
            onClick={() => setFormat(f)}
            className={`font-mono text-xs tracking-[0.14em] uppercase cursor-pointer transition-all duration-150 py-2 rounded-[7px] border-0 ${
              format === f
                ? "bg-surface-card text-accent shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,_0_1px_2px_rgba(0,0,0,0.2)]"
                : "bg-transparent text-ink-muted"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="pt-[14px] border-t border-line flex gap-1.5">
        {(
          [
            { fmt: "css" as ExportFormat, label: "CSS" },
            { fmt: "tailwind" as ExportFormat, label: "Tailwind" },
            { fmt: "json" as ExportFormat, label: "JSON" },
            { fmt: "figma" as ExportFormat, label: "Figma" },
          ] as const
        ).map(({ fmt, label }) => (
          <button
            key={fmt}
            type="button"
            onClick={exportHandler(fmt)}
            className="flex-1 bg-transparent border border-line text-ink-muted font-mono text-[11px] tracking-[0.1em] uppercase px-[10px] py-[9px] rounded-ui-sm cursor-pointer flex items-center justify-center gap-[7px] transition-all duration-150 hover:text-accent hover:border-accent hover:bg-accent-soft"
          >
            <Download size={11} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
