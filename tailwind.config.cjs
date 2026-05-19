/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /** Semantic tokens — values live in index.css as CSS custom properties.
         *  Light/dark switching is handled by the .dark class on <html>;
         *  no dark: variants are needed in component markup for these tokens. */
        background: 'var(--background)',
        surface: {
          DEFAULT: 'var(--surface)',
          hover:   'var(--surface-hover)',
        },
        border:  'var(--border)',
        foreground: {
          DEFAULT: 'var(--foreground)',
          soft:    'var(--foreground-soft)',
          muted:   'var(--foreground-muted)',
        },
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
