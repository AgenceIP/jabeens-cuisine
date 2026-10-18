import Hero from '@/components/home/Hero'
import Marquee from '@/components/home/Marquee'
import PremiereImpression from '@/components/home/PremiereImpression'
import LaCarte from '@/components/home/LaCarte'
import EvenementsPrives from '@/components/home/EvenementsPrives'
import FeedbackForm from '@/components/home/FeedbackForm'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <PremiereImpression />
      <LaCarte />
<EvenementsPrives />
      <FeedbackForm />
      <Footer />
    </>
  )
}
