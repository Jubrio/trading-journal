/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12181f',
        paper: '#f6f5f2',
        line: '#e2e0da',
        accent: {
          DEFAULT: '#1f7a53',
          soft: '#e5f2ea',
        },
        loss: {
          DEFAULT: '#b3452c',
          soft: '#f7e9e4',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
