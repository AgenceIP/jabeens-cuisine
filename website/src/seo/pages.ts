import { siteConfig } from '@/data/siteConfig'

// Head of every indexable page (French, like <html lang="fr">). Used at build time by the
// prerender and at runtime when navigating, so both always agree.
// Titles 30-60 characters, descriptions 120-130 (tested).
export const pages = {
  '/': {
    name: 'Accueil',
    title: "Restaurant indien & pakistanais, Brossard | Jabeen's Cuisine",
    description: 'Restaurant indien et pakistanais 100 % halal à Brossard : biryani, butter chicken, grillades tandoori. Commandez ou réservez.',
    image: '/assets/og/home.jpg',
  },
  '/menu': {
    name: 'Menu',
    title: "Menu indien et pakistanais halal | Jabeen's Cuisine",
    description: "Menu de Jabeen's Cuisine à Brossard : tapas, grillades tandoori, currys végé et viandes, biryani, naans. 100 % halal, en PDF.",
    image: '/assets/og/menu.jpg',
  },
  '/location-salle': {
    name: 'Salle et traiteur',
    title: "Salle de réception et traiteur, Brossard | Jabeen's Cuisine",
    description: "Salle de réception jusqu'à 225 personnes à Brossard et traiteur à domicile : menus Queen, King, Corporate, stations pani puri.",
    image: '/assets/og/salle.jpg',
  },
  '/notre-histoire': {
    name: 'Notre histoire',
    title: "Notre histoire depuis 2020, Brossard | Jabeen's Cuisine",
    description: "L'histoire de Jabeen's Cuisine à Brossard depuis 2020 : une ouverture en pleine pandémie, une communauté fidèle, un renouveau.",
    image: '/assets/og/histoire.jpg',
  },
} as const

export type PagePath = keyof typeof pages

export const absolute = (path: string) => siteConfig.url + (path === '/' ? '/' : path)
