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
  const posterRef       = useRef<HTMLImageElement>(null)
  const t = useT()

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // Set imperatively for maximum iOS Safari compatibility
    v.muted = true
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')

    const playVideo = () => {
      v.play()
        .then(() => {
          // Fade out the custom poster once video is actually playing
          if (posterRef.current) {
            posterRef.current.style.transition = 'opacity 0.6s'
            posterRef.current.style.opacity = '0'
          }
        })
        .catch(() => {})
    }

    playVideo()
    // Retry on canplay in case the first attempt fires before data is available
    v.addEventListener('canplay', playVideo, { once: true })
  }, [])

  useGSAP(() => {
    gsap.set([titleLine1Inner.current, titleLine2Inner.current], { y: 0, yPercent: 110 }) // y: 0 drops the inline translateY
    gsap.set([taglineRef.current, ctaRef.current], { opacity: 0 })

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
    tl.to(titleLine1Inner.current, { yPercent: 0, duration: 1 }, 0.3)
    tl.to(titleLine2Inner.current, { yPercent: 0, duration: 1 }, 0.53)
    tl.to(taglineRef.current,      { opacity: 1, y: 0, duration: 0.8 }, 1.0)
    tl.to(ctaRef.current,          { opacity: 1, y: 0, duration: 0.7 }, 1.35)

    gsap.to(bgRef.current, {
      yPercent: 22, ease: 'none',
      scrollTrigger: { trigger: containerRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })

    gsap.to(contentRef.current, {
      opacity: 0, yPercent: -18, ease: 'none',
      scrollTrigger: { trigger: containerRef.current, start: 'top top', end: '45% top', scrub: true },
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="melt-hero relative h-screen w-full overflow-hidden flex items-center"
      style={{ background: 'transparent' }}
    >
      {/* Background — parallax target */}
      <div ref={bgRef} className="hero-media absolute inset-0 overflow-hidden" style={{ willChange: 'transform' }}>
        {/* Custom LCP poster — shown while video loads, fades once video plays.
            Using a CSS image instead of the video poster attribute avoids iOS
            showing a native play button overlay when autoplay is triggered. */}
        <img
          ref={posterRef}
          src="/assets/hero-2.jpg"
          alt="Assiette de Jabeen's Cuisine"
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center', zIndex: 1, pointerEvents: 'none' }}
        />
        <video
          ref={videoRef}
          src="/assets/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: 'center center', zIndex: 2 }}
        />
        <div
          className="hero-scrim absolute inset-0"
          style={{
            zIndex: 3,
            background: 'linear-gradient(to bottom, rgb(var(--c-scrim) / 0.25) 0%, rgb(var(--c-scrim) / 0.4) 50%, rgb(var(--c-scrim) / 0.85) 80%, rgb(var(--c-scrim) / 0.85) 100%)',
          }}
        />
      </div>

      {/* Bottom section fade — blends into next section on scroll */}
      <div
        className="dark-only absolute bottom-0 left-0 right-0 pointer-events-none z-20"
        style={{ height: '16%', background: 'linear-gradient(to top, rgb(var(--c-bg) / 1) 0%, rgb(var(--c-bg) / 0.6) 40%, rgb(var(--c-bg) / 0) 100%)' }}
      />

      {/* Content — fades + rises on scroll */}
      <div ref={contentRef} className="relative z-10 w-full max-w-site mx-auto px-8 md:px-20 lg:px-24" style={{ willChange: 'transform, opacity' }}>
        <div className="max-w-3xl">
          {/* one h1 for the page; lines start below their mask (as GSAP sets them) so the prerendered HTML does not flash them */}
          <h1 className="text-display mb-6 leading-none tracking-display">
            <span className="reveal-wrap mb-2">
              <span ref={titleLine1Inner} className="block text-on-dark" style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', transform: 'translateY(110%)' }}>
                Jabeen's
              </span>
            </span>{' '}
            <span aria-hidden className="block my-3 md:my-4" style={{ width: 60, height: 1, background: 'rgb(var(--c-accent-soft) / 0.6)' }} />
            <span className="reveal-wrap">
              <span ref={titleLine2Inner} className="block text-on-dark" style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', transform: 'translateY(110%)' }}>
                Cuisine
              </span>
            </span>
          </h1>

          <p
            ref={taglineRef}
            className="text-display-italic mb-10 opacity-0"
            style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', color: 'rgb(var(--c-on-dark) / 0.85)' }}
          >
            {t.hero.tagline}
          </p>

          <div ref={ctaRef} className="flex flex-wrap gap-4 opacity-0">
            <MagneticButton>
              <a
                href="https://jabeenscuisine.clusterpos.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-label px-8 py-4 transition-colors duration-300 block"
                style={{ background: 'rgb(var(--c-accent-soft))', color: 'rgb(var(--c-scrim))', fontSize: 'max(0.78rem, var(--fs-min))', fontWeight: 700 }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgb(var(--c-on-dark))')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgb(var(--c-accent-soft))')}
              >
                {t.hero.cta_order}
              </a>
            </MagneticButton>
            <MagneticButton>
              <Link
                to="/menu"
                className="text-label px-8 py-4 border transition-all duration-300 block"
                style={{ borderColor: 'rgb(var(--c-on-dark) / 0.4)', color: 'rgb(var(--c-on-dark))', fontSize: 'max(0.78rem, var(--fs-min))', fontWeight: 700 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgb(var(--c-accent-soft))'; e.currentTarget.style.color = 'rgb(var(--c-accent-soft))' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgb(var(--c-on-dark) / 0.4)'; e.currentTarget.style.color = 'rgb(var(--c-on-dark))' }}
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
