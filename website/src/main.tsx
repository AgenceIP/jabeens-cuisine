import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { preloadRoute } from './routes'

// The page is prerendered; load its code first, then React replaces that HTML in one commit.
const start = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  // prerendered French copy was hidden for visitors who chose English (see index.html)
  requestAnimationFrame(() => document.documentElement.removeAttribute('data-prerender'))
}

Promise.resolve(preloadRoute(location.pathname)).catch(() => {}).finally(start)
