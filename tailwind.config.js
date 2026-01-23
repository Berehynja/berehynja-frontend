/** @type {import('tailwindcss').Config} */
const { COLORS } = require("./src/data/colors");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        RoyalBlue: "#01b0f1",
        Sky: "#6ED0F0",
        LightSky: "#C1DDEF",
        Sage: "#A4C9A0",
        GreenAccent: "#9ACD32",
        Rose: "#DF7D84",
        Red: "#FF5A5A",
        Violet: "#8E44AD",
        Sand: "#E2CD7A",
        White: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
