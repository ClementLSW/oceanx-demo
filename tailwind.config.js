/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0B1D3A',
        teal: { DEFAULT: '#0EA5A0', light: '#14D4CD', dark: '#0A7A76' },
        coral: '#FF6B6B',
        sand: '#F5F0EB',
        sea: { 100: '#E0F4F4', 200: '#B3E8E5', 300: '#66D1CC' },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};
