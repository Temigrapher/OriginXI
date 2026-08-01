/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        pitch: '#0A0A0A',
        surface: '#151310',
        'surface-2': '#1C1915',
        gold: '#C9A227',
        'gold-bright': '#E0C158',
        cream: '#F5F1E6',
        'cream-dim': '#A69F8E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
