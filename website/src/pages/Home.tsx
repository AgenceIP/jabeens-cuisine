import { useEffect } from 'react'
import Hero from '@/components/home/Hero'
import Marquee from '@/components/home/Marquee'
import PremiereImpression from '@/components/home/PremiereImpression'
import LaCarte from '@/components/home/LaCarte'
import Backstory from '@/components/home/Backstory'
import CommanderEnLigne from '@/components/home/CommanderEnLigne'
import EvenementsPrives from '@/components/home/EvenementsPrives'
import FeedbackForm from '@/components/home/FeedbackForm'
import Footer from '@/components/layout/Footer'

export default function Home() {
  useEffect(() => {
    document.title = "Jabeen's Cuisine — Restaurant Indien & Pakistanais Halal, Brossard"
  }, [])

  return (
    <>
      <Hero />
      <Marquee />
      <PremiereImpression />
      <LaCarte />
      <Backstory />
      <CommanderEnLigne />
      <EvenementsPrives />
      <FeedbackForm />
      <Footer />
    </>
  )
}
