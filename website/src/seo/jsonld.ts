import { siteConfig as s } from '@/data/siteConfig'
import { pages, absolute, type PagePath } from './pages'

const restaurantId = `${s.url}/#restaurant`

const restaurant = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': restaurantId,
  name: s.name,
  url: absolute('/'),
  logo: absolute('/assets/logo-footer.png'),
  image: absolute(pages['/'].image),
  telephone: s.telephone,
  email: s.email,
  servesCuisine: ['Indian', 'Pakistani', 'Halal'],
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    streetAddress: s.addressParts.street,
    addressLocality: s.addressParts.city,
    addressRegion: s.addressParts.region,
    postalCode: s.addressParts.postalCode,
    addressCountry: s.addressParts.country,
  },
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: s.openingHours.days, opens: s.openingHours.opens, closes: s.openingHours.closes }],
  hasMap: s.maps.directionsUrl,
  menu: absolute('/menu'),
  acceptsReservations: true,
  sameAs: Object.values(s.social),
}

const breadcrumb = (path: PagePath) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: pages['/'].name, item: absolute('/') },
    { '@type': 'ListItem', position: 2, name: pages[path].name, item: absolute(path) },
  ],
})

const hallService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Salle de réception et service traiteur',
  serviceType: 'Location de salle et traiteur',
  description: pages['/location-salle'].description,
  provider: { '@id': restaurantId },
  areaServed: s.addressParts.city,
  url: absolute('/location-salle'),
}

/** JSON-LD blocks for a page: the restaurant on the home page, a breadcrumb (and the service) elsewhere. */
export function jsonLd(path: PagePath): object[] {
  if (path === '/') return [restaurant]
  return path === '/location-salle' ? [breadcrumb(path), hallService] : [breadcrumb(path)]
}
