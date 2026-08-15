/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#0A0A0C',
        border: 'rgba(255, 255, 255, 0.08)',
        accent: {
          blue: '#0050FF',
          cyan: '#00D6FF',
          emerald: '#00FF99',
          crimson: '#FF2A5F',
        }
      },
      fontFamily: {
        display: ['Clash Display', 'sans-serif'],
        sans: ['General Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['SF Mono', 'ui-monospace', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
