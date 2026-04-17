import { useState, useRef, useEffect } from 'react'
import { menuData } from '@/data/menuData'
import type { MenuCategory } from '@/types'
import Footer from '@/components/layout/Footer'
import { useT } from '@/contexts/LanguageContext'

function MenuItemRow({ item }: { item: MenuCategory['items'][0] }) {
  return (
    <div
      className="flex items-start justify-between py-5 gap-4"
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
          <p className="text-text-muted font-light leading-relaxed" style={{ fontSize: '0.78rem' }}>
            {item.description}
          </p>
        )}
      </div>
      <p className="text-text-muted font-light flex-shrink-0 pt-1" style={{ fontSize: '0.85rem' }}>——</p>
    </div>
  )
}

export default function Menu() {
  const [activeId, setActiveId] = useState(menuData[0].id)
  const mainRef = useRef<HTMLDivElement>(null)
  const t = useT()
  const m = t.menuPage

  useEffect(() => {
    const handleScroll = () => {
      const sections = menuData.map(cat => document.getElementById(cat.id))
      const scrollY = window.scrollY + 200
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollY) {
          setActiveId(menuData[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top, behavior: 'smooth' })
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
        <p className="text-text-muted font-light mt-4 text-sm">
          {m.subheading}
        </p>
      </div>

      <div
        className="flex min-h-screen"
        ref={mainRef}
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
            {menuData.map(cat => (
              <button
                key={cat.id}
                onClick={() => scrollToSection(cat.id)}
                className="text-left w-full py-3 transition-all duration-300 block"
                style={{
                  borderLeft: `2px solid ${activeId === cat.id ? '#A8956A' : 'transparent'}`,
                  paddingLeft: '12px',
                  color: activeId === cat.id ? '#A8956A' : '#6B6B6B',
                  fontFamily: 'Montserrat',
                  fontSize: '0.65rem',
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}
              >
                <span>{cat.label}</span>
                {cat.sublabel && (
                  <span className="block" style={{ fontSize: '0.55rem', opacity: 0.6, fontWeight: 400 }}>
                    {cat.sublabel}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Mobile category pills */}
        <div className="md:hidden sticky top-20 z-30 w-full px-4 py-3 overflow-x-auto flex gap-2" style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid #1E1E1E' }}>
          {menuData.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToSection(cat.id)}
              className="flex-shrink-0 text-label py-2 px-4 transition-all duration-300"
              style={{
                background: activeId === cat.id ? '#A8956A' : 'transparent',
                color: activeId === cat.id ? '#0A0A0A' : '#6B6B6B',
                border: '1px solid',
                borderColor: activeId === cat.id ? '#A8956A' : '#1E1E1E',
                fontSize: '0.55rem',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu content */}
        <main className="flex-1 py-12 px-8 md:px-16 max-w-3xl">
          {menuData.map(category => (
            <section
              key={category.id}
              id={category.id}
              className="mb-20"
            >
              <div className="mb-8">
                <p
                  className="text-label text-gold mb-2"
                  style={{
                    borderLeft: '2px solid #A8956A',
                    paddingLeft: '12px',
                  }}
                >
                  {category.label}
                </p>
                {category.sublabel && (
                  <p className="text-text-muted font-light" style={{ fontSize: '0.75rem', paddingLeft: '14px' }}>
                    {category.sublabel}
                  </p>
                )}
                <div className="mt-4 gold-rule" />
              </div>

              <div>
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
      </div>

      <Footer />
    </>
  )
}
