export type Theme = 'light' | 'dark'

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/** White-wordmark logos are the originals; light theme uses navy-wordmark copies. */
export function logoSrc(name: 'main' | 'footer', theme: Theme, onDark = false): string {
  return onDark || theme === 'dark' ? `/assets/logo-${name}.webp` : `/assets/logo-${name}-light.webp`
}
