export interface CateringPhoto { id: string; alt: { fr: string; en: string } }

export const PHOTO_W = 1600
export const PHOTO_H = 2143
export const photoSrc = (id: string, w: 800 | 1600) => `/assets/catering/${id}-${w}.webp`

export const hallPhotos: CateringPhoto[] = [
  { id: 'hall-01-reception-stage-front', alt: { fr: 'Scène de réception avec arche sculptée, fleurs et canapé doré', en: 'Reception stage with carved arch, flowers and gilded sofa' } },
  { id: 'hall-02-reception-stage-angle', alt: { fr: 'Scène de réception vue de côté', en: 'Reception stage seen from the side' } },
  { id: 'hall-03-hall-evening-empty', alt: { fr: 'La salle de réception en soirée, lustre en cristal et tables dressées', en: 'The reception hall in the evening, crystal chandelier and set tables' } },
  { id: 'hall-04-neon-flower-wall', alt: { fr: "Mur de roses blanches avec l'enseigne lumineuse Jabeen's Cuisine", en: "White rose wall with the Jabeen's Cuisine neon sign" } },
  { id: 'hall-05-flower-wall-seating', alt: { fr: 'Mur de fleurs, chevalet de plan de table et miroir décoré', en: 'Flower wall, seating chart easel and decorated mirror' } },
  { id: 'hall-06-mr-mrs-arch-stage', alt: { fr: 'Estrade avec arche florale et lettres Mr & Mrs', en: 'Platform with floral arch and Mr & Mrs letters' } },
]

export const buffetPhotos: CateringPhoto[] = [
  { id: 'buffet-01-gold-buffet-line', alt: { fr: 'Buffet en chauffe-plats dorés', en: 'Buffet in gold chafing dishes' } },
  { id: 'buffet-02-butter-chicken', alt: { fr: 'Poulet au beurre au buffet', en: 'Butter chicken on the buffet' } },
  { id: 'buffet-03-curry', alt: { fr: 'Cari garni de coriandre et de gingembre', en: 'Curry garnished with coriander and ginger' } },
  { id: 'buffet-04-biryani', alt: { fr: 'Biryani aux légumes', en: 'Vegetable biryani' } },
]

export const livePhotos: CateringPhoto[] = [
  { id: 'live-01-pani-puri-cart', alt: { fr: 'Chariot pani puri', en: 'Pani puri cart' } },
  { id: 'live-04-masala-chai-cart', alt: { fr: 'Chariot chai masala', en: 'Masala chai cart' } },
  { id: 'live-03-drinks-cart', alt: { fr: 'Chariot de boissons', en: 'Drinks cart' } },
  { id: 'live-02-pani-puri-cart-angle', alt: { fr: 'Chariot pani puri prêt pour le service', en: 'Pani puri cart ready for service' } },
  { id: 'live-05-pani-puri-closeup', alt: { fr: 'Bol de pani puri croustillants', en: 'Bowl of crispy pani puri' } },
  { id: 'live-06-pani-puri-poster', alt: { fr: 'Affiche « Pani Puri : moins cher qu’une thérapie »', en: 'Poster "Pani Puri: cheaper than therapy"' } },
  { id: 'live-07-chai-detail', alt: { fr: 'Épices et biscottes de la station chai', en: 'Spices and rusks at the chai station' } },
]
