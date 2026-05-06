import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Footer from '@/components/layout/Footer'
import { useT } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

export default function NotreHistoire() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const t = useT()
  const h = t.histoirePage

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
    <div ref={sectionRef} style={{ background: '#0A0A0A' }}>
      {/* Hero — split: dark left panel + video right panel */}
      <div className="relative h-screen overflow-hidden flex">

        {/* Left: solid dark panel with text */}
        <div className="relative z-10 w-full md:w-[45%] flex-shrink-0 flex flex-col justify-center px-10 md:px-16 lg:px-24" style={{ background: '#0A0A0A' }}>
          {/* Mobile: video as background behind text */}
          <video
            src="/assets/restaurant-interior.mp4"
            autoPlay muted loop playsInline
            className="md:hidden absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="histoire-hero-content opacity-0 relative z-10 text-center md:text-left">
            <p className="text-label text-gold mb-6">{h.label}</p>
            <h1 className="text-display text-text-primary leading-none mb-10" style={{ fontSize: 'clamp(3rem, 4.5vw, 5rem)' }}>
              {h.heroTitle}
            </h1>
            <div className="gold-divider mb-8 mx-auto md:mx-0" />
            <blockquote className="text-display-italic" style={{ fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', lineHeight: 1.9, color: 'rgba(245,245,240,0.65)' }}>
              {h.quote}
            </blockquote>
          </div>
        </div>

        {/* Right: video panel (desktop only) */}
        <div className="hidden md:block flex-1 relative overflow-hidden">
          <video
            src="/assets/restaurant-interior.mp4"
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Blend left edge into dark panel */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0A0A0A 0%, transparent 18%)' }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0" style={{ height: 120, background: 'linear-gradient(to top, #0A0A0A, transparent)' }} />
        </div>

      </div>

      {/* Timeline */}
      <div className="timeline-section section-padding">
        <div className="max-w-site mx-auto">
          <p className="fade-in-section text-label text-gold mb-16 text-center">{h.timelineLabel}</p>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden md:block" style={{ width: 1, background: '#1E1E1E' }} />
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
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center w-3 h-3 rounded-full border border-gold mt-4" style={{ background: '#0A0A0A' }} />
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="philosophy-section section-padding" style={{ background: '#111111', borderTop: '1px solid #1E1E1E' }}>
        <div className="max-w-site mx-auto">
          <p className="fade-in-section text-label text-gold mb-16 text-center">{h.valuesLabel}</p>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderTop: '1px solid #1E1E1E' }}>
            {h.values.map((col, i) => (
              <div
                key={col.title}
                className="philosophy-col opacity-0 py-12 px-10"
                style={{ borderLeft: i > 0 ? '1px solid #1E1E1E' : 'none' }}
              >
                <div className="mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ color: '#A8956A' }}>
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
