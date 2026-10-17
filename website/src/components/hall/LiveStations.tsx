import { motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import { livePhotos } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'
import { reveal } from './reveal'

export default function LiveStations() {
  const h = useT().hallPage
  const { lang } = useLang()
  const carts = livePhotos.slice(0, 3)
  const details = livePhotos.slice(3)
  return (
    <section className="melt-band bg-band text-band-ink py-20 md:py-28">
      <div className="max-w-site mx-auto px-6 md:px-16">
        <motion.div {...reveal} className="max-w-2xl mb-12">
          <p className="text-label text-gold-soft mb-3">{h.live.label}</p>
          <h2 className="text-display mb-4" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{h.live.heading}</h2>
          <p className="text-band-ink/80 leading-relaxed">{h.live.text}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {carts.map((p, i) => (
            <motion.figure key={p.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
              <CateringImg id={p.id} alt={p.alt[lang]} className="aspect-[3/4]" />
              <figcaption className="text-label mt-3" style={{ fontSize: 'max(0.7rem, var(--fs-min))' }}>{h.live.carts[i]}</figcaption>
            </motion.figure>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {details.map(p => (
            <motion.figure key={p.id} {...reveal}>
              <CateringImg id={p.id} alt={p.alt[lang]} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[3/4]" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
