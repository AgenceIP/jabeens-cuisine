import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect, Suspense } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from '@/components/layout/Navbar'
import PageTransition from '@/components/layout/PageTransition'
import NewsletterPopup from '@/components/ui/NewsletterPopup'
import { pages, absolute, type PagePath } from '@/seo/pages'
import { routes } from '@/routes'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// Keeps the head in step when navigating inside the app (the prerendered HTML has it already).
function PageHead() {
  const { pathname } = useLocation()
  useEffect(() => {
    const p = pages[pathname as PagePath]
    if (!p) return
    document.title = p.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', p.description)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', absolute(pathname))
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {Object.entries(routes).map(([path, Page]) => (
          <Route key={path} path={path} element={<PageTransition><Page /></PageTransition>} />
        ))}
      </Routes>
    </AnimatePresence>
  )
}

/** Everything inside the router; the browser wraps it in BrowserRouter, the prerender in StaticRouter. */
export function AppShell() {
  return (
    <LanguageProvider>
      <ScrollToTop />
      <PageHead />
      <NewsletterPopup />
      <Navbar />
      <Suspense fallback={<div style={{ background: 'rgb(var(--c-bg))', minHeight: '100vh' }} />}>
        <AnimatedRoutes />
      </Suspense>
    </LanguageProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
