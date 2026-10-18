import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menuData, dineInMenuData, takeOutMenuData } from '@/data/menuData'
import type { MenuCategory } from '@/types'
import Footer from '@/components/layout/Footer'
import { useT, useLang } from '@/contexts/LanguageContext'
import GoldFlecks from '@/components/decor/GoldFlecks'

type MenuType = 'dineIn' | 'takeOut'

function VegLeaf({ size = 14, label }: { size?: number; label: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="#74B36B"
      role="img" aria-label={label} style={{ flexShrink: 0 }}
    >
      <path d="M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93-2.77 2.34-4.71 5.61-5.39 9.32 2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z" />
    </svg>
  )
}

function MenuItemRow({ item, lang }: { item: MenuCategory['items'][0]; lang: string }) {
  const desc = lang === 'fr' ? item.description : (item.descriptionEn ?? item.description)
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid rgb(var(--c-line))' }}>
      {/* Texte */}
      <div style={{ flex: 1, minWidth: 0, padding: '22px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span className="text-gold" style={{ fontSize: 'max(0.65rem, var(--fs-min))', flexShrink: 0 }}>✦</span>
          <p className="text-display text-text-primary" style={{ fontSize: '1.4rem', lineHeight: 1.15 }}>{item.name}</p>
          {item.vegetarian && <VegLeaf label={lang === 'fr' ? 'Végétarien' : 'Vegetarian'} />}
        </div>
        {desc && (
          <p className="text-text-muted font-light" style={{ fontSize: 'max(0.88rem, var(--fs-body-min))', lineHeight: 1.7 }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  )
}

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState<MenuType>('dineIn')
  const [activeId, setActiveId] = useState(menuData[0].id)
  const t = useT()
  const m = t.menuPage
  const { lang } = useLang()

  const PDF_MENUS = [
    { type: 'dineIn' as MenuType, title: m.dineIn.toUpperCase(), subtitle: m.dineInSubtitle, pdf: '/menu/Restaurant MENU.pdf' },
    { type: 'takeOut' as MenuType, title: m.takeOut.toUpperCase(), subtitle: m.takeOutSubtitle, pdf: '/menu/TAKE OUT MENU.pdf' },
  ]
  const DRINKS_PDF = { title: m.drinks.toUpperCase(), subtitle: m.drinksSubtitle, pdf: '/menu/DrinkMenu.pdf' }

  const catLabel = (cat: MenuCategory) => lang === 'fr' ? (cat.labelFr ?? cat.label) : cat.label
  const catSublabel = (cat: MenuCategory) => lang === 'fr' ? (cat.sublabelFr ?? cat.sublabel) : cat.sublabel

  const currentData = activeMenu === 'dineIn' ? dineInMenuData : takeOutMenuData

  useEffect(() => { setActiveId(currentData[0].id) }, [activeMenu])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200
      for (let i = currentData.length - 1; i >= 0; i--) {
        const el = document.getElementById(currentData[i].id)
        if (el && el.offsetTop <= scrollY) { setActiveId(currentData[i].id); break }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentData])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 160, behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Hero — integrated with tab switcher ── */}
      <div className="relative isolate pt-32 pb-0 px-8 md:px-16 text-center" style={{ background: 'transparent' }}>
        <GoldFlecks className="-z-10 right-[6%] top-24 w-28 md:w-48" />
        <p className="text-label text-gold mb-4">{m.label}</p>
        <h1 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>{m.heading}</h1>
        <p className="text-text-muted font-light text-sm mb-10">{m.subheading}</p>

        {/* Tab switcher — part of the hero, same visual zone */}
        <div style={{ display: 'flex', maxWidth: 480, margin: '0 auto', borderTop: '1px solid rgb(var(--c-accent) / 0.2)' }}>
          {PDF_MENUS.map(menu => (
            <button
              key={menu.type}
              onClick={() => setActiveMenu(menu.type)}
              style={{
                flex: 1, padding: '20px 0', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeMenu === menu.type ? 'rgb(var(--c-accent))' : 'transparent'}`,
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontSize: 'max(0.65rem, var(--fs-min))', fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: activeMenu === menu.type ? 'rgb(var(--c-accent))' : 'rgb(var(--c-muted))',
                transition: 'color 0.3s, border-color 0.3s',
              }}
            >{menu.title}</button>
          ))}
        </div>
      </div>

      {/* ── MOBILE sticky nav — category pills only (tabs are in the hero above) ── */}
      <div
        className="md:hidden sticky z-40"
        style={{ top: 79, background: 'rgb(var(--c-nav) / 0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgb(var(--c-accent) / 0.15)' }}
      >
        <div style={{ overflowX: 'auto', display: 'flex', gap: 8, padding: '10px 16px' }}>
          {currentData.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              style={{
                flexShrink: 0, padding: '6px 14px', cursor: 'pointer',
                background: activeId === cat.id ? 'rgb(var(--c-btn))' : 'transparent',
                color: activeId === cat.id ? 'rgb(var(--c-btn-ink))' : 'rgb(var(--c-muted))',
                border: `1px solid ${activeId === cat.id ? 'rgb(var(--c-btn))' : 'rgb(var(--c-ink) / 0.3)'}`,
                fontFamily: 'var(--font-body)', fontSize: 'max(0.52rem, var(--fs-min))', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                transition: 'all 0.25s', whiteSpace: 'nowrap' as const,
              }}
            >{catLabel(cat)}</button>
          ))}
        </div>
      </div>

      {/* ── Menu content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMenu}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          style={{ background: 'transparent', display: 'flex', minHeight: '100vh' }}
        >
          {/* Desktop sidebar */}
          <aside
            className="hidden md:block flex-shrink-0 py-12"
            style={{ width: 300, borderRight: '1px solid rgb(var(--c-line))', position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
          >
            <nav className="px-10">
              {currentData.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  className="text-left w-full py-4 block transition-all duration-300"
                  style={{
                    paddingLeft: '16px', background: 'none', cursor: 'pointer',
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                    borderLeft: `2px solid ${activeId === cat.id ? 'rgb(var(--c-accent))' : 'transparent'}`,
                    color: activeId === cat.id ? 'rgb(var(--c-accent))' : 'rgb(var(--c-muted))',
                    fontFamily: 'var(--font-body)', fontSize: 'max(0.72rem, var(--fs-min))', fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  }}
                >
                  <span>{catLabel(cat)}</span>
                  {cat.sublabel && <span className="block" style={{ fontSize: 'max(0.58rem, var(--fs-min))', opacity: 0.85, fontWeight: 500, marginTop: 2 }}>{catSublabel(cat)}</span>}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 py-8 md:py-12 px-4 md:px-16">
            {currentData.map(category => (
              <section key={category.id} id={category.id} className="mb-10 md:mb-20">
                {/* Category header */}
                <div className="mb-2" style={{ paddingTop: 56, paddingBottom: 20, textAlign: 'center' }}>
                  {category.sublabel && (
                    <p className="text-label text-text-muted" style={{ fontSize: 'max(0.58rem, var(--fs-min))', letterSpacing: '0.35em', marginBottom: 10 }}>
                      {catSublabel(category)}
                    </p>
                  )}
                  <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', marginBottom: 20 }}>
                    {catLabel(category)}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgb(var(--c-line))' }} />
                    <span className="text-gold" style={{ fontSize: 'max(0.6rem, var(--fs-min))' }}>✦</span>
                    <div style={{ flex: 1, height: 1, background: 'rgb(var(--c-line))' }} />
                  </div>
                </div>

                {category.items.map((item, i) => (
                  <MenuItemRow key={i} item={item} lang={lang} />
                ))}
              </section>
            ))}

            <div className="py-10" style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center' }}>
              <VegLeaf size={13} label={lang === 'fr' ? 'Végétarien' : 'Vegetarian'} />
              <p className="text-label text-text-muted" style={{ fontSize: 'max(0.6rem, var(--fs-min))' }}>{m.vegetarian}</p>
            </div>
          </main>
        </motion.div>
      </AnimatePresence>

      {/* PDF Menus — at the bottom */}
      <div style={{ background: 'transparent', padding: '48px 24px 60px', borderTop: '1px solid rgb(var(--c-line))' }}>
        <p className="text-center text-label text-gold mb-8" style={{ fontSize: 'max(0.6rem, var(--fs-min))', letterSpacing: '0.25em' }}>
          {m.pdfLabel.toUpperCase()}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ maxWidth: 960, margin: '0 auto' }}>
          {[...PDF_MENUS, DRINKS_PDF].map((menu) => (
            <div key={menu.title} style={{ border: '1px solid rgb(var(--c-line))', overflow: 'hidden', background: 'rgb(var(--c-surface))' }}>
              {/* Mobile: full-card button */}
              <a href={menu.pdf} target="_blank" rel="noopener noreferrer" className="md:hidden flex flex-col items-center justify-center py-10 px-6" style={{ textDecoration: 'none' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'max(0.88rem, var(--fs-body-min))', fontWeight: 700, letterSpacing: '0.25em', color: 'rgb(var(--c-ink))', textAlign: 'center' }}>{menu.title}</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'max(0.6rem, var(--fs-min))', color: 'rgb(var(--c-muted))', marginTop: 6, textAlign: 'center' }}>{menu.subtitle}</p>
              </a>
              {/* Desktop */}
              <div className="hidden md:flex" style={{ padding: '14px 20px', borderBottom: '1px solid rgb(var(--c-line))', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'max(0.65rem, var(--fs-min))', fontWeight: 600, letterSpacing: '0.22em', color: 'rgb(var(--c-accent))' }}>{menu.title}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 'max(0.55rem, var(--fs-min))', color: 'rgb(var(--c-muted))', fontWeight: 500, marginTop: 3 }}>{menu.subtitle}</p>
                </div>
                <a href={menu.pdf} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'var(--font-body)', fontSize: 'max(0.72rem, var(--fs-min))', fontWeight: 700, color: 'rgb(var(--c-ink))', letterSpacing: '0.12em', textDecoration: 'none', border: '1px solid rgb(var(--c-ink) / 0.4)', padding: '6px 12px', transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = 'rgb(var(--c-accent))'; a.style.borderColor = 'rgb(var(--c-accent))' }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = 'rgb(var(--c-ink))'; a.style.borderColor = 'rgb(var(--c-ink) / 0.4)' }}
                >{m.openButton}</a>
              </div>
              <div className="hidden md:block" style={{ height: 420, overflow: 'hidden', background: 'rgb(var(--c-surface))' }}>
                <iframe src={`${menu.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} title={menu.title} style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  )
}
