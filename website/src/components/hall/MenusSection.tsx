import { motion } from 'framer-motion'
import { useT } from '@/contexts/LanguageContext'
import { CATERING_MENUS, type CateringMenuId } from '@/data/cateringMenus'
import { MENU_MINIMUMS } from '@/lib/cateringRules'
import { fmt } from '@/lib/fmt'
import { reveal } from './reveal'

export default function MenusSection({ onChoose }: { onChoose: (menu: CateringMenuId) => void }) {
  const m = useT().hallPage.menus
  return (
    <section id="menus" className="scroll-mt-24 max-w-site mx-auto px-6 md:px-16 py-20 md:py-28">
      <div className="text-center mb-12">
        <p className="text-label text-gold mb-3">{m.label}</p>
        <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{m.heading}</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {CATERING_MENUS.map((menu, i) => (
          <motion.article key={menu.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="bg-surface border border-border-subtle p-7 md:p-8 flex flex-col">
            <p className="text-label text-gold">Menu</p>
            <h3 className="text-display text-text-primary mt-1" style={{ fontSize: '2.4rem' }}>{menu.name}</h3>
            <p className="text-label text-gold border border-gold self-start px-3 py-2 mt-3 mb-5" style={{ fontSize: '0.62rem' }}>{fmt(m.minimum, { n: MENU_MINIMUMS[menu.id] })}</p>
            <ul className="text-text-muted text-[0.95rem] mb-8 flex-1">
              {m.items[menu.id].map(line => <li key={line} className="py-2 border-b border-border-subtle">{line}</li>)}
            </ul>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => onChoose(menu.id)} className="btn-primary text-center">{m.choose}</button>
              <a href={menu.pdf} target="_blank" rel="noopener" className="text-label text-gold underline underline-offset-4 text-center py-2" style={{ fontSize: '0.68rem' }}>
                {m.download} ({menu.name})
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
