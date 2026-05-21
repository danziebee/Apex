import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apex: {
          black: "#000000",
          surface: "#050a12",
          blue: "#007aff",
          "blue-bright": "#3b82f6",
          "blue-glow": "#1a4fd6",
          muted: "#94a3b8",
          frost: "rgba(230, 240, 248, 0.92)",
          "frost-text": "#1a2d4a",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      borderRadius: {
        pill: "9999px",
        glass: "1.75rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 122, 255, 0.12), inset 0 1px 0 rgba(255,255,255,0.08)",
        "glass-lg": "0 24px 80px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 122, 255, 0.15)",
        folder: "0 40px 100px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255,255,255,0.06)",
      },
      backdropBlur: {
        glass: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
