# Light Theme + Hall & Traiteur Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Switch the Jabeen's Cuisine site to a light ivory/navy theme (dark theme kept behind one attribute), rebuild `/location-salle` as the Hall & Traiteur page with menus and one request form, and add catering photos to the homepage carousel.

**Architecture:** Colours and fonts become CSS custom properties (RGB channels) defined twice in `src/index.css` (`:root[data-theme="light"]` and `:root[data-theme="dark"]`); Tailwind colour names read those variables, and inline styles use `rgb(var(--c-…))`. Form rules live in a pure module (`src/lib/cateringRules.ts`) tested with Vitest; the page is split into small components under `src/components/hall/`. Image and PDF preparation are one-off Node scripts under `website/scripts/`.

**Tech Stack:** React 19, Vite 8, TypeScript 6, Tailwind 3.4, framer-motion 11, react-hook-form 7, sharp (installed), Vitest (new), playwright-core (new, uses installed Edge), pdfjs-dist + @napi-rs/canvas + pdf-lib (script-only, own folder).

**Spec:** `docs/superpowers/specs/2026-10-13-light-theme-catering-design.md`

All commands run from `website/` unless stated. Branch: `feat/light-catering` (already created; rollback tag `pre-light-theme` exists).

## Global Constraints

- Light palette (RGB channels): bg `251 248 242`, surface `255 255 255`, ink `20 33 61`, muted `74 85 104`, line `230 223 210`, accent `138 106 47`, accent-soft `201 169 106`, band `20 33 61`, band-ink `251 248 242`, btn `20 33 61`, btn-ink `251 248 242`, btn-hover `42 58 92`, nav `251 248 242`, field `255 255 255`, error `155 44 44`.
- Dark palette = today's values: bg `6 13 24`, surface `17 17 17`, ink `245 245 240`, muted `222 222 218`, line `30 30 30`, accent `168 149 106`, accent-soft `168 149 106`, band `13 26 46`, band-ink `245 245 240`, btn `168 149 106`, btn-ink `245 245 240`, btn-hover `191 169 122`, nav `6 13 24`, field `13 26 46`, error `224 122 95`.
- Theme-independent: `--c-scrim: 6 13 24` (dark overlays on photos), `--c-on-dark: 245 245 240` (text on photos).
- Fonts: light = Cormorant Garamond 600 (display) + Jost 400 (body); dark = Cormorant Garamond 300 + Montserrat 300.
- The active theme is the `data-theme` attribute on `<html>` in `website/index.html` (`light`). `?theme=dark|light` in any URL overrides it for the browser session (client comparison).
- Menu minimums: Queen 50, King 50, Corporate 10, not sure 10, hall only 1. Hall capacity 225.
- Formspree form for requests: `xdabbvjy`. Email payload keys are in French whatever the site language.
- No prices on the page. No emoji or Unicode symbols drawn as emoji (use inline SVG). No invented figures.
- Every new text exists in both `en` and `fr` in `src/i18n/translations.ts` with the same shape.
- Lighthouse mobile ≥ 90, accessibility 100 on `/` and `/location-salle`. Check 390 px and 1440 px.
- Never commit `Catering pictures and menus/` (raw client files). Never print secrets.
- Commit messages: conventional, ending with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. Visitor types 20 guests with Corporate, then switches the menu to King: the guest error ("King requires at least 50") must appear at once, without re-submitting. Pinned by the e2e check in Task 12 (step 4).
2. Visitor picks a menu, then switches the service to "Hall only": the menu field disappears, the minimum drops to 1 and the email must not contain a menu. Pinned by `buildPayload` and `guestRange` tests in Task 8.
3. Visitor types an address with "Catering at your address", then switches to the hall: the address is no longer required and is not sent. Pinned by `buildPayload` test in Task 8.
4. Guest count typed as empty, `0`, `-3` or `12.5`: a clear "enter a whole number" error, never a silent pass. Pinned by `guestIssue` tests in Task 8.
5. Date chosen as today must pass and yesterday must fail, regardless of the visitor's time zone (compare local `YYYY-MM-DD` strings). Pinned by `isPastDate` tests in Task 8.

---

## File map

| File | Responsibility |
|---|---|
| `website/index.html` | `data-theme`, `?theme=` override script, font link |
| `website/src/index.css` | theme tokens, base styles, `.btn-primary`, `.btn-ghost`, `.field` |
| `website/tailwind.config.js` | Tailwind colours/fonts from tokens |
| `website/src/theme/theme.ts` | `Theme`, `currentTheme()`, `logoSrc()` |
| `website/src/theme/theme.test.ts` | token parity between themes, `logoSrc` |
| `website/src/theme/no-legacy-colors.test.ts` | guard: no hard-coded legacy colours/fonts in components |
| `website/scripts/light-logos.mjs` | navy-wordmark logo copies |
| `website/scripts/shots.mjs` | screenshots (Edge via playwright-core) |
| `website/scripts/catering-images.mjs` | edited JPGs → WebP 800/1600 |
| `website/scripts/pdf-clean/` | own `package.json` + `clean.mjs` (rasterised, cleaned menus) |
| `website/src/data/cateringPhotos.ts` | photo ids, alt text, `photoSrc()` |
| `website/src/data/cateringMenus.ts` | menu ids, names, PDF paths |
| `website/src/lib/cateringRules.ts` (+ `.test.ts`) | minimums, guest range, required fields, payload |
| `website/src/lib/fmt.ts` (+ `.test.ts`) | `{name}` interpolation |
| `website/src/components/hall/*` | page sections + form |
| `website/src/pages/Hall.tsx` | page assembly |

---

### Task 1: Theme tokens foundation (+ Vitest)

**Files:**
- Modify: `website/package.json` (scripts, devDependencies)
- Modify: `website/index.html:2` (html tag), `website/index.html:23` (font link), head script
- Modify: `website/src/index.css` (whole `@layer base` colours, utilities)
- Modify: `website/tailwind.config.js`
- Create: `website/src/theme/theme.ts`, `website/src/theme/theme.test.ts`, `website/src/theme/no-legacy-colors.test.ts`

**Interfaces:**
- Produces: CSS variables `--c-bg … --c-error`, `--c-scrim`, `--c-on-dark`, `--font-display`, `--font-body`, `--fw-display`, `--fw-body`; Tailwind colours `background, surface, border-subtle, text-primary, text-muted, gold, gold-soft, band, band-ink, on-dark, scrim, error`; classes `.btn-primary`, `.btn-ghost`, `.field`; `theme.ts` exports `type Theme = 'light' | 'dark'`, `currentTheme(): Theme`, `logoSrc(name: 'main' | 'footer', theme: Theme, onDark?: boolean): string`; guard test with `PENDING` exclusion list.

- [ ] **Step 1: Install Vitest and add the test script**

```bash
npm i -D vitest
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 2: Write the failing tests**

`website/src/theme/theme.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { logoSrc } from './theme'

const css = readFileSync(resolve(__dirname, '../index.css'), 'utf8')

function varsOf(selector: string): string[] {
  const start = css.indexOf(selector)
  expect(start, `${selector} block missing`).toBeGreaterThan(-1)
  const block = css.slice(start, css.indexOf('}', start))
  return [...block.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]).sort()
}

describe('theme tokens', () => {
  it('light and dark define the same variables', () => {
    const light = varsOf(':root[data-theme="light"]')
    const dark = varsOf(':root[data-theme="dark"]')
    expect(light.length).toBeGreaterThan(15)
    expect(light).toEqual(dark)
  })
})

describe('logoSrc', () => {
  it('uses the navy wordmark in the light theme', () => {
    expect(logoSrc('main', 'light')).toBe('/assets/logo-main-light.webp')
  })
  it('uses the white wordmark in the dark theme', () => {
    expect(logoSrc('footer', 'dark')).toBe('/assets/logo-footer.webp')
  })
  it('uses the white wordmark over a dark photo in any theme', () => {
    expect(logoSrc('main', 'light', true)).toBe('/assets/logo-main.webp')
  })
})
```

`website/src/theme/no-legacy-colors.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const SRC = resolve(__dirname, '..')
// Files still to convert. Each task removes the files it converts; Task 10 empties it.
const PENDING = new Set<string>([
  'App.tsx',
  'components/layout/Navbar.tsx',
  'components/layout/Footer.tsx',
  'components/home/Backstory.tsx',
  'components/home/CommanderEnLigne.tsx',
  'components/home/EvenementsPrives.tsx',
  'components/home/FeedbackForm.tsx',
  'components/home/GaleriePhoto.css',
  'components/home/Hero.tsx',
  'components/home/LaCarte.tsx',
  'components/home/Marquee.css',
  'components/home/PremiereImpression.tsx',
  'components/ui/NewsletterPopup.tsx',
  'components/ui/OpenTableWidget.tsx',
  'pages/Menu.tsx',
  'pages/NotreHistoire.tsx',
  'pages/Hall.tsx',
])
const LEGACY = /#(A8956A|1E1E1E|F5F5F0|0D1A2E|DEDEDA|060D18|2A2A2A|BFA97A|3A3A3A|0A0A0A|6B6B6B|4A4A44|E8E8E8)\b|rgba\(\s*(6,\s*13,\s*24|168,\s*149,\s*106|245,\s*245,\s*240|10,\s*10,\s*10|30,\s*30,\s*30)\s*,|fontFamily:\s*'(Montserrat|Cormorant Garamond)/i

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })
}

describe('no legacy colours', () => {
  const files = walk(SRC)
    .filter(p => /\.(tsx?|css)$/.test(p) && !p.endsWith('.test.ts'))
    .map(p => relative(SRC, p).replace(/\\/g, '/'))
    .filter(f => f !== 'index.css' && !PENDING.has(f))

  it.each(files)('%s uses theme tokens', f => {
    const hit = readFileSync(join(SRC, f), 'utf8').match(LEGACY)
    expect(hit?.[0] ?? null).toBeNull()
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `Cannot find module './theme'` and `:root[data-theme="light"] block missing`.

- [ ] **Step 4: Create `src/theme/theme.ts`**

```ts
export type Theme = 'light' | 'dark'

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/** White-wordmark logos are the originals; light theme uses navy-wordmark copies. */
export function logoSrc(name: 'main' | 'footer', theme: Theme, onDark = false): string {
  return onDark || theme === 'dark' ? `/assets/logo-${name}.webp` : `/assets/logo-${name}-light.webp`
}
```

- [ ] **Step 5: Replace the top of `src/index.css` (from `@layer base {` through the scrollbar rules) with tokens**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --c-scrim: 6 13 24;
  --c-on-dark: 245 245 240;
}

:root[data-theme="light"] {
  --c-bg: 251 248 242;
  --c-surface: 255 255 255;
  --c-ink: 20 33 61;
  --c-muted: 74 85 104;
  --c-line: 230 223 210;
  --c-accent: 138 106 47;
  --c-accent-soft: 201 169 106;
  --c-band: 20 33 61;
  --c-band-ink: 251 248 242;
  --c-btn: 20 33 61;
  --c-btn-ink: 251 248 242;
  --c-btn-hover: 42 58 92;
  --c-nav: 251 248 242;
  --c-field: 255 255 255;
  --c-error: 155 44 44;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Jost', sans-serif;
  --fw-display: 600;
  --fw-body: 400;
  --body-bg-image: none;
  --field-scheme: light;
}

:root[data-theme="dark"] {
  --c-bg: 6 13 24;
  --c-surface: 17 17 17;
  --c-ink: 245 245 240;
  --c-muted: 222 222 218;
  --c-line: 30 30 30;
  --c-accent: 168 149 106;
  --c-accent-soft: 168 149 106;
  --c-band: 13 26 46;
  --c-band-ink: 245 245 240;
  --c-btn: 168 149 106;
  --c-btn-ink: 245 245 240;
  --c-btn-hover: 191 169 122;
  --c-nav: 6 13 24;
  --c-field: 13 26 46;
  --c-error: 224 122 95;
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Montserrat', sans-serif;
  --fw-display: 300;
  --fw-body: 300;
  --body-bg-image: url('/assets/background.jpg');
  --field-scheme: dark;
}

@layer base {
  * { box-sizing: border-box; margin: 0; padding: 0; }

  html {
    background-color: rgb(var(--c-bg));
    color: rgb(var(--c-ink));
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: var(--font-body);
    font-weight: var(--fw-body);
    background-color: rgb(var(--c-bg));
    background-image: var(--body-bg-image);
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: center center;
    color: rgb(var(--c-ink));
    overflow-x: hidden;
  }

  @media (max-width: 768px) {
    body {
      background-attachment: scroll;
      background-size: auto 60vh;
      background-repeat: repeat;
      background-position: top center;
    }
  }

  ::selection { background: rgb(var(--c-accent) / 0.25); color: rgb(var(--c-ink)); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: rgb(var(--c-bg)); }
  ::-webkit-scrollbar-thumb { background: rgb(var(--c-line)); }
  ::-webkit-scrollbar-thumb:hover { background: rgb(var(--c-accent)); }
```

Keep the rest of `@layer base` (a, img, button, inputs, #root) unchanged. In `@layer utilities` change:

```css
  .text-label { font-family: var(--font-body); /* size/weight/spacing unchanged */ }
  .text-display { font-family: var(--font-display); font-weight: var(--fw-display); letter-spacing: 0.06em; }
  .text-display-italic { font-family: var(--font-display); font-weight: var(--fw-display); font-style: italic; letter-spacing: 0.04em; }
  .gold-divider { /* … */ background-color: rgb(var(--c-accent) / 0.4); }
  .gold-rule { /* … */ background-color: rgb(var(--c-accent) / 0.15); }
  .hover-underline::after { /* … */ background: rgb(var(--c-accent)); }
```

Add a components layer after `@layer base`:

```css
@layer components {
  .btn-primary {
    display: inline-block;
    font-family: var(--font-body);
    font-size: 0.74rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 1rem 1.75rem;
    background: rgb(var(--c-btn)); color: rgb(var(--c-btn-ink));
    transition: background-color 0.3s;
  }
  .btn-primary:hover { background: rgb(var(--c-btn-hover)); }
  .btn-primary:disabled { opacity: 0.7; cursor: wait; }
  .btn-ghost {
    display: inline-block;
    font-family: var(--font-body);
    font-size: 0.74rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 1rem 1.75rem;
    border: 1px solid rgb(var(--c-ink) / 0.55); color: rgb(var(--c-ink));
    transition: color 0.3s, border-color 0.3s;
  }
  .btn-ghost:hover { color: rgb(var(--c-accent)); border-color: rgb(var(--c-accent)); }
  .field {
    width: 100%; background: transparent; border: none;
    border-bottom: 1px solid rgb(var(--c-ink) / 0.25);
    color: rgb(var(--c-ink)); padding: 14px 0; font-size: 0.95rem;
    font-family: var(--font-body); font-weight: var(--fw-body);
    color-scheme: var(--field-scheme);
    transition: border-color 0.3s;
  }
  .field:focus { border-bottom-color: rgb(var(--c-accent)); }
  .field[aria-invalid="true"] { border-bottom-color: rgb(var(--c-error)); }
  .field option { background: rgb(var(--c-field)); color: rgb(var(--c-ink)); }
  .field::placeholder { color: rgb(var(--c-muted) / 0.7); }
}
```

- [ ] **Step 6: Point Tailwind at the tokens (`tailwind.config.js` `theme.extend.colors` and `fontFamily`)**

```js
const c = name => `rgb(var(--c-${name}) / <alpha-value>)`

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: c('bg'),
        surface: c('surface'),
        'border-subtle': c('line'),
        'text-primary': c('ink'),
        'text-muted': c('muted'),
        gold: c('accent'),
        'gold-soft': c('accent-soft'),
        band: c('band'),
        'band-ink': c('band-ink'),
        'on-dark': c('on-dark'),
        scrim: c('scrim'),
        error: c('error'),
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      // letterSpacing, maxWidth, transitionTimingFunction unchanged
    },
  },
  plugins: [],
}
```

- [ ] **Step 7: Theme attribute, override script and fonts in `index.html`**

Change `<html lang="…">` to `<html lang="…" data-theme="light">` (keep the existing `lang`). Replace the Google Fonts `<link href=…>` with:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@400;500;600&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

Add as the first element of `<head>`:

```html
<script>
  (function () {
    try {
      var q = new URLSearchParams(location.search).get('theme')
      if (q === 'light' || q === 'dark') sessionStorage.setItem('theme', q)
      var t = sessionStorage.getItem('theme')
      if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t)
    } catch (e) {}
  })()
</script>
```

- [ ] **Step 8: Run tests and build**

Run: `npm test && npm run build`
Expected: theme tests PASS; guard test PASS (only already-clean files are scanned); build succeeds.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json index.html tailwind.config.js src/index.css src/theme
git commit -m "feat: add light/dark theme tokens and Vitest"
```

---

### Task 2: Layout in the theme (Navbar, Footer, App, light logos, screenshot script)

**Files:**
- Create: `website/scripts/light-logos.mjs`, `website/public/assets/logo-main-light.webp`, `website/public/assets/logo-footer-light.webp`, `website/scripts/shots.mjs`
- Modify: `website/src/components/layout/Navbar.tsx`, `website/src/components/layout/Footer.tsx`, `website/src/App.tsx:41`, `website/src/theme/no-legacy-colors.test.ts` (PENDING), `website/package.json`

**Interfaces:**
- Consumes: `currentTheme`, `logoSrc` (Task 1); Tailwind colours `on-dark`, `text-primary`, `gold`, `border-subtle`.
- Produces: `node scripts/shots.mjs <baseUrl> <theme> <outDir> [paths…]` writing `<outDir>/<theme>-<desk|mob>-<slug>.png`.

- [ ] **Step 1: Remove the three layout files from `PENDING`** (`App.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`), run `npm test`, expect FAIL listing them.

- [ ] **Step 2: Generate navy-wordmark logos — `scripts/light-logos.mjs`**

```js
// Recolour the white wordmark of the logos to navy (#14213D); the gold peacock is untouched.
import sharp from 'sharp'

const NAVY = [20, 33, 61]
const jobs = [
  { src: 'public/assets/logo-main.png', out: 'public/assets/logo-main-light.webp', width: 600 },
  { src: 'public/assets/logo-footer.png', out: 'public/assets/logo-footer-light.webp', width: 400 },
]

for (const { src, out, width } of jobs) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]]
    const greyish = Math.max(r, g, b) - Math.min(r, g, b) < 40
    if (a > 0 && greyish && r > 150) [data[i], data[i + 1], data[i + 2]] = NAVY
  }
  await sharp(data, { raw: info }).resize({ width }).webp({ quality: 90 }).toFile(out)
  console.log('wrote', out)
}
```

Run: `node scripts/light-logos.mjs`, then look at both files on an ivory background (e.g. `ffmpeg -f lavfi -i color=c=0xFBF8F2:s=700x300 -i public/assets/logo-main-light.webp -filter_complex overlay=50:70 -frames:v 1 <scratch>/check.png`). Expected: navy "JABEEN'S CUISINE / INDIENNE ET PAKISTANAISE", gold peacock unchanged. If the tagline greys stay light, lower `r > 150` to `r > 120`.

- [ ] **Step 3: Navbar — logo, colours, over-hero mode**

In `Navbar.tsx` add `import { currentTheme, logoSrc } from '@/theme/theme'` and, after `const { lang, setLang } = useLang()`:

```tsx
  const overHero = location.pathname === '/' && !scrolled && !mobileOpen
  const linkIdle = overHero ? 'text-on-dark' : 'text-text-primary'
```

Replace the `<nav>` style:

```tsx
        style={{
          background: overHero ? 'rgb(var(--c-scrim) / 0.25)' : 'rgb(var(--c-nav) / 0.94)',
          backdropFilter: overHero ? 'none' : 'blur(16px)',
          borderBottom: overHero ? 'none' : '1px solid rgb(var(--c-line))',
        }}
```

Logo `src="/assets/logo-main.webp"` → `src={logoSrc('main', currentTheme(), overHero)}`.
External link class `… hover:text-gold text-text-primary` → `` `text-label transition-colors duration-300 hover:text-gold ${linkIdle}` ``.
Internal link class: `location.pathname === link.to ? 'text-gold' : 'text-text-primary'` → `location.pathname === link.to ? 'text-gold' : linkIdle`.
Reserve button class `border border-text-primary text-text-primary` → `` `… border ${overHero ? 'border-on-dark text-on-dark' : 'border-text-primary text-text-primary'} …` `` (keep the rest of the class string).
Hamburger spans `bg-text-primary` → `` {overHero ? 'bg-on-dark' : 'bg-text-primary'} `` (template string per span).
Mobile overlay style `background: 'rgba(6,13,24,0.97)'` → `background: 'rgb(var(--c-bg) / 0.97)'`.
`<LangToggle lang={lang} setLang={setLang} />` (desktop) → `<LangToggle lang={lang} setLang={setLang} onDark={overHero} />`.

Replace `LangToggle` styles:

```tsx
function LangToggle({ lang, setLang, onDark = false }: { lang: 'en' | 'fr'; setLang: (l: 'en' | 'fr') => void; onDark?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${onDark ? 'rgb(var(--c-on-dark) / 0.35)' : 'rgb(var(--c-line))'}`, borderRadius: 2, overflow: 'hidden', position: 'relative' }}>
      <motion.div
        layoutId="lang-pill"
        style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', background: 'rgb(var(--c-btn))', left: lang === 'fr' ? '0%' : '50%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      />
      {(['fr', 'en'] as const).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            position: 'relative', zIndex: 1, background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: '0.55rem', letterSpacing: '0.25em',
            color: lang === l ? 'rgb(var(--c-btn-ink))' : onDark ? 'rgb(var(--c-on-dark) / 0.7)' : 'rgb(var(--c-muted))',
            transition: 'color 0.3s', padding: '6px 10px', fontWeight: 600,
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Footer and App**

`Footer.tsx`:
- `borderTop: '1px solid rgba(168,149,106,0.15)'` → `borderTop: '1px solid rgb(var(--c-accent) / 0.15)'`
- `'linear-gradient(to top, #060D18 0%, transparent 100%)'` → `'linear-gradient(to top, rgb(var(--c-bg)) 0%, transparent 100%)'`
- `fontFamily: 'Montserrat'` (all) → `fontFamily: 'var(--font-body)'`
- `color: '#F5F5F0'` → `color: 'rgb(var(--c-ink))'`; `color: '#DEDEDA'` → `color: 'rgb(var(--c-muted))'`
- `borderTop: '1px solid #1E1E1E'` → `borderTop: '1px solid rgb(var(--c-line))'`
- logo `src="/assets/logo-footer.webp"` → `src={logoSrc('footer', currentTheme())}` with `import { currentTheme, logoSrc } from '@/theme/theme'`

`App.tsx:41`: `background: '#060D18'` → `background: 'rgb(var(--c-bg))'`.

- [ ] **Step 5: Screenshot script — `scripts/shots.mjs`**

```bash
npm i -D playwright-core
```

```js
// Usage: node scripts/shots.mjs http://localhost:4173 light shots / /menu /location-salle
import { chromium } from 'playwright-core'
import { mkdir } from 'node:fs/promises'

const [base = 'http://localhost:4173', theme = 'light', out = 'shots', ...paths] = process.argv.slice(2)
const pages = paths.length ? paths : ['/', '/menu', '/notre-histoire', '/location-salle']
const sizes = [
  { name: 'desk', viewport: { width: 1440, height: 900 } },
  { name: 'mob', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
]
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge' })
for (const s of sizes) {
  const ctx = await browser.newContext({ viewport: s.viewport, isMobile: s.isMobile, hasTouch: s.hasTouch, deviceScaleFactor: s.deviceScaleFactor ?? 1 })
  await ctx.addInitScript(() => {
    localStorage.setItem('jc_newsletter_seen', String(Date.now()))
    localStorage.setItem('lang', 'fr')
  })
  const page = await ctx.newPage()
  for (const p of pages) {
    await page.goto(`${base}${p}${p.includes('?') ? '&' : '?'}theme=${theme}`, { waitUntil: 'networkidle' })
    // scroll through so whileInView / ScrollTrigger reveals run, then back to top
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)) }
      window.scrollTo(0, 0); await new Promise(r => setTimeout(r, 600))
    })
    const slug = p === '/' ? 'home' : p.replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')
    await page.screenshot({ path: `${out}/${theme}-${s.name}-${slug}.png`, fullPage: true })
    console.log('shot', theme, s.name, p)
  }
  await ctx.close()
}
await browser.close()
```

Add `shots/` to `website/.gitignore`.

- [ ] **Step 6: Verify**

Run: `npm test` → PASS. `npm run build && npx vite preview --port 4173` (background), then `node scripts/shots.mjs http://localhost:4173 light shots / /menu` and `node scripts/shots.mjs http://localhost:4173 dark shots /`. Look at the PNGs: light nav is an ivory bar with navy links and navy logo on `/menu`; over the home hero the nav is transparent with white links and white logo; dark theme looks like today.

- [ ] **Step 7: Commit**

```bash
git add scripts/light-logos.mjs scripts/shots.mjs public/assets/logo-main-light.webp public/assets/logo-footer-light.webp src/components/layout src/App.tsx src/theme/no-legacy-colors.test.ts package.json package-lock.json .gitignore
git commit -m "feat: theme-aware navbar, footer and navy logos for the light theme"
```

---

### Task 3: Homepage and shared UI in the theme

**Files:**
- Modify: `src/components/home/{Hero,PremiereImpression,LaCarte,EvenementsPrives,CommanderEnLigne,Backstory,FeedbackForm}.tsx`, `src/components/home/{Marquee,GaleriePhoto}.css`, `src/components/ui/{NewsletterPopup,OpenTableWidget}.tsx`, `src/theme/no-legacy-colors.test.ts`

**Interfaces:**
- Consumes: tokens and classes from Task 1.

Mapping used in Tasks 3 and 4 (apply to every occurrence; context exceptions below the table):

| Legacy value | Replacement |
|---|---|
| `#060D18`, `rgba(6,13,24,1)` (page background, fades into the page) | `rgb(var(--c-bg))` |
| `rgba(6,13,24,a)` as a page panel or fade | `rgb(var(--c-bg) / a)` |
| `#F5F5F0` text | `rgb(var(--c-ink))` / class `text-text-primary` |
| `#DEDEDA`, `#6B6B6B` text | `rgb(var(--c-muted))` / class `text-text-muted` |
| `#1E1E1E`, `#2A2A2A` borders/lines | `rgb(var(--c-line))` |
| `#3A3A3A`, `#4A4A44` borders of buttons/links | `rgb(var(--c-ink) / 0.3)` |
| `#A8956A` text, focus borders, dividers | `rgb(var(--c-accent))` |
| `#A8956A` button background | `rgb(var(--c-btn))` with text `rgb(var(--c-btn-ink))`; hover `#bfa97a` → `rgb(var(--c-btn-hover))` |
| `#0A0A0A` text on an active pill | `rgb(var(--c-btn-ink))`; as a background dot → `rgb(var(--c-bg))` |
| `#0D1A2E` `<option>` background | `rgb(var(--c-field))` |
| `rgba(168,149,106,a)` | `rgb(var(--c-accent) / a)` |
| `#E8E8E8` | `rgb(var(--c-ink))` |
| `fontFamily: 'Montserrat'…` | `fontFamily: 'var(--font-body)'` |
| `fontFamily: 'Cormorant Garamond'…` | `fontFamily: 'var(--font-display)'` |
| `rgba(0,0,0,0)` inside `maskImage` | unchanged (mask alpha only) |

Context exceptions (text sits on a photo, keep it dark/white in both themes):
- **Hero.tsx**: overlay gradient `rgba(6,13,24,…)` (z-index 3 div) → `rgb(var(--c-scrim) / …)` same alphas, but last stop `rgba(6,13,24,1) 100%` → `rgb(var(--c-scrim) / 0.85) 100%`. Bottom fade div (`height: '35%'`) → `rgb(var(--c-bg) / 1) 0%, rgb(var(--c-bg) / 0.6) 40%, rgb(var(--c-bg) / 0) 100%`. Title spans `text-text-primary` → `text-on-dark`. Tagline `color: '#DEDEDA'` → `'rgb(var(--c-on-dark) / 0.85)'`. Order button: background `rgb(var(--c-btn))`, color `rgb(var(--c-btn-ink))`, hover `rgb(var(--c-btn-hover))`. Menu button: `rgba(245,245,240,0.4)` → `rgb(var(--c-on-dark) / 0.4)`, color `#F5F5F0` → `rgb(var(--c-on-dark))`, hover colour `rgb(var(--c-accent-soft))`. Divider `rgba(168,149,106,0.5)` → `rgb(var(--c-accent-soft) / 0.6)`.
- **CommanderEnLigne.tsx** becomes a navy band: overlay `linear-gradient(to bottom, rgba(10,10,10,0.7), rgba(10,10,10,0.9))` → `linear-gradient(to bottom, rgb(var(--c-band) / 0.88), rgb(var(--c-band) / 0.96))`; label `text-gold` → `text-gold-soft`; heading/body `text-text-primary`/`text-text-muted` → `text-band-ink` / `text-band-ink/80`; button border `#3A3A3A` → `rgb(var(--c-band-ink) / 0.35)`, colour `#F5F5F0` → `rgb(var(--c-band-ink))`, hover → `rgb(var(--c-accent-soft))`.
- **GaleriePhoto.css**: hover veil `rgba(6, 13, 24, 0.28)` → `rgb(var(--c-scrim) / 0.18)`.
- **NewsletterPopup.tsx**: backdrop `rgba(0,0,0,0.85)` → `rgb(var(--c-scrim) / 0.7)`; shadow unchanged; box `#060D18` → `rgb(var(--c-surface))`.
- **EvenementsPrives.tsx** button: border/colour `#F5F5F0` → `rgb(var(--c-ink))`; hover background `rgb(var(--c-ink))`, hover colour `rgb(var(--c-bg))`.
- **Backstory.tsx** scrub text: `rgba(245,245,240,0.12)` → `rgb(var(--c-ink) / 0.12)`, `rgba(245,245,240,0.82)` → `rgb(var(--c-ink) / 0.82)`.
- **LaCarte.tsx** edge vignettes: `#060D18` → `rgb(var(--c-bg))`, `rgba(6,13,24,0)` → `rgb(var(--c-bg) / 0)`.

- [ ] **Step 1:** Remove the 11 home/ui files of this task from `PENDING`; run `npm test`; expect FAIL listing them.
- [ ] **Step 2:** Apply the mapping and exceptions file by file. For `FeedbackForm.tsx`, replace `inputStyle` and the per-field `onFocus`/`onBlur`/`borderBottomColor` logic with `className="field"` plus `aria-invalid={!!errors.<name>}` on each input/select/textarea (delete the now-unused `inputStyle` constant and the inline `<option style>`), and make the submit button `className="btn-primary w-full"` (keep `disabled={sending}`).
- [ ] **Step 3:** Run `npm test` → PASS; `npx tsc -b --force` → no errors; `npm run lint` → no new errors.
- [ ] **Step 4:** `npm run build && npx vite preview --port 4173` then `node scripts/shots.mjs http://localhost:4173 light shots /` and `… dark shots /`. Check: hero text white on video in light theme, sections below on ivory with navy text, commander section is a navy band, carousel vignettes fade into ivory, dark theme unchanged from today.
- [ ] **Step 5: Commit**

```bash
git add src/components/home src/components/ui src/theme/no-legacy-colors.test.ts
git commit -m "feat: homepage sections use theme tokens"
```

---

### Task 4: Menu and Notre histoire pages in the theme

**Files:**
- Modify: `src/pages/Menu.tsx`, `src/pages/NotreHistoire.tsx`, `src/theme/no-legacy-colors.test.ts`

- [ ] **Step 1:** Remove `pages/Menu.tsx` and `pages/NotreHistoire.tsx` from `PENDING`; `npm test` → FAIL listing them.
- [ ] **Step 2:** Apply the Task 3 mapping. Specifics:
  - `Menu.tsx:114` sticky bar `rgba(6,13,24,0.95)` → `rgb(var(--c-nav) / 0.95)`.
  - `Menu.tsx:123-125` active pill: background `rgb(var(--c-btn))`, colour `rgb(var(--c-btn-ink))`, border `rgb(var(--c-btn))`; idle colour `rgb(var(--c-muted))`, border `rgb(var(--c-ink) / 0.3)`.
  - `Menu.tsx:212`, `:230` card backgrounds `rgba(6,13,24,0.8)`/`0.6` → `rgb(var(--c-surface))`.
  - `Menu.tsx:13` veg icon `#74B36B` stays.
  - `NotreHistoire.tsx:71` mobile overlay on the photo `rgba(6,13,24,0.72)` → `rgb(var(--c-bg) / 0.82)` (text stays ink on a light veil).
  - `NotreHistoire.tsx:136` timeline dot `#0A0A0A` → `rgb(var(--c-bg))`.
  - `NotreHistoire.tsx:146-147` philosophy panel `rgba(6,13,24,0.75)` → `rgb(var(--c-surface) / 0.75)` and its fade.
- [ ] **Step 3:** `npm test` → PASS; `npx tsc -b --force` → clean.
- [ ] **Step 4:** Build, preview, `node scripts/shots.mjs http://localhost:4173 light shots /menu /notre-histoire` and the same with `dark`. Check readability of every text block at 390 and 1440.
- [ ] **Step 5: Commit**

```bash
git add src/pages/Menu.tsx src/pages/NotreHistoire.tsx src/theme/no-legacy-colors.test.ts
git commit -m "feat: menu and story pages use theme tokens"
```

---

### Task 5: Catering photos for the web

**Files:**
- Create: `website/scripts/catering-images.mjs`, `website/public/assets/catering/*.webp`, `website/src/data/cateringPhotos.ts`

**Interfaces:**
- Produces: `photoSrc(id: string, w: 800 | 1600): string`, `PHOTO_W = 1600`, `PHOTO_H = 2143`, `interface CateringPhoto { id: string; alt: { fr: string; en: string } }`, arrays `hallPhotos` (6), `buffetPhotos` (4), `livePhotos` (7).

- [ ] **Step 1: Script — `scripts/catering-images.mjs`**

```js
// Edited client photos (3:4, 1744x2336) -> WebP 800 and 1600 px wide.
import sharp from 'sharp'
import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('..', 'Catering pictures and menus', '_selection', 'edited')
const OUT = path.resolve('public', 'assets', 'catering')
await mkdir(OUT, { recursive: true })
for (const file of (await readdir(SRC)).filter(f => f.endsWith('.jpg'))) {
  const id = file.replace(/\.jpg$/, '')
  for (const w of [800, 1600]) {
    await sharp(path.join(SRC, file)).resize({ width: w }).webp({ quality: 78 }).toFile(path.join(OUT, `${id}-${w}.webp`))
  }
  console.log('ok', id)
}
```

Run: `node scripts/catering-images.mjs` → 34 files. Check: `ls -la public/assets/catering | head` (1600 files ≈ 150–350 KB each).

- [ ] **Step 2: Data — `src/data/cateringPhotos.ts`**

```ts
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
```

- [ ] **Step 3:** `npx tsc -b --force` → clean.
- [ ] **Step 4: Commit**

```bash
git add scripts/catering-images.mjs public/assets/catering src/data/cateringPhotos.ts
git commit -m "feat: web versions of the catering photos"
```

---

### Task 6: Cleaned menu PDFs

**Files:**
- Create: `website/scripts/pdf-clean/package.json`, `website/scripts/pdf-clean/clean.mjs`, `website/public/menus/catering/{queen,king,corporate}.pdf`, `website/src/data/cateringMenus.ts`

**Interfaces:**
- Produces: `type CateringMenuId = 'queen' | 'king' | 'corporate'`, `CATERING_MENUS: { id: CateringMenuId; name: string; pdf: string }[]`.

- [ ] **Step 1: Own dependencies (not part of the site build)**

```bash
mkdir -p scripts/pdf-clean && cd scripts/pdf-clean
npm init -y >/dev/null && npm pkg set type=module private=true
npm i pdfjs-dist @napi-rs/canvas pdf-lib
cd ../..
```

(`node_modules` is already ignored by `website/.gitignore`.)

- [ ] **Step 2: First pass — render page 1 of King and Queen to find the scribble — `scripts/pdf-clean/clean.mjs`**

```js
// Rebuild the catering menus from page images: removes the hidden prices in the text layer,
// covers the King scribble with the matching blank area of the Queen menu, shrinks Corporate.
// Usage (from website/): node scripts/pdf-clean/clean.mjs [--inspect]
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
import { PDFDocument } from 'pdf-lib'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SRC = path.resolve('..', 'Catering pictures and menus')
const OUT = path.resolve('public', 'menus', 'catering')
const SCALE = 2 // ~144 dpi
const JOBS = [
  { file: 'QUEEN MENU JC.pdf', out: 'queen.pdf' },
  { file: 'KingMenu (minimum 50 ppl).pdf', out: 'king.pdf' },
  { file: 'Final01_CorporateMenu.pdf', out: 'corporate.pdf' },
]
// Fractions of page 1 (x, y, w, h) holding the hand-drawn scribble on the King menu.
// Measured in --inspect output; the same area is blank on the Queen menu.
const KING_PATCH = { x: 0.392, y: 0.312, w: 0.21, h: 0.034 }

async function renderPages(file) {
  const doc = await getDocument({ data: new Uint8Array(await readFile(path.join(SRC, file))) }).promise
  const pages = []
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n)
    const vp = page.getViewport({ scale: SCALE })
    const { canvas, context } = doc.canvasFactory.create(Math.ceil(vp.width), Math.ceil(vp.height))
    await page.render({ canvasContext: context, viewport: vp }).promise
    pages.push({ canvas, context, ptW: vp.width / SCALE, ptH: vp.height / SCALE })
  }
  return pages
}

await mkdir(OUT, { recursive: true })
const rendered = {}
for (const job of JOBS) rendered[job.out] = await renderPages(job.file)

const king = rendered['king.pdf'][0], queen = rendered['queen.pdf'][0]
const r = { x: Math.round(KING_PATCH.x * king.canvas.width), y: Math.round(KING_PATCH.y * king.canvas.height), w: Math.round(KING_PATCH.w * king.canvas.width), h: Math.round(KING_PATCH.h * king.canvas.height) }

if (process.argv.includes('--inspect')) {
  for (const [name, p] of [['king', king], ['queen', queen]]) {
    p.context.strokeStyle = 'red'; p.context.lineWidth = 2; p.context.strokeRect(r.x, r.y, r.w, r.h)
    await writeFile(path.join(OUT, `_inspect-${name}.png`), await p.canvas.encode('png'))
  }
  console.log('wrote _inspect-*.png; adjust KING_PATCH until the red box covers only the scribble')
  process.exit(0)
}

king.context.putImageData(queen.context.getImageData(r.x, r.y, r.w, r.h), r.x, r.y)

for (const job of JOBS) {
  const pdf = await PDFDocument.create()
  for (const p of rendered[job.out]) {
    const jpg = await pdf.embedJpg(await p.canvas.encode('jpeg', 80))
    pdf.addPage([p.ptW, p.ptH]).drawImage(jpg, { x: 0, y: 0, width: p.ptW, height: p.ptH })
  }
  await writeFile(path.join(OUT, job.out), await pdf.save())
  console.log('wrote', job.out)
}
```

Run: `node scripts/pdf-clean/clean.mjs --inspect`, open `public/menus/catering/_inspect-king.png` and `_inspect-queen.png`. Adjust `KING_PATCH` until the red box covers the whole scribble on King and only blank background on Queen (between the two decorative line ends). Delete the `_inspect-*.png` files.

- [ ] **Step 3: Build the PDFs and verify**

Run: `node scripts/pdf-clean/clean.mjs`
Then:

```bash
for f in queen king corporate; do echo "$f $(du -k public/menus/catering/$f.pdf | cut -f1) KB, text chars: $(pdftotext public/menus/catering/$f.pdf - | tr -d '[:space:]' | wc -c)"; done
```

Expected: text chars `0` for all three (no hidden price text), corporate under 5000 KB. Render King page 1 again (or open the PDF) and check the scribble is gone and the patch is invisible at normal zoom.

- [ ] **Step 4: Data — `src/data/cateringMenus.ts`**

```ts
export type CateringMenuId = 'queen' | 'king' | 'corporate'

export const CATERING_MENUS: { id: CateringMenuId; name: string; pdf: string }[] = [
  { id: 'queen', name: 'Queen', pdf: '/menus/catering/queen.pdf' },
  { id: 'king', name: 'King', pdf: '/menus/catering/king.pdf' },
  { id: 'corporate', name: 'Corporate', pdf: '/menus/catering/corporate.pdf' },
]
```

- [ ] **Step 5: Commit**

```bash
git add scripts/pdf-clean/package.json scripts/pdf-clean/package-lock.json scripts/pdf-clean/clean.mjs public/menus/catering src/data/cateringMenus.ts
git commit -m "feat: cleaned catering menu PDFs (no hidden prices, lighter Corporate)"
```

---

### Task 7: Interpolation helper

**Files:**
- Create: `src/lib/fmt.ts`, `src/lib/fmt.test.ts`

**Interfaces:**
- Produces: `fmt(template: string, vars: Record<string, string | number>): string`.

- [ ] **Step 1: Failing test**

```ts
import { expect, it } from 'vitest'
import { fmt } from './fmt'

it('replaces named placeholders and leaves unknown ones empty', () => {
  expect(fmt('Le menu {menu} demande au moins {min} personnes.', { menu: 'King', min: 50 }))
    .toBe('Le menu King demande au moins 50 personnes.')
  expect(fmt('Hi {name}', {})).toBe('Hi ')
})
```

- [ ] **Step 2:** `npm test -- src/lib/fmt.test.ts` → FAIL (module missing).
- [ ] **Step 3: Implement**

```ts
export const fmt = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''))
```

- [ ] **Step 4:** `npm test -- src/lib/fmt.test.ts` → PASS.
- [ ] **Step 5:** Commit: `git add src/lib/fmt.ts src/lib/fmt.test.ts && git commit -m "feat: add fmt interpolation helper"`

---

### Task 8: Catering form rules

**Files:**
- Create: `src/lib/cateringRules.ts`, `src/lib/cateringRules.test.ts`

**Interfaces:**
- Consumes: `CateringMenuId` (Task 6).
- Produces:
  - `type Service = 'salle_traiteur' | 'traiteur_domicile' | 'salle_seule'`
  - `type MenuChoice = CateringMenuId | 'indecis'`
  - `type Occasion = 'fete_maison' | 'reception' | 'pre_mariage' | 'corporatif' | 'autre'`
  - `MENU_MINIMUMS: Record<MenuChoice, number>`, `HALL_CAPACITY = 225`
  - `usesHall(s: Service | ''): boolean`, `needsMenu(s: Service | ''): boolean`, `needsAddress(s: Service | ''): boolean`
  - `guestRange(s: Service | '', menu: MenuChoice | ''): { min: number; max: number | null }`
  - `type GuestIssue = { kind: 'invalid' } | { kind: 'min'; min: number } | { kind: 'max'; max: number } | null`
  - `guestIssue(s: Service | '', menu: MenuChoice | '', raw: string): GuestIssue`
  - `toLocalISODate(d: Date): string`, `isPastDate(value: string, today: Date): boolean`
  - `interface CateringRequest { service: Service; menu: MenuChoice | ''; occasion: Occasion; guests: number; date: string; address: string; prenom: string; nom: string; email: string; telephone: string; notes: string }`
  - `buildPayload(r: CateringRequest, lang: 'fr' | 'en'): Record<string, string>`
  - `CATERING_FORM_ID = 'xdabbvjy'`

- [ ] **Step 1: Failing tests — `src/lib/cateringRules.test.ts`**

```ts
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
```

- [ ] **Step 2:** `npm test -- src/lib/cateringRules.test.ts` → FAIL (module missing).

- [ ] **Step 3: Implement — `src/lib/cateringRules.ts`**

```ts
import type { CateringMenuId } from '@/data/cateringMenus'

export type Service = 'salle_traiteur' | 'traiteur_domicile' | 'salle_seule'
export type MenuChoice = CateringMenuId | 'indecis'
export type Occasion = 'fete_maison' | 'reception' | 'pre_mariage' | 'corporatif' | 'autre'

export const CATERING_FORM_ID = 'xdabbvjy'
export const HALL_CAPACITY = 225
export const MENU_MINIMUMS: Record<MenuChoice, number> = { queen: 50, king: 50, corporate: 10, indecis: 10 }

export const usesHall = (s: Service | '') => s === 'salle_traiteur' || s === 'salle_seule'
export const needsMenu = (s: Service | '') => s !== 'salle_seule'
export const needsAddress = (s: Service | '') => s === 'traiteur_domicile'

export function guestRange(s: Service | '', menu: MenuChoice | ''): { min: number; max: number | null } {
  const min = needsMenu(s) && menu ? MENU_MINIMUMS[menu] : 1
  return { min, max: usesHall(s) ? HALL_CAPACITY : null }
}

export type GuestIssue = { kind: 'invalid' } | { kind: 'min'; min: number } | { kind: 'max'; max: number } | null

export function guestIssue(s: Service | '', menu: MenuChoice | '', raw: string): GuestIssue {
  const n = Number(raw)
  if (raw.trim() === '' || !Number.isInteger(n) || n < 1) return { kind: 'invalid' }
  const { min, max } = guestRange(s, menu)
  if (n < min) return { kind: 'min', min }
  if (max !== null && n > max) return { kind: 'max', max }
  return null
}

export function toLocalISODate(d: Date): string {
  const pad = (x: number) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** `value` is the YYYY-MM-DD string of an <input type="date">. */
export const isPastDate = (value: string, today: Date) => value < toLocalISODate(today)

export interface CateringRequest {
  service: Service
  menu: MenuChoice | ''
  occasion: Occasion
  guests: number
  date: string
  address: string
  prenom: string
  nom: string
  email: string
  telephone: string
  notes: string
}

// The client reads these emails in French whatever language the visitor used.
const LABELS = {
  service: { salle_traiteur: "Salle + traiteur Jabeen's", traiteur_domicile: 'Traiteur à votre adresse', salle_seule: 'Salle seulement' },
  menu: { queen: 'Queen (min. 50)', king: 'King (min. 50)', corporate: 'Corporate (min. 10)', indecis: 'Pas encore choisi' },
  occasion: { fete_maison: 'Fête à la maison', reception: 'Réception', pre_mariage: 'Pré-mariage', corporatif: 'Corporatif', autre: 'Autre' },
} as const

export function buildPayload(r: CateringRequest, lang: 'fr' | 'en'): Record<string, string> {
  const p: Record<string, string> = { Service: LABELS.service[r.service] }
  if (needsMenu(r.service) && r.menu) p.Menu = LABELS.menu[r.menu]
  p.Occasion = LABELS.occasion[r.occasion]
  p['Invités'] = String(r.guests)
  p.Date = r.date
  if (needsAddress(r.service)) p.Adresse = r.address.trim()
  p['Prénom'] = r.prenom.trim()
  p.Nom = r.nom.trim()
  p.Courriel = r.email.trim()
  p['Téléphone'] = r.telephone.trim()
  p.Notes = r.notes.trim() || '—'
  p['Langue du site'] = lang.toUpperCase()
  p._replyto = r.email.trim()
  p._subject = `Demande traiteur – ${p['Prénom']} ${p.Nom} – ${r.date}`
  return p
}
```

- [ ] **Step 4:** `npm test -- src/lib/cateringRules.test.ts` → PASS (all cases).
- [ ] **Step 5:** Commit: `git add src/lib/cateringRules.ts src/lib/cateringRules.test.ts && git commit -m "feat: catering request rules (minimums, hall capacity, payload)"`

---

### Task 9: Page copy (FR/EN)

**Files:**
- Modify: `src/i18n/translations.ts` (replace both `hallPage` objects)
- Create: `src/i18n/translations.test.ts`

**Interfaces:**
- Produces: `t.hallPage` with keys used in Task 10: `meta.title`, `label`, `heading`, `description`, `ctaMenus`, `ctaQuote`, `offers.hall|catering.{label,title,text}`, `occasionsLabel`, `occasions[4]`, `galleryLabel`, `galleryHeading`, `galleryHall`, `galleryBuffet`, `live.{label,heading,text,carts[3]}`, `menus.{label,heading,minimum,download,choose,items.{queen,king,corporate}[]}`, `form.{…}` (see code).

- [ ] **Step 1: Failing parity test — `src/i18n/translations.test.ts`**

```ts
import { expect, it } from 'vitest'
import { translations } from './translations'

const shape = (v: unknown): unknown =>
  Array.isArray(v) ? v.map(shape) : v && typeof v === 'object'
    ? Object.fromEntries(Object.keys(v).sort().map(k => [k, shape((v as Record<string, unknown>)[k])]))
    : typeof v

it('en and fr have the same shape', () => {
  expect(shape(translations.en)).toEqual(shape(translations.fr))
})

it('hall page has the catering form copy', () => {
  expect(translations.fr.hallPage.form.errors.minGuests).toContain('{min}')
  expect(translations.en.hallPage.menus.items.king.length).toBeGreaterThan(2)
})
```

- [ ] **Step 2:** `npm test -- src/i18n` → FAIL (`form` undefined).

- [ ] **Step 3: Replace `fr.hallPage` with**

```ts
    hallPage: {
      meta: { title: "Hall & Traiteur — Jabeen's Cuisine | Salle jusqu'à 225 personnes, traiteur à domicile" },
      label: 'Hall & Traiteur',
      heading: 'Votre événement, notre cuisine.',
      description: "Une salle de réception jusqu'à 225 personnes à Brossard, et un service traiteur qui se déplace chez vous.",
      ctaMenus: 'Voir les menus',
      ctaQuote: 'Demander une soumission',
      offers: {
        hall: { label: 'Notre salle', title: 'Recevez chez nous', text: "Jusqu'à 225 personnes, scène décorée, mur de fleurs et service complet sur place." },
        catering: { label: 'Traiteur', title: 'On se déplace chez vous', text: 'Buffet installé et servi à votre adresse, avec nos stations en direct.' },
      },
      occasionsLabel: 'Pour toutes vos occasions',
      occasions: ['Fête à la maison', 'Réception', 'Pré-mariage', 'Corporatif'],
      galleryLabel: 'En images',
      galleryHeading: 'La salle et le buffet',
      galleryHall: 'La salle',
      galleryBuffet: 'Le buffet',
      live: {
        label: 'Stations en direct',
        heading: 'Préparé devant vos invités',
        text: 'Nos chariots pani puri, chai masala et boissons, servis sur place par notre équipe.',
        carts: ['Pani puri', 'Chai masala', 'Bar à boissons'],
      },
      menus: {
        label: 'Menus traiteur',
        heading: 'Choisissez votre formule',
        minimum: 'Minimum {n} personnes',
        download: 'Télécharger le PDF',
        choose: 'Choisir ce menu',
        items: {
          queen: ['Inclus : salade verte, raïta, riz vapeur, naan', '2 entrées végé et 2 entrées non végé', '1 station en direct (pani puri, chaat, pav bhaji…)', '2 plats végé et 2 plats non végé', '2 desserts et comptoir chai masala en direct'],
          king: ['Inclus : salade verte, raïta, riz vapeur, naan', '3 entrées végé et 2 entrées non végé', '1 station en direct (pani puri, chaat, pav bhaji…)', '3 plats végé, 2 plats non végé et 1 biryani', '2 desserts et comptoir chai masala en direct'],
          corporate: ['Planche à partager exécutive', 'Canapés signature, végé et viande', 'Boîte lunch exécutive', 'Buffet lunch indo-italien', 'Réception corporative et desserts'],
        },
      },
      form: {
        label: 'Demande de soumission',
        heading: 'Parlez-nous de votre événement',
        subheading: 'Remplissez le formulaire, nous vous répondons sous 24 heures.',
        service: 'Service',
        serviceOptions: { salle_traiteur: 'Salle + notre traiteur', traiteur_domicile: 'Traiteur à votre adresse', salle_seule: 'Salle seulement' },
        menu: 'Menu',
        menuOptions: { queen: 'Queen (min. 50)', king: 'King (min. 50)', corporate: 'Corporate (min. 10)', indecis: 'Pas encore décidé' },
        occasion: 'Occasion',
        occasionOptions: { fete_maison: 'Fête à la maison', reception: 'Réception', pre_mariage: 'Pré-mariage', corporatif: 'Corporatif', autre: 'Autre' },
        guests: 'Nombre de personnes',
        guestsHint: 'Minimum {min}',
        guestsHintMax: 'Minimum {min}, maximum {max}',
        date: "Date de l'événement",
        address: "Adresse de l'événement",
        addressPlaceholder: '123 rue Exemple, Brossard',
        prenom: 'Prénom',
        nom: 'Nom',
        email: 'Courriel',
        telephone: 'Téléphone',
        notes: 'Informations complémentaires',
        notesPlaceholder: 'Allergies, demandes spéciales, horaire…',
        choose: 'Choisir…',
        submit: 'Envoyer ma demande',
        sending: 'Envoi…',
        note: 'Notre équipe vous contactera sous 24 heures.',
        errors: {
          required: 'Ce champ est requis.',
          email: 'Adresse courriel invalide.',
          invalidGuests: 'Entrez un nombre entier de personnes.',
          minGuests: 'Le menu {menu} demande au moins {min} personnes.',
          minGuestsGeneric: 'Au moins {min} personne(s).',
          maxGuests: 'La salle accueille au maximum {max} personnes.',
          pastDate: 'Choisissez une date à venir.',
          network: "L'envoi n'a pas fonctionné. Appelez-nous au (450) 926-3111.",
        },
        success_title: 'Demande envoyée.',
        success_p1: 'Merci, notre équipe vous contactera dans les 24 heures.',
        success_p2: "À très bientôt chez Jabeen's.",
      },
    },
```

- [ ] **Step 4: Replace `en.hallPage` with the same shape**

```ts
    hallPage: {
      meta: { title: "Hall & Catering — Jabeen's Cuisine | Hall for up to 225 guests, catering at your place" },
      label: 'Hall & Catering',
      heading: 'Your event, our cooking.',
      description: 'A reception hall for up to 225 guests in Brossard, and a catering service that comes to you.',
      ctaMenus: 'See the menus',
      ctaQuote: 'Request a quote',
      offers: {
        hall: { label: 'Our hall', title: 'Host your event with us', text: 'Up to 225 guests, decorated stage, flower wall and full service on site.' },
        catering: { label: 'Catering', title: 'We come to you', text: 'Buffet set up and served at your address, with our live stations.' },
      },
      occasionsLabel: 'For every occasion',
      occasions: ['House party', 'Reception', 'Pre-wedding', 'Corporate'],
      galleryLabel: 'In pictures',
      galleryHeading: 'The hall and the buffet',
      galleryHall: 'The hall',
      galleryBuffet: 'The buffet',
      live: {
        label: 'Live stations',
        heading: 'Made in front of your guests',
        text: 'Our pani puri, masala chai and drinks carts, served on site by our team.',
        carts: ['Pani puri', 'Masala chai', 'Drinks bar'],
      },
      menus: {
        label: 'Catering menus',
        heading: 'Choose your package',
        minimum: 'Minimum {n} guests',
        download: 'Download the PDF',
        choose: 'Choose this menu',
        items: {
          queen: ['Includes green salad, raita, steamed rice, naan', '2 veg and 2 non-veg starters', '1 live station (pani puri, chaat, pav bhaji…)', '2 veg and 2 non-veg mains', '2 desserts and a live masala tea counter'],
          king: ['Includes green salad, raita, steamed rice, naan', '3 veg and 2 non-veg starters', '1 live station (pani puri, chaat, pav bhaji…)', '3 veg mains, 2 non-veg mains and 1 biryani', '2 desserts and a live masala tea counter'],
          corporate: ['Executive grazing board', 'Signature canapés, veg and meat', 'Executive lunch box', 'Indo-Italian lunch buffet', 'Corporate reception and desserts'],
        },
      },
      form: {
        label: 'Request a quote',
        heading: 'Tell us about your event',
        subheading: 'Fill in the form and we will get back to you within 24 hours.',
        service: 'Service',
        serviceOptions: { salle_traiteur: 'Hall + our catering', traiteur_domicile: 'Catering at your address', salle_seule: 'Hall only' },
        menu: 'Menu',
        menuOptions: { queen: 'Queen (min. 50)', king: 'King (min. 50)', corporate: 'Corporate (min. 10)', indecis: 'Not decided yet' },
        occasion: 'Occasion',
        occasionOptions: { fete_maison: 'House party', reception: 'Reception', pre_mariage: 'Pre-wedding', corporatif: 'Corporate', autre: 'Other' },
        guests: 'Number of guests',
        guestsHint: 'Minimum {min}',
        guestsHintMax: 'Minimum {min}, maximum {max}',
        date: 'Event date',
        address: 'Event address',
        addressPlaceholder: '123 Example St, Brossard',
        prenom: 'First name',
        nom: 'Last name',
        email: 'Email',
        telephone: 'Phone',
        notes: 'Additional information',
        notesPlaceholder: 'Allergies, special requests, timing…',
        choose: 'Choose…',
        submit: 'Send my request',
        sending: 'Sending…',
        note: 'Our team will contact you within 24 hours.',
        errors: {
          required: 'This field is required.',
          email: 'Invalid email address.',
          invalidGuests: 'Enter a whole number of guests.',
          minGuests: 'The {menu} menu requires at least {min} guests.',
          minGuestsGeneric: 'At least {min} guest(s).',
          maxGuests: 'The hall holds at most {max} guests.',
          pastDate: 'Choose a date in the future.',
          network: "Sending failed. Please call us at (450) 926-3111.",
        },
        success_title: 'Request sent.',
        success_p1: 'Thank you, our team will contact you within 24 hours.',
        success_p2: "See you soon at Jabeen's.",
      },
    },
```

Keep `menuPage.cateringTab` etc. untouched (other code may use it; the old Hall used it only for the tab).

- [ ] **Step 5:** `npm test -- src/i18n` → PASS. (`Hall.tsx` will not type-check until Task 10; that is expected — do not run the build here.)
- [ ] **Step 6:** Commit: `git add src/i18n && git commit -m "feat: FR/EN copy for the Hall & Traiteur page"`

---

### Task 10: Hall & Traiteur page

**Files:**
- Create: `src/components/hall/{reveal.ts,CateringImg.tsx,HallIntro.tsx,Offers.tsx,Gallery.tsx,LiveStations.tsx,MenusSection.tsx,RequestForm.tsx}`
- Modify: `src/pages/Hall.tsx` (full rewrite), `src/theme/no-legacy-colors.test.ts` (remove `pages/Hall.tsx`; `PENDING` becomes empty)

**Interfaces:**
- Consumes: `photoSrc`, `PHOTO_W`, `PHOTO_H`, `hallPhotos`, `buffetPhotos`, `livePhotos` (Task 5); `CATERING_MENUS`, `CateringMenuId` (Task 6); `fmt` (Task 7); everything from `cateringRules` (Task 8); `t.hallPage` (Task 9); `useT`, `useLang` (`@/contexts/LanguageContext`).
- Produces: `RequestForm` prop `preset: { menu: CateringMenuId; n: number } | null`; `MenusSection` prop `onChoose(menu: CateringMenuId): void`; section ids `menus` and `demande`.

- [ ] **Step 1:** Remove `pages/Hall.tsx` from `PENDING` (set becomes empty); `npm test` → FAIL for `pages/Hall.tsx`.

- [ ] **Step 2: Shared bits**

`src/components/hall/reveal.ts`:

```ts
export const reveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}
```

`src/components/hall/CateringImg.tsx`:

```tsx
import { photoSrc, PHOTO_H, PHOTO_W } from '@/data/cateringPhotos'

export default function CateringImg({ id, alt, sizes = '(min-width: 768px) 33vw, 50vw', priority = false, className = '' }: {
  id: string; alt: string; sizes?: string; priority?: boolean; className?: string
}) {
  return (
    <img
      src={photoSrc(id, 800)}
      srcSet={`${photoSrc(id, 800)} 800w, ${photoSrc(id, 1600)} 1600w`}
      sizes={sizes}
      width={PHOTO_W}
      height={PHOTO_H}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`w-full h-auto object-cover ${className}`}
    />
  )
}
```

- [ ] **Step 3: Sections**

`src/components/hall/HallIntro.tsx`:

```tsx
import { motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import { hallPhotos } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'
import { reveal } from './reveal'

export default function HallIntro({ onMenus, onQuote }: { onMenus: () => void; onQuote: () => void }) {
  const h = useT().hallPage
  const { lang } = useLang()
  const stage = hallPhotos[0]
  return (
    <section className="max-w-site mx-auto px-6 md:px-16 pt-32 md:pt-40 pb-16 md:pb-24 grid md:grid-cols-[1.05fr_0.95fr] gap-10 md:gap-16 items-center">
      <motion.div {...reveal}>
        <p className="text-label text-gold mb-4">{h.label}</p>
        <h1 className="text-display text-text-primary mb-6" style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.75rem)', lineHeight: 1.05 }}>{h.heading}</h1>
        <p className="text-text-muted text-base md:text-lg leading-relaxed max-w-xl">{h.description}</p>
        <div className="flex flex-wrap gap-3 mt-8">
          <button type="button" onClick={onMenus} className="btn-primary">{h.ctaMenus}</button>
          <button type="button" onClick={onQuote} className="btn-ghost">{h.ctaQuote}</button>
        </div>
      </motion.div>
      <CateringImg id={stage.id} alt={stage.alt[lang]} priority sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5]" />
    </section>
  )
}
```

`src/components/hall/Offers.tsx`:

```tsx
import { motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import { buffetPhotos, hallPhotos } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'
import { reveal } from './reveal'

export default function Offers() {
  const h = useT().hallPage
  const { lang } = useLang()
  const cards = [
    { photo: hallPhotos[2], copy: h.offers.hall },
    { photo: buffetPhotos[0], copy: h.offers.catering },
  ]
  return (
    <section className="max-w-site mx-auto px-6 md:px-16 pb-20 md:pb-28">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {cards.map(({ photo, copy }, i) => (
          <motion.article key={photo.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="bg-surface border border-border-subtle">
            <CateringImg id={photo.id} alt={photo.alt[lang]} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/3]" />
            <div className="p-6 md:p-8">
              <p className="text-label text-gold mb-2">{copy.label}</p>
              <h2 className="text-display text-text-primary mb-3" style={{ fontSize: 'clamp(1.7rem, 2.6vw, 2.2rem)' }}>{copy.title}</h2>
              <p className="text-text-muted leading-relaxed">{copy.text}</p>
            </div>
          </motion.article>
        ))}
      </div>
      <motion.div {...reveal} className="mt-12 text-center">
        <p className="text-label text-gold mb-4">{h.occasionsLabel}</p>
        <ul className="flex flex-wrap justify-center gap-3">
          {h.occasions.map(o => (
            <li key={o} className="text-label text-text-primary border border-text-primary/30 px-5 py-3" style={{ fontSize: '0.7rem' }}>{o}</li>
          ))}
        </ul>
      </motion.div>
    </section>
  )
}
```

`src/components/hall/Gallery.tsx`:

```tsx
import { motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import { buffetPhotos, hallPhotos, type CateringPhoto } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'
import { reveal } from './reveal'

function Group({ title, photos, cols }: { title: string; photos: CateringPhoto[]; cols: string }) {
  const { lang } = useLang()
  return (
    <div className="mb-14 last:mb-0">
      <h3 className="text-label text-text-primary mb-5" style={{ fontSize: '0.72rem' }}>{title}</h3>
      <div className={`grid grid-cols-2 ${cols} gap-3 md:gap-4`}>
        {photos.map((p, i) => (
          <motion.figure key={p.id} {...reveal} transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }} className="overflow-hidden">
            <CateringImg id={p.id} alt={p.alt[lang]} className="aspect-[3/4] transition-transform duration-700 hover:scale-[1.03]" />
          </motion.figure>
        ))}
      </div>
    </div>
  )
}

export default function Gallery() {
  const h = useT().hallPage
  return (
    <section className="max-w-site mx-auto px-6 md:px-16 py-20 md:py-28 border-t border-border-subtle">
      <div className="text-center mb-12">
        <p className="text-label text-gold mb-3">{h.galleryLabel}</p>
        <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{h.galleryHeading}</h2>
      </div>
      <Group title={h.galleryHall} photos={hallPhotos} cols="md:grid-cols-3" />
      <Group title={h.galleryBuffet} photos={buffetPhotos} cols="md:grid-cols-4" />
    </section>
  )
}
```

`src/components/hall/LiveStations.tsx`:

```tsx
import { motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import { livePhotos } from '@/data/cateringPhotos'
import CateringImg from './CateringImg'
import { reveal } from './reveal'

export default function LiveStations() {
  const h = useT().hallPage
  const { lang } = useLang()
  const carts = livePhotos.slice(0, 3)
  const details = livePhotos.slice(3)
  return (
    <section className="bg-band text-band-ink py-20 md:py-28">
      <div className="max-w-site mx-auto px-6 md:px-16">
        <motion.div {...reveal} className="max-w-2xl mb-12">
          <p className="text-label text-gold-soft mb-3">{h.live.label}</p>
          <h2 className="text-display mb-4" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{h.live.heading}</h2>
          <p className="text-band-ink/80 leading-relaxed">{h.live.text}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-5">
          {carts.map((p, i) => (
            <motion.figure key={p.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
              <CateringImg id={p.id} alt={p.alt[lang]} className="aspect-[3/4]" />
              <figcaption className="text-label mt-3" style={{ fontSize: '0.7rem' }}>{h.live.carts[i]}</figcaption>
            </motion.figure>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          {details.map(p => (
            <motion.figure key={p.id} {...reveal}>
              <CateringImg id={p.id} alt={p.alt[lang]} sizes="(min-width: 768px) 25vw, 50vw" className="aspect-[3/4]" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
```

`src/components/hall/MenusSection.tsx`:

```tsx
import { motion } from 'framer-motion'
import { useT } from '@/contexts/LanguageContext'
import { CATERING_MENUS, type CateringMenuId } from '@/data/cateringMenus'
import { MENU_MINIMUMS } from '@/lib/cateringRules'
import { fmt } from '@/lib/fmt'
import { reveal } from './reveal'

export default function MenusSection({ onChoose }: { onChoose: (menu: CateringMenuId) => void }) {
  const m = useT().hallPage.menus
  return (
    <section id="menus" className="scroll-mt-24 max-w-site mx-auto px-6 md:px-16 py-20 md:py-28">
      <div className="text-center mb-12">
        <p className="text-label text-gold mb-3">{m.label}</p>
        <h2 className="text-display text-text-primary" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{m.heading}</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {CATERING_MENUS.map((menu, i) => (
          <motion.article key={menu.id} {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }} className="bg-surface border border-border-subtle p-7 md:p-8 flex flex-col">
            <p className="text-label text-gold">Menu</p>
            <h3 className="text-display text-text-primary mt-1" style={{ fontSize: '2.4rem' }}>{menu.name}</h3>
            <p className="text-label text-gold border border-gold self-start px-3 py-2 mt-3 mb-5" style={{ fontSize: '0.62rem' }}>{fmt(m.minimum, { n: MENU_MINIMUMS[menu.id] })}</p>
            <ul className="text-text-muted text-[0.95rem] mb-8 flex-1">
              {m.items[menu.id].map(line => <li key={line} className="py-2 border-b border-border-subtle">{line}</li>)}
            </ul>
            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => onChoose(menu.id)} className="btn-primary text-center">{m.choose}</button>
              <a href={menu.pdf} target="_blank" rel="noopener" className="text-label text-gold underline underline-offset-4 text-center py-2" style={{ fontSize: '0.68rem' }}>
                {m.download} ({menu.name})
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Request form — `src/components/hall/RequestForm.tsx`**

```tsx
import { useEffect, useId, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang, useT } from '@/contexts/LanguageContext'
import type { CateringMenuId } from '@/data/cateringMenus'
import {
  buildPayload, CATERING_FORM_ID, guestIssue, guestRange, isPastDate, needsAddress, needsMenu, toLocalISODate,
  type CateringRequest, type MenuChoice, type Occasion, type Service,
} from '@/lib/cateringRules'
import { fmt } from '@/lib/fmt'

interface Values {
  service: Service | ''; menu: MenuChoice | ''; occasion: Occasion | ''; guests: string; date: string; address: string
  prenom: string; nom: string; email: string; telephone: string; notes: string
}

const SERVICES: Service[] = ['salle_traiteur', 'traiteur_domicile', 'salle_seule']
const MENUS: MenuChoice[] = ['queen', 'king', 'corporate', 'indecis']
const OCCASIONS: Occasion[] = ['fete_maison', 'reception', 'pre_mariage', 'corporatif', 'autre']
const MENU_NAMES: Record<MenuChoice, string> = { queen: 'Queen', king: 'King', corporate: 'Corporate', indecis: '' }

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="text-label text-text-primary block mb-1" style={{ fontSize: '0.62rem' }}>{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-text-muted text-xs mt-2">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="text-error text-sm mt-2">{error}</p>}
    </div>
  )
}

export default function RequestForm({ preset }: { preset: { menu: CateringMenuId; n: number } | null }) {
  const f = useT().hallPage.form
  const { lang } = useLang()
  const uid = useId()
  const id = (name: string) => `${uid}-${name}`
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const { register, handleSubmit, watch, setValue, trigger, getValues, formState: { errors, isSubmitted } } = useForm<Values>({
    defaultValues: { service: '', menu: '', occasion: '', guests: '', date: '', address: '', prenom: '', nom: '', email: '', telephone: '', notes: '' },
  })
  const service = watch('service')
  const menu = watch('menu')
  const range = guestRange(service, menu)

  useEffect(() => {
    if (!preset) return
    setValue('menu', preset.menu, { shouldDirty: true })
    if (getValues('service') === 'salle_seule' || getValues('service') === '') setValue('service', 'salle_traiteur')
  }, [preset, setValue, getValues])

  // Re-check the guest count as soon as the menu or service changes.
  useEffect(() => {
    if (getValues('guests') !== '' || isSubmitted) void trigger('guests')
  }, [service, menu, trigger, getValues, isSubmitted])

  const guestMessage = (raw: string): true | string => {
    const issue = guestIssue(service, menu, raw)
    if (!issue) return true
    if (issue.kind === 'invalid') return f.errors.invalidGuests
    if (issue.kind === 'max') return fmt(f.errors.maxGuests, { max: issue.max })
    return menu && menu !== 'indecis' && needsMenu(service)
      ? fmt(f.errors.minGuests, { menu: MENU_NAMES[menu], min: issue.min })
      : fmt(f.errors.minGuestsGeneric, { min: issue.min })
  }

  const onSubmit = async (v: Values) => {
    setStatus('sending')
    const request: CateringRequest = { ...v, service: v.service as Service, occasion: v.occasion as Occasion, guests: Number(v.guests) }
    try {
      const res = await fetch(`https://formspree.io/f/${CATERING_FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(buildPayload(request, lang)),
      })
      setStatus(res.ok ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const err = (name: keyof Values) => errors[name]?.message as string | undefined
  const aria = (name: keyof Values) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${id(name)}-err` : undefined,
  })

  return (
    <section id="demande" className="scroll-mt-24 border-t border-border-subtle">
      <div className="max-w-2xl mx-auto px-6 md:px-8 py-20 md:py-28">
        <div className="text-center mb-12">
          <p className="text-label text-gold mb-3">{f.label}</p>
          <h2 className="text-display text-text-primary mb-4" style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}>{f.heading}</h2>
          <p className="text-text-muted">{f.subheading}</p>
        </div>
        <AnimatePresence mode="wait">
          {status === 'sent' ? (
            <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12" role="status">
              <div className="gold-divider mx-auto mb-8" />
              <p className="text-display text-text-primary mb-4" style={{ fontSize: '1.9rem' }}>{f.success_title}</p>
              <p className="text-text-muted mb-1">{f.success_p1}</p>
              <p className="text-text-muted">{f.success_p2}</p>
            </motion.div>
          ) : (
            <motion.form key="form" noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
              <fieldset>
                <legend className="text-label text-text-primary mb-3" style={{ fontSize: '0.62rem' }}>{f.service}</legend>
                <div className="grid sm:grid-cols-3 gap-3" role="radiogroup">
                  {SERVICES.map(s => (
                    <label key={s} className={`border px-4 py-3 cursor-pointer text-sm transition-colors focus-within:ring-2 focus-within:ring-gold ${service === s ? 'border-gold text-text-primary bg-surface' : 'border-text-primary/25 text-text-muted'}`}>
                      <input type="radio" value={s} className="sr-only" {...register('service', { required: f.errors.required })} />
                      {f.serviceOptions[s]}
                    </label>
                  ))}
                </div>
                {err('service') && <p role="alert" className="text-error text-sm mt-2">{err('service')}</p>}
              </fieldset>

              <div className="grid sm:grid-cols-2 gap-6">
                {needsMenu(service) && (
                  <Field id={id('menu')} label={f.menu} error={err('menu')}>
                    <select id={id('menu')} className="field" {...aria('menu')} {...register('menu', { validate: v => !needsMenu(getValues('service')) || v !== '' || f.errors.required })}>
                      <option value="">{f.choose}</option>
                      {MENUS.map(mn => <option key={mn} value={mn}>{f.menuOptions[mn]}</option>)}
                    </select>
                  </Field>
                )}
                <Field id={id('occasion')} label={f.occasion} error={err('occasion')}>
                  <select id={id('occasion')} className="field" {...aria('occasion')} {...register('occasion', { required: f.errors.required })}>
                    <option value="">{f.choose}</option>
                    {OCCASIONS.map(o => <option key={o} value={o}>{f.occasionOptions[o]}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <Field id={id('guests')} label={f.guests} error={err('guests')}
                  hint={range.max ? fmt(f.guestsHintMax, { min: range.min, max: range.max }) : fmt(f.guestsHint, { min: range.min })}>
                  <input id={id('guests')} type="number" inputMode="numeric" min={range.min} max={range.max ?? undefined} step={1} className="field"
                    {...aria('guests')} aria-describedby={errors.guests ? `${id('guests')}-err` : `${id('guests')}-hint`}
                    {...register('guests', { validate: guestMessage })} />
                </Field>
                <Field id={id('date')} label={f.date} error={err('date')}>
                  <input id={id('date')} type="date" min={toLocalISODate(new Date())} className="field" {...aria('date')}
                    {...register('date', { required: f.errors.required, validate: v => !isPastDate(v, new Date()) || f.errors.pastDate })} />
                </Field>
              </div>

              {needsAddress(service) && (
                <Field id={id('address')} label={f.address} error={err('address')}>
                  <input id={id('address')} className="field" placeholder={f.addressPlaceholder} autoComplete="street-address" {...aria('address')}
                    {...register('address', { validate: v => !needsAddress(getValues('service')) || v.trim() !== '' || f.errors.required })} />
                </Field>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <Field id={id('prenom')} label={f.prenom} error={err('prenom')}>
                  <input id={id('prenom')} className="field" autoComplete="given-name" {...aria('prenom')} {...register('prenom', { required: f.errors.required })} />
                </Field>
                <Field id={id('nom')} label={f.nom} error={err('nom')}>
                  <input id={id('nom')} className="field" autoComplete="family-name" {...aria('nom')} {...register('nom', { required: f.errors.required })} />
                </Field>
                <Field id={id('email')} label={f.email} error={err('email')}>
                  <input id={id('email')} type="email" className="field" autoComplete="email" {...aria('email')}
                    {...register('email', { required: f.errors.required, pattern: { value: /^\S+@\S+\.\S+$/, message: f.errors.email } })} />
                </Field>
                <Field id={id('telephone')} label={f.telephone} error={err('telephone')}>
                  <input id={id('telephone')} type="tel" className="field" autoComplete="tel" placeholder="(450) 926-3111" {...aria('telephone')}
                    {...register('telephone', { required: f.errors.required })} />
                </Field>
              </div>

              <Field id={id('notes')} label={f.notes}>
                <textarea id={id('notes')} rows={3} className="field resize-none" placeholder={f.notesPlaceholder} {...register('notes')} />
              </Field>

              <div>
                <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">{status === 'sending' ? f.sending : f.submit}</button>
                {status === 'error' && <p role="alert" className="text-error text-sm mt-4 text-center">{f.errors.network}</p>}
                <p className="text-text-muted text-xs text-center mt-4">{f.note}</p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Page — replace `src/pages/Hall.tsx` entirely**

```tsx
import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Footer from '@/components/layout/Footer'
import { useT } from '@/contexts/LanguageContext'
import type { CateringMenuId } from '@/data/cateringMenus'
import HallIntro from '@/components/hall/HallIntro'
import Offers from '@/components/hall/Offers'
import Gallery from '@/components/hall/Gallery'
import LiveStations from '@/components/hall/LiveStations'
import MenusSection from '@/components/hall/MenusSection'
import RequestForm from '@/components/hall/RequestForm'

const scrollToId = (id: string) => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export default function Hall() {
  const h = useT().hallPage
  const [preset, setPreset] = useState<{ menu: CateringMenuId; n: number } | null>(null)

  useEffect(() => { document.title = h.meta.title }, [h])

  const choose = (menu: CateringMenuId) => {
    setPreset(p => ({ menu, n: (p?.n ?? 0) + 1 }))
    scrollToId('demande')
  }

  return (
    <MotionConfig reducedMotion="user">
      <main>
        <HallIntro onMenus={() => scrollToId('menus')} onQuote={() => scrollToId('demande')} />
        <Offers />
        <Gallery />
        <LiveStations />
        <MenusSection onChoose={choose} />
        <RequestForm preset={preset} />
      </main>
      <Footer />
    </MotionConfig>
  )
}
```

- [ ] **Step 6: Verify**

Run: `npm test` → all PASS (guard now scans every file). `npx tsc -b --force` → clean. `npm run lint` → no new errors. `npm run build` → OK.

- [ ] **Step 7: Look at it**

`npx vite preview --port 4173` then `node scripts/shots.mjs http://localhost:4173 light shots /location-salle` and `… dark shots /location-salle`. Check at 1440 and 390: section order (intro, offers, occasions, gallery, live stations, menus, form), no horizontal scroll, buttons readable, navy band readable, every image loaded.

- [ ] **Step 8: Commit**

```bash
git add src/components/hall src/pages/Hall.tsx src/theme/no-legacy-colors.test.ts
git commit -m "feat: rebuild Hall & Traiteur page with menus and one request form"
```

---

### Task 11: Catering photos in the homepage carousel

**Files:**
- Modify: `src/components/home/LaCarte.tsx` (rows 1–3)

- [ ] **Step 1:** Add one catering photo per row, at a position that mixes it with the dishes:

```ts
// row1, after 'Achaari Paneer Tikka'
  { src: '/assets/catering/live-01-pani-puri-cart-800.webp', w: 300, pos: 'center 55%' },
// row2, after 'Samosa Chaat'
  { src: '/assets/catering/buffet-01-gold-buffet-line-800.webp', w: 440, pos: 'center 62%' },
// row3, after 'Popadum Platter'
  { src: '/assets/catering/buffet-02-butter-chicken-800.webp', w: 310, pos: 'center 50%' },
// row3, after 'Pani Puri'
  { src: '/assets/catering/live-05-pani-puri-closeup-800.webp', w: 300, pos: 'center 45%' },
```

- [ ] **Step 2:** Build, preview, `node scripts/shots.mjs http://localhost:4173 light shots /`. Check the four new tiles crop well (cart canopy and bowl visible, no awkward cut).
- [ ] **Step 3:** Commit: `git add src/components/home/LaCarte.tsx && git commit -m "feat: catering photos in the homepage carousel"`

---

### Task 12: Verification

**Files:**
- Create: `website/scripts/form-check.mjs`

- [ ] **Step 1:** `npm test && npx tsc -b --force && npm run lint && npm run build` → all green. Paste the summary lines.

- [ ] **Step 2: Full screenshot pass, both themes**

```bash
npx vite preview --port 4173   # background
node scripts/shots.mjs http://localhost:4173 light shots
node scripts/shots.mjs http://localhost:4173 dark shots
```

Build contact sheets (ffmpeg `hstack`/`tile` at reduced size) and read every page at 1440 and 390 in both themes. Fix anything unreadable, cut off or overflowing before continuing.

- [ ] **Step 3: Lighthouse (mobile)**

```bash
for p in / /location-salle; do npx -y lighthouse "http://localhost:4173$p" --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --chrome-path="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --chrome-flags="--headless=new" --output=json --output-path="shots/lh$(echo $p | tr '/' '_').json" --quiet; done
node -e "for (const f of ['shots/lh_.json','shots/lh_location-salle.json']) { const r=require('./'+f); console.log(f, Object.fromEntries(Object.entries(r.categories).map(([k,v])=>[k,Math.round(v.score*100)]))) }"
```

Expected: performance ≥ 90, accessibility 100 on both. Fix contrast/label issues the report lists.

- [ ] **Step 4: Form behaviour check without emailing the client — `scripts/form-check.mjs`**

```js
// Drives the request form in Edge, intercepts Formspree, prints the payload. Never reaches the real endpoint.
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:4173'
const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage()
await page.addInitScript(() => { localStorage.setItem('jc_newsletter_seen', String(Date.now())); localStorage.setItem('lang', 'fr') })
let payload = null
let fail = process.argv.includes('--fail')
await page.route('https://formspree.io/**', async route => {
  payload = route.request().postDataJSON()
  await route.fulfill(fail ? { status: 500, body: '{}' } : { status: 200, contentType: 'application/json', body: '{"ok":true}' })
})
await page.goto(`${base}/location-salle`, { waitUntil: 'networkidle' })

// "Choisir ce menu" on Corporate presets the form
await page.getByRole('button', { name: 'Choisir ce menu' }).nth(2).click()
await page.getByLabel('Traiteur à votre adresse').check({ force: true })
await page.getByLabel('Nombre de personnes').fill('20')
await page.getByLabel('Occasion').selectOption('reception')
// Review Focus 1: switch to King -> error appears at once
await page.getByLabel('Menu', { exact: true }).selectOption('king')
await page.getByText('Le menu King demande au moins 50 personnes.').waitFor({ timeout: 3000 })
console.log('ok: min error shown on menu change')

await page.getByLabel('Nombre de personnes').fill('80')
const d = new Date(); d.setDate(d.getDate() + 30)
await page.getByLabel("Date de l'événement").fill(d.toISOString().slice(0, 10))
await page.getByLabel("Adresse de l'événement").fill('12 rue des Lilas, Brossard')
await page.getByLabel('Prénom').fill('Test')
await page.getByLabel('Nom', { exact: true }).fill('Formulaire')
await page.getByLabel('Courriel').fill('test@example.com')
await page.getByLabel('Téléphone').fill('514-555-0101')
await page.getByRole('button', { name: 'Envoyer ma demande' }).click()
await page.waitForTimeout(1500)
console.log('payload', JSON.stringify(payload, null, 2))
console.log('visible:', fail ? await page.getByText('Appelez-nous au (450) 926-3111').isVisible() : await page.getByText('Demande envoyée.').isVisible())
await browser.close()
```

Run: `node scripts/form-check.mjs` → prints "ok: min error shown on menu change", a payload with `Menu: "King (min. 50)"`, `Adresse`, `Invités: "80"`, and `visible: true`. Run `node scripts/form-check.mjs --fail` → `visible: true` for the phone-number error. A real submission to Formspree (which emails the client) happens only with Yousif's OK.

- [ ] **Step 5: SEO**

Run the `seo-page` skill on `http://localhost:4173/location-salle`; fix what it finds that is in scope (title, headings, alt text, link text).

- [ ] **Step 6: Commit**

```bash
git add scripts/form-check.mjs
git commit -m "test: form behaviour check with intercepted Formspree"
```

---

### Task 13: Preview for the client

- [ ] **Step 1:** `git push -u origin feat/light-catering` and `git push origin pre-light-theme` (branch preview only; `main` untouched).
- [ ] **Step 2:** Get the Vercel preview URL for the branch (GitHub check on the branch, or `vercel:status`). Open `/location-salle` and `/?theme=dark` on the preview to confirm both themes.
- [ ] **Step 3:** Append lessons to `C:\Users\Yousif Ibrahim\.claude\skills\agenceip-web\LEARNINGS.md` (date + rule), and tell Yousif in one line.
- [ ] **Step 4:** Report to Yousif: preview URL, what changed, rollback options (`?theme=dark`, tag `pre-light-theme`, Vercel Instant Rollback), and the open client items from the spec (§10).
