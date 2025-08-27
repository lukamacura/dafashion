// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    fontFamily: {
      // default body/UI
      sans: ["var(--font-satoshi)", "system-ui", "sans-serif"],
      // naslovi / hero
      display: ["var(--font-fraunces)", "serif"],
      // (opciono) mono ako zatreba
      mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
    },
  },
  plugins: [],
};

export default config;
