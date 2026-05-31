/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FEFEFE',
        forest: '#1A6B45',
        'forest-deep': '#134F33',
        'forest-soft': '#E8F5EE',
        coral: '#F4522A',
        'coral-soft': '#FFF0EC',
        aubergine: '#5C2A7F',
        'aubergine-soft': '#F2EBF8',
        ink: '#0F0F0F',
        'ink-dim': '#6B6560',
        'ink-faint': '#B0A9A2',
        surface: '#F8F5F1',
        'surface-alt': '#EEE9E2',
        border: '#DFD8CF',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        instrument: ['"Instrument Serif"', 'serif'],
        fira: ['"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}
