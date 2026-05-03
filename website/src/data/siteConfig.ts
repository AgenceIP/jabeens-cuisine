export const siteConfig = {
  name: "Jabeen's Cuisine",
  tagline: 'INDIAN & PAKISTANI FUSION',
  address: '5750 C Boulevard Taschereau, Brossard, QC J4W 1M4',
  phone: '(450) 926-3111',
  email: 'info@jabeenscuisine.ca',
  hours: {
    'Dim – Mer': '11h00 – 22h30',
    'Jeu – Sam': '11h00 – 1h00',
  },
  social: {
    instagram: 'https://www.instagram.com/jabeenscuisineofficial/',
    facebook: 'https://www.facebook.com/jabeenscuisine',
    tiktok: 'https://www.tiktok.com/@jabeenscuisine',
  },
  ordering: {
    uberEats: 'https://www.ubereats.com/ca-fr/store/jabeens-cuisine/8aEZ90juThytXIoQPghFvw',
    doorDash: 'https://www.doordash.com/fr-CA/store/jabeens-cuisine-brossard-969551/',
    skipTheDishes: 'https://www.skipthedishes.com/jabeens-cuisine',
  },
  maps: {
    embedUrl: 'https://maps.google.com/maps?q=5750+C+Boulevard+Taschereau,+Brossard,+QC+J4W+1M4&t=&z=16&ie=UTF8&iwloc=&output=embed',
    directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=5750+C+Boulevard+Taschereau,+Brossard,+QC+J4W+1M4',
  },
  openTable: {
    // TODO: Create account at restaurant.opentable.com, then paste your restaurant ID here
    restaurantId: '',
  },
  nav: [
    { label: 'Accueil', to: '/' },
    { label: 'Menu', to: '/menu' },
    { label: 'Notre Histoire', to: '/notre-histoire' },
    { label: 'Réservations', to: '/reservations' },
    { label: 'Commander', to: '/commander' },
    { label: 'Location de Salle', to: '/location-salle' },
  ],
}
