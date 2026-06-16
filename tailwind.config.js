const { colors, fontFamily, fontSize } = require('./src/constants/tokens');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontFamily,
      fontSize,
    },
  },
  plugins: [],
};
