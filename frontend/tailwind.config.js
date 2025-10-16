/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          DEFAULT: "#7c3aed",
          foreground: "#ffffff",
        },
        surface: {
          0: "#ffffff",
          50: "#fafbfc",
          100: "#f8fafc",
          200: "#eef2f6",
          300: "#e2e8f0",
          400: "#cbd5e1",
        },
        success: {
          50: "#ecfdf5",
          200: "#bbf7d0",
          500: "#10b981",
          600: "#059669",
        },
        warning: {
          50: "#fffbeb",
          200: "#fed7aa",
          500: "#f59e0b",
          600: "#d97706",
        },
        error: {
          50: "#fef2f2",
          200: "#fecaca",
          500: "#ef4444",
          600: "#dc2626",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgba(0,0,0,0.04), 0 2px 6px -1px rgba(0,0,0,0.05)",
        glow: "0 0 15px rgba(124,58,237,0.08)",
      },
      animation: {
        "bounce-subtle": "bounce 1s ease-in-out 2",
        "pulse-soft": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      transitionDuration: {
        150: "150ms",
        250: "250ms",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
