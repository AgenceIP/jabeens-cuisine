import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { siteConfig } from '@/data/siteConfig'
import { useT } from '@/contexts/LanguageContext'
import MagneticButton from '@/components/ui/MagneticButton'

gsap.registerPlugin(ScrollTrigger)

const platformUrls = [
  { name: 'Uber Eats',     url: siteConfig.ordering.uberEats },
  { name: 'DoorDash',      url: siteConfig.ordering.doorDash },
  { name: 'SkipTheDishes', url: siteConfig.ordering.skipTheDishes },
]

export default function CommanderEnLigne() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const labelRef     = useRef<HTMLParagraphElement>(null)
  const headingInner = useRef<HTMLHeadingElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const btnsRef      = useRef<HTMLDivElement>(null)
  const t = useT()

  useGSAP(() => {
    const trigger = { trigger: sectionRef.current, start: 'top 78%' }

    // Initial states
    gsap.set(labelRef.current,       { opacity: 0, y: 10 })
    gsap.set(headingInner.current,   { yPercent: 110 })
    gsap.set(subRef.current,         { opacity: 0, y: 14 })
    if (btnsRef.current?.children) {
      gsap.set(Array.from(btnsRef.current.children), { opacity: 0, y: 20 })
    }

    gsap.to(labelRef.current,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: trigger })

    gsap.to(headingInner.current,
      { yPercent: 0, duration: 1, ease: 'power4.out', delay: 0.1, scrollTrigger: trigger })

    gsap.to(subRef.current,
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.3, scrollTrigger: trigger })

    if (btnsRef.current?.children) {
      gsap.to(Array.from(btnsRef.current.children),
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.5, scrollTrigger: trigger })
    }

  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: 'transparent' }}>
      <div className="absolute inset-0">
        <img src="/assets/food-gen-2.jpg" alt="" width={896} height={1200} className="w-full h-full object-cover opacity-20" loading="lazy" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(10,10,10,0.9))' }} />
      </div>

      <div className="relative z-10 text-center section-padding">
        <p ref={labelRef} className="text-label text-gold mb-6 opacity-0">{t.commanderSection.label}</p>

        <div className="reveal-wrap mb-4">
          <h2
            ref={headingInner}
            className="text-display text-text-primary inline-block"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
          >
            {t.commanderSection.heading}
          </h2>
        </div>

        <p ref={subRef} className="text-text-muted mb-14 font-light opacity-0" style={{ fontSize: '0.9rem' }}>
          {t.commanderSection.subheading}
        </p>

        <div ref={btnsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {platformUrls.map(platform => (
            <MagneticButton key={platform.name} strength={0.2}>
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label px-10 py-4 border transition-all duration-300 block"
                style={{ borderColor: '#3A3A3A', color: '#F5F5F0', fontSize: '0.78rem', fontWeight: 700 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#A8956A'; e.currentTarget.style.color = '#A8956A' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3A3A3A'; e.currentTarget.style.color = '#F5F5F0' }}
              >
                {platform.name}
              </a>
            </MagneticButton>
          ))}
        </div>
      </div>
    </section>
  )
}
