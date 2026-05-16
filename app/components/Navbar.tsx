import Image from "next/image";
import Link from "next/link";

import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="relative z-2 flex items-center gap-4 justify-between px-10 py-3 border-b border-line bg-surface-raised">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Image aria-hidden alt="page logo" width={30} height={30} src="/favicon.svg" />
          <span className="font-display font-medium text-xl tracking-tighter text-ink group-hover:opacity-80 transition-opacity">
            Shades of Space
          </span>
        </Link>

        <a
          href="https://apod.nasa.gov/apod/astropix.html"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs tracking-widest uppercase text-ink-subtle pl-4 border-l border-line hover:text-ink transition-colors"
        >
          NASA APOD · Daily Palette
        </a>
      </div>

      <div className="hero-divider" aria-hidden="true" />

      <ThemeToggle />
    </header>
  );
}
