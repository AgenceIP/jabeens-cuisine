import { useLang, useT } from '@/contexts/LanguageContext'
import { hallPhotos } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'

export default function HallIntro({ onMenus, onQuote }: { onMenus: () => void; onQuote: () => void }) {
  const h = useT().hallPage
  const { lang } = useLang()
  const stage = hallPhotos[0]
  return (
    <section className="max-w-site mx-auto px-6 md:px-16 pt-32 md:pt-40 pb-16 md:pb-24 grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-16 items-center">
      {/* No entrance animation: this block is the LCP element. */}
      <div>
        <p className="text-label text-gold mb-4">{h.label}</p>
        <h1 className="text-display text-text-primary mb-6" style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.75rem)', lineHeight: 1.05 }}>{h.heading}</h1>
        <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-xl">{h.description}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button type="button" onClick={onMenus} className="btn-primary">{h.ctaMenus}</button>
          <button type="button" onClick={onQuote} className="btn-ghost">{h.ctaQuote}</button>
        </div>
      </div>
      <CateringImg id={stage.id} alt={stage.alt[lang]} priority sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5]" />
    </section>
  )
}
