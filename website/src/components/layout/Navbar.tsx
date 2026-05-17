import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavbarScroll } from '@/hooks/useNavbarScroll'
import { useT, useLang } from '@/contexts/LanguageContext'
import MagneticButton from '@/components/ui/MagneticButton'

export default function Navbar() {
  const scrolled = useNavbarScroll(60)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const t = useT()
  const { lang, setLang } = useLang()

  const closeMobile = () => setMobileOpen(false)

  const ORDER_URL = 'https://jabeenscuisine.clusterpos.com/'

  const navLinks = [
    { label: t.nav.menu,       to: '/menu' },
    { label: t.nav.order,      to: ORDER_URL, external: true },
    { label: t.nav.hallRental, to: '/location-salle' },
    { label: t.nav.ourStory,   to: '/notre-histoire' },
  ]

  const allLinks = [
    { label: t.nav.home,       to: '/' },
    { label: t.nav.menu,       to: '/menu' },
    { label: t.nav.order,      to: ORDER_URL, external: true },
    { label: t.nav.ourStory,   to: '/notre-histoire' },
    { label: t.nav.hallRental, to: '/location-salle' },
  ]

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.92)' : 'rgba(0,0,0,0.25)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(30,30,30,0.8)' : 'none',
        }}
      >
        <div className="max-w-site mx-auto px-8 md:px-16 flex items-center h-20" style={{ gap: 0 }}>

          {/* Logo — hard left */}
          <Link
            to="/"
            onClick={() => { closeMobile(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex-shrink-0"
          >
            <img
              src="/assets/logo-main.png"
              alt="Jabeen's Cuisine"
              width={320}
              height={80}
              className="w-52 md:w-80"
              style={{ objectFit: 'contain' }}
              fetchPriority="high"
              decoding="async"
            />
          </Link>

          {/* Center links — desktop only */}
          <div className="hidden md:flex items-center flex-1 justify-center" style={{ gap: lang === 'fr' ? '1.8rem' : '2.5rem' }}>
            {navLinks.map(link => link.external ? (
              <a
                key={link.to}
                href={link.to}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label transition-colors duration-300 hover:text-gold text-text-primary"
                style={{ fontSize: lang === 'fr' ? '0.62rem' : '0.72rem', fontWeight: 700, letterSpacing: lang === 'fr' ? '0.14em' : '0.2em' }}
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`text-label transition-colors duration-300 hover:text-gold ${
                  location.pathname === link.to ? 'text-gold' : 'text-text-primary'
                }`}
                style={{ fontSize: lang === 'fr' ? '0.62rem' : '0.72rem', fontWeight: 700, letterSpacing: lang === 'fr' ? '0.14em' : '0.2em' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Réserver CTA + lang toggle — desktop */}
          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            <MagneticButton strength={0.2}>
              <a
                href="tel:4509263111"
                className="text-label border border-text-primary text-text-primary px-6 py-3 transition-all duration-300 hover:border-gold hover:text-gold block text-center"
                style={{ fontSize: '0.76rem', fontWeight: 700 }}
              >
                {t.nav.reserve}
              </a>
            </MagneticButton>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          {/* Mobile: hamburger */}
          <div className="md:hidden flex-1 flex justify-end">
            <button
              className="flex flex-col gap-1.5 p-2 z-60"
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label="Menu"
            >
              <motion.span
                className="block w-6 h-px bg-text-primary origin-center"
                animate={mobileOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-px bg-text-primary origin-center"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-6 h-px bg-text-primary origin-center"
                animate={mobileOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8">
              <img
                src="/assets/logo-peacock.png"
                alt="Jabeen's Cuisine"
                width={80}
                height={80}
                className="mb-4 opacity-60"
                decoding="async"
              />
              {allLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {link.external ? (
                    <a
                      href={link.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobile}
                      className="text-display text-4xl text-text-primary hover:text-gold transition-colors duration-300 block"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.to}
                      onClick={closeMobile}
                      className="text-display text-4xl text-text-primary hover:text-gold transition-colors duration-300 block"
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center gap-4 mt-4"
              >
                <a
                  href="tel:4509263111"
                  onClick={closeMobile}
                  className="text-label border border-gold text-gold px-8 py-4 block"
                  style={{ fontSize: '0.76rem', fontWeight: 700 }}
                >
                  {t.nav.reserveTable}
                </a>
                <LangToggle lang={lang} setLang={(l) => { setLang(l); closeMobile() }} />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function LangToggle({ lang, setLang }: { lang: 'en' | 'fr'; setLang: (l: 'en' | 'fr') => void }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        border: '1px solid #2A2A2A',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        layoutId="lang-pill"
        style={{
          position: 'absolute',
          top: 0, bottom: 0,
          width: '50%',
          background: '#A8956A',
          left: lang === 'fr' ? '0%' : '50%',
        }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      {(['fr', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            position: 'relative', zIndex: 1,
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'Montserrat', fontSize: '0.55rem', letterSpacing: '0.25em',
            color: lang === l ? '#0A0A0A' : '#6B6B6B',
            transition: 'color 0.3s',
            padding: '6px 10px',
            fontWeight: 600,
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
