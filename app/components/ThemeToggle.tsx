"use client";

import { useState, useLayoutEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  const toggle = () => {
    setIsLight((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
      localStorage.setItem("theme", next ? "light" : "dark");
      return next;
    });
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
