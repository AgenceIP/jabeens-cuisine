/** Ink from the dine-in menu (light theme only). "down" hangs below the edge above it, "up" rises to the edge below it. */
export default function InkBand({ direction = 'down' }: { direction?: 'down' | 'up' }) {
  return <div aria-hidden="true" className={`ink-band light-only${direction === 'up' ? ' ink-band--up' : ''}`} />
}
