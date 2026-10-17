import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '@/contexts/LanguageContext'

// Formspree newsletter form ID
// To create a dedicated newsletter form: https://formspree.io → New Form → email: info@jabeenscuisine.com
// Replace this ID with the new form's ID once created
const FORMSPREE_NEWSLETTER_ID = 'xeennwdj'

const LS_KEY = 'jc_newsletter_seen'
const TTL_MS = 30 * 24 * 60 * 60 * 1000 // 30 days

// Site affiché dans un cadre (ex.: la vitrine d'Agence IP): pas de fenêtre d'infolettre.
function isEmbedded(): boolean {
  try {
    return window.self !== window.top
  } catch {
    return true // accès refusé au parent: on est forcément dans un cadre
  }
}

function shouldShow(): boolean {
  if (isEmbedded()) return false
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return true
    const ts = parseInt(raw, 10)
    return Date.now() - ts > TTL_MS
  } catch {
    return true
  }
}

function markSeen(): void {
  try {
    localStorage.setItem(LS_KEY, String(Date.now()))
  } catch {
    // localStorage unavailable (private browsing, etc.) — silently ignore
  }
}

export default function NewsletterPopup() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useT()
  const nl = t.newsletter

  useEffect(() => {
    if (!shouldShow()) return
    const timer = setTimeout(() => setOpen(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Focus input when popup opens
  useEffect(() => {
    if (open) {
      const focusTimer = setTimeout(() => inputRef.current?.focus(), 500)
      return () => clearTimeout(focusTimer)
    }
  }, [open])

  function dismiss() {
    markSeen()
    setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_NEWSLETTER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, _subject: "Newsletter signup — Jabeen's Cuisine" }),
      })
      if (res.ok) {
        setStatus('success')
        markSeen()
        setTimeout(() => setOpen(false), 2500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismiss}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgb(var(--c-scrim) / 0.7)',
            backdropFilter: 'blur(6px)',
            padding: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              background: 'rgb(var(--c-surface))',
              border: '1px solid rgb(var(--c-line))',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
              padding: 'clamp(32px, 6vw, 56px)',
              width: 'min(480px, 90vw)',
              textAlign: 'center',
            }}
          >
            {/* Close button */}
            <button
              onClick={dismiss}
              aria-label="Fermer"
              style={{
                position: 'absolute',
                top: -14,
                right: -14,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgb(var(--c-surface))',
                border: '1px solid rgb(var(--c-ink) / 0.3)',
                color: 'rgb(var(--c-muted))',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'max(0.75rem, var(--fs-min))',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.color = 'rgb(var(--c-ink))'
                b.style.borderColor = 'rgb(var(--c-accent))'
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.color = 'rgb(var(--c-muted))'
                b.style.borderColor = 'rgb(var(--c-ink) / 0.3)'
              }}
            >
              ✕
            </button>

            <AnimatePresence mode="wait">
              {status !== 'success' ? (
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  {/* Gold accent line */}
                  <div style={{ width: 32, height: 1, background: 'rgb(var(--c-accent))', margin: '0 auto 24px' }} />

                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 400,
                      fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                      color: 'rgb(var(--c-ink))',
                      lineHeight: 1.2,
                      marginBottom: 12,
                    }}
                  >
                    {nl.heading}
                  </h2>

                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 300,
                      fontSize: '0.8rem',
                      color: 'rgb(var(--c-muted))',
                      lineHeight: 1.6,
                      marginBottom: 32,
                    }}
                  >
                    {nl.subheading}
                  </p>

                  <form onSubmit={handleSubmit}>
                    <input
                      ref={inputRef}
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={nl.placeholder}
                      required
                      style={{
                        display: 'block',
                        width: '100%',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid rgb(var(--c-ink) / 0.25)',
                        color: 'rgb(var(--c-ink))',
                        padding: '12px 0',
                        fontSize: '0.875rem',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 300,
                        marginBottom: 24,
                        outline: 'none',
                        textAlign: 'center',
                        transition: 'border-color 0.3s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={e => (e.currentTarget.style.borderBottomColor = 'rgb(var(--c-accent))')}
                      onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgb(var(--c-ink) / 0.25)')}
                    />

                    {status === 'error' && (
                      <p style={{ color: 'rgb(var(--c-error))', fontSize: 'max(0.75rem, var(--fs-min))', fontFamily: 'var(--font-body)', marginBottom: 12 }}>
                        {nl.error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      style={{
                        display: 'block',
                        width: '100%',
                        background: 'rgb(var(--c-btn))',
                        color: 'rgb(var(--c-btn-ink))',
                        border: 'none',
                        padding: '14px 0',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: 'max(0.72rem, var(--fs-min))',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        cursor: status === 'sending' ? 'wait' : 'pointer',
                        opacity: status === 'sending' ? 0.7 : 1,
                        transition: 'background 0.2s, opacity 0.2s',
                      }}
                      onMouseEnter={e => {
                        if (status !== 'sending') (e.currentTarget as HTMLButtonElement).style.background = 'rgb(var(--c-btn-hover))'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgb(var(--c-btn))'
                      }}
                    >
                      {status === 'sending' ? '…' : nl.cta}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ padding: '16px 0' }}
                >
                  <div style={{ width: 32, height: 1, background: 'rgb(var(--c-accent))', margin: '0 auto 24px' }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontStyle: 'italic',
                      fontWeight: 400,
                      fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                      color: 'rgb(var(--c-ink))',
                      marginBottom: 12,
                    }}
                  >
                    {nl.success_title}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.8rem', color: 'rgb(var(--c-muted))' }}>
                    {nl.success_body}
                  </p>
                  <div style={{ width: 32, height: 1, background: 'rgb(var(--c-accent))', margin: '24px auto 0' }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
