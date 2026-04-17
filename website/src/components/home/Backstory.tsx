import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useT } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function Backstory() {
  const sectionRef     = useRef<HTMLDivElement>(null)
  const quoteMarkRef   = useRef<HTMLDivElement>(null)
  const quoteInner     = useRef<HTMLElement>(null)   // masked reveal
  const ruleRef        = useRef<HTMLDivElement>(null)
  const imgWrapRef     = useRef<HTMLDivElement>(null) // clip-path
  const imgInnerRef    = useRef<HTMLImageElement>(null) // scale + parallax
  const labelRef       = useRef<HTMLParagraphElement>(null)
  const p1Ref          = useRef<HTMLParagraphElement>(null)
  const p2Ref          = useRef<HTMLParagraphElement>(null)
  const p3Ref          = useRef<HTMLParagraphElement>(null)
  const t = useT()

  useGSAP(() => {
    // Set all initial states upfront — GSAP owns these
    gsap.set(quoteMarkRef.current,  { opacity: 0, y: 20 })
    gsap.set(quoteInner.current,    { yPercent: 110 })
    gsap.set(ruleRef.current,       { opacity: 0, scaleX: 0, transformOrigin: 'center center' })
    gsap.set(imgWrapRef.current,    { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(imgInnerRef.current,   { scale: 1.1 })
    gsap.set(labelRef.current,      { opacity: 0, y: 10 })

    // ── Quote section ──────────────────────────────────────────
    gsap.to(quoteMarkRef.current,
      { opacity: 0.5, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: quoteMarkRef.current, start: 'top 80%' } })

    gsap.to(quoteInner.current,
      { yPercent: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: quoteInner.current, start: 'top 85%' } })

    gsap.to(ruleRef.current,
      { opacity: 1, scaleX: 1, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: ruleRef.current, start: 'top 80%' } })

    // ── Image: clip-path + scale ────────────────────────────────
    const imgTrigger = { trigger: imgWrapRef.current, start: 'top 80%' }

    gsap.to(imgWrapRef.current,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power4.out', scrollTrigger: imgTrigger })

    gsap.to(imgInnerRef.current,
      { scale: 1, duration: 1.4, ease: 'power4.out', scrollTrigger: imgTrigger })

    // ── Image parallax ─────────────────────────────────────────
    gsap.to(imgInnerRef.current, {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: {
        trigger: imgWrapRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    // ── Label ──────────────────────────────────────────────────
    gsap.to(labelRef.current,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: labelRef.current, start: 'top 85%' } })

    // ── Scrubbed paragraphs — text brightens as user reads through ──
    // This is the Apple M-series chip page effect
    const scrubColor = { color: 'rgba(245,245,240,0.12)' }
    const brightColor = { color: 'rgba(245,245,240,0.82)' }

    ;[p1Ref, p2Ref, p3Ref].forEach((ref) => {
      gsap.set(ref.current, scrubColor)
      gsap.to(ref.current, {
        ...brightColor,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 82%',
          end: 'top 32%',
          scrub: true,
        },
      })
    })

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="section-padding" style={{ background: '#0A0A0A' }}>
      <div className="max-w-site mx-auto">

        {/* Quote */}
        <div className="text-center mb-20 max-w-3xl mx-auto px-4">
          <div
            ref={quoteMarkRef}
            className="text-display-italic text-gold leading-none mb-4 select-none"
            style={{ fontSize: '6rem', lineHeight: 0.8 }}
          >
            "
          </div>
          <div className="reveal-wrap">
            <blockquote
              ref={quoteInner}
              className="text-display-italic text-text-primary leading-relaxed"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', display: 'block' }}
            >
              {t.backstory.quote}
            </blockquote>
          </div>
        </div>

        <div ref={ruleRef} className="gold-rule mb-20" />

        {/* Columns */}
        <div className="flex flex-col md:flex-row gap-16 items-start">

          {/* Image */}
          <div className="w-full md:w-[45%]">
            <div
              ref={imgWrapRef}
              className="relative overflow-hidden"
            >
              <img
                ref={imgInnerRef}
                src="/assets/food-shahi-paneer.jpg"
                alt="Shahi Paneer — Jabeen's Cuisine"
                width={736}
                height={980}
                className="w-full object-cover"
                style={{ willChange: 'transform' }}
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full md:w-[55%] pt-8 md:pt-16">
            <p ref={labelRef} className="text-label text-gold mb-8">{t.backstory.label}</p>
            <p ref={p1Ref} className="font-light leading-loose mb-6" style={{ fontSize: '0.92rem', lineHeight: 1.95 }}>
              {t.backstory.p1}
            </p>
            <p ref={p2Ref} className="font-light leading-loose mb-6" style={{ fontSize: '0.92rem', lineHeight: 1.95 }}>
              {t.backstory.p2}
            </p>
            <p ref={p3Ref} className="font-light leading-loose mb-12" style={{ fontSize: '0.92rem', lineHeight: 1.95 }}>
              {t.backstory.p3}
            </p>
            <div className="gold-divider mb-8" />
            <p className="text-display-italic text-text-muted" style={{ fontSize: '1.1rem' }}>
              {t.backstory.halal}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
