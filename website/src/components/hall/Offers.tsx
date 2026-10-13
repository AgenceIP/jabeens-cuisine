import { motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import { buffetPhotos, hallPhotos } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'
import { reveal } from './reveal'

export default function Offers() {
  const h = useT().hallPage
  const { lang } = useLang()
  const cards = [
    { photo: hallPhotos[2], copy: h.offers.hall },
    { photo: buffetPhotos[0], copy: h.offers.catering },
  ]
  return (
    <section className="max-w-site mx-auto px-6 md:px-16 pb-20 md:pb-28">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {cards.map(({ photo, copy }, i) => (
          <motion.article key={photo.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="bg-surface border border-border-subtle">
            <CateringImg id={photo.id} alt={photo.alt[lang]} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3]" />
            <div className="p-6 md:p-8">
              <p className="text-label text-gold mb-2">{copy.label}</p>
              <h2 className="text-display text-text-primary mb-3" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.2rem)' }}>{copy.title}</h2>
              <p className="text-text-muted leading-relaxed">{copy.text}</p>
            </div>
          </motion.article>
        ))}
      </div>
      <motion.div {...reveal} className="mt-12 text-center">
        <p className="text-label text-gold mb-4">{h.occasionsLabel}</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {h.occasions.map(o => (
            <li key={o} className="text-label text-text-primary border border-text-primary/30 px-5 py-3" style={{ fontSize: '0.7rem' }}>{o}</li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}
