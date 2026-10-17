import { motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import { buffetPhotos, hallPhotos, type CateringPhoto } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'
import { reveal } from './reveal'

function Group({ title, photos, cols, aspect }: { title: string; photos: CateringPhoto[]; cols: string; aspect: string }) {
  const { lang } = useLang()
  return (
    <div className="mb-14 last:mb-0">
      <h3 className="text-label text-text-primary mb-5" style={{ fontSize: 'max(0.72rem, var(--fs-min))' }}>{title}</h3>
      <div className={`grid grid-cols-2 ${cols} gap-3 md:gap-4`}>
        {photos.map((p, i) => (
          <motion.figure key={p.id} {...reveal} transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }}>
            <div className="overflow-hidden">
              <CateringImg id={p.id} alt={p.alt[lang]} className={`${aspect} transition-transform duration-700 hover:scale-[1.03]`} />
            </div>
            {p.caption && <figcaption className="text-text-muted text-xs mt-2">{p.caption[lang]}</figcaption>}
          </motion.figure>
        ))}
      </div>
    </div>
  )
}

export default function Gallery() {
  const h = useT().hallPage
  return (
    <section className="max-w-site mx-auto px-6 md:px-16 py-20 md:py-28 border-t border-border-subtle">
      <div className="text-center mb-12">
        <p className="text-label text-gold mb-3">{h.galleryLabel}</p>
        <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{h.galleryHeading}</h2>
      </div>
      <Group title={h.galleryHall} photos={hallPhotos} cols="md:grid-cols-3" aspect="aspect-[3/4]" />
      <Group title={h.galleryBuffet} photos={buffetPhotos} cols="md:grid-cols-4" aspect="aspect-square" />
    </section>
  )
}
