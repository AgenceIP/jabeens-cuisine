import { Link } from 'react-router-dom'
import { siteConfig } from '@/data/siteConfig'
import { useT } from '@/contexts/LanguageContext'

export default function Footer() {
  const t = useT()
  const f = t.footer

  return (
    <footer style={{ background: 'transparent', borderTop: '1px solid rgba(168,149,106,0.15)' }}>

      {/* Google Maps strip */}
      <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
        <iframe
          src={siteConfig.maps.embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(1) contrast(1.1) opacity(0.6)', display: 'block' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Jabeen's Cuisine — Google Maps"
        />
        {/* Bottom gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to top, #060D18 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        {/* Address + directions link */}
        <div
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
          className="max-w-site mx-auto px-8 md:px-16 pb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2"
        >
          <div>
            <p className="text-label text-gold mb-1" style={{ fontSize: '0.55rem' }}>{f.findUs}</p>
            <p style={{ fontFamily: 'Montserrat', fontSize: '0.75rem', color: '#F5F5F0', fontWeight: 300 }}>
              {siteConfig.address}
            </p>
          </div>
          <a
            href={siteConfig.maps.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-label transition-colors duration-300 hover:text-gold"
            style={{ fontSize: '0.55rem', color: '#DEDEDA', fontWeight: 500 }}
          >
            {f.directions}
          </a>
        </div>
      </div>

      <div className="max-w-site mx-auto px-8 md:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <img
              src="/assets/logo-footer.webp"
              alt="Jabeen's Cuisine"
              width={200}
              height={200}
              style={{ objectFit: 'contain' }}
              className="mb-6"
            />
            <p className="text-text-muted text-xs leading-relaxed font-light" style={{ fontFamily: 'Montserrat' }}>
              {f.tagline}<br />
              Brossard, Québec
            </p>
            <div className="flex gap-5 mt-6">
              <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-text-muted hover:text-gold transition-colors duration-300">
                <InstagramIcon />
              </a>
              <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-text-muted hover:text-gold transition-colors duration-300">
                <FacebookIcon />
              </a>
              <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-text-muted hover:text-gold transition-colors duration-300">
                <TikTokIcon />
              </a>
            </div>
          </div>

          {/* Eat */}
          <div>
            <p className="text-label text-gold mb-6">{f.eat}</p>
            <ul className="space-y-3">
              {[
                { label: f.menu, to: '/menu' },
                { label: f.order, to: 'https://jabeenscuisine.clusterpos.com', external: true },
                { label: f.hallRental, to: '/location-salle' },
              ].map(item => (
                <li key={item.to}>
                  {item.external ? (
                    <a
                      href={item.to}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-text-primary transition-colors duration-300 text-sm font-light"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.to} className="text-text-muted hover:text-text-primary transition-colors duration-300 text-sm font-light">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Visit */}
          <div>
            <p className="text-label text-gold mb-6">{f.visit}</p>
            <ul className="space-y-3">
              <li className="text-text-muted text-sm font-light leading-relaxed">
                {siteConfig.address}
              </li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="text-text-muted hover:text-text-primary transition-colors duration-300 text-sm font-light">
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="text-label text-gold mb-6">{f.hours}</p>
            <ul className="space-y-3">
              {f.hoursData.map(({ days, hours }) => (
                <li key={days} className="text-text-muted text-sm font-light">
                  <span className="text-text-primary">{days}</span><br />
                  {hours}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6" style={{ borderTop: '1px solid #1E1E1E' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-label text-text-muted" style={{ fontSize: '0.6rem' }}>
              © {new Date().getFullYear()} Jabeen's Cuisine. {f.copyright}
            </p>
            <p className="text-label text-text-muted" style={{ fontSize: '0.6rem' }}>
              {f.halal}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
    </svg>
  )
}
