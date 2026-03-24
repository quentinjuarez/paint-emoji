/**
 * This file is kept solely for eslint-plugin-tailwindcss (v3.x) compatibility.
 * The actual TailwindCSS v4 configuration lives in src/style.css.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        white: '#ffffff',
      },
      fontFamily: {
        custom: ['Inter', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      borderRadius: {
        xs: '1px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '10px',
        '2xl': '12px',
      },
      transitionProperty: {
        height: 'height, max-height, min-height',
        width: 'width, max-width, min-width',
      },
      transitionDuration: {
        DEFAULT: '250ms',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
