const c = name => `rgb(var(--c-${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: c('bg'),
        surface: c('surface'),
        'border-subtle': c('line'),
        'text-primary': c('ink'),
        'text-muted': c('muted'),
        gold: c('accent'),
        'gold-soft': c('accent-soft'),
        band: c('band'),
        'band-ink': c('band-ink'),
        'on-dark': c('on-dark'),
        scrim: c('scrim'),
        error: c('error'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
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
