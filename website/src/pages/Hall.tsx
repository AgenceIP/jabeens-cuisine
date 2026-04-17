import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import { useT } from '@/contexts/LanguageContext'

interface FormValues {
  prenom: string
  nom: string
  email: string
  telephone: string
  date: string
  heure_debut: string
  heure_fin: string
  personnes: string
  type_evenement: string
  restauration: string
  notes: string
}

const inputStyle: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid #1E1E1E',
  color: '#F5F5F0',
  padding: '14px 0',
  fontSize: '0.875rem',
  fontFamily: 'Montserrat',
  fontWeight: 300,
  width: '100%',
  transition: 'border-color 0.3s',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'Montserrat',
  fontSize: '0.55rem',
  fontWeight: 500,
  letterSpacing: '0.3em',
  textTransform: 'uppercase' as const,
  color: '#6B6B6B',
  display: 'block',
  marginBottom: '8px',
}

const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6B6B' stroke-width='1' fill='none'/%3E%3C/svg%3E")`

// Photo sources — replace null with real paths once photos are available e.g. '/assets/hall-1.jpg'
const photoSrcs: (string | null)[] = [null, null, null, null, null, null]

export default function Hall() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const t = useT()
  const h = t.hallPage

  const onSubmit = (_data: FormValues) => setSubmitted(true)

  const getInputStyle = (hasError: boolean): React.CSSProperties => ({
    ...inputStyle,
    borderBottomColor: hasError ? '#A8956A' : '#1E1E1E',
  })

  return (
    <>
      <div style={{ background: '#0A0A0A', minHeight: '100vh' }}>

        {/* ── Header ── */}
        <div className="pt-40 pb-16 text-center px-8" style={{ borderBottom: '1px solid #1E1E1E' }}>
          <p className="text-label text-gold mb-4">{h.label}</p>
          <h1 className="text-display text-text-primary mb-6" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            {h.heading}
          </h1>
          <p className="text-text-muted font-light text-sm max-w-md mx-auto leading-relaxed">
            {h.description}
          </p>
        </div>

        {/* ── Galerie ── */}
        <section className="max-w-7xl mx-auto px-8 md:px-16 py-24">
          <div className="text-center mb-14">
            <p className="text-label text-gold mb-3">{h.galleryLabel}</p>
            <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
              {h.galleryHeading}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {h.photos.map((photo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="relative overflow-hidden"
                style={{ aspectRatio: '4/3', background: '#111111', border: '1px solid #1E1E1E' }}
              >
                {photoSrcs[i] ? (
                  <img src={photoSrcs[i]!} alt={photo.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect x="2" y="6" width="28" height="20" rx="1" stroke="#2A2A2A" strokeWidth="1.5" />
                      <circle cx="21" cy="13" r="3" stroke="#2A2A2A" strokeWidth="1.5" />
                      <path d="M2 22l8-7 5 5 4-3 11 9" stroke="#2A2A2A" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontFamily: 'Montserrat', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#2A2A2A', textTransform: 'uppercase' }}>
                      {h.photoPlaceholder}
                    </span>
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 px-4 py-3"
                  style={{ background: 'linear-gradient(0deg, rgba(10,10,10,0.85) 0%, transparent 100%)' }}
                >
                  <span style={{ fontFamily: 'Montserrat', fontSize: '0.6rem', letterSpacing: '0.25em', color: '#6B6B6B', textTransform: 'uppercase' }}>
                    {photo.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <div style={{ borderTop: '1px solid #1E1E1E' }} />

        {/* ── Stats ── */}
        <section className="max-w-4xl mx-auto px-8 py-20 grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
          {h.stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <p className="text-display text-gold" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>{stat.value}</p>
              <p className="text-label text-text-muted mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </section>

        <div style={{ borderTop: '1px solid #1E1E1E' }} />

        {/* ── Formulaire ── */}
        <section className="max-w-xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <p className="text-label text-gold mb-3">{h.formLabel}</p>
            <h2 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
              {h.formHeading}
            </h2>
            <p className="text-text-muted font-light text-sm">{h.formSubheading}</p>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit(onSubmit)}>
                {/* Prénom / Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{h.prenom}</label>
                    <input
                      {...register('prenom', { required: true })}
                      placeholder={h.prenom}
                      style={getInputStyle(!!errors.prenom)}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.prenom ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{h.nom}</label>
                    <input
                      {...register('nom', { required: true })}
                      placeholder={h.nom}
                      style={getInputStyle(!!errors.nom)}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.nom ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                </div>

                {/* Email / Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{h.email}</label>
                    <input
                      {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                      type="email"
                      placeholder="email@example.com"
                      style={getInputStyle(!!errors.email)}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.email ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{h.telephone}</label>
                    <input
                      {...register('telephone', { required: true })}
                      type="tel"
                      placeholder="(450) 926-3111"
                      style={getInputStyle(!!errors.telephone)}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.telephone ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="mb-8">
                  <label style={labelStyle}>{h.date}</label>
                  <input
                    {...register('date', { required: true })}
                    type="date"
                    style={{ ...getInputStyle(!!errors.date), colorScheme: 'dark' }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = errors.date ? '#A8956A' : '#1E1E1E')}
                  />
                </div>

                {/* Heure début / fin */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{h.heureDebut}</label>
                    <input
                      {...register('heure_debut', { required: true })}
                      type="time"
                      style={{ ...getInputStyle(!!errors.heure_debut), colorScheme: 'dark' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.heure_debut ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{h.heureFin}</label>
                    <input
                      {...register('heure_fin', { required: true })}
                      type="time"
                      style={{ ...getInputStyle(!!errors.heure_fin), colorScheme: 'dark' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.heure_fin ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                </div>

                {/* Personnes / Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{h.personnes}</label>
                    <select
                      {...register('personnes', { required: true })}
                      style={{ ...getInputStyle(!!errors.personnes), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                    >
                      <option value="" disabled style={{ background: '#111' }}>—</option>
                      {h.personnesOptions.map(n => (
                        <option key={n} value={n} style={{ background: '#111' }}>{n} {h.personnesLabel}</option>
                      ))}
                      <option value="150+" style={{ background: '#111' }}>150+ {h.personnesLabel}</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{h.typeEvenement}</label>
                    <select
                      {...register('type_evenement', { required: true })}
                      style={{ ...getInputStyle(!!errors.type_evenement), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                    >
                      <option value="" disabled style={{ background: '#111' }}>—</option>
                      {Object.entries(h.typeOptions).map(([val, label]) => (
                        <option key={val} value={val} style={{ background: '#111' }}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Restauration */}
                <div className="mb-8">
                  <label style={labelStyle}>{h.restauration}</label>
                  <select
                    {...register('restauration', { required: true })}
                    style={{ ...getInputStyle(!!errors.restauration), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                  >
                    <option value="" disabled style={{ background: '#111' }}>—</option>
                    {Object.entries(h.restaurationOptions).map(([val, label]) => (
                      <option key={val} value={val} style={{ background: '#111' }}>{label}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="mb-12">
                  <label style={labelStyle}>{h.notes}</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder={h.placeholder_notes}
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = '#1E1E1E')}
                  />
                </div>

                <button
                  type="submit"
                  className="text-label w-full py-5 transition-all duration-300"
                  style={{ background: '#A8956A', color: '#0A0A0A' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#bfa97a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#A8956A')}
                >
                  {h.submit}
                </button>

                <p className="text-text-muted text-center mt-6 font-light" style={{ fontSize: '0.75rem' }}>
                  {h.note}
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center py-20"
              >
                <div className="gold-divider mx-auto mb-10" />
                <p className="text-display text-text-primary mb-6" style={{ fontSize: '1.8rem' }}>{h.success_title}</p>
                <p className="text-text-muted font-light text-sm mb-2">{h.success_p1}</p>
                <p className="text-text-muted font-light text-sm">{h.success_p2}</p>
                <div className="gold-divider mx-auto mt-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <Footer />
    </>
  )
}
