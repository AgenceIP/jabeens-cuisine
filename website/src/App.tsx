import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect, lazy, Suspense } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/layout/PageTransition'
import GrandOpeningPopup from '@/components/ui/GrandOpeningPopup'

const Home         = lazy(() => import('@/pages/Home'))
const Menu         = lazy(() => import('@/pages/Menu'))
const NotreHistoire = lazy(() => import('@/pages/NotreHistoire'))
const Hall         = lazy(() => import('@/pages/Hall'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/menu" element={<PageTransition><Menu /></PageTransition>} />
        <Route path="/notre-histoire" element={<PageTransition><NotreHistoire /></PageTransition>} />
        <Route path="/location-salle" element={<PageTransition><Hall /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <GrandOpeningPopup />
        <Navbar />
        <Suspense fallback={<div style={{ background: '#0A0A0A', minHeight: '100vh' }} />}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </LanguageProvider>
  )
}
