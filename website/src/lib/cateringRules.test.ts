import { describe, expect, it } from 'vitest'
import { buildPayload, guestIssue, guestRange, HALL_CAPACITY, isPastDate, MENU_MINIMUMS, needsAddress, needsMenu, usesHall, type CateringRequest } from './cateringRules'

describe('service rules', () => {
  it('knows which services use the hall, need a menu, need an address', () => {
    expect([usesHall('salle_traiteur'), usesHall('salle_seule'), usesHall('traiteur_domicile')]).toEqual([true, true, false])
    expect([needsMenu('salle_traiteur'), needsMenu('traiteur_domicile'), needsMenu('salle_seule')]).toEqual([true, true, false])
    expect([needsAddress('traiteur_domicile'), needsAddress('salle_traiteur'), needsAddress('')]).toEqual([true, false, false])
  })
})

describe('guestRange', () => {
  it('uses the menu minimum and the hall capacity', () => {
    expect(MENU_MINIMUMS).toEqual({ queen: 50, king: 50, corporate: 10, indecis: 10 })
    expect(guestRange('salle_traiteur', 'king')).toEqual({ min: 50, max: HALL_CAPACITY })
    expect(guestRange('traiteur_domicile', 'corporate')).toEqual({ min: 10, max: null })
  })
  it('drops the menu minimum for hall only', () => {
    expect(guestRange('salle_seule', 'king')).toEqual({ min: 1, max: 225 })
  })
  it('falls back to 1 before a menu is chosen', () => {
    expect(guestRange('', '')).toEqual({ min: 1, max: null })
  })
})

describe('guestIssue', () => {
  it.each(['', '0', '-3', '12.5', 'abc'])('rejects %j as not a whole number', raw => {
    expect(guestIssue('traiteur_domicile', 'corporate', raw)).toEqual({ kind: 'invalid' })
  })
  it('flags counts under the menu minimum', () => {
    expect(guestIssue('traiteur_domicile', 'king', '20')).toEqual({ kind: 'min', min: 50 })
  })
  it('flags counts over the hall capacity', () => {
    expect(guestIssue('salle_traiteur', 'queen', '226')).toEqual({ kind: 'max', max: 225 })
  })
  it('accepts counts in range, including the boundaries', () => {
    expect(guestIssue('salle_traiteur', 'king', '50')).toBeNull()
    expect(guestIssue('salle_traiteur', 'king', '225')).toBeNull()
    expect(guestIssue('traiteur_domicile', 'corporate', '400')).toBeNull()
  })
})

describe('isPastDate', () => {
  const today = new Date(2026, 9, 13, 23, 30) // local 2026-10-13, late evening
  it('allows today and later, rejects yesterday', () => {
    expect(isPastDate('2026-10-13', today)).toBe(false)
    expect(isPastDate('2026-12-01', today)).toBe(false)
    expect(isPastDate('2026-10-12', today)).toBe(true)
  })
})

describe('buildPayload', () => {
  const base: CateringRequest = {
    service: 'traiteur_domicile', menu: 'king', occasion: 'reception', guests: 80, date: '2026-11-21',
    address: ' 12 rue des Lilas, Brossard ', prenom: 'Amina', nom: 'Khan', email: 'amina@example.com',
    telephone: '514-555-0101', notes: '',
  }
  it('uses readable French keys and labels', () => {
    expect(buildPayload(base, 'en')).toEqual({
      Service: 'Traiteur à votre adresse',
      Menu: 'King (min. 50)',
      Occasion: 'Réception',
      'Invités': '80',
      Date: '2026-11-21',
      Adresse: '12 rue des Lilas, Brossard',
      'Prénom': 'Amina',
      Nom: 'Khan',
      Courriel: 'amina@example.com',
      'Téléphone': '514-555-0101',
      Notes: '—',
      'Langue du site': 'EN',
      _replyto: 'amina@example.com',
      _subject: 'Demande traiteur – Amina Khan – 2026-11-21',
    })
  })
  it('omits the address when the event is in the hall', () => {
    const p = buildPayload({ ...base, service: 'salle_traiteur' }, 'fr')
    expect(p).not.toHaveProperty('Adresse')
    expect(p.Service).toBe("Salle + traiteur Jabeen's")
  })
  it('omits the menu for hall only', () => {
    const p = buildPayload({ ...base, service: 'salle_seule', menu: 'king' }, 'fr')
    expect(p).not.toHaveProperty('Menu')
    expect(p).not.toHaveProperty('Adresse')
  })
})
