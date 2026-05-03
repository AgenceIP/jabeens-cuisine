import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GrandOpeningPopup() {
  const [open, setOpen] = useState(true)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.85)',
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
            style={{ position: 'relative' }}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              style={{
                position: 'absolute',
                top: -14,
                right: -14,
                zIndex: 10,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: '#0A0A0A',
                border: '1px solid #3A3A3A',
                color: '#999',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.color = '#E8E8E8'
                b.style.borderColor = '#A8956A'
              }}
              onMouseLeave={e => {
                const b = e.currentTarget as HTMLButtonElement
                b.style.color = '#999'
                b.style.borderColor = '#3A3A3A'
              }}
            >
              ✕
            </button>

            {/* Poster */}
            <img
              src="/menu/GRAND OPENING.png"
              alt="Grand Opening"
              style={{
                display: 'block',
                width: 'min(520px, 88vw)',
                maxHeight: '88vh',
                objectFit: 'contain',
                border: '1px solid #2A2A2A',
                boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
