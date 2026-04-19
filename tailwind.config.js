/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a12',
        surface: 'rgba(255,255,255,0.04)',
        gold: '#c8b48c',
        'text-primary': '#e8e4dc',
        'text-secondary': '#6b6b7b',
        border: 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
