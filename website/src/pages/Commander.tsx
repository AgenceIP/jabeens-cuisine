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

          {/* Deliverect */}
          <div className="mt-16 p-12 text-center" style={{ border: '1px solid #1E1E1E', background: '#111111' }}>
            <p className="text-label text-gold mb-4" style={{ fontSize: '0.6rem' }}>{c.deliverect_label}</p>
            <p className="text-display text-text-primary mb-4" style={{ fontSize: '1.5rem' }}>{c.deliverect_heading}</p>
            <p className="text-text-muted font-light mb-8" style={{ fontSize: '0.8rem' }}>{c.deliverect_body}</p>
            {/* EMBED DELIVERECT WIDGET HERE
                1. Go to your Deliverect dashboard
                2. Navigate to Online Ordering > Widget
                3. Copy the embed code and replace this div
            */}
            <div className="w-full min-h-[200px] flex items-center justify-center" style={{ border: '1px dashed #1E1E1E', background: '#0A0A0A' }}>
              <p className="text-label text-text-muted" style={{ fontSize: '0.55rem' }}>{c.deliverect_zone}</p>
            </div>
          </div>

          {/* Hours */}
          <div className="mt-16 text-center">
            <div className="gold-rule mb-8" />
            <p className="text-label text-text-muted mb-6">{c.hours_label}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-8">
              <div>
                <p className="text-display text-text-primary" style={{ fontSize: '1.1rem' }}>{c.days1}</p>
                <p className="text-text-muted font-light text-sm">11:00 – 22:30</p>
              </div>
              <div style={{ width: 1, background: '#1E1E1E' }} className="hidden sm:block" />
              <div>
                <p className="text-display text-text-primary" style={{ fontSize: '1.1rem' }}>{c.days2}</p>
                <p className="text-text-muted font-light text-sm">11:00 – 1:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
