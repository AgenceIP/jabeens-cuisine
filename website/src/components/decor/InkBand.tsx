/** Ink from the dine-in menu (light theme only). "down" hangs below the edge above it, "up" rises to the edge below it. */
export default function InkBand({ direction = 'down' }: { direction?: 'down' | 'up' }) {
  return (
    <img
      src="/assets/decor/ink-band-1280.webp"
      srcSet="/assets/decor/ink-band-1280.webp 1280w, /assets/decor/ink-band-2560.webp 2560w"
      sizes="100vw"
      width={2560}
      height={760}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      className={`ink-band light-only${direction === 'up' ? ' ink-band--up' : ''}`}
    />
  )
}
