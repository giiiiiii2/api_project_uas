/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eef9ff",
          100: "#d9f1ff",
          200: "#bce7ff",
          300: "#8fd9ff",
          400: "#59c2ff",
          500: "#33a6ff",
          600: "#1a85f7",
          700: "#146de8",
          800: "#1759bc",
          900: "#174b93",
          950: "#122e5b",
        },
        secondary: {
          50: "#f0fdf6",
          100: "#dcfceb",
          200: "#bbf7d6",
          300: "#86efb9",
          400: "#4ade97",
          500: "#22c77b",
          600: "#16a363",
          700: "#138151",
          800: "#146643",
          900: "#135438",
          950: "#042f1e",
        },
        accent: {
          50: "#fef2f3",
          100: "#fde6e7",
          200: "#fbd0d5",
          300: "#f7aab2",
          400: "#f27a8a",
          500: "#ea546a",
          600: "#d5294a",
          700: "#b31d3f",
          800: "#961b3c",
          900: "#801b39",
          950: "#460a1a",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
}

