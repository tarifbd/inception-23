import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        utility: ["var(--font-utility)", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f7f4f8",
          100: "#eee8f1",
          200: "#dfd2e5",
          300: "#c5accf",
          400: "#a37eb3",
          500: "#825895",
          600: "#684077",
          650: "#593369",
          700: "#492959",
          750: "#3c204c",
          800: "#321a40",
          900: "#271233",
          950: "#170820",
        },
        support: {
          50: "#effaf8",
          100: "#d8f3ee",
          200: "#b4e5dc",
          300: "#82d0c4",
          400: "#4bb4a7",
          500: "#2d978c",
          600: "#207a72",
          700: "#1d625d",
          800: "#1c4f4c",
          900: "#193f3d",
          950: "#0b2625",
        },
        accent: {
          50: "#fbf4f7",
          100: "#f5e6ed",
          200: "#ebcbd9",
          300: "#dca4bb",
          400: "#c87596",
          500: "#ab4d73",
          600: "#8d3158",
          700: "#7b2447",
          800: "#651f3d",
          900: "#551d36",
          950: "#32101f",
        },
        night: {
          950: "#0a0c0f",
          900: "#111419",
          800: "#1b2027",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.625rem",
        "2xl": "0.75rem",
        "3xl": "0.875rem",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(23, 8, 32, 0.05)",
        md: "0 8px 24px rgba(23, 8, 32, 0.08)",
        lg: "0 16px 40px rgba(23, 8, 32, 0.10)",
        xl: "0 24px 64px rgba(23, 8, 32, 0.13)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        entrance: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      backgroundImage: {
        "paper-grid":
          "linear-gradient(rgba(23,8,32,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(23,8,32,0.035) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
export default config;
