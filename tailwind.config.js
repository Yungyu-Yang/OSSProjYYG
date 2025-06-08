/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFE0D2',
        secondary: '#F4B8A7',
        background: '#FFF9F5',
      },
    },
  },
  plugins: [],
};