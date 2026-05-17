import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/layout/PageTransition'
import GrandOpeningPopup from '@/components/ui/GrandOpeningPopup'
import Home from '@/pages/Home'
import Menu from '@/pages/Menu'
import NotreHistoire from '@/pages/NotreHistoire'
import Hall from '@/pages/Hall'

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
        <AnimatedRoutes />
      </BrowserRouter>
    </LanguageProvider>
  )
}
