import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/data/siteConfig'
import { useT } from '@/contexts/LanguageContext'

const FORMSPREE_ID = 'xeennwdj'

interface FormValues {
  prenom: string
  nom: string
  email: string
  type: string
  message: string
}

const selectArrow = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B6B6B' stroke-width='1' fill='none'/%3E%3C/svg%3E")`

export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()
  const t = useT()
  const fb = t.feedback

  const onSubmit = async (data: FormValues) => {
    setSending(true)
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: `${data.prenom} ${data.nom}`,
          email: data.email,
          type: data.type,
          message: data.message,
        }),
      })
      if (res.ok) setSubmitted(true)
    } finally {
      setSending(false)
    }
  }

  return (
    <section style={{ background: 'transparent' }} className="section-padding">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-label text-gold mb-4">{fb.label}</p>
          <h2 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {fb.heading}
          </h2>
          <p className="text-text-muted font-light text-sm">{fb.subheading}</p>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="fb-prenom" className="text-label text-text-muted block mb-2" style={{ fontSize: 'max(0.55rem, var(--fs-min))' }}>{fb.prenom}</label>
                  <input
                    id="fb-prenom"
                    {...register('prenom', { required: true })}
                    placeholder={fb.placeholder_prenom}
                    className="field"
                    aria-invalid={!!errors.prenom}
                  />
                </div>
                <div>
                  <label htmlFor="fb-nom" className="text-label text-text-muted block mb-2" style={{ fontSize: 'max(0.55rem, var(--fs-min))' }}>{fb.nom}</label>
                  <input
                    id="fb-nom"
                    {...register('nom', { required: true })}
                    placeholder={fb.placeholder_nom}
                    className="field"
                    aria-invalid={!!errors.nom}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="fb-email" className="text-label text-text-muted block mb-2" style={{ fontSize: 'max(0.55rem, var(--fs-min))' }}>{fb.email}</label>
                <input
                  id="fb-email"
                  {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                  type="email"
                  placeholder="email@example.com"
                  className="field"
                  aria-invalid={!!errors.email}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="fb-type" className="text-label text-text-muted block mb-2" style={{ fontSize: 'max(0.55rem, var(--fs-min))' }}>{fb.typeLabel}</label>
                <select
                  id="fb-type"
                  {...register('type', { required: true })}
                  className="field"
                  aria-invalid={!!errors.type}
                  style={{ cursor: 'pointer', appearance: 'none', backgroundImage: selectArrow, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 4px center' }}
                >
                  <option value="" disabled>{fb.selectType}</option>
                  <option value="compliment">{fb.types.compliment}</option>
                  <option value="suggestion">{fb.types.suggestion}</option>
                  <option value="probleme">{fb.types.probleme}</option>
                  <option value="autre">{fb.types.autre}</option>
                </select>
              </div>

              <div className="mb-12">
                <label htmlFor="fb-message" className="text-label text-text-muted block mb-2" style={{ fontSize: 'max(0.55rem, var(--fs-min))' }}>{fb.message}</label>
                <textarea
                  id="fb-message"
                  {...register('message', { required: true })}
                  rows={4}
                  placeholder={fb.placeholder_message}
                  className="field resize-none"
                  style={{ lineHeight: 1.7 }}
                  aria-invalid={!!errors.message}
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="btn-primary w-full py-5"
              >
                {sending ? '...' : fb.submit}
              </button>

              <div className="flex justify-center gap-8 mt-12">
                <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="text-label text-text-muted hover:text-gold transition-colors duration-300" style={{ fontSize: 'max(0.6rem, var(--fs-min))' }}>Instagram</a>
                <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="text-label text-text-muted hover:text-gold transition-colors duration-300" style={{ fontSize: 'max(0.6rem, var(--fs-min))' }}>Facebook</a>
                <a href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer" className="text-label text-text-muted hover:text-gold transition-colors duration-300" style={{ fontSize: 'max(0.6rem, var(--fs-min))' }}>TikTok</a>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-center py-20"
            >
              <div className="gold-divider mx-auto mb-8" />
              <p className="text-display-italic text-text-primary mb-4" style={{ fontSize: '1.5rem' }}>{fb.success_title}</p>
              <p className="text-text-muted font-light text-sm">{fb.success_body}</p>
              <div className="gold-divider mx-auto mt-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
