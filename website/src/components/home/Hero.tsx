import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useT } from '@/contexts/LanguageContext'
import MagneticButton from '@/components/ui/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const containerRef    = useRef<HTMLElement>(null)
  const bgRef           = useRef<HTMLDivElement>(null)
  const contentRef      = useRef<HTMLDivElement>(null)
  const titleLine1Inner = useRef<HTMLSpanElement>(null)
  const titleLine2Inner = useRef<HTMLSpanElement>(null)
  const taglineRef      = useRef<HTMLParagraphElement>(null)
  const ctaRef          = useRef<HTMLDivElement>(null)
  const videoRef        = useRef<HTMLVideoElement>(null)
  const t = useT()

  useEffect(() => {
    const v = videoRef.current
    if (v) { v.muted = true; v.play().catch(() => {}) }
  }, [])

  useGSAP(() => {
    // Set initial hidden states immediately (GSAP owns the transform, not React)
    gsap.set([titleLine1Inner.current, titleLine2Inner.current], { yPercent: 110 })
    gsap.set([taglineRef.current, ctaRef.current], { opacity: 0 })

    // ── Entrance timeline ──────────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    // Masked line reveals — text slides up from behind invisible barrier
    tl.to(titleLine1Inner.current,
      { yPercent: 0, duration: 1 }, 0.3)
    tl.to(titleLine2Inner.current,
      { yPercent: 0, duration: 1 }, 0.53)

    tl.to(taglineRef.current,
      { opacity: 1, y: 0, duration: 0.8 }, 1.0)
    tl.to(ctaRef.current,
      { opacity: 1, y: 0, duration: 0.7 }, 1.35)

    // ── Background parallax on scroll ─────────────────────────────
    // Background drifts up slower than the page → creates depth
    gsap.to(bgRef.current, {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    // ── Content fades + rises as hero scrolls out ─────────────────
    // Very Apple: the hero content disappears into the page
    gsap.to(contentRef.current, {
      opacity: 0,
      yPercent: -18,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '45% top',
        scrub: true,
      },
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center"
      style={{ background: '#0A0A0A' }}
    >
      {/* Background — parallax target */}
      <div ref={bgRef} className="absolute inset-0 overflow-hidden" style={{ willChange: 'transform' }}>
        <video
          ref={videoRef}
          src="/assets/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover scale-100 md:scale-[1.12]"
          style={{ objectPosition: 'center center' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.45) 50%, rgba(10,10,10,0.88) 100%)',
          }}
        />
      </div>

      {/* Content — fades + rises on scroll */}
      <div ref={contentRef} className="relative z-10 w-full max-w-site mx-auto px-8 md:px-20 lg:px-24" style={{ willChange: 'transform, opacity' }}>
        <div className="max-w-3xl">
          {/* Masked title lines */}
          <h1 className="text-display mb-2 leading-none tracking-display">
            <span className="reveal-wrap">
              <span
                ref={titleLine1Inner}
                className="block text-text-primary"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
              >
                Jabeen's
              </span>
            </span>
          </h1>
          <div className="my-3 md:my-4" style={{ width: 60, height: 1, background: 'rgba(168,149,106,0.5)' }} />
          <h1 className="text-display mb-6 leading-none tracking-display">
            <span className="reveal-wrap">
              <span
                ref={titleLine2Inner}
                className="block text-text-primary"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
              >
                Cuisine
              </span>
            </span>
          </h1>

          <p
            ref={taglineRef}
            className="text-display-italic mb-10 opacity-0"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'rgba(245,245,240,0.7)' }}
          >
            {t.hero.tagline}
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4 opacity-0">
            <MagneticButton>
              <Link
                to="/commander"
                className="text-label px-8 py-4 transition-colors duration-300 block"
                style={{ background: '#A8956A', color: '#F5F5F0', fontSize: '0.78rem', fontWeight: 700 }}
                onMouseEnter={e => (e.currentTarget.style.background = '#bfa97a')}
                onMouseLeave={e => (e.currentTarget.style.background = '#A8956A')}
              >
                {t.hero.cta_order}
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/menu"
                className="text-label px-8 py-4 border transition-all duration-300 block"
                style={{ borderColor: 'rgba(245,245,240,0.4)', color: '#F5F5F0', fontSize: '0.78rem', fontWeight: 700 }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#A8956A'
                  e.currentTarget.style.color = '#A8956A'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(245,245,240,0.4)'
                  e.currentTarget.style.color = '#F5F5F0'
                }}
              >
                {t.hero.cta_menu}
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>

    </section>
  )
}

