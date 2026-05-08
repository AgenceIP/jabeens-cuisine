import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import OpenTableWidget from '@/components/ui/OpenTableWidget'
import { useT } from '@/contexts/LanguageContext'

interface FormValues {
  prenom: string
  nom: string
  email: string
  telephone: string
  date: string
  heure: string
  personnes: string
  occasion: string
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

export default function Reservations() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const t = useT()
  const r = t.reservationsPage

  const onSubmit = (_data: FormValues) => setSubmitted(true)

  const getInputStyle = (hasError: boolean): React.CSSProperties => ({
    ...inputStyle,
    borderBottomColor: hasError ? '#A8956A' : '#1E1E1E',
  })

  return (
    <>
      <div style={{ background: '#07091C', minHeight: '100vh' }}>

        {/* Header */}
        <div className="pt-40 pb-16 text-center px-8" style={{ borderBottom: '1px solid #1E1E1E' }}>
          <p className="text-label text-gold mb-4">{r.label}</p>
          <h1 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}>
            {r.heading}
          </h1>
          <p className="text-text-muted font-light text-sm">{r.subheading}</p>
        </div>

        {/* OpenTable section */}
        <div className="max-w-2xl mx-auto px-8 py-20">
          <div className="text-center mb-10">
            <p className="text-label text-gold mb-3">{r.otLabel}</p>
            <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
              {r.otHeading}
            </h2>
          </div>
          <OpenTableWidget />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-6 max-w-2xl mx-auto px-8 pb-20">
          <div className="flex-1" style={{ height: 1, background: '#1E1E1E' }} />
          <p className="text-label text-text-muted" style={{ fontSize: '0.55rem' }}>
            {r.groupsLabel}
          </p>
          <div className="flex-1" style={{ height: 1, background: '#1E1E1E' }} />
        </div>

        {/* Groups & Events form */}
        <div className="max-w-xl mx-auto px-8 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-display text-text-primary mb-3" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}>
              {r.groupsHeading}
            </h2>
            <p className="text-text-muted font-light text-sm leading-relaxed">{r.groupsBody}</p>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit(onSubmit)}>
                {/* Prénom / Nom */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{r.prenom}</label>
                    <input
                      {...register('prenom', { required: true })}
                      placeholder={r.prenom}
                      style={getInputStyle(!!errors.prenom)}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.prenom ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{r.nom}</label>
                    <input
                      {...register('nom', { required: true })}
                      placeholder={r.nom}
                      style={getInputStyle(!!errors.nom)}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.nom ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                </div>

                {/* Email / Téléphone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{r.email}</label>
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
                    <label style={labelStyle}>{r.telephone}</label>
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

                {/* Date / Heure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{r.date}</label>
                    <input
                      {...register('date', { required: true })}
                      type="date"
                      style={{ ...getInputStyle(!!errors.date), colorScheme: 'dark' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.date ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>{r.heure}</label>
                    <input
                      {...register('heure', { required: true })}
                      type="time"
                      style={{ ...getInputStyle(!!errors.heure), colorScheme: 'dark' }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = errors.heure ? '#A8956A' : '#1E1E1E')}
                    />
                  </div>
                </div>

                {/* Personnes / Occasion */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label style={labelStyle}>{r.personnes}</label>
                    <select
                      {...register('personnes', { required: true })}
                      style={{ ...getInputStyle(!!errors.personnes), appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                    >
                      <option value="" disabled style={{ background: '#111' }}>{r.selectPersonnes}</option>
                      {[10, 15, 20, 25, 30, 40, 50].map(n => (
                        <option key={n} value={n} style={{ background: '#111' }}>
                          {n}+ {r.personnesLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>{r.occasion}</label>
                    <select
                      {...register('occasion')}
                      style={{ ...inputStyle, appearance: 'none', cursor: 'pointer', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                    >
                      <option value="" style={{ background: '#111' }}>{r.noOccasion}</option>
                      <option value="anniversaire" style={{ background: '#111' }}>{r.occasions.anniversaire}</option>
                      <option value="romantique" style={{ background: '#111' }}>{r.occasions.romantique}</option>
                      <option value="affaires" style={{ background: '#111' }}>{r.occasions.affaires}</option>
                      <option value="mariage" style={{ background: '#111' }}>{r.occasions.mariage}</option>
                      <option value="autre" style={{ background: '#111' }}>{r.occasions.autre}</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-12">
                  <label style={labelStyle}>{r.notes}</label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    placeholder={r.placeholder_notes}
                    style={{ ...inputStyle, resize: 'none', lineHeight: 1.7 }}
                    onFocus={e => (e.currentTarget.style.borderBottomColor = '#A8956A')}
                    onBlur={e => (e.currentTarget.style.borderBottomColor = '#1E1E1E')}
                  />
                </div>

                <button
                  type="submit"
                  className="text-label w-full py-5 transition-all duration-300"
                  style={{ background: '#A8956A', color: '#07091C' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#bfa97a')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#A8956A')}
                >
                  {r.submit}
                </button>

                <p className="text-text-muted text-center mt-6 font-light" style={{ fontSize: '0.75rem' }}>
                  {r.note}
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
                <p className="text-display text-text-primary mb-6" style={{ fontSize: '1.8rem' }}>{r.success_title}</p>
                <p className="text-text-muted font-light text-sm mb-2">{r.success_p1}</p>
                <p className="text-text-muted font-light text-sm">{r.success_p2}</p>
                <div className="gold-divider mx-auto mt-10" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </>
  )
}
