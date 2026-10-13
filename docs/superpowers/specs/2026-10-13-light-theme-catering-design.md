# Design Spec — Light Theme + Hall & Traiteur Page

**Date:** 2026-10-13
**Project:** Jabeen's Cuisine website (`website/`, React 19 + Vite + Tailwind 3.4)
**Scope:** Make the whole site lighter with more readable fonts, rebuild the Hall & Traiteur page around the client's catering offer, and add catering photos to the homepage carousel. Everything must be easy to undo if the client does not like it.

---

## 1. Context

On 2026-10-03 the client asked for:

- photos showing that Jabeen's has a reception hall **and** caters at other locations;
- a section for the live stations (the pani puri, chai and drinks carts he posts on social media);
- three catering menus shown on the site, chosen in the request form, with a minimum number of guests that depends on the menu;
- the menu PDFs available for download;
- occasions: house party, reception, pre-wedding events;
- page order: catering, photos, menus, form;
- a site that is less dark, with the fonts reviewed;
- a few catering photos in the homepage carousel.

The current page (`src/pages/Hall.tsx`) has empty photo placeholders, two tabs with two separate forms (hall booking and catering) and three stats. The site is dark navy-black (`#060D18`) with a textured background image, gold `#A8956A`, Cormorant Garamond 300 and Montserrat 300. About 229 colour values are hard-coded in components and inline styles.

---

## 2. Decisions taken with Yousif

| Topic | Decision |
|---|---|
| Theme | Lighten the whole site first, then build the catering page on it. |
| Palette | Option A "Ivory & Navy" (see `assets/2026-10-13-theme-options.jpg`). |
| Fonts | Cormorant Garamond 600 for headings, Jost 400/500 for body text. |
| Rollback | Must be easy to return to the current site. |
| Form | One request form replaces the two forms. |
| Prices | No prices on the page (the client hid them on the Queen and King PDFs). |
| Videos | Not used (WhatsApp videos are 480p). |

---

## 3. Rollback

1. Tag `pre-light-theme` marks the current site (commit `489d06a`). All work happens on branch `feat/light-catering`.
2. Every push of the branch gets a Vercel preview URL. The client reviews the preview; production changes only after Yousif's OK.
3. After launch, two ways back:
   - Vercel "Instant Rollback" to the previous production deployment (one click), or
   - `git revert -m 1 <merge commit>` on `main`.
4. Inside the code, the dark theme is kept: switching `data-theme="light"` to `data-theme="dark"` on `<html>` in `website/index.html` restores the dark colours, fonts, background and logos while keeping the new page.

---

## 4. Theme system

### 4.1 Tokens

Colours and fonts become CSS custom properties in `src/index.css`, defined twice:

```css
:root[data-theme="light"] { /* palette A */ }
:root[data-theme="dark"]  { /* today's exact values */ }
```

| Token | Light (A) | Dark (today) |
|---|---|---|
| `--bg` | `#FBF8F2` ivory | `#060D18` |
| `--surface` | `#FFFFFF` | `#111111` / `rgba(6,13,24,0.6)` |
| `--ink` (main text) | `#14213D` navy | `#F5F5F0` |
| `--muted` (secondary text) | `#4A5568` | `#DEDEDA` |
| `--line` (borders) | `#E6DFD2` | `#1E1E1E` |
| `--accent` (gold text, labels) | `#8A6A2F` (4.5:1 on ivory) | `#A8956A` |
| `--accent-soft` (gold decoration, gold on navy) | `#C9A96A` | `#A8956A` |
| `--band` / `--band-ink` (navy sections) | `#14213D` / `#FBF8F2` | `#0D1A2E` / `#F5F5F0` |
| `--btn` / `--btn-ink` | `#14213D` / `#FBF8F2` | `#A8956A` / `#F5F5F0` |
| `--font-display` | Cormorant Garamond, weight 600 | Cormorant Garamond, weight 300 |
| `--font-body` | Jost, weight 400 | Montserrat, weight 300 |
| `--body-bg-image` | none | `url('/assets/background.jpg')` |

Tailwind colour names (`background`, `surface`, `border-subtle`, `text-primary`, `text-muted`, `gold`) map to these variables, so existing class names keep working. Hard-coded hex values in components and inline styles are replaced by the variables. Exact final values are checked for contrast (WCAG AA 4.5:1 for text) during implementation.

### 4.2 What stays dark

The homepage hero (video/photo with dark overlay and white text) keeps its overlay in both themes. The navbar is transparent over that hero and becomes an ivory bar with navy text on scroll and on pages without a dark hero.

### 4.3 Logos

The current logo files have a white wordmark and a gold peacock. For the light theme, navy-wordmark copies are generated from the same files (white pixels recoloured to `--ink`, the gold peacock unchanged): `logo-main-light.webp`, `logo-footer-light.webp`. Components pick the file from the active theme.

### 4.4 Fonts

Google Fonts link in `index.html` loads Cormorant Garamond 300/500/600 (+ italics in use), Jost 400/500 and Montserrat 300/400/500/600 (dark theme). `.text-display` and `.text-label` utilities read the font variables.

---

## 5. Hall & Traiteur page (`/location-salle`)

Same URL and nav label ("Hall & Traiteur" / "Hall & Catering"). French and English through `src/i18n/translations.ts`.

### 5.1 Sections, in order

1. **Intro.** Label "Hall & Traiteur", heading, one paragraph (reception hall up to 225 guests in Brossard + catering at your address), buttons "Voir les menus" (scrolls to menus) and "Demander une soumission" (scrolls to form). Photo: reception stage (front).
2. **Two offers.** Card "Notre salle" (hall photo, up to 225 guests, decorated stage, flower wall, full service on site) and card "Traiteur à votre adresse" (buffet photo, buffet set up and served at the client's address).
3. **Occasions.** Fête à la maison · Réception · Pré-mariage · Corporatif.
4. **Gallery.** Hall photos (6) and buffet photos (4), with short captions.
5. **Live stations** (navy band). Pani puri cart, masala chai cart, drinks cart, plus the details (pani puri close-up, posters). One line of copy: prepared in front of your guests.
6. **Menus.** Three cards:
   - **Queen** — minimum 50 guests. Includes green salad, raita, steamed rice, naan. 2 veg starters, 2 non-veg starters, 1 live station, 2 veg mains, 2 non-veg mains, 2 desserts, live masala tea counter.
   - **King** — minimum 50 guests. Same base. 3 veg starters, 2 non-veg starters, 1 live station, 3 veg mains, 2 non-veg mains, 1 biryani, 2 desserts (incl. live meetha paan option), live masala tea counter.
   - **Corporate** — minimum 10 guests. Executive grazing board, signature canapés, executive lunch boxes, Indo-Italian lunch buffet, premium corporate reception, dessert collection.
   Each card: minimum badge, summary, "Télécharger le PDF", "Choisir ce menu" (scrolls to the form with this menu selected).
7. **Request form** (section 5.2).

The old stats block is reduced to the one figure we can stand behind: 225 guests (shown in the intro and the hall card). "1 salle" and "100% privatisation" are removed.

### 5.2 Request form

| Field | Type | Rule |
|---|---|---|
| Service | radio | `salle_traiteur` (hall + our catering), `traiteur_domicile` (catering at your address), `salle_seule` (hall only). Required. |
| Menu | select | `queen`, `king`, `corporate`, `indecis` (not sure yet). Required unless service is `salle_seule` (then hidden). Preset by "Choisir ce menu". |
| Occasion | select | `fete_maison`, `reception`, `pre_mariage`, `corporatif`, `autre`. Required. |
| Guests | number | Minimum = menu minimum (Queen 50, King 50, Corporate 10, not sure 10, hall only 1). Maximum 225 when service uses the hall. Required. |
| Date | date | Required, not in the past. |
| Address | text | Shown and required only for `traiteur_domicile`. |
| First name, last name, email, phone | text | Required (email format checked). |
| Notes | textarea | Optional. |

Error messages name the rule, e.g. "Le menu King demande au moins 50 personnes." Changing the menu re-checks the guest count.

Submission goes to the existing catering Formspree form (`xdabbvjy`) with readable keys so the client's email is easy to read, for example `Service: Traiteur à votre adresse`, `Menu: King (min. 50)`, `Invités: 80`. The hall form ID (`xnjwwyrg`) is no longer used. Success and error states as today; on network error, the message tells the visitor to call (450) 926-3111.

The rules live in one pure module (`src/lib/cateringRules.ts`: menu minimums, guest range, required fields per service, payload builder) with unit tests written first (Vitest).

---

## 6. Assets

- **Photos.** The 17 edited photos in `Catering pictures and menus/_selection/edited/` are converted to WebP at 1600 px and 800 px wide (sharp script) into `public/assets/catering/` and served with `srcset`, `width`/`height` and lazy loading below the fold.
- **Homepage carousel** (`LaCarte.tsx`). Four photos are added across the three rows: pani puri cart, butter chicken, gold buffet line, pani puri close-up.
- **Menu PDFs** in `public/menus/catering/`. Web versions are rebuilt from page images, which removes the hidden prices still present in the text layer of the Queen ($30) and King ($35) files. A clean patch covers the hand-drawn scribble on the King file. The Corporate file goes from 23.8 MB to about 3 MB. The script lives in `website/scripts/` and is not shipped. The client should still send clean exports from his design tool to replace them.
- **Raw client files** (`Catering pictures and menus/`, about 100 MB) stay out of git.

---

## 7. Honesty and privacy

- The photos are the client's own events. AI edits removed people, straightened perspective and corrected colour. Two photos (empty hall, empty buffet line) had large areas rebuilt; the client confirms they look like his hall before launch.
- Couples' names and guest seating lists were removed from the flower-wall photos.
- No invented figures, reviews or prices.

---

## 8. Testing and checks

1. Unit tests (Vitest) for `cateringRules.ts`: minimums per menu, hall maximum, address rule, hall-only rule, payload keys.
2. `npm run build` and lint pass.
3. Screenshots at 1440 px and 390 px of every page in the light theme, and the same pages with `data-theme="dark"` to prove the rollback switch works.
4. Form tried end to end in the preview (validation messages, menu preset from the cards, successful Formspree submission).
5. Lighthouse mobile ≥ 90 and accessibility 100 on `/` and `/location-salle`.
6. `seo-page` on `/location-salle`; fix what it finds.

---

## 9. Files

| File | Change |
|---|---|
| `website/index.html` | `data-theme="light"` on `<html>`, font link |
| `website/src/index.css` | theme tokens, body background per theme |
| `website/tailwind.config.js` | colours and fonts read the variables |
| `website/src/components/**`, `website/src/pages/**` | hard-coded colours replaced by tokens; logo per theme |
| `website/src/pages/Hall.tsx` | rebuilt page (sections split into small components under `src/components/hall/`) |
| `website/src/lib/cateringRules.ts` (+ test) | form rules and payload |
| `website/src/i18n/translations.ts` | new FR/EN copy for the page |
| `website/src/components/home/LaCarte.tsx` | four catering photos |
| `website/public/assets/catering/*` | web photos |
| `website/public/menus/catering/*.pdf` | cleaned menus |
| `website/public/assets/logo-*-light.webp` | navy-wordmark logos |
| `website/scripts/*` | one-off image and PDF scripts |

---

## 10. Open items for the client

- Confirm the two rebuilt photos (empty hall, empty buffet line) look like his venue.
- Send clean menu exports without prices (Queen, King) and a lighter Corporate export.
- Confirm Corporate prices may stay visible in its PDF.
