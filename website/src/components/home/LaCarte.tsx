import { Link } from 'react-router-dom'
import { useT } from '@/contexts/LanguageContext'
import './GaleriePhoto.css'

const p = (name: string) => `/menu/images/${encodeURIComponent(name)}.jpg`

const row1: { src: string; w: number; pos?: string }[] = [
  { src: p('Butter Chicken'),              w: 340, pos: 'center 65%' },
  { src: p('Lahori Kadhai Chicken'),       w: 300, pos: 'center 65%' },
  { src: p('Achaari Paneer Tikka'),        w: 320, pos: 'center 65%' },
  { src: p('Goan Style Prawns Curry'),     w: 290, pos: 'center 65%' },
  { src: p('Mushroom Stuffed Tikka'),      w: 330, pos: 'center 65%' },
  { src: p('Lamb Bhuna'),                  w: 310, pos: 'center 65%' },
  { src: p('Desi Style Fish and Chips'),   w: 285, pos: 'center 65%' },
]

const row2: { src: string; w: number; pos?: string }[] = [
  { src: p('Chicken Lababdar'),       w: 480, pos: 'center 65%' },
  { src: p('Samosa Chaat'),           w: 440, pos: 'center 65%' },
  { src: p('Methi Malai Chicken'),    w: 460, pos: 'center 65%' },
  { src: p('Dahi Puri'),              w: 420, pos: 'center 65%' },
  { src: p('Melon Salad'),            w: 450, pos: 'center 65%' },
  { src: p('Chicken Malai Tikka'),    w: 430, pos: 'center 65%' },
]

const row3: { src: string; w: number; pos?: string }[] = [
  { src: p('Honey Chili Gobhi'),      w: 310, pos: 'center 65%' },
  { src: p('Phirni Brûlée'),          w: 290, pos: 'center 65%' },
  { src: p('Popadum Platter'),        w: 330, pos: 'center 65%' },
  { src: p('Beef Samosa'),            w: 270, pos: 'center 65%' },
  { src: p('South Asian Tiramisu'),   w: 320, pos: 'center 65%' },
  { src: p('Pani Puri'),              w: 300, pos: 'center 65%' },
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
      style={{
        background: 'transparent',
        paddingTop: '60px',
        paddingBottom: '0px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header */}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
        <PhotoRow photos={row1} height={218} direction="left"  duration={48} />
        <PhotoRow photos={row2} height={198} direction="right" duration={36} />
        <PhotoRow photos={row3} height={210} direction="left"  duration={56} />
      </div>

      {/* Edge vignettes — left, right, top, bottom */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '180px', background: 'linear-gradient(to right, #060D18 0%, rgba(6,13,24,0) 100%)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '180px', background: 'linear-gradient(to left, #060D18 0%, rgba(6,13,24,0) 100%)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to bottom, #060D18, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, #060D18, transparent)', pointerEvents: 'none', zIndex: 2 }} />

      {/* CTA */}
      <div className="text-center mt-14 px-8" style={{ position: 'relative', zIndex: 3 }}>
        <Link
          to="/menu"
          className="text-label transition-all duration-300 inline-block"
          style={{ borderBottom: '1px solid #4A4A44', paddingBottom: '6px', color: '#DEDEDA', letterSpacing: '0.2em' }}
          onMouseEnter={e => {
            e.currentTarget.style.borderBottomColor = '#A8956A'
            e.currentTarget.style.color = '#A8956A'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderBottomColor = '#4A4A44'
            e.currentTarget.style.color = '#DEDEDA'
          }}
        >
          {c.cta}
        </Link>
      </div>
    </section>
  )
}
