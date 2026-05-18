import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menuData, dineInMenuData, takeOutMenuData } from '@/data/menuData'
import type { MenuCategory } from '@/types'
import Footer from '@/components/layout/Footer'
import { useT, useLang } from '@/contexts/LanguageContext'

type MenuType = 'dineIn' | 'takeOut'

type LightboxItem = { image: string; name: string; description?: string; vegetarian?: boolean }

function MenuItemRow({ item, onImageClick, lang }: { item: MenuCategory['items'][0]; onImageClick: (item: LightboxItem) => void; lang: string }) {
  const desc = lang === 'fr' ? item.description : (item.descriptionEn ?? item.description)
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid #1E1E1E', minHeight: 110 }}>
      {/* Image — gauche */}
      {item.image && (
        <div style={{ width: 200, flexShrink: 0, padding: 10, display: 'flex', alignItems: 'stretch' }}>
          <button
            onClick={() => onImageClick({ image: item.image!, name: item.name, description: desc, vegetarian: item.vegetarian })}
            style={{ flex: 1, overflow: 'hidden', padding: 0, background: 'none', border: '1px solid #A8956A', cursor: 'zoom-in', display: 'block', position: 'relative' }}
            aria-label={lang === 'fr' ? `Voir ${item.name}` : `View ${item.name}`}
          >
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              decoding="async"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.85)', transition: 'transform 0.4s ease, filter 0.4s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.filter = 'brightness(1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.filter = 'brightness(0.85)' }}
            />
          </button>
        </div>
      )}
      {/* Texte */}
      <div style={{ flex: 1, minWidth: 0, padding: '22px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          {item.vegetarian && <span className="text-gold" style={{ fontSize: '0.65rem', flexShrink: 0 }}>✦</span>}
          <p className="text-display text-text-primary" style={{ fontSize: '1.4rem', lineHeight: 1.15 }}>{item.name}</p>
        </div>
        {desc && (
          <p className="text-text-muted font-light" style={{ fontSize: '0.88rem', lineHeight: 1.7 }}>
            {desc}
          </p>
        )}
      </div>
    </div>
  )
}

function ImageLightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  const { lang } = useLang()
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', padding: '24px' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ position: 'relative', maxWidth: 520, width: '100%', background: 'rgba(6,13,24,0.97)', border: '1px solid #2A2A2A', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', overflow: 'hidden' }}
      >
        <button
          onClick={onClose} aria-label={lang === 'fr' ? 'Fermer' : 'Close'}
          style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, width: 30, height: 30, borderRadius: '50%', background: 'rgba(10,10,10,0.7)', border: '1px solid #3A3A3A', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', backdropFilter: 'blur(4px)' }}
        >✕</button>
        <img src={item.image} alt={item.name} style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '65vh', display: 'block', margin: '0 auto' }} />
        <div style={{ padding: '20px 24px 24px' }}>
          <div className="flex items-center gap-2 mb-2">
            {item.vegetarian && <span className="text-gold" style={{ fontSize: '0.65rem' }}>✦</span>}
            <p className="text-display text-text-primary" style={{ fontSize: '1.2rem' }}>{item.name}</p>
          </div>
          {item.description && (
            <p className="text-text-muted font-light leading-relaxed" style={{ fontSize: '0.82rem' }}>{item.description}</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState<MenuType>('dineIn')
  const [activeId, setActiveId] = useState(menuData[0].id)
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null)
  const t = useT()
  const m = t.menuPage
  const { lang } = useLang()

  const PDF_MENUS = [
    { type: 'dineIn' as MenuType, title: m.dineIn.toUpperCase(), subtitle: m.dineInSubtitle, pdf: '/menu/Restaurant MENU.pdf' },
    { type: 'takeOut' as MenuType, title: m.takeOut.toUpperCase(), subtitle: m.takeOutSubtitle, pdf: '/menu/TAKE OUT MENU.pdf' },
  ]
  const DRINKS_PDF = { title: m.drinks.toUpperCase(), subtitle: m.drinksSubtitle, pdf: '/menu/DrinkMenu.pdf' }

  useEffect(() => {
    document.title = "Menu — Jabeen's Cuisine | Indien & Pakistanais Halal · Brossard"
  }, [])

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
      {/* Hero */}
      <div className="pt-32 pb-12 px-8 md:px-16 text-center" style={{ background: 'transparent', borderBottom: '1px solid #1E1E1E' }}>
        <p className="text-label text-gold mb-4">{m.label}</p>
        <h1 className="text-display text-text-primary" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>{m.heading}</h1>
        <p className="text-text-muted font-light mt-4 text-sm">{m.subheading}</p>
      </div>

      {/* ── MOBILE sticky nav bar: tab switcher + category pills ── */}
      <div
        className="md:hidden sticky z-40"
        style={{ top: 79, background: 'rgba(6, 13, 24, 0.92)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #1E1E1E' }}
      >
        {/* Tab switcher */}
        <div style={{ display: 'flex', borderBottom: '1px solid #1E1E1E' }}>
          {PDF_MENUS.map(menu => (
            <button
              key={menu.type}
              onClick={() => setActiveMenu(menu.type)}
              style={{
                flex: 1, padding: '14px 0', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeMenu === menu.type ? '#A8956A' : 'transparent'}`,
                cursor: 'pointer', fontFamily: 'Montserrat', fontSize: '0.6rem', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                color: activeMenu === menu.type ? '#A8956A' : '#DEDEDA',
                transition: 'color 0.3s',
              }}
            >{menu.title}</button>
          ))}
        </div>
        {/* Category pills */}
        <div style={{ overflowX: 'auto', display: 'flex', gap: 8, padding: '10px 16px' }}>
          {currentData.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              style={{
                flexShrink: 0, padding: '6px 14px', cursor: 'pointer',
                background: activeId === cat.id ? '#A8956A' : 'transparent',
                color: activeId === cat.id ? '#0A0A0A' : '#DEDEDA',
                border: `1px solid ${activeId === cat.id ? '#A8956A' : '#3A3A3A'}`,
                fontFamily: 'Montserrat', fontSize: '0.52rem', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                transition: 'all 0.25s', whiteSpace: 'nowrap' as const,
              }}
            >{catLabel(cat)}</button>
          ))}
        </div>
      </div>

      {/* ── DESKTOP tab switcher ── */}
      <div className="hidden md:block" style={{ background: 'transparent' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', borderBottom: '1px solid #1E1E1E' }}>
          {PDF_MENUS.map(menu => (
            <button
              key={menu.type}
              onClick={() => setActiveMenu(menu.type)}
              style={{
                flex: 1, padding: '22px 0', background: 'none', border: 'none',
                borderBottom: `2px solid ${activeMenu === menu.type ? '#A8956A' : 'transparent'}`,
                cursor: 'pointer', fontFamily: 'Montserrat', fontSize: '0.65rem', fontWeight: 600,
                letterSpacing: '0.22em', textTransform: 'uppercase' as const,
                color: activeMenu === menu.type ? '#A8956A' : '#DEDEDA',
                transition: 'color 0.3s, border-color 0.3s',
              }}
            >{menu.title}</button>
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
            style={{ width: 300, borderRight: '1px solid #1E1E1E', position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
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
                    borderLeft: `2px solid ${activeId === cat.id ? '#A8956A' : 'transparent'}`,
                    color: activeId === cat.id ? '#A8956A' : '#6B6B6B',
                    fontFamily: 'Montserrat', fontSize: '0.72rem', fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  }}
                >
                  <span>{catLabel(cat)}</span>
                  {cat.sublabel && <span className="block" style={{ fontSize: '0.58rem', opacity: 0.85, fontWeight: 500, marginTop: 2 }}>{catSublabel(cat)}</span>}
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
                    <p className="text-label text-text-muted" style={{ fontSize: '0.58rem', letterSpacing: '0.35em', marginBottom: 10 }}>
                      {catSublabel(category)}
                    </p>
                  )}
                  <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(1.8rem, 3vw, 3rem)', marginBottom: 20 }}>
                    {catLabel(category)}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ flex: 1, height: 1, background: '#1E1E1E' }} />
                    <span className="text-gold" style={{ fontSize: '0.6rem' }}>✦</span>
                    <div style={{ flex: 1, height: 1, background: '#1E1E1E' }} />
                  </div>
                </div>

                {category.items.map((item, i) => (
                  <MenuItemRow key={i} item={item} onImageClick={setLightbox} lang={lang} />
                ))}
              </section>
            ))}

            <div className="py-10 text-center">
              <p className="text-label text-text-muted" style={{ fontSize: '0.6rem' }}>{m.vegetarian}</p>
            </div>
          </main>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {lightbox && <ImageLightbox item={lightbox} onClose={() => setLightbox(null)} />}
      </AnimatePresence>

      {/* PDF Menus — at the bottom */}
      <div style={{ background: 'transparent', padding: '48px 24px 60px', borderTop: '1px solid #1E1E1E' }}>
        <p className="text-center text-label text-gold mb-8" style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}>
          {m.pdfLabel.toUpperCase()}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ maxWidth: 960, margin: '0 auto' }}>
          {[...PDF_MENUS, DRINKS_PDF].map((menu) => (
            <div key={menu.title} style={{ border: '1px solid #2A2A2A', overflow: 'hidden', background: 'rgba(6,13,24,0.8)' }}>
              {/* Mobile: full-card button */}
              <a href={menu.pdf} target="_blank" rel="noopener noreferrer" className="md:hidden flex flex-col items-center justify-center py-10 px-6" style={{ textDecoration: 'none' }}>
                <p style={{ fontFamily: 'Montserrat', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.25em', color: '#F5F5F0', textAlign: 'center' }}>{menu.title}</p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '0.6rem', color: '#DEDEDA', marginTop: 6, textAlign: 'center' }}>{menu.subtitle}</p>
              </a>
              {/* Desktop */}
              <div className="hidden md:flex" style={{ padding: '14px 20px', borderBottom: '1px solid #1E1E1E', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'Montserrat', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.22em', color: '#A8956A' }}>{menu.title}</p>
                  <p style={{ fontFamily: 'Montserrat', fontSize: '0.55rem', color: '#DEDEDA', fontWeight: 500, marginTop: 3 }}>{menu.subtitle}</p>
                </div>
                <a href={menu.pdf} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'Montserrat', fontSize: '0.72rem', fontWeight: 700, color: '#F5F5F0', letterSpacing: '0.12em', textDecoration: 'none', border: '1px solid #DEDEDA', padding: '6px 12px', transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#A8956A'; a.style.borderColor = '#A8956A' }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#F5F5F0'; a.style.borderColor = '#DEDEDA' }}
                >{m.openButton}</a>
              </div>
              <div className="hidden md:block" style={{ height: 420, overflow: 'hidden', background: 'rgba(6,13,24,0.6)' }}>
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
