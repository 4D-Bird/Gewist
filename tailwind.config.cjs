/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /** One Dark — shared between the app shell and CodeMirror's oneDark theme. */
        'dark-base':     '#282c34', // main background
        'dark-elevated': '#21252b', // toolbar / sidebar surface
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
