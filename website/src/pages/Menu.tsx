import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menuData, dineInMenuData, takeOutMenuData } from '@/data/menuData'
import type { MenuCategory } from '@/types'
import Footer from '@/components/layout/Footer'
import { useT, useLang } from '@/contexts/LanguageContext'

type MenuType = 'dineIn' | 'takeOut'

type LightboxItem = { image: string; name: string; description?: string; vegetarian?: boolean }

function MenuItemRow({ item, onImageClick }: { item: MenuCategory['items'][0]; onImageClick: (item: LightboxItem) => void }) {
  return (
    <div className="flex items-start gap-6 py-6" style={{ borderBottom: '1px solid #1E1E1E' }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          {item.vegetarian && <span className="text-gold" style={{ fontSize: '0.75rem' }}>✦</span>}
          <p className="text-display text-text-primary" style={{ fontSize: '1.25rem' }}>{item.name}</p>
        </div>
        {item.description && (
          <p className="text-text-muted font-light leading-relaxed" style={{ fontSize: '0.92rem' }}>
            {item.description}
          </p>
        )}
      </div>
      {item.image ? (
        <button
          onClick={() => onImageClick({ image: item.image!, name: item.name, description: item.description, vegetarian: item.vegetarian })}
          style={{ padding: 0, background: 'none', border: 'none', cursor: 'zoom-in', flexShrink: 0, overflow: 'hidden', display: 'block' }}
          aria-label={`Voir ${item.name}`}
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            decoding="async"
            width={120}
            height={120}
            style={{
              width: 120, height: 120,
              objectFit: 'contain', background: '#111',
              filter: 'brightness(0.92) contrast(1.05)',
              display: 'block',
              transition: 'transform 0.4s ease, filter 0.4s ease',
            }}
            onMouseEnter={e => { const i = e.currentTarget as HTMLImageElement; i.style.transform = 'scale(1.06)'; i.style.filter = 'brightness(1) contrast(1.05)' }}
            onMouseLeave={e => { const i = e.currentTarget as HTMLImageElement; i.style.transform = 'scale(1)'; i.style.filter = 'brightness(0.92) contrast(1.05)' }}
          />
        </button>
      ) : (
        <div style={{ width: 120, flexShrink: 0 }} />
      )}
    </div>
  )
}

function ImageLightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
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
        style={{ position: 'relative', maxWidth: 520, width: '100%', background: '#0E0E0E', border: '1px solid #2A2A2A', boxShadow: '0 32px 80px rgba(0,0,0,0.8)', overflow: 'hidden' }}
      >
        <button
          onClick={onClose} aria-label="Fermer"
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
      <div className="pt-32 pb-12 px-8 md:px-16 text-center" style={{ background: '#0A0A0A', borderBottom: '1px solid #1E1E1E' }}>
        <p className="text-label text-gold mb-4">{m.label}</p>
        <h1 className="text-display text-text-primary" style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}>{m.heading}</h1>
        <p className="text-text-muted font-light mt-4 text-sm">{m.subheading}</p>
      </div>

      {/* ── MOBILE sticky nav bar: tab switcher + category pills ── */}
      <div
        className="md:hidden sticky z-40"
        style={{ top: 79, background: '#0A0A0A', borderBottom: '1px solid #1E1E1E' }}
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
                color: activeMenu === menu.type ? '#A8956A' : '#555',
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
                color: activeId === cat.id ? '#0A0A0A' : '#6B6B6B',
                border: `1px solid ${activeId === cat.id ? '#A8956A' : '#2A2A2A'}`,
                fontFamily: 'Montserrat', fontSize: '0.52rem', fontWeight: 500,
                letterSpacing: '0.12em', textTransform: 'uppercase' as const,
                transition: 'all 0.25s', whiteSpace: 'nowrap' as const,
              }}
            >{catLabel(cat)}</button>
          ))}
        </div>
      </div>

      {/* ── DESKTOP tab switcher ── */}
      <div className="hidden md:block" style={{ background: '#0A0A0A' }}>
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
                color: activeMenu === menu.type ? '#A8956A' : '#444',
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
          style={{ background: '#0A0A0A', display: 'flex', minHeight: '100vh' }}
        >
          {/* Desktop sidebar */}
          <aside
            className="hidden md:block flex-shrink-0 py-12"
            style={{ width: 240, borderRight: '1px solid #1E1E1E', position: 'sticky', top: 80, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
          >
            <nav className="px-8">
              {currentData.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  className="text-left w-full py-3 block transition-all duration-300"
                  style={{
                    paddingLeft: '12px', background: 'none', cursor: 'pointer',
                    borderTop: 'none', borderRight: 'none', borderBottom: 'none',
                    borderLeft: `2px solid ${activeId === cat.id ? '#A8956A' : 'transparent'}`,
                    color: activeId === cat.id ? '#A8956A' : '#6B6B6B',
                    fontFamily: 'Montserrat', fontSize: '0.65rem', fontWeight: 500,
                    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  }}
                >
                  <span>{catLabel(cat)}</span>
                  {cat.sublabel && <span className="block" style={{ fontSize: '0.55rem', opacity: 0.6, fontWeight: 400 }}>{catSublabel(cat)}</span>}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 py-8 md:py-12 px-4 md:px-16" style={{ maxWidth: 760 }}>
            {currentData.map(category => (
              <section key={category.id} id={category.id} className="mb-10 md:mb-20">
                {/* Category header */}
                <div className="mb-6 md:mb-8">
                  <div className="md:hidden flex flex-col items-center text-center py-4" style={{ borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E' }}>
                    <span style={{ width: 20, height: 1, background: '#A8956A', display: 'block', marginBottom: 8 }} />
                    <p className="text-label text-gold" style={{ fontSize: '0.68rem', letterSpacing: '0.25em' }}>{catLabel(category)}</p>
                    {category.sublabel && <p className="text-text-muted font-light mt-1" style={{ fontSize: '0.62rem' }}>{catSublabel(category)}</p>}
                    <span style={{ width: 20, height: 1, background: '#A8956A', display: 'block', marginTop: 8 }} />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-label text-gold mb-2" style={{ borderLeft: '2px solid #A8956A', paddingLeft: '12px' }}>{catLabel(category)}</p>
                    {category.sublabel && <p className="text-text-muted font-light" style={{ fontSize: '0.75rem', paddingLeft: '14px' }}>{catSublabel(category)}</p>}
                    <div className="mt-4 gold-rule" />
                  </div>
                </div>

                {category.items.map((item, i) => (
                  <MenuItemRow key={i} item={item} onImageClick={setLightbox} />
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
      <div style={{ background: '#0A0A0A', padding: '48px 24px 60px', borderTop: '1px solid #1E1E1E' }}>
        <p className="text-center text-label text-gold mb-8" style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}>
          {m.pdfLabel.toUpperCase()}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={{ maxWidth: 960, margin: '0 auto' }}>
          {[...PDF_MENUS, DRINKS_PDF].map((menu) => (
            <div key={menu.title} style={{ border: '1px solid #2A2A2A', overflow: 'hidden', background: '#0E0E0E' }}>
              {/* Mobile: full-card button */}
              <a href={menu.pdf} target="_blank" rel="noopener noreferrer" className="md:hidden flex flex-col items-center justify-center py-10 px-6" style={{ textDecoration: 'none' }}>
                <p style={{ fontFamily: 'Montserrat', fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.25em', color: '#F5F5F0', textAlign: 'center' }}>{menu.title}</p>
                <p style={{ fontFamily: 'Montserrat', fontSize: '0.6rem', color: '#6B6B6B', marginTop: 6, textAlign: 'center' }}>{menu.subtitle}</p>
              </a>
              {/* Desktop */}
              <div className="hidden md:flex" style={{ padding: '14px 20px', borderBottom: '1px solid #1E1E1E', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontFamily: 'Montserrat', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.22em', color: '#A8956A' }}>{menu.title}</p>
                  <p style={{ fontFamily: 'Montserrat', fontSize: '0.55rem', color: '#555', marginTop: 3 }}>{menu.subtitle}</p>
                </div>
                <a href={menu.pdf} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily: 'Montserrat', fontSize: '0.72rem', fontWeight: 700, color: '#F5F5F0', letterSpacing: '0.12em', textDecoration: 'none', border: '1px solid #6B6B6B', padding: '6px 12px', transition: 'color 0.2s, border-color 0.2s' }}
                  onMouseEnter={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#A8956A'; a.style.borderColor = '#A8956A' }}
                  onMouseLeave={e => { const a = e.currentTarget as HTMLAnchorElement; a.style.color = '#F5F5F0'; a.style.borderColor = '#6B6B6B' }}
                >{m.openButton}</a>
              </div>
              <div className="hidden md:block" style={{ height: 420, overflow: 'hidden', background: '#111' }}>
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
