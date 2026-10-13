import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import { useT } from '@/contexts/LanguageContext'
import type { CateringMenuId } from '@/data/cateringMenus'
import HallIntro from '@/components/hall/HallIntro'
import Offers from '@/components/hall/Offers'
import Gallery from '@/components/hall/Gallery'
import LiveStations from '@/components/hall/LiveStations'
import MenusSection from '@/components/hall/MenusSection'
import RequestForm from '@/components/hall/RequestForm'

const scrollToId = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export default function Hall() {
  const h = useT().hallPage
  const [preset, setPreset] = useState<{ menu: CateringMenuId; n: number } | null>(null)

  // Page-specific title, description and canonical; restored when leaving (the other routes share index.html's).
  useEffect(() => {
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    const before = { title: document.title, desc: desc?.content, canonical: canonical?.href }
    document.title = h.meta.title
    desc?.setAttribute('content', h.meta.description)
    canonical?.setAttribute('href', 'https://www.jabeenscuisine.com/location-salle')
    return () => {
      document.title = before.title
      if (before.desc) desc?.setAttribute('content', before.desc)
      if (before.canonical) canonical?.setAttribute('href', before.canonical)
    }
  }, [h])

  const choose = (menu: CateringMenuId) => {
    setPreset(p => ({ menu, n: (p?.n ?? 0) + 1 }))
    scrollToId('demande')
  }

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <HallIntro onMenus={() => scrollToId('menus')} onQuote={() => scrollToId('demande')} />
        <Offers />
        <Gallery />
        <LiveStations />
        <MenusSection onChoose={choose} />
        <RequestForm preset={preset} />
      </main>
      <Footer />
    </MotionConfig>
  )
}
