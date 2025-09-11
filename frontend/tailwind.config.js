/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: '#6366f1',
          foreground: '#ffffff'
        },
        surface: {
          0: '#ffffff',
          100: '#f8fafc',
          200: '#eef2f6',
          300: '#e2e8f0'
        }
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgba(0,0,0,0.4), 0 2px 6px -1px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
