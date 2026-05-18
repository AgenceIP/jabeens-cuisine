import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useT } from '@/contexts/LanguageContext'
import MagneticButton from '@/components/ui/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

const TRIGGER_START = 'top 78%'

export default function PremiereImpression() {
  const sectionRef    = useRef<HTMLDivElement>(null)
  const imgWrapRef    = useRef<HTMLDivElement>(null) // clip-path on this
  const imgInnerRef   = useRef<HTMLImageElement>(null) // scale + parallax on this
  const labelRef      = useRef<HTMLParagraphElement>(null)
  const headingInner  = useRef<HTMLHeadingElement>(null)  // masked reveal inner
  const dividerRef    = useRef<HTMLDivElement>(null)
  const p1Ref         = useRef<HTMLParagraphElement>(null)
  const p2Ref         = useRef<HTMLParagraphElement>(null)
  const linkRef       = useRef<HTMLAnchorElement>(null)
  const t = useT()

  useGSAP(() => {
    const trigger = { trigger: sectionRef.current, start: TRIGGER_START }

    // Set initial states — GSAP owns these, not React
    gsap.set(imgWrapRef.current,   { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(imgInnerRef.current,  { scale: 1.1 })
    gsap.set(headingInner.current, { yPercent: 110 })
    gsap.set([labelRef.current, p1Ref.current, p2Ref.current, linkRef.current], { opacity: 0 })
    gsap.set(dividerRef.current,   { scaleX: 0, transformOrigin: 'left center' })

    // ── Image: clip-path curtain reveal + zoom ──────────────────
    gsap.to(imgWrapRef.current,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.out', scrollTrigger: trigger })

    gsap.to(imgInnerRef.current,
      { scale: 1, duration: 1.4, ease: 'power4.out', scrollTrigger: trigger })

    // ── Image parallax on scroll ───────────────────────────────
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
    const textTrigger = { trigger: sectionRef.current, start: TRIGGER_START }

    gsap.to(labelRef.current,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: textTrigger })

    gsap.to(headingInner.current,
      { yPercent: 0, duration: 1, ease: 'power4.out', delay: 0.1, scrollTrigger: textTrigger })

    gsap.to(dividerRef.current,
      { scaleX: 1, duration: 0.7, ease: 'power3.out', delay: 0.3, scrollTrigger: textTrigger })

    gsap.to([p1Ref.current, p2Ref.current],
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15, delay: 0.4, scrollTrigger: textTrigger })

    gsap.to(linkRef.current,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.7, scrollTrigger: textTrigger })

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="w-full overflow-hidden" style={{ background: 'transparent' }}>
      <div className="flex flex-col md:flex-row min-h-[640px]">

        {/* Image — clip-path reveal */}
        <div
          ref={imgWrapRef}
          className="w-full md:w-[60%] overflow-hidden"
          style={{
            minHeight: '500px',
            WebkitMaskImage: 'linear-gradient(to right, black 60%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 8%, black 92%, rgba(0,0,0,0) 100%)',
            WebkitMaskComposite: 'destination-in',
            maskImage: 'linear-gradient(to right, black 60%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 8%, black 92%, rgba(0,0,0,0) 100%)',
            maskComposite: 'intersect',
          }}
        >
          <img
            ref={imgInnerRef}
            src="/assets/tables.jpg"
            alt="Jabeen's Cuisine"
            width={736}
            height={1104}
            className="w-full h-full object-cover"
            style={{ minHeight: '500px', willChange: 'transform' }}
            loading="lazy"
          />
        </div>

        {/* Text block */}
        <div
          className="w-full md:w-[40%] flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20"
          style={{ background: 'transparent' }}
        >
          <p ref={labelRef} className="text-label text-gold mb-6">{t.premiereImpression.label}</p>

          {/* Masked heading */}
          <div className="reveal-wrap mb-8">
            <h2
              ref={headingInner}
              className="text-display text-text-primary leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
            >
              {t.premiereImpression.heading}
            </h2>
          </div>

          <div ref={dividerRef} className="gold-divider mb-8" />

          <p ref={p1Ref} className="text-text-muted font-light leading-relaxed mb-4" style={{ fontSize: '0.9rem' }}>
            {t.premiereImpression.p1}
          </p>
          <p ref={p2Ref} className="text-text-muted font-light leading-relaxed mb-10" style={{ fontSize: '0.9rem' }}>
            {t.premiereImpression.p2}
          </p>

          <MagneticButton style={{ display: 'inline-block', width: 'fit-content' }}>
            <Link
              ref={linkRef}
              to="/notre-histoire"
              className="text-label hover-underline inline-block"
              style={{ color: '#F5F5F0', fontSize: '0.78rem', fontWeight: 700 }}
            >
              {t.premiereImpression.link}
            </Link>
          </MagneticButton>
        </div>

      </div>
    </section>
  )
}
