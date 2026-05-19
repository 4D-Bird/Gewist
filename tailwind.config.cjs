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
      // Suppress the typographic backtick decorations that @tailwindcss/typography
      // adds around <code> elements — syntax highlighting handles rendering itself.
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: 'none' },
            'code::after':  { content: 'none' },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after':  { content: 'none' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
