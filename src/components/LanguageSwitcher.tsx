'use client'
import { useLanguage } from '@/contexts/LanguageContext'

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1 bg-[#0a1428] border border-[#c9a84c]/15 rounded-lg p-0.5">
      {(['en', 'nl'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wider transition-all font-[family-name:var(--font-inter)] uppercase"
          style={{
            background: lang === l ? '#c9a84c' : 'transparent',
            color: lang === l ? '#060c1d' : '#7a8fa8',
          }}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
