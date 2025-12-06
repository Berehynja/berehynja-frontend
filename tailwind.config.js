/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   theme: {
    extend: {
      fontFamily: {
        // Inter
        interMedium: ['Inter-Medium', 'sans-serif'],
        interRegular: ['Inter-Regular', 'sans-serif'],

        // Montserrat
        montserratLight: ['Montserrat-Light', 'sans-serif'],
        montserratRegular: ['Montserrat-Regular', 'sans-serif'],
        montserratMedium: ['Montserrat-Medium', 'sans-serif'],
        montserratSemiBold: ['Montserrat-SemiBold', 'sans-serif'],
        montserratBold: ['Montserrat-Bold', 'sans-serif'],

        // Caveat
        caveatRegular: ['Caveat-Regular', 'cursive'],
        caveatMedium: ['Caveat-Medium', 'cursive'],
        caveatSemiBold: ['Caveat-SemiBold', 'cursive'],
        caveatBold: ['Caveat-Bold', 'cursive'],

        // Dancing Script
        dancingRegular: ['DancingScript-Regular', 'cursive'],
        dancingMedium: ['DancingScript-Medium', 'cursive'],
        dancingSemiBold: ['DancingScript-SemiBold', 'cursive'],
        dancingBold: ['DancingScript-Bold', 'cursive'],
      },
    },
  },
  plugins: [],
};