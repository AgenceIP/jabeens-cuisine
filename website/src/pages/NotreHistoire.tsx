import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Footer from '@/components/layout/Footer'
import GoldFlecks from '@/components/decor/GoldFlecks'
import { useT } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function NotreHistoire() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const v = videoRef.current
    if (v) { v.muted = true; v.play().catch(() => {}) }
  }, [])
  const t = useT()
  const h = t.histoirePage

  useEffect(() => {
    document.title = "Notre Histoire — Jabeen's Cuisine | Depuis 2017, Brossard"
  }, [])

  useGSAP(() => {
    // Hero entrance
    gsap.fromTo('.histoire-hero-content',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
    )

    // Fade-in every section block as it enters the viewport
    gsap.utils.toArray<Element>('.fade-in-section').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
      )
    })

    // Timeline entries — staggered
    gsap.fromTo('.timeline-entry',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.timeline-section', start: 'top 75%' } }
    )

    // Philosophy columns — staggered
    gsap.fromTo('.philosophy-col',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.15,
        scrollTrigger: { trigger: '.philosophy-section', start: 'top 75%' } }
    )
  }, { scope: sectionRef })

  return (
    <div ref={sectionRef} style={{ background: 'transparent' }}>
      {/* Hero — split: dark left panel + video right panel */}
      <div className="relative h-screen overflow-hidden flex">

        {/* Mobile: video full screen */}
        <video
          ref={videoRef}
          src="/assets/restaurant-interior.mp4"
          autoPlay muted loop playsInline
          preload="metadata"
          className="md:hidden absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover' }}
        />
        {/* Mobile dark overlay */}
        <div className="md:hidden absolute inset-0" style={{ background: 'rgb(var(--c-bg) / 0.82)' }} />

        {/* Desktop: solid dark left panel */}
        <div className="dark-only hidden md:block absolute inset-y-0 left-0" style={{ right: '55%', background: 'rgb(var(--c-bg))' }} />

        {/* Left: text panel */}
        <div className="relative z-10 w-full md:w-[45%] flex-shrink-0 flex flex-col justify-center px-10 md:px-16 lg:px-24">
          <GoldFlecks className="-z-10 left-4 md:left-10 top-24 w-28 md:w-44" />
          <div className="histoire-hero-content opacity-0 relative z-10 text-center md:text-left">
            <p className="text-label text-gold mb-6">{h.label}</p>
            <h1 className="text-display text-text-primary leading-none mb-10" style={{ fontSize: 'clamp(3rem, 4.5vw, 5rem)' }}>
              {h.heroTitle}
            </h1>
            <div className="gold-divider mb-8 mx-auto md:mx-0" />
            <blockquote className="text-display-italic" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', lineHeight: 1.9, color: 'rgb(var(--c-muted))' }}>
              {h.quote}
            </blockquote>
          </div>
        </div>

        {/* Right panel: video — all 4 edges masked */}
        <div className="hidden md:flex flex-1 relative z-10 overflow-hidden items-center justify-center">
          <video
            ref={videoRef}
            src="/assets/restaurant-interior.mp4"
            autoPlay muted loop playsInline
            preload="metadata"
            className="w-full h-full dark-mask"
            style={{
              objectFit: 'contain',
              objectPosition: 'center',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, black 25%, black 75%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 12%, black 88%, rgba(0,0,0,0) 100%)',
              WebkitMaskComposite: 'destination-in',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,0) 0%, black 25%, black 75%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 12%, black 88%, rgba(0,0,0,0) 100%)',
              maskComposite: 'intersect',
            }}
          />
          {/* Left blend — merges video into the dark left panel */}
          <div className="dark-only absolute inset-y-0 left-0 pointer-events-none" style={{ width: '35%', background: 'linear-gradient(to right, rgb(var(--c-bg)) 0%, rgb(var(--c-bg) / 0) 100%)' }} />
          {/* Right blend */}
          <div className="dark-only absolute inset-y-0 right-0 pointer-events-none" style={{ width: '25%', background: 'linear-gradient(to left, rgb(var(--c-bg) / 0.85) 0%, rgb(var(--c-bg) / 0) 100%)' }} />
        </div>

        {/* Bottom section fade — blends hero into the next section */}
        <div className="dark-only absolute bottom-0 left-0 right-0 pointer-events-none z-20"
          style={{ height: '30%', background: 'linear-gradient(to top, rgb(var(--c-bg)) 0%, rgb(var(--c-bg) / 0.5) 50%, rgb(var(--c-bg) / 0) 100%)' }} />

      </div>

      {/* Timeline */}
      <div className="timeline-section section-padding">
        <div className="max-w-site mx-auto">
          <p className="fade-in-section text-label text-gold mb-16 text-center">{h.timelineLabel}</p>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block" style={{ width: 1, background: 'rgb(var(--c-line))' }} />
            <div className="space-y-16">
              {h.timeline.map((entry, i) => (
                <div
                  key={entry.year}
                  className={`timeline-entry opacity-0 flex flex-col md:flex-row items-start gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <span className="text-display text-gold block mb-2" style={{ fontSize: '3rem' }}>{entry.year}</span>
                    <h3 className="text-display text-text-primary mb-3" style={{ fontSize: '1.3rem' }}>{entry.title}</h3>
                    <p className="text-text-muted font-light leading-relaxed" style={{ fontSize: '0.85rem' }}>{entry.text}</p>
                  </div>
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center w-3 h-3 rounded-full border border-gold mt-4" style={{ background: 'rgb(var(--c-bg))' }} />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="philosophy-section section-padding" style={{ background: 'rgb(var(--c-surface) / 0.75)', borderTop: 'none', position: 'relative' }}>
        <div aria-hidden className="dark-only" style={{ position: 'absolute', top: -80, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, transparent, rgb(var(--c-surface) / 0.75))', pointerEvents: 'none' }} />
        <div className="max-w-site mx-auto">
          <p className="fade-in-section text-label text-gold mb-16 text-center">{h.valuesLabel}</p>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderTop: '1px solid rgb(var(--c-line))' }}>
            {h.values.map((col, i) => (
              <div
                key={col.title}
                className="philosophy-col opacity-0 py-12 px-10"
                style={{ borderLeft: i > 0 ? '1px solid rgb(var(--c-line))' : 'none' }}
              >
                <div className="mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: 'rgb(var(--c-accent))' }}>
                    <path d="M12 2L9.5 9.5H2L8 14L5.5 21.5L12 17L18.5 21.5L16 14L22 9.5H14.5L12 2Z" stroke="currentColor" strokeWidth="1" fill="none" />
                  </svg>
                </div>
                <h3 className="text-display text-text-primary mb-4" style={{ fontSize: '1.4rem' }}>{col.title}</h3>
                <div className="gold-divider mb-6" />
                <p className="text-text-muted font-light leading-loose" style={{ fontSize: '0.85rem' }}>{col.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
