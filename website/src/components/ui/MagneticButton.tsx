import { useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'

interface Props {
  children: ReactNode
  strength?: number   // 0–1, how far it moves (default 0.28)
  className?: string
  style?: React.CSSProperties
}

/**
 * Wraps any element with a magnetic cursor effect.
 * On hover: element subtly follows the cursor.
 * On leave: elastic spring-back to origin.
 */
export default function MagneticButton({ children, strength = 0.28, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width  / 2) * strength
    const y = (e.clientY - rect.top  - rect.height / 2) * strength
    gsap.to(el, { x, y, duration: 0.4, ease: 'power3.out', overwrite: true })
  }

  const handleMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1.1, 0.5)', overwrite: true })
  }

  return (
    <div
      ref={ref}
      className={`magnetic${className ? ` ${className}` : ''}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
