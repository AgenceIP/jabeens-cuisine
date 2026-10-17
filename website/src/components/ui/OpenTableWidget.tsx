import { useEffect, useRef } from 'react'
import { siteConfig } from '@/data/siteConfig'

export default function OpenTableWidget() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { restaurantId } = siteConfig.openTable

  useEffect(() => {
    if (!restaurantId || !containerRef.current) return
    containerRef.current.innerHTML = ''
    const script = document.createElement('script')
    script.src = `//www.opentable.com/widget/reservation/loader?rid=${restaurantId}&type=wide&theme=custom&lang=fr-CA&overlay=false&domain=com&backgroundColor=111111&primaryColor=A8956A&captionColor=F5F5F0`
    script.async = true
    containerRef.current.appendChild(script)
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [restaurantId])

  if (!restaurantId) {
    return (
      <div className="text-center py-14 px-8" style={{ border: '1px dashed rgb(var(--c-line))', background: 'rgb(var(--c-surface) / 0.7)' }}>
        <p className="text-label text-gold mb-3" style={{ fontSize: 'max(0.55rem, var(--fs-min))' }}>OPENTABLE</p>
        <p className="font-light mb-3" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'rgb(var(--c-ink))' }}>
          Widget de réservation
        </p>
        <p className="font-light" style={{ fontFamily: 'var(--font-body)', fontSize: 'max(0.75rem, var(--fs-min))', color: 'rgb(var(--c-muted))', fontWeight: 500, lineHeight: 1.7 }}>
          Créez un compte sur{' '}
          <a
            href="https://restaurant.opentable.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'rgb(var(--c-accent))' }}
          >
            restaurant.opentable.com
          </a>
          , puis ajoutez votre restaurant ID dans{' '}
          <code style={{ color: 'rgb(var(--c-accent))', fontSize: 'max(0.7rem, var(--fs-min))' }}>siteConfig.openTable.restaurantId</code>
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full" />
}
