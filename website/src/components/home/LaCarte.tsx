import { Link } from 'react-router-dom'
import { useT } from '@/contexts/LanguageContext'
import './GaleriePhoto.css'
import GoldFlecks from '@/components/decor/GoldFlecks'

const p = (name: string) => `/menu/images/${encodeURIComponent(name)}.jpg`

const row1: { src: string; w: number; pos?: string }[] = [
  { src: p('Butter Chicken'),              w: 340, pos: 'center 65%' },
  { src: p('Lahori Kadhai Chicken'),       w: 300, pos: 'center 65%' },
  { src: p('Achaari Paneer Tikka'),        w: 320, pos: 'center 65%' },
  { src: '/assets/catering/live-01-pani-puri-cart-800.webp', w: 300, pos: 'center 55%' },
  { src: p('Goan Style Prawns Curry'),     w: 290, pos: 'center 65%' },
  { src: p('Mushroom Stuffed Tikka'),      w: 330, pos: 'center 65%' },
  { src: p('Lamb Bhuna'),                  w: 310, pos: 'center 65%' },
  { src: p('Desi Style Fish and Chips'),   w: 285, pos: 'center 65%' },
]

const row2: { src: string; w: number; pos?: string }[] = [
  { src: p('Chicken Lababdar'),       w: 480, pos: 'center 65%' },
  { src: p('Samosa Chaat'),           w: 440, pos: 'center 65%' },
  { src: '/assets/catering/buffet-01-gold-buffet-line-800.webp', w: 440, pos: 'center 62%' },
  { src: p('Methi Malai Chicken'),    w: 460, pos: 'center 65%' },
  { src: p('Dahi Puri'),              w: 420, pos: 'center 65%' },
  { src: p('Melon Salad'),            w: 450, pos: 'center 65%' },
  { src: p('Chicken Malai Tikka'),    w: 430, pos: 'center 65%' },
]

const row3: { src: string; w: number; pos?: string }[] = [
  { src: p('Honey Chili Gobhi'),      w: 310, pos: 'center 65%' },
  { src: p('Phirni Brûlée'),          w: 290, pos: 'center 65%' },
  { src: p('Popadum Platter'),        w: 330, pos: 'center 65%' },
  { src: '/assets/catering/buffet-02-butter-chicken-800.webp', w: 310, pos: 'center 50%' },
  { src: p('Beef Samosa'),            w: 270, pos: 'center 65%' },
  { src: p('South Asian Tiramisu'),   w: 320, pos: 'center 65%' },
  { src: p('Pani Puri'),              w: 300, pos: 'center 65%' },
  { src: '/assets/catering/live-05-pani-puri-closeup-800.webp', w: 300, pos: 'center 45%' },
  { src: p('Butter Naan'),            w: 285, pos: 'center 65%' },
]

const GAP = 6 // px between photos

function PhotoRow({
  photos,
  height,
  direction,
  duration,
}: {
  photos: typeof row1
  height: number
  direction: 'left' | 'right'
  duration: number
}) {
  // Render 2 identical sets for seamless infinite loop
  const set = (
    <>
      {photos.map((p, i) => (
        <div
          key={i}
          className="galerie-photo"
          style={{ width: p.w, height, marginRight: GAP }}
        >
          <img
            src={p.src}
            alt=""
            width={p.w}
            height={height}
            style={{ objectPosition: p.pos ?? 'center center' }}
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}
    </>
  )

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        className={`galerie-track galerie-track--${direction}`}
        style={{ '--duration': `${duration}s` } as React.CSSProperties}
      >
        {set}
        {set}
      </div>
    </div>
  )
}

export default function LaCarte() {
  const t = useT()
  const c = t.laCarte

  return (
    <section
      className="isolate"
      style={{
        background: 'transparent',
        paddingTop: '60px',
        paddingBottom: '0px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
      <GoldFlecks className="-z-10 left-[8%] top-4 w-28 md:w-48" />
      <div className="text-center mb-12 px-8">
        <p className="text-label text-gold mb-4">{c.label}</p>
        <h2
          className="text-display text-text-primary"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
        >
          {c.heading}
        </h2>
      </div>

      {/* Three drift rows */}
      <div className="melt-edges" style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
        <PhotoRow photos={row1} height={218} direction="left"  duration={48} />
        <PhotoRow photos={row2} height={198} direction="right" duration={36} />
        <PhotoRow photos={row3} height={210} direction="left"  duration={56} />
      </div>

      {/* Edge vignettes — left, right, top, bottom */}
      <div aria-hidden className="dark-only" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '180px', background: 'linear-gradient(to right, rgb(var(--c-bg)) 0%, rgb(var(--c-bg) / 0) 100%)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden className="dark-only" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '180px', background: 'linear-gradient(to left, rgb(var(--c-bg)) 0%, rgb(var(--c-bg) / 0) 100%)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden className="dark-only" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, rgb(var(--c-bg)), rgb(var(--c-bg) / 0))', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden className="dark-only" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, rgb(var(--c-bg)), rgb(var(--c-bg) / 0))', pointerEvents: 'none', zIndex: 2 }} />

      {/* CTA */}
      <div className="text-center mt-14 px-8" style={{ position: 'relative', zIndex: 3 }}>
        <Link
          to="/menu"
          className="text-label transition-all duration-300 inline-block"
          style={{ borderBottom: '1px solid rgb(var(--c-ink) / 0.3)', paddingBottom: '6px', color: 'rgb(var(--c-muted))', letterSpacing: '0.2em' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderBottomColor = 'rgb(var(--c-accent))'
            e.currentTarget.style.color = 'rgb(var(--c-accent))'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderBottomColor = 'rgb(var(--c-ink) / 0.3)'
            e.currentTarget.style.color = 'rgb(var(--c-muted))'
          }}
        >
          {c.cta}
        </Link>
      </div>
    </section>
  )
}
