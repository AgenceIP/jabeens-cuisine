import { useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export function useCountUp(target: number, decimals = 0, duration = 2) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLElement>(null)
  const triggered = useRef(false)

  const animate = useCallback(() => {
    if (triggered.current) return
    triggered.current = true
    const obj = { val: 0 }
    gsap.to(obj, {
      val: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setValue(parseFloat(obj.val.toFixed(decimals)))
      },
    })
  }, [target, decimals, duration])

  useGSAP(() => {
    if (!ref.current) return
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 80%',
      onEnter: animate,
    })
  }, { scope: ref, dependencies: [animate] })

  return { value, ref }
}
