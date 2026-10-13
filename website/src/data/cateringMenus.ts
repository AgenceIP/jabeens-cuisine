export type CateringMenuId = 'queen' | 'king' | 'corporate'

export const CATERING_MENUS: { id: CateringMenuId; name: string; pdf: string }[] = [
  { id: 'queen', name: 'Queen', pdf: '/menus/catering/queen.pdf' },
  { id: 'king', name: 'King', pdf: '/menus/catering/king.pdf' },
  { id: 'corporate', name: 'Corporate', pdf: '/menus/catering/corporate.pdf' },
]
