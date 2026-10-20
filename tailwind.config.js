/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette reprise telle quelle de la maquette (:root de index.html)
        navy: { DEFAULT: "#003976", 2: "#0F5CA8", deep: "#04193A" },
        ink: "#0B1B2E",
        paper: { DEFAULT: "#F6F1E3", 2: "#EEE6D2" },
        white2: "#FFFDF7",
        gold: { DEFAULT: "#B8862F", light: "#E8B94D", deep: "#8C641F" },
        brick: "#A23E2E",
        text: { DEFAULT: "#16212F", soft: "#56636F", faint: "#8B939E" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
