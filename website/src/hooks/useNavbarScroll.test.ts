import { describe, expect, it } from 'vitest'
import { navHidden } from './useNavbarScroll'

describe('navHidden: the header slips away while reading down, comes back on the way up', () => {
  it('stays visible near the top of the page', () => {
    expect(navHidden(100, 150, false)).toBe(false)
    expect(navHidden(400, 120, true)).toBe(false)
  })

  it('hides when scrolling down past the threshold', () => {
    expect(navHidden(300, 340, false)).toBe(true)
  })

  it('shows again as soon as the reader scrolls up', () => {
    expect(navHidden(900, 880, true)).toBe(false)
  })

  it('ignores tiny jitters (keeps its state)', () => {
    expect(navHidden(900, 903, false)).toBe(false)
    expect(navHidden(900, 897, true)).toBe(true)
  })
})
