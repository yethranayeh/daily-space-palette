import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}"
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px"
			}
		},
		extend: {
			fontFamily: {
				mono:    ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
				display: ["var(--font-fraunces)", "'Iowan Old Style'", "Georgia", "serif"],
				sans:    ["var(--font-inter)", "system-ui", "sans-serif"],
			},
			colors: {
				/* ── Surfaces ────────────────────────────────────────────── */
				surface:          "var(--surface)",
				"surface-raised": "var(--surface-raised)",
				"surface-card":   "var(--surface-card)",
				"surface-inset":  "var(--surface-inset)",

				/* ── Borders (named "line" to avoid bg-border / border-border verbosity) */
				line:             "var(--border)",
				"line-strong":    "var(--border-strong)",

				/* ── Text ────────────────────────────────────────────────── */
				ink:              "var(--ink)",
				"ink-muted":      "var(--ink-muted)",
				"ink-subtle":     "var(--ink-subtle)",

				/* ── Accent ──────────────────────────────────────────────── */
				accent:           "var(--accent)",
				"accent-soft":    "var(--accent-soft)",
				"accent-ink":     "var(--accent-ink)",

				/* ── Destructive (toast error states) ────────────────────── */
				destructive:      "var(--destructive)",
				"destructive-ink":"var(--destructive-ink)",
			},
			borderRadius: {
				"ui-lg": "var(--radius-lg)",
				"ui-md": "var(--radius-md)",
				"ui-sm": "var(--radius-sm)",
			},
			boxShadow: {
				ui: "var(--shadow)",
			},
		}
	},
	plugins: []
} satisfies Config;
