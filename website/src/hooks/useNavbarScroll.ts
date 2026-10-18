import { useState, useEffect } from 'react'

export function useNavbarScroll(threshold = 60) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let rafId: number

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold)
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [threshold])

  return scrolled
}
