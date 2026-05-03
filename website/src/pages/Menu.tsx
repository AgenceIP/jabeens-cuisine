import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { menuData } from '@/data/menuData'
import type { MenuCategory } from '@/types'
import Footer from '@/components/layout/Footer'
import { useT } from '@/contexts/LanguageContext'

type MenuType = 'dineIn' | 'takeOut'

const PDF_MENUS = [
  {
    type: 'dineIn' as MenuType,
    title: 'DINE IN',
    subtitle: 'Restaurant Menu',
    pdf: '/menu/Restaurant MENU.pdf',
  },
  {
    type: 'takeOut' as MenuType,
    title: 'TAKE OUT',
    subtitle: 'À emporter',
    pdf: '/menu/TAKE OUT MENU.pdf',
  },
]

function MenuItemRow({ item }: { item: MenuCategory['items'][0] }) {
  return (
    <div
      className="flex items-start gap-4 py-5"
      style={{ borderBottom: '1px solid #1E1E1E' }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {item.vegetarian && (
            <span className="text-gold" style={{ fontSize: '0.65rem' }}>✦</span>
          )}
          <p
            className="text-display text-text-primary"
            style={{ fontSize: '1.1rem' }}
          >
            {item.name}
          </p>
        </div>
        {item.description && (
          <p
            className="text-text-muted font-light leading-relaxed"
            style={{ fontSize: '0.78rem' }}
          >
            {item.description}
          </p>
        )}
      </div>
      {item.image ? (
        <img
          src={item.image}
          alt={item.name}
          style={{
            width: 120,
            height: 80,
            objectFit: 'cover',
            flexShrink: 0,
            filter: 'brightness(0.88) contrast(1.05)',
          }}
        />
      ) : (
        <p
          className="text-text-muted font-light flex-shrink-0 pt-1"
          style={{ fontSize: '0.85rem' }}
        >
          ——
        </p>
      )}
    </div>
  )
}

export default function Menu() {
  const [activeMenu, setActiveMenu] = useState<MenuType>('dineIn')
  const [activeId, setActiveId] = useState(menuData[0].id)
  const t = useT()
  const m = t.menuPage

  const filteredData = useMemo(
    () =>
      menuData
        .map(cat => ({
          ...cat,
          items: cat.items.filter(item => !item.menus || item.menus.includes(activeMenu)),
        }))
        .filter(cat => cat.items.length > 0),
    [activeMenu]
  )

  useEffect(() => {
    if (filteredData.length > 0) setActiveId(filteredData[0].id)
  }, [activeMenu])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200
      for (let i = filteredData.length - 1; i >= 0; i--) {
        const el = document.getElementById(filteredData[i].id)
        if (el && el.offsetTop <= scrollY) {
          setActiveId(filteredData[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [filteredData])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Page hero */}
      <div
        className="pt-32 pb-16 px-8 md:px-16 text-center"
        style={{ background: '#0A0A0A', borderBottom: '1px solid #1E1E1E' }}
      >
        <p className="text-label text-gold mb-4">{m.label}</p>
        <h1
          className="text-display text-text-primary"
          style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
        >
          {m.heading}
        </h1>
        <p className="text-text-muted font-light mt-4 text-sm">{m.subheading}</p>
      </div>

      {/* PDF Previews */}
      <div style={{ background: '#0A0A0A', padding: '60px 32px 48px', borderBottom: '1px solid #1E1E1E' }}>
        <p
          className="text-center text-label text-gold mb-10"
          style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}
        >
          NOS MENUS — TÉLÉCHARGER OU CONSULTER
        </p>
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          style={{ maxWidth: 900, margin: '0 auto', perspective: 1200 }}
        >
          {PDF_MENUS.map((menu, i) => (
            <motion.div
              key={menu.type}
              initial={{ opacity: 0, y: 50, rotateY: i === 0 ? 12 : -12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                style={{
                  border: '1px solid #2A2A2A',
                  overflow: 'hidden',
                  background: '#0E0E0E',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #1E1E1E',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontFamily: 'Montserrat',
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.22em',
                        color: '#A8956A',
                      }}
                    >
                      {menu.title}
                    </p>
                    <p
                      style={{
                        fontFamily: 'Montserrat',
                        fontSize: '0.55rem',
                        color: '#555',
                        marginTop: 3,
                        letterSpacing: '0.1em',
                      }}
                    >
                      {menu.subtitle}
                    </p>
                  </div>
                  <a
                    href={menu.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    style={{
                      fontFamily: 'Montserrat',
                      fontSize: '0.52rem',
                      color: '#555',
                      letterSpacing: '0.12em',
                      textDecoration: 'none',
                      border: '1px solid #2A2A2A',
                      padding: '5px 10px',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLAnchorElement).style.color = '#A8956A'
                      ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#A8956A'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLAnchorElement).style.color = '#555'
                      ;(e.currentTarget as HTMLAnchorElement).style.borderColor = '#2A2A2A'
                    }}
                  >
                    ↗ OUVRIR
                  </a>
                </div>

                {/* PDF embed */}
                <div style={{ height: 460, overflow: 'hidden', background: '#111' }}>
                  <iframe
                    src={`${menu.pdf}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    title={menu.title}
                    style={{ width: '100%', height: '100%', border: 'none', pointerEvents: 'none' }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Menu type tab switcher */}
      <div style={{ background: '#0A0A0A' }}>
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            borderBottom: '1px solid #1E1E1E',
          }}
        >
          {PDF_MENUS.map(menu => (
            <button
              key={menu.type}
              onClick={() => setActiveMenu(menu.type)}
              style={{
                flex: 1,
                padding: '22px 0',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${activeMenu === menu.type ? '#A8956A' : 'transparent'}`,
                cursor: 'pointer',
                fontFamily: 'Montserrat',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: activeMenu === menu.type ? '#A8956A' : '#444',
                transition: 'color 0.3s, border-color 0.3s',
              }}
            >
              {menu.title}
            </button>
          ))}
        </div>
      </div>

      {/* Menu content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMenu}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex min-h-screen"
          style={{ background: '#0A0A0A' }}
        >
          {/* Sticky sidebar — desktop */}
          <aside
            className="hidden md:block flex-shrink-0 py-12"
            style={{
              width: 240,
              borderRight: '1px solid #1E1E1E',
              position: 'sticky',
              top: 80,
              alignSelf: 'flex-start',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
            }}
          >
            <nav className="px-8">
              {filteredData.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => scrollToSection(cat.id)}
                  className="text-left w-full py-3 transition-all duration-300 block"
                  style={{
                    paddingLeft: '12px',
                    color: activeId === cat.id ? '#A8956A' : '#6B6B6B',
                    fontFamily: 'Montserrat',
                    fontSize: '0.65rem',
                    fontWeight: 500,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    background: 'none',
                    borderTop: 'none',
                    borderRight: 'none',
                    borderBottom: 'none',
                    borderLeft: `2px solid ${activeId === cat.id ? '#A8956A' : 'transparent'}`,
                    cursor: 'pointer',
                  }}
                >
                  <span>{cat.label}</span>
                  {cat.sublabel && (
                    <span
                      className="block"
                      style={{ fontSize: '0.55rem', opacity: 0.6, fontWeight: 400 }}
                    >
                      {cat.sublabel}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Mobile category pills */}
          <div
            className="md:hidden sticky top-20 z-30 w-full px-4 py-3 overflow-x-auto flex gap-2"
            style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #1E1E1E' }}
          >
            {filteredData.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className="flex-shrink-0 text-label py-2 px-4 transition-all duration-300"
                style={{
                  background: activeId === cat.id ? '#A8956A' : 'transparent',
                  color: activeId === cat.id ? '#0A0A0A' : '#6B6B6B',
                  border: `1px solid ${activeId === cat.id ? '#A8956A' : '#1E1E1E'}`,
                  fontSize: '0.55rem',
                  cursor: 'pointer',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Items */}
          <main className="flex-1 py-12 px-4 md:px-16 max-w-3xl">
            {filteredData.map(category => (
              <section key={category.id} id={category.id} className="mb-12 md:mb-20">
                {/* Mobile header */}
                <div
                  className="md:hidden mb-6 flex flex-col items-center text-center py-4"
                  style={{ borderTop: '1px solid #1E1E1E', borderBottom: '1px solid #1E1E1E' }}
                >
                  <span
                    style={{ width: 24, height: 1, background: '#A8956A', display: 'block', marginBottom: 10 }}
                  />
                  <p
                    className="text-label text-gold"
                    style={{ fontSize: '0.7rem', letterSpacing: '0.25em' }}
                  >
                    {category.label}
                  </p>
                  {category.sublabel && (
                    <p className="text-text-muted font-light mt-1" style={{ fontSize: '0.65rem' }}>
                      {category.sublabel}
                    </p>
                  )}
                  <span
                    style={{ width: 24, height: 1, background: '#A8956A', display: 'block', marginTop: 10 }}
                  />
                </div>

                {/* Desktop header */}
                <div className="hidden md:block mb-8">
                  <p
                    className="text-label text-gold mb-2"
                    style={{ borderLeft: '2px solid #A8956A', paddingLeft: '12px' }}
                  >
                    {category.label}
                  </p>
                  {category.sublabel && (
                    <p
                      className="text-text-muted font-light"
                      style={{ fontSize: '0.75rem', paddingLeft: '14px' }}
                    >
                      {category.sublabel}
                    </p>
                  )}
                  <div className="mt-4 gold-rule" />
                </div>

                <div className="px-0">
                  {category.items.map((item, i) => (
                    <MenuItemRow key={i} item={item} />
                  ))}
                </div>
              </section>
            ))}

            <div className="py-12 text-center">
              <p className="text-label text-text-muted" style={{ fontSize: '0.6rem' }}>
                {m.vegetarian}
              </p>
            </div>
          </main>
        </motion.div>
      </AnimatePresence>

      <Footer />
    </>
  )
}
