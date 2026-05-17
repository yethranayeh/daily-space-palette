"use client";

import { useState, useLayoutEffect } from "react";

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
      className="font-mono text-xs uppercase text-ink-muted bg-transparent border border-line rounded-ui-sm px-4 py-2 w-30 cursor-pointer transition-all duration-150 hover:text-ink hover:border-line-strong"
    >
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] mr-2 align-middle"
      />
      {mounted ? (isLight ? "Nightfall" : "Daylight") : null}
    </button>
  );
}
