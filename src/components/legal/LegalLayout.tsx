"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface Section {
  heading: string;
  content: (string | { list: string[] })[];
}

interface LegalContent {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}

export function LegalLayout({ en, nl }: { en: LegalContent; nl: LegalContent }) {
  const { lang } = useLanguage();
  const c = lang === "nl" ? nl : en;

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      <section className="py-16 bg-[#0a1428] border-b border-[#c9a84c]/10">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            Global Horse Auction
          </p>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">{c.title}</h1>
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">{c.subtitle}</p>
          <p className="text-xs text-[#4a5a70] mt-3 font-[family-name:var(--font-inter)]">{c.lastUpdated}</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        {c.sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4 flex items-center gap-3">
              <span className="text-sm font-mono text-[#c9a84c]/40">{String(i + 1).padStart(2, "0")}</span>
              {section.heading}
            </h2>
            <div className="space-y-4 pl-8">
              {section.content.map((block, j) =>
                typeof block === "string" ? (
                  <p key={j} className="text-[#a8bfd4] text-sm leading-relaxed font-[family-name:var(--font-inter)]">
                    {block}
                  </p>
                ) : (
                  <ul key={j} className="space-y-2">
                    {block.list.map((item, k) => (
                      <li key={k} className="flex items-start gap-3 text-sm text-[#a8bfd4] font-[family-name:var(--font-inter)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        ))}

        <div className="pt-8 border-t border-[#c9a84c]/10">
          <p className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">
            {lang === "nl" ? "Vragen?" : "Questions?"}{" "}
            <a href="mailto:info@globalhorseauction.com" className="text-[#c9a84c] hover:underline">
              info@globalhorseauction.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
