import { lazy, type ComponentType } from 'react'
import type { PagePath } from '@/seo/pages'

// Lazy pages that can be loaded ahead: the first page is loaded before React starts, so it
// replaces the prerendered HTML in one go (no blank Suspense frame in between).
function page(load: () => Promise<{ default: ComponentType }>) {
  let Loaded: ComponentType | null = null
  const Lazy = lazy(load)
  const Page = () => (Loaded ? <Loaded /> : <Lazy />)
  Page.preload = () => load().then(m => { Loaded = m.default })
  return Page
}

export const routes = {
  '/': page(() => import('@/pages/Home')),
  '/menu': page(() => import('@/pages/Menu')),
  '/notre-histoire': page(() => import('@/pages/NotreHistoire')),
  '/location-salle': page(() => import('@/pages/Hall')),
}

export const preloadRoute = (path: string) => routes[path as PagePath]?.preload()
