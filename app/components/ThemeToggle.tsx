"use client";

import { useState } from "react";

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "light";
  });

  const toggle = () => {
    setIsLight((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", next);
      localStorage.setItem("theme", next ? "light" : "dark");
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="font-mono text-xs uppercase text-ink-muted bg-transparent border border-line rounded-ui-sm px-4 py-2 w-[120px] cursor-pointer transition-all duration-150 hover:text-ink hover:border-line-strong"
    >
      <span
        aria-hidden="true"
        className="inline-block w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)] mr-2 align-middle"
      />
      {isLight ? "Nightfall" : "Daylight"}
    </button>
  );
}
