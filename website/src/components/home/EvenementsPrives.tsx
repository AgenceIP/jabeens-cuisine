import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useT } from '@/contexts/LanguageContext'
import MagneticButton from '@/components/ui/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function EvenementsPrives() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const imgWrapRef   = useRef<HTMLDivElement>(null)
  const imgInnerRef  = useRef<HTMLImageElement>(null)
  const labelRef     = useRef<HTMLParagraphElement>(null)
  const headingInner = useRef<HTMLHeadingElement>(null)
  const dividerRef   = useRef<HTMLDivElement>(null)
  const bodyRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const t = useT()

  useGSAP(() => {
    const trigger = { trigger: sectionRef.current, start: 'top 78%' }

    // Set initial states
    gsap.set(imgWrapRef.current,   { clipPath: 'inset(0% 0% 100% 0%)' })
    gsap.set(imgInnerRef.current,  { scale: 1.1 })
    gsap.set(headingInner.current, { yPercent: 110 })
    gsap.set([labelRef.current, bodyRef.current, ctaRef.current], { opacity: 0 })
    gsap.set(dividerRef.current,   { scaleX: 0, transformOrigin: 'left center' })

    // ── Image: clip-path curtain ───────────────────────────────
    gsap.to(imgWrapRef.current,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.out', scrollTrigger: trigger })

    gsap.to(imgInnerRef.current,
      { scale: 1, duration: 1.4, ease: 'power4.out', scrollTrigger: trigger })

    // Parallax
    gsap.to(imgInnerRef.current, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    // ── Text reveals ───────────────────────────────────────────
    gsap.to(labelRef.current,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: trigger })

    gsap.to(headingInner.current,
      { yPercent: 0, duration: 1, ease: 'power4.out', delay: 0.1, scrollTrigger: trigger })

    gsap.to(dividerRef.current,
      { scaleX: 1, duration: 0.7, ease: 'power3.out', delay: 0.35, scrollTrigger: trigger })

    gsap.to(bodyRef.current,
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5, scrollTrigger: trigger })

    gsap.to(ctaRef.current,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.7, scrollTrigger: trigger })

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="w-full overflow-hidden" style={{ background: '#111111', borderTop: '1px solid #1E1E1E' }}>
      <div className="flex flex-col md:flex-row min-h-[600px]">

        {/* Text */}
        <div
          className="w-full md:w-1/2 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20"
          style={{ background: '#111111' }}
        >
          <p ref={labelRef} className="text-label text-gold mb-6">{t.evenements.label}</p>

          <div className="reveal-wrap mb-8">
            <h2
              ref={headingInner}
              className="text-display text-text-primary leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', whiteSpace: 'pre-line' }}
            >
              {t.evenements.heading}
            </h2>
          </div>

          <div ref={dividerRef} className="gold-divider mb-8" />

          <p ref={bodyRef} className="text-text-muted font-light leading-relaxed mb-10" style={{ fontSize: '0.9rem' }}>
            {t.evenements.body}
          </p>

          <div ref={ctaRef}>
            <MagneticButton style={{ display: 'inline-block' }}>
              <Link
                to="/location-salle"
                className="text-label border px-8 py-4 inline-block transition-all duration-300"
                style={{ borderColor: '#A8956A', color: '#A8956A' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#A8956A'; e.currentTarget.style.color = '#0A0A0A' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#A8956A' }}
              >
                {t.evenements.cta}
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* Image — clip-path from top */}
        <div
          ref={imgWrapRef}
          className="w-full md:w-1/2 overflow-hidden"
          style={{ minHeight: '480px' }}
        >
          <img
            ref={imgInnerRef}
            src="/assets/hero-2.jpg"
            alt="Jabeen's Cuisine Events"
            width={800}
            height={1000}
            className="w-full h-full object-cover"
            style={{ willChange: 'transform' }}
            loading="lazy"
          />
        </div>

      </div>
    </section>
  )
}
