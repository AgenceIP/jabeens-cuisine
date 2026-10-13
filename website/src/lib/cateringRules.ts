import type { CateringMenuId } from '@/data/cateringMenus'

export type Service = 'salle_traiteur' | 'traiteur_domicile' | 'salle_seule'
export type MenuChoice = CateringMenuId | 'indecis'
export type Occasion = 'fete_maison' | 'reception' | 'pre_mariage' | 'corporatif' | 'autre'

export const CATERING_FORM_ID = 'xdabbvjy'
export const HALL_CAPACITY = 225
export const MENU_MINIMUMS: Record<MenuChoice, number> = { queen: 50, king: 50, corporate: 10, indecis: 10 }

export const usesHall = (s: Service | '') => s === 'salle_traiteur' || s === 'salle_seule'
export const needsMenu = (s: Service | '') => s !== 'salle_seule'
export const needsAddress = (s: Service | '') => s === 'traiteur_domicile'

export function guestRange(s: Service | '', menu: MenuChoice | ''): { min: number; max: number | null } {
  const min = needsMenu(s) && menu ? MENU_MINIMUMS[menu] : 1
  return { min, max: usesHall(s) ? HALL_CAPACITY : null }
}

export type GuestIssue = { kind: 'invalid' } | { kind: 'min'; min: number } | { kind: 'max'; max: number } | null

export function guestIssue(s: Service | '', menu: MenuChoice | '', raw: string): GuestIssue {
  const n = Number(raw)
  if (raw.trim() === '' || !Number.isInteger(n) || n < 1) return { kind: 'invalid' }
  const { min, max } = guestRange(s, menu)
  if (n < min) return { kind: 'min', min }
  if (max !== null && n > max) return { kind: 'max', max }
  return null
}

export function toLocalISODate(d: Date): string {
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** `value` is the YYYY-MM-DD string of an <input type="date">. */
export const isPastDate = (value: string, today: Date) => value < toLocalISODate(today)

export interface CateringRequest {
  service: Service
  menu: MenuChoice | ''
  occasion: Occasion
  guests: number
  date: string
  address: string
  prenom: string
  nom: string
  email: string
  telephone: string
  notes: string
}

// The client reads these emails in French whatever language the visitor used.
const LABELS = {
  service: { salle_traiteur: "Salle + traiteur Jabeen's", traiteur_domicile: 'Traiteur à votre adresse', salle_seule: 'Salle seulement' },
  menu: { queen: 'Queen (min. 50)', king: 'King (min. 50)', corporate: 'Corporate (min. 10)', indecis: 'Pas encore choisi' },
  occasion: { fete_maison: 'Fête à la maison', reception: 'Réception', pre_mariage: 'Pré-mariage', corporatif: 'Corporatif', autre: 'Autre' },
} as const

export function buildPayload(r: CateringRequest, lang: 'fr' | 'en'): Record<string, string> {
  const p: Record<string, string> = { Service: LABELS.service[r.service] }
  if (needsMenu(r.service) && r.menu) p.Menu = LABELS.menu[r.menu]
  p.Occasion = LABELS.occasion[r.occasion]
  p['Invités'] = String(r.guests)
  p.Date = r.date
  if (needsAddress(r.service)) p.Adresse = r.address.trim()
  p['Prénom'] = r.prenom.trim()
  p.Nom = r.nom.trim()
  p.Courriel = r.email.trim()
  p['Téléphone'] = r.telephone.trim()
  p.Notes = r.notes.trim() || '—'
  p['Langue du site'] = lang.toUpperCase()
  p._replyto = r.email.trim()
  p._subject = `Demande traiteur – ${p['Prénom']} ${p.Nom} – ${r.date}`
  return p
}
