// Name, address and phone (NAP): the one source for the footer, JSON-LD and llms.txt.
const street = '5750 C Boulevard Taschereau'
const city = 'Brossard'
const region = 'QC'
const postalCode = 'J4W 1M4'

export const siteConfig = {
  name: "Jabeen's Cuisine",
  url: 'https://www.jabeenscuisine.com',
  tagline: 'INDIAN & PAKISTANI FUSION',
  address: `${street}, ${city}, ${region} ${postalCode}`,
  addressParts: { street, city, region, postalCode, country: 'CA' },
  phone: '(450) 926-3111',
  telephone: '+1-450-926-3111',
  email: 'info@jabeenscuisine.ca',
  // What the footer shows; JSON-LD repeats it (to confirm with the client).
  openingHours: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '11:00', closes: '23:00' },
  hours: {
    'Tous les jours': '11h00 – 23h00',
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
    restaurantId: '1507504',
  },
  nav: [
    { label: 'Accueil', to: '/' },
    { label: 'Menu', to: '/menu' },
    { label: 'Notre Histoire', to: '/notre-histoire' },
    { label: 'Commander', to: 'https://jabeenscuisine.clusterpos.com' },
    { label: 'Location de Salle', to: '/location-salle' },
  ],
}
