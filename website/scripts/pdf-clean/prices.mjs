// Which part of a menu text item is a price. Returns 'all' when nothing worth keeping is left,
// otherwise the [start, end) character spans to erase (empty when there is no price).
const PRICE = /(\s*[-–]\s*)?\$\s?\d+(?:[.,]\d{1,2})?(?:\s*\/\s*\$?\s?\d+(?:[.,]\d{1,2})?)*(?:\s*(?:per person|par personne))?|\d+(?:[.,]\d{1,2})?\s?\$(?:\s*(?:per person|par personne))?/gi
// Add-on lines whose whole point is the price ("pour 4 $ de plus", "for $4 extra").
const PRICE_SENTENCE = /pour\s*\d+\s*\$|for\s*\$\s*\d+\s*extra/i

export function priceSpans(text) {
  if (PRICE_SENTENCE.test(text)) return 'all'
  const spans = [...text.matchAll(PRICE)].map(m => [m.index, m.index + m[0].length])
  if (!spans.length) return []
  let rest = text
  for (const [a, b] of [...spans].reverse()) rest = rest.slice(0, a) + rest.slice(b)
  return /^[\s/|•·\-–]*$/.test(rest) ? 'all' : spans
}
