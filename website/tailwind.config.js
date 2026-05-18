/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#060D18',
        surface: '#111111',
        'border-subtle': '#1E1E1E',
        'text-primary': '#F5F5F0',
        'text-muted': '#DEDEDA',
        gold: '#A8956A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.3em',
        display: '0.06em',
        wide: '0.12em',
      },
      maxWidth: {
        site: '1440px',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
