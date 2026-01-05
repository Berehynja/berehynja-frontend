/** @type {import('tailwindcss').Config} */
const {COLORS} = require("./src/data/colors")

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
    extend: {
      colors:{
        ...COLORS
      }
    },
  },
  plugins: [],
};

