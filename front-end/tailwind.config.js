/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary-color)",
        "secondary": "var(--secondary-color)",
        "tertiary": "var(--tertiary-color)",
        "disabled": "var(--disabled-color)",
        "background": "var(--background-color)",
        "primary-text": "var(--primary-text-color)"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Google Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}
