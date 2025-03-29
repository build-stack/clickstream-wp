/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wp-admin-primary': '#2271b1',
        'wp-admin-hover': '#135e96',
        'wp-admin-background': '#f0f0f1',
        'wp-admin-menu': '#1d2327',
        'wp-admin-text': '#3c434a',
      },
    },
  },
  plugins: [],
} 