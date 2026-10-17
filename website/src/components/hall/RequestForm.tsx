import { useEffect, useId, useState, type ReactNode } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import type { CateringMenuId } from '@/data/cateringMenus'
import {
  buildPayload, CATERING_FORM_ID, guestIssue, guestRange, isPastDate, needsAddress, needsMenu, toLocalISODate,
  type CateringRequest, type MenuChoice, type Occasion, type Service,
} from '@/lib/cateringRules'
import { fmt } from '@/lib/fmt'

interface Values {
  service: Service | ''; menu: MenuChoice | ''; occasion: Occasion | ''; guests: string; date: string; address: string
  prenom: string; nom: string; email: string; telephone: string; notes: string
}

const SERVICES: Service[] = ['salle_traiteur', 'traiteur_domicile', 'salle_seule']
const MENUS: MenuChoice[] = ['queen', 'king', 'corporate', 'indecis']
const OCCASIONS: Occasion[] = ['fete_maison', 'reception', 'pre_mariage', 'corporatif', 'autre']
const MENU_NAMES: Record<MenuChoice, string> = { queen: 'Queen', king: 'King', corporate: 'Corporate', indecis: '' }

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-label text-text-primary block mb-1" style={{ fontSize: 'max(0.62rem, var(--fs-min))' }}>{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-text-muted text-xs mt-2">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="text-error text-sm mt-2">{error}</p>}
    </div>
  )
}

export default function RequestForm({ preset }: { preset: { menu: CateringMenuId; n: number } | null }) {
  const f = useT().hallPage.form
  const { lang } = useLang()
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const { register, control, handleSubmit, setValue, trigger, getValues, getFieldState, formState: { errors, isSubmitted } } = useForm<Values>({
    // onTouched: once a field was visited, its error updates as the visitor types (an error shown
    // after a menu change must clear as soon as the count is fixed).
    mode: 'onTouched',
    defaultValues: { service: '', menu: '', occasion: '', guests: '', date: '', address: '', prenom: '', nom: '', email: '', telephone: '', notes: '' },
  })
  const service = useWatch({ control, name: 'service' })
  const menu = useWatch({ control, name: 'menu' })
  const range = guestRange(service, menu)

  useEffect(() => {
    if (!preset) return
    setValue('menu', preset.menu, { shouldDirty: true, shouldValidate: true })
    // A menu needs catering: leave the hall-only choice, but let the visitor pick hall or address.
    if (getValues('service') === 'salle_seule') setValue('service', '', { shouldValidate: isSubmitted })
  }, [preset, setValue, getValues, isSubmitted])

  // Re-check the guest count as soon as the menu or service changes.
  useEffect(() => {
    if (getValues('guests') !== '' || isSubmitted) void trigger('guests')
  }, [service, menu, trigger, getValues, isSubmitted])

  const guestMessage = (raw: string): true | string => {
    const issue = guestIssue(service, menu, raw)
    if (!issue) return true
    if (issue.kind === 'invalid') return f.errors.invalidGuests
    if (issue.kind === 'max') return fmt(f.errors.maxGuests, { max: issue.max })
    return menu && menu !== 'indecis' && needsMenu(service)
      ? fmt(f.errors.minGuests, { menu: MENU_NAMES[menu], min: issue.min })
      : fmt(f.errors.minGuestsGeneric, { min: issue.min })
  }

  const onSubmit = async (v: Values) => {
    setStatus('sending')
    const request: CateringRequest = { ...v, service: v.service as Service, occasion: v.occasion as Occasion, guests: Number(v.guests) }
    try {
      const res = await fetch(`https://formspree.io/f/${CATERING_FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload(request, lang)),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const err = (name: keyof Values) => errors[name]?.message as string | undefined
  const aria = (name: keyof Values) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${id(name)}-err` : undefined,
  })

  return (
    <section id="demande" className="scroll-mt-24 border-t border-border-subtle">
      <div className="max-w-2xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="text-label text-gold mb-3">{f.label}</p>
          <h2 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{f.heading}</h2>
          <p className="text-text-muted">{f.subheading}</p>
        </div>
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12" role="status">
              <div className="gold-divider mx-auto mb-8" />
              <p className="text-display text-text-primary mb-4" style={{ fontSize: '1.9rem' }}>{f.success_title}</p>
              <p className="text-text-muted mb-1">{f.success_p1}</p>
              <p className="text-text-muted">{f.success_p2}</p>
            </motion.div>
          ) : (
            <motion.form key="form" noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              <fieldset>
                <legend className="text-label text-text-primary mb-3" style={{ fontSize: 'max(0.62rem, var(--fs-min))' }}>{f.service}</legend>
                <div className="grid sm:grid-cols-3 gap-3" role="radiogroup">
                  {SERVICES.map(s => (
                    <label key={s} className={`border px-4 py-3 cursor-pointer text-sm transition-colors focus-within:ring-2 focus-within:ring-gold ${service === s ? 'border-gold text-text-primary bg-surface' : 'border-text-primary/50 text-text-muted'}`}>
                      <input type="radio" value={s} className="sr-only" {...register('service', { required: f.errors.required })} />
                      {f.serviceOptions[s]}
                    </label>
                  ))}
                </div>
                {err('service') && <p role="alert" className="text-error text-sm mt-2">{err('service')}</p>}
              </fieldset>

              <div className="grid sm:grid-cols-2 gap-6">
                {needsMenu(service) && (
                  <Field id={id('menu')} label={f.menu} error={err('menu')}>
                    <select id={id('menu')} className="field" {...aria('menu')} {...register('menu', { validate: v => !needsMenu(getValues('service')) || v !== '' || f.errors.required })}>
                      <option value="">{f.choose}</option>
                      {MENUS.map(mn => <option key={mn} value={mn}>{f.menuOptions[mn]}</option>)}
                    </select>
                  </Field>
                )}
                <Field id={id('occasion')} label={f.occasion} error={err('occasion')}>
                  <select id={id('occasion')} className="field" {...aria('occasion')} {...register('occasion', { required: f.errors.required })}>
                    <option value="">{f.choose}</option>
                    {OCCASIONS.map(o => <option key={o} value={o}>{f.occasionOptions[o]}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field id={id('guests')} label={f.guests} error={err('guests')}
                  hint={range.max ? fmt(f.guestsHintMax, { min: range.min, max: range.max }) : fmt(f.guestsHint, { min: range.min })}>
                  <input id={id('guests')} type="number" inputMode="numeric" min={range.min} max={range.max ?? undefined} step={1} className="field"
                    {...aria('guests')} aria-describedby={errors.guests ? `${id('guests')}-err` : `${id('guests')}-hint`}
                    {...register('guests', {
                      validate: guestMessage,
                      // An error shown after a menu/service change must update as the visitor types.
                      onChange: () => { if (getFieldState('guests').error) void trigger('guests') },
                    })} />
                </Field>
                <Field id={id('date')} label={f.date} error={err('date')}>
                  <input id={id('date')} type="date" min={toLocalISODate(new Date())} className="field" {...aria('date')}
                    {...register('date', { required: f.errors.required, validate: v => !isPastDate(v, new Date()) || f.errors.pastDate })} />
                </Field>
              </div>

              {needsAddress(service) && (
                <Field id={id('address')} label={f.address} error={err('address')}>
                  <input id={id('address')} className="field" placeholder={f.addressPlaceholder} autoComplete="street-address" {...aria('address')}
                    {...register('address', { validate: v => !needsAddress(getValues('service')) || v.trim() !== '' || f.errors.required })} />
                </Field>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <Field id={id('prenom')} label={f.prenom} error={err('prenom')}>
                  <input id={id('prenom')} className="field" autoComplete="given-name" {...aria('prenom')} {...register('prenom', { required: f.errors.required })} />
                </Field>
                <Field id={id('nom')} label={f.nom} error={err('nom')}>
                  <input id={id('nom')} className="field" autoComplete="family-name" {...aria('nom')} {...register('nom', { required: f.errors.required })} />
                </Field>
                <Field id={id('email')} label={f.email} error={err('email')}>
                  <input id={id('email')} type="email" className="field" autoComplete="email" {...aria('email')}
                    {...register('email', { required: f.errors.required, pattern: { value: /^\S+@\S+\.\S+$/, message: f.errors.email } })} />
                </Field>
                <Field id={id('telephone')} label={f.telephone} error={err('telephone')}>
                  <input id={id('telephone')} type="tel" className="field" autoComplete="tel" placeholder="(450) 926-3111" {...aria('telephone')}
                    {...register('telephone', { required: f.errors.required })} />
                </Field>
              </div>

              <Field id={id('notes')} label={f.notes}>
                <textarea id={id('notes')} rows={3} className="field resize-none" placeholder={f.notesPlaceholder} {...register('notes')} />
              </Field>

              <div>
                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">{status === 'sending' ? f.sending : f.submit}</button>
                {status === 'error' && <p role="alert" className="text-error text-sm mt-4 text-center">{f.errors.network}</p>}
                <p className="text-text-muted text-xs text-center mt-4">{f.note}</p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
