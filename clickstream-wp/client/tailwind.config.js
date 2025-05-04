/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071e3',
          gray: '#f5f5f7',
          darkgray: '#86868b',
          black: '#1d1d1f',
          red: '#fa5252',
        }
      }
    },
  },
  plugins: [],
} 