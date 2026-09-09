import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        tg: {
          bg: "var(--tg-theme-bg-color, #090d16)",
          text: "var(--tg-theme-text-color, #f1f5f9)",
          hint: "var(--tg-theme-hint-color, #64748b)",
          link: "var(--tg-theme-link-color, #38bdf8)",
          button: "var(--tg-theme-button-color, #3b82f6)",
          "button-text": "var(--tg-theme-button-text-color, #ffffff)",
          "secondary-bg": "var(--tg-theme-secondary-bg-color, #0f172a)",
          accent: "#00f0ff",
          gold: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
export default config;
