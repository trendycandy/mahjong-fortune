/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { felt: { DEFAULT: '#2d7a4a', dark: '#1e5631' }, accent: '#c41e3a' },
      keyframes: { fadeUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } } },
      animation: { fadeUp: 'fadeUp 0.5s ease-out both' },
    },
  },
  plugins: [],
}
