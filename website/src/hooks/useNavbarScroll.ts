import { useState, useEffect } from 'react'

// Hidden while reading down (past `from`), back on any scroll up; tiny jitters keep the state.
export function navHidden(prevY: number, y: number, wasHidden: boolean, from = 200) {
  if (y < from) return false
  if (y - prevY > 6) return true
  if (prevY - y > 6) return false
  return wasHidden
}

export function useNavbarScroll(threshold = 60) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let rafId: number
    let lastY = window.scrollY

    const handleScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        const prevY = lastY // the updater may run later, after lastY moves on
        setScrolled(y > threshold)
        setHidden(h => navHidden(prevY, y, h))
        lastY = y
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafId)
    }
  }, [threshold])

  return { scrolled, hidden }
}
