import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgba(255, 255, 255, 0.1)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#00D9FF",
        background: "#000000",
        foreground: "#F8F9FA",
        primary: {
          DEFAULT: "#00D9FF",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#0EA5E9",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#374151",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#00D9FF",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#F8F9FA",
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#F8F9FA",
        },
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        xs: "2px",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      keyframes: {
        "grid-flow": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "50px 50px" },
        },
        "float-orb": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(100px, -100px) scale(1.2)" },
          "66%": { transform: "translate(-100px, 100px) scale(0.8)" },
        },
        bounce: {
          "0%, 20%, 50%, 80%, 100%": { transform: "translateY(0)" },
          "40%": { transform: "translateY(-10px)" },
          "60%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "grid-flow": "grid-flow 20s linear infinite",
        "float-orb": "float-orb 20s ease-in-out infinite",
        bounce: "bounce 2s infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;