/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0B090A',
        secondary: '#002F01',
        accent: '#820D0E',
        neutral: '#B1A7A6',
        light: '#F5F3F4',
      },
      fontFamily: {
        sans: ['Work Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'title': ['2.25rem', { lineHeight: '1.3' }],
        'subtitle': ['1.5rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.025em' }],
      },
    },
  },
  plugins: [],
};