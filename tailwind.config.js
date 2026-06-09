/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#EDFAF5',
          200: '#BFF0DC',
          300: '#7DDFC2',
          400: '#3DC8A0',
          500: '#1A8C72',
          600: '#0D5C4A',
        },
        secondary: {
          100: '#FFF3EE',
          200: '#FDD4BE',
          300: '#FCAA88',
          400: '#F47D4E',
          500: '#B05530',
          600: '#7A3318',
        },
        neutral: {
          100: '#FAFAF8',
          200: '#EBEBE6',
          300: '#CCCBC4',
          400: '#8F8D84',
          500: '#5C5A53',
          600: '#2A2924',
        },
      },
      fontFamily: {
        'heading-bold': ['Unbounded_700Bold'],
        'heading-medium': ['Unbounded_500Medium'],
        body: ['Inter_400Regular'],
        'body-medium': ['Inter_500Medium'],
        'body-bold': ['Inter_700Bold'],
      },
      fontSize: {
        h1: ['28px', { lineHeight: '32px' }],
        h2: ['24px', { lineHeight: '28px' }],
        h3: ['20px', { lineHeight: '24px' }],
        'body-lg': ['24px', { lineHeight: '30px' }],
        body: ['20px', { lineHeight: '26px' }],
        'body-sm': ['16px', { lineHeight: '22px' }],
      },
    },
  },
  plugins: [],
};
