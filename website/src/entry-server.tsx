// Build-time prerender (scripts/prerender.mjs): the HTML of each page, so crawlers that do not
// run JavaScript still read its heading, text, links and structured data.
import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom/server'
import { AppShell } from './App'
import { preloadRoute } from './routes'

export { pages, absolute } from './seo/pages'
export { jsonLd } from './seo/jsonld'
export { siteConfig } from './data/siteConfig'

export async function render(url: string): Promise<string> {
  await preloadRoute(url)
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <AppShell />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
