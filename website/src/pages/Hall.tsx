import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import { useT } from '@/contexts/LanguageContext'


interface HallFormValues {
  prenom: string; nom: string; email: string; telephone: string
  date: string; heure_debut: string; heure_fin: string
  personnes: string; type_evenement: string; restauration: string; notes: string
}

interface CateringFormValues {
  prenom: string; nom: string; email: string; telephone: string
  date: string; personnes: string; type_evenement: string
  adresse: string; menu_preference: string; notes: string
}

const inputStyle: React.CSSProperties = {
  background: 'transparent', border: 'none', borderBottom: '1px solid #1E1E1E',
  color: '#F5F5F0', padding: '14px 0', fontSize: '0.875rem',
  fontFamily: 'Montserrat', fontWeight: 300, width: '100%',
  transition: 'border-color 0.3s', outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Montserrat', fontSize: '0.55rem', fontWeight: 500,
  letterSpacing: '0.3em', textTransform: 'uppercase' as const,
  color: '#DEDEDA', display: 'block', marginBottom: '8px',
}

const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6B6B' stroke-width='1' fill='none'/%3E%3C/svg%3E")`

const hallPhotos = [null, null, null, null, null, null]
const cateringPhotos = [null, null, null, null]

function PhotoGrid({ srcs, labels, placeholder }: { srcs: (string | null)[]; labels: string[]; placeholder: string }) {
  const cols = srcs.length === 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
  return (
    <div className={`grid ${cols} gap-4`}>
      {srcs.map((src, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden"
          style={{ aspectRatio: '4/3', background: '#111111', border: '1px solid #1E1E1E' }}
        >
          {src ? (
            <img src={src} alt={labels[i]} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="2" y="6" width="28" height="20" rx="1" stroke="#2A2A2A" strokeWidth="1.5" />
                <circle cx="21" cy="13" r="3" stroke="#2A2A2A" strokeWidth="1.5" />
                <path d="M2 22l8-7 5 5 4-3 11 9" stroke="#2A2A2A" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              <span style={{ fontFamily: 'Montserrat', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#2A2A2A', textTransform: 'uppercase' }}>
                {placeholder}
              </span>
            </div>
          )}
          {labels[i] && (
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'linear-gradient(0deg, rgba(10,10,10,0.85) 0%, transparent 100%)' }}>
              <span style={{ fontFamily: 'Montserrat', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#DEDEDA', fontWeight: 500, textTransform: 'uppercase' }}>{labels[i]}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

function getStyle(base: React.CSSProperties, hasError: boolean): React.CSSProperties {
  return { ...base, borderBottomColor: hasError ? '#A8956A' : '#1E1E1E' }
}

const HALL_ID = 'xnjwwyrg'
const CATERING_ID = 'xdabbvjy'

export default function Hall() {
  const [activeTab, setActiveTab] = useState<'hall' | 'catering'>('hall')
  const [submittedHall, setSubmittedHall] = useState(false)
  const [submittedCatering, setSubmittedCatering] = useState(false)
  const [sendingHall, setSendingHall] = useState(false)
  const [sendingCatering, setSendingCatering] = useState(false)
  const hallForm = useForm<HallFormValues>()
  const cateringForm = useForm<CateringFormValues>()
  const t = useT()
  const h = t.hallPage
  const m = t.menuPage

  useEffect(() => {
    document.title = "Location de Salle & Catering — Jabeen's Cuisine | Jusqu'à 225 personnes"
  }, [])

  const submitHall = async (data: HallFormValues) => {
    setSendingHall(true)
    try {
      const res = await fetch(`https://formspree.io/f/${HALL_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) setSubmittedHall(true)
    } finally {
      setSendingHall(false)
    }
  }

  const submitCatering = async (data: CateringFormValues) => {
    setSendingCatering(true)
    try {
      const res = await fetch(`https://formspree.io/f/${CATERING_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) setSubmittedCatering(true)
    } finally {
      setSendingCatering(false)
    }
  }

  const hallLabels = h.photos.map(p => p.label)
  const cateringLabels = ['Service en salle', 'Buffet', 'Cocktail', 'Présentation']

  const tabBtn = (tab: 'hall' | 'catering', label: string) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        flex: 1, padding: '18px 0', background: 'none', border: 'none',
        borderBottom: `2px solid ${activeTab === tab ? '#A8956A' : 'transparent'}`,
        cursor: 'pointer', fontFamily: 'Montserrat', fontSize: '0.72rem',
        fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const,
        color: activeTab === tab ? '#A8956A' : '#DEDEDA', transition: 'color 0.3s, border-color 0.3s',
      }}
    >{label}</button>
  )

  return (
    <>
      <div style={{ background: 'transparent', minHeight: '100vh' }}>

        {/* Header */}
        <div className="pt-40 pb-16 text-center px-8" style={{ borderBottom: '1px solid #1E1E1E' }}>
          <p className="text-label text-gold mb-4">{h.label}</p>
          <h1 className="text-display text-text-primary mb-6" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            {h.heading}
          </h1>
          <p className="text-text-muted font-light text-sm max-w-md mx-auto leading-relaxed">{h.description}</p>
        </div>

        {/* Tab switcher */}
        <div style={{ borderBottom: '1px solid #1E1E1E', display: 'flex', maxWidth: 480, margin: '0 auto' }}>
          {tabBtn('hall', h.formHeading)}
          {tabBtn('catering', m.cateringTab)}
        </div>

        {/* Photo gallery */}
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab + '-gallery'}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-8 md:px-16 py-20"
          >
            <div className="text-center mb-14">
              <p className="text-label text-gold mb-3">{h.galleryLabel}</p>
              <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                {activeTab === 'hall' ? h.galleryHeading : h.cateringGalleryHeading}
              </h2>
            </div>
            {activeTab === 'hall'
              ? <PhotoGrid srcs={hallPhotos} labels={hallLabels} placeholder={h.photoPlaceholder} />
              : <PhotoGrid srcs={cateringPhotos} labels={cateringLabels} placeholder={h.photoPlaceholder} />
            }
          </motion.section>
        </AnimatePresence>

        <div style={{ borderTop: '1px solid #1E1E1E' }} />

        {/* Stats */}
        <section className="max-w-4xl mx-auto px-8 py-20 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {h.stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}>
              <p className="text-display text-gold" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>{stat.value}</p>
              <p className="text-label text-text-muted mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        <div style={{ borderTop: '1px solid #1E1E1E' }} />

        {/* Forms */}
        <AnimatePresence mode="wait">
          {activeTab === 'hall' ? (
            <motion.section key="hall-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-xl mx-auto px-8 py-24">
              <div className="text-center mb-16">
                <p className="text-label text-gold mb-3">{h.formLabel}</p>
                <h2 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>{h.formHeading}</h2>
                <p className="text-text-muted font-light text-sm">{h.formSubheading}</p>
              </div>

              <AnimatePresence mode="wait">
                {!submittedHall ? (
                  <motion.form key="hall-f" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={hallForm.handleSubmit(submitHall)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>{h.prenom}</label>
                        <input {...hallForm.register('prenom', { required: true })} placeholder={h.prenom} style={getStyle(inputStyle, !!hallForm.formState.errors.prenom)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = hallForm.formState.errors.prenom ? '#A8956A' : '#1E1E1E')} />
                      </div>
                      <div>
                        <label style={labelStyle}>{h.nom}</label>
                        <input {...hallForm.register('nom', { required: true })} placeholder={h.nom} style={getStyle(inputStyle, !!hallForm.formState.errors.nom)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = hallForm.formState.errors.nom ? '#A8956A' : '#1E1E1E')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>{h.email}</label>
                        <input {...hallForm.register('email', { required: true, pattern: /^\S+@\S+$/i })} type="email" placeholder="email@example.com" style={getStyle(inputStyle, !!hallForm.formState.errors.email)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = hallForm.formState.errors.email ? '#A8956A' : '#1E1E1E')} />
                      </div>
                      <div>
                        <label style={labelStyle}>{h.telephone}</label>
                        <input {...hallForm.register('telephone', { required: true })} type="tel" placeholder="(450) 926-3111" style={getStyle(inputStyle, !!hallForm.formState.errors.telephone)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = hallForm.formState.errors.telephone ? '#A8956A' : '#1E1E1E')} />
                      </div>
                    </div>
                    <div className="mb-8">
                      <label style={labelStyle}>{h.date}</label>
                      <input {...hallForm.register('date', { required: true })} type="date" style={{ ...getStyle(inputStyle, !!hallForm.formState.errors.date), colorScheme: 'dark' }} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = hallForm.formState.errors.date ? '#A8956A' : '#1E1E1E')} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>{h.heureDebut}</label>
                        <input {...hallForm.register('heure_debut', { required: true })} type="time" style={{ ...getStyle(inputStyle, !!hallForm.formState.errors.heure_debut), colorScheme: 'dark' }} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = hallForm.formState.errors.heure_debut ? '#A8956A' : '#1E1E1E')} />
                      </div>
                      <div>
                        <label style={labelStyle}>{h.heureFin}</label>
                        <input {...hallForm.register('heure_fin', { required: true })} type="time" style={{ ...getStyle(inputStyle, !!hallForm.formState.errors.heure_fin), colorScheme: 'dark' }} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = hallForm.formState.errors.heure_fin ? '#A8956A' : '#1E1E1E')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>{h.personnes}</label>
                        <select {...hallForm.register('personnes', { required: true })} style={{ ...getStyle(inputStyle, !!hallForm.formState.errors.personnes), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}>
                          <option value="" disabled style={{ background: '#111' }}>—</option>
                          {h.personnesOptions.map(n => <option key={n} value={n} style={{ background: '#111' }}>{n} {h.personnesLabel}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>{h.typeEvenement}</label>
                        <select {...hallForm.register('type_evenement', { required: true })} style={{ ...getStyle(inputStyle, !!hallForm.formState.errors.type_evenement), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}>
                          <option value="" disabled style={{ background: '#111' }}>—</option>
                          {Object.entries(h.typeOptions).map(([val, label]) => <option key={val} value={val} style={{ background: '#111' }}>{label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-8">
                      <label style={labelStyle}>{h.restauration}</label>
                      <select {...hallForm.register('restauration', { required: true })} style={{ ...getStyle(inputStyle, !!hallForm.formState.errors.restauration), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}>
                        <option value="" disabled style={{ background: '#111' }}>—</option>
                        {Object.entries(h.restaurationOptions).map(([val, label]) => <option key={val} value={val} style={{ background: '#111' }}>{label}</option>)}
                      </select>
                    </div>
                    <div className="mb-12">
                      <label style={labelStyle}>{h.notes}</label>
                      <textarea {...hallForm.register('notes')} rows={3} placeholder={h.placeholder_notes} style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = '#1E1E1E')} />
                    </div>
                    <button type="submit" disabled={sendingHall} className="text-label w-full py-5 transition-all duration-300" style={{ background: '#A8956A', color: '#F5F5F0', fontSize: '0.78rem', fontWeight: 700, opacity: sendingHall ? 0.7 : 1, cursor: sendingHall ? 'wait' : 'pointer' }} onMouseEnter={e => { if (!sendingHall) e.currentTarget.style.background = '#bfa97a' }} onMouseLeave={e => (e.currentTarget.style.background = '#A8956A')}>
                      {sendingHall ? '...' : h.submit}
                    </button>
                    <p className="text-text-muted text-center mt-6 font-light" style={{ fontSize: '0.75rem' }}>{h.note}</p>
                  </motion.form>
                ) : (
                  <SuccessMessage h={h} />
                )}
              </AnimatePresence>
            </motion.section>
          ) : (
            <motion.section key="catering-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-xl mx-auto px-8 py-24">
              <div className="text-center mb-16">
                <p className="text-label text-gold mb-3">Catering</p>
                <h2 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
                  {t.nav.hallRental.includes('Catering') || t.nav.hallRental.includes('Traiteur') ? h.cateringGalleryHeading : 'Catering Request'}
                </h2>
                <p className="text-text-muted font-light text-sm">{h.formSubheading}</p>
              </div>

              <AnimatePresence mode="wait">
                {!submittedCatering ? (
                  <motion.form key="catering-f" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={cateringForm.handleSubmit(submitCatering)}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>{h.prenom}</label>
                        <input {...cateringForm.register('prenom', { required: true })} placeholder={h.prenom} style={getStyle(inputStyle, !!cateringForm.formState.errors.prenom)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = cateringForm.formState.errors.prenom ? '#A8956A' : '#1E1E1E')} />
                      </div>
                      <div>
                        <label style={labelStyle}>{h.nom}</label>
                        <input {...cateringForm.register('nom', { required: true })} placeholder={h.nom} style={getStyle(inputStyle, !!cateringForm.formState.errors.nom)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = cateringForm.formState.errors.nom ? '#A8956A' : '#1E1E1E')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>{h.email}</label>
                        <input {...cateringForm.register('email', { required: true, pattern: /^\S+@\S+$/i })} type="email" placeholder="email@example.com" style={getStyle(inputStyle, !!cateringForm.formState.errors.email)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = cateringForm.formState.errors.email ? '#A8956A' : '#1E1E1E')} />
                      </div>
                      <div>
                        <label style={labelStyle}>{h.telephone}</label>
                        <input {...cateringForm.register('telephone', { required: true })} type="tel" placeholder="(450) 926-3111" style={getStyle(inputStyle, !!cateringForm.formState.errors.telephone)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = cateringForm.formState.errors.telephone ? '#A8956A' : '#1E1E1E')} />
                      </div>
                    </div>
                    <div className="mb-8">
                      <label style={labelStyle}>{h.date}</label>
                      <input {...cateringForm.register('date', { required: true })} type="date" style={{ ...getStyle(inputStyle, !!cateringForm.formState.errors.date), colorScheme: 'dark' }} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = cateringForm.formState.errors.date ? '#A8956A' : '#1E1E1E')} />
                    </div>
                    <div className="mb-8">
                      <label style={labelStyle}>{h.notes.includes('Informations') ? 'Event Address' : "Adresse de l'événement"}</label>
                      <input {...cateringForm.register('adresse', { required: true })} placeholder="123 Rue Exemple, Brossard" style={getStyle(inputStyle, !!cateringForm.formState.errors.adresse)} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = cateringForm.formState.errors.adresse ? '#A8956A' : '#1E1E1E')} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label style={labelStyle}>{h.personnes}</label>
                        <select {...cateringForm.register('personnes', { required: true })} style={{ ...getStyle(inputStyle, !!cateringForm.formState.errors.personnes), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}>
                          <option value="" disabled style={{ background: '#111' }}>—</option>
                          {h.personnesOptions.map(n => <option key={n} value={n} style={{ background: '#111' }}>{n} {h.personnesLabel}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelStyle}>{h.typeEvenement}</label>
                        <select {...cateringForm.register('type_evenement', { required: true })} style={{ ...getStyle(inputStyle, !!cateringForm.formState.errors.type_evenement), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}>
                          <option value="" disabled style={{ background: '#111' }}>—</option>
                          {Object.entries(h.typeOptions).map(([val, label]) => <option key={val} value={val} style={{ background: '#111' }}>{label}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mb-8">
                      <label style={labelStyle}>{h.restauration}</label>
                      <select {...cateringForm.register('menu_preference', { required: true })} style={{ ...getStyle(inputStyle, !!cateringForm.formState.errors.menu_preference), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}>
                        <option value="" disabled style={{ background: '#111' }}>—</option>
                        <option value="buffet" style={{ background: '#111' }}>Buffet</option>
                        <option value="cocktail" style={{ background: '#111' }}>{Object.values(h.restaurationOptions)[1]}</option>
                        <option value="table" style={{ background: '#111' }}>{Object.values(h.restaurationOptions)[0]}</option>
                        <option value="sur_mesure" style={{ background: '#111' }}>{h.typeOptions.autre}</option>
                      </select>
                    </div>
                    <div className="mb-12">
                      <label style={labelStyle}>{h.notes}</label>
                      <textarea {...cateringForm.register('notes')} rows={3} placeholder={h.placeholder_notes} style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }} onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')} onBlur={e => (e.currentTarget.style.borderBottomColor = '#1E1E1E')} />
                    </div>
                    <button type="submit" disabled={sendingCatering} className="text-label w-full py-5 transition-all duration-300" style={{ background: '#A8956A', color: '#F5F5F0', fontSize: '0.78rem', fontWeight: 700, opacity: sendingCatering ? 0.7 : 1, cursor: sendingCatering ? 'wait' : 'pointer' }} onMouseEnter={e => { if (!sendingCatering) e.currentTarget.style.background = '#bfa97a' }} onMouseLeave={e => (e.currentTarget.style.background = '#A8956A')}>
                      {sendingCatering ? '...' : h.submit}
                    </button>
                    <p className="text-text-muted text-center mt-6 font-light" style={{ fontSize: '0.75rem' }}>{h.note}</p>
                  </motion.form>
                ) : (
                  <SuccessMessage h={h} />
                )}
              </AnimatePresence>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  )
}

function SuccessMessage({ h }: { h: { success_title: string; success_p1: string; success_p2: string } }) {
  return (
    <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="text-center py-20">
      <div className="gold-divider mx-auto mb-10" />
      <p className="text-display text-text-primary mb-6" style={{ fontSize: '1.8rem' }}>{h.success_title}</p>
      <p className="text-text-muted font-light text-sm mb-2">{h.success_p1}</p>
      <p className="text-text-muted font-light text-sm">{h.success_p2}</p>
      <div className="gold-divider mx-auto mt-10" />
    </motion.div>
  )
}
