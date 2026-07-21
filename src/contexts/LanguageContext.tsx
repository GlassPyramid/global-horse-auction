'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Lang } from '@/lib/i18n'
import { translations } from '@/lib/i18n'

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (section: keyof typeof translations.en, key: string) => string
}

const Ctx = createContext<LangCtx>({ lang: 'en', setLang: () => {}, t: (_, k) => k })

export function LanguageProvider({ initial, children }: { initial: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial)

  useEffect(() => {
    const stored = localStorage.getItem('lang') as Lang | null
    if (stored && stored !== lang) setLangState(stored)
  }, [])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.cookie = `lang=${l}; path=/; max-age=31536000`
  }, [])

  const tFn = useCallback((section: keyof typeof translations.en, key: string): string => {
    const s = translations[lang][section] as Record<string, string>
    return s?.[key] ?? (translations.en[section] as Record<string, string>)?.[key] ?? key
  }, [lang])

  return <Ctx.Provider value={{ lang, setLang, t: tFn }}>{children}</Ctx.Provider>
}

export function useLanguage() {
  return useContext(Ctx)
}
