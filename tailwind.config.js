/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        fondo: "url('/src/assets/fondo.png')",
        fondoMovil: "url('/src/assets/fondoMovil.png')"
      }
    },
  },
  plugins: [],
}