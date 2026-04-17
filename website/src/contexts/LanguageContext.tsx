import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Language, type Translations } from '@/i18n/translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('lang')
    return (stored === 'en' || stored === 'fr') ? stored : 'en'
  })

  const setLang = (newLang: Language) => {
    localStorage.setItem('lang', newLang)
    setLangState(newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useT(): Translations {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useT must be used inside LanguageProvider')
  return ctx.t
}

export function useLang(): { lang: Language; setLang: (l: Language) => void } {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return { lang: ctx.lang, setLang: ctx.setLang }
}
