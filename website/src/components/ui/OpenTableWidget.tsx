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
      <div className="text-center py-14 px-8" style={{ border: '1px dashed #2A2A2A', background: 'rgba(6,13,24,0.7)' }}>
        <p className="text-label text-gold mb-3" style={{ fontSize: '0.55rem' }}>OPENTABLE</p>
        <p className="font-light mb-3" style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.4rem', color: '#F5F5F0' }}>
          Widget de réservation
        </p>
        <p className="font-light" style={{ fontFamily: 'Montserrat', fontSize: '0.75rem', color: '#DEDEDA', fontWeight: 500, lineHeight: 1.7 }}>
          Créez un compte sur{' '}
          <a
            href="https://restaurant.opentable.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#A8956A' }}
          >
            restaurant.opentable.com
          </a>
          , puis ajoutez votre restaurant ID dans{' '}
          <code style={{ color: '#A8956A', fontSize: '0.7rem' }}>siteConfig.openTable.restaurantId</code>
        </p>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full" />
}
