"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_EVENT = "themechange";

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function getSnapshot() {
  return document.documentElement.classList.contains("light");
}

// ? The server cannot read localStorage or the html class, so it hands back null
//   and the toggle renders no theme state until hydration resolves the real value
function getServerSnapshot() {
  return null;
}

export function ThemeToggle() {
  const isLight = useSyncExternalStore<boolean | null>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const mounted = isLight !== null;

  const toggle = () => {
    const root = document.documentElement;
    const next = !root.classList.contains("light");

    root.classList.toggle("light", next);
    root.classList.toggle("dark", !next);
    localStorage.setItem("theme", next ? "light" : "dark");
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? (isLight ? "Switch to dark theme" : "Switch to light theme") : "Toggle theme"}
      className="font-mono text-xs uppercase text-ink-muted bg-transparent border border-line rounded-ui-sm cursor-pointer transition-all duration-150 hover:text-ink hover:border-line-strong flex items-center justify-center size-9 sm:size-auto sm:px-4 sm:w-30"
    >
      {mounted && (isLight ? <Moon size={15} className="sm:hidden" /> : <Sun size={15} className="sm:hidden" />)}
      <span className="hidden sm:inline-flex items-center">
        <span
          aria-hidden="true"
          className="inline-block w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] mr-2 align-middle"
        />
        {mounted ? (isLight ? "Nightfall" : "Daylight") : null}
      </span>
    </button>
  );
}
