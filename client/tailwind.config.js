/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'edu-emerald': '#10B981',
        'edu-dark': '#022C22',
      },
    },
  },
  plugins: [],
}