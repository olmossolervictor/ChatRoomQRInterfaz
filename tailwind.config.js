/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")], // <-- ¡Esta línea es la que faltaba!
  theme: {
    extend: {},
  },
  plugins: [],
}