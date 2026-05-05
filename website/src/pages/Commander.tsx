import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/data/siteConfig'
import { useT } from '@/contexts/LanguageContext'

export default function Commander() {
  const t = useT()
  const c = t.commanderPage

  const platforms = [
    { name: 'Uber Eats', description: c.platforms.uberEats, url: siteConfig.ordering.uberEats },
    { name: 'DoorDash', description: c.platforms.doorDash, url: siteConfig.ordering.doorDash },
    { name: 'SkipTheDishes', description: c.platforms.skip, url: siteConfig.ordering.skipTheDishes },
  ]

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden flex items-center justify-center" style={{ height: '55vh' }}>
        <img src="/assets/food-gen-1.png" alt="" width={896} height={1200} className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.55), rgba(10,10,10,0.9))' }} />
        <div className="relative z-10 text-center px-8">
          <p className="text-label text-gold mb-4">{c.label}</p>
          <h1 className="text-display text-text-primary" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
            {c.heading}
          </h1>
        </div>
      </div>

      <div style={{ background: '#0A0A0A' }}>
        <div className="max-w-3xl mx-auto px-8 py-20">
          <div className="text-center mb-16">
            <p className="text-text-muted font-light leading-relaxed" style={{ fontSize: '0.9rem', whiteSpace: 'pre-line' }}>
              {c.subheading}
            </p>
          </div>

          {/* Platform cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: '#1E1E1E' }}>
            {platforms.map(platform => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center py-14 px-8 text-center transition-all duration-500"
                style={{ background: '#111111' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0A0A0A' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#111111' }}
              >
                <p className="text-label text-text-muted mb-2 transition-colors duration-300 group-hover:text-gold" style={{ fontSize: '0.6rem' }}>
                  {platform.description}
                </p>
                <p className="text-display text-text-primary mb-6 transition-colors duration-300 group-hover:text-gold" style={{ fontSize: '1.4rem' }}>
                  {platform.name}
                </p>
                <span
                  className="text-label transition-all duration-300"
                  style={{ fontSize: '0.6rem', border: '1px solid #1E1E1E', padding: '8px 20px', color: '#6B6B6B' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#A8956A'; e.currentTarget.style.color = '#A8956A' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#1E1E1E'; e.currentTarget.style.color = '#6B6B6B' }}
                >
                  {c.cta}
                </span>
              </a>
            ))}
          </div>

          {/* Order button */}
          <div className="mt-16 py-14 text-center" style={{ border: '1px solid #1E1E1E', background: '#111111' }}>
            {/* TODO: link href to external ordering platform */}
            <a
              href="#"
              style={{
                display: 'inline-block',
                fontFamily: 'Montserrat',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#0A0A0A',
                background: '#A8956A',
                padding: '18px 48px',
                textDecoration: 'none',
                transition: 'background 0.3s, color 0.3s',
              }}
              onMouseEnter={e => {
                const a = e.currentTarget as HTMLAnchorElement
                a.style.background = '#C4AF85'
              }}
              onMouseLeave={e => {
                const a = e.currentTarget as HTMLAnchorElement
                a.style.background = '#A8956A'
              }}
            >
              Order from the menu
            </a>
          </div>

          {/* Hours */}
          <div className="mt-16 text-center">
            <div className="gold-rule mb-8" />
            <p className="text-label text-text-muted mb-6">{c.hours_label}</p>
            <div>
              <p className="text-display text-text-primary" style={{ fontSize: '1.1rem' }}>Tous les jours</p>
              <p className="text-text-muted font-light text-sm">11:00 – 23:00</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
