import Link from "next/link";
import { Shield, Video, Gavel, Truck, HeartHandshake, CheckCircle, ArrowRight } from "lucide-react";
import { getLang } from "@/lib/lang";
import { t } from "@/lib/i18n";

export default async function HowItWorksPage() {
  const lang = await getLang();

  const steps = [
    {
      number: "01",
      icon: Shield,
      title: t(lang, 'howItWorks', 'step1title'),
      description: t(lang, 'howItWorks', 'step1desc'),
      details: [
        t(lang, 'howItWorks', 'step1d1'),
        t(lang, 'howItWorks', 'step1d2'),
        t(lang, 'howItWorks', 'step1d3'),
        t(lang, 'howItWorks', 'step1d4'),
      ],
    },
    {
      number: "02",
      icon: Video,
      title: t(lang, 'howItWorks', 'step2title'),
      description: t(lang, 'howItWorks', 'step2desc'),
      details: [
        t(lang, 'howItWorks', 'step2d1'),
        t(lang, 'howItWorks', 'step2d2'),
        t(lang, 'howItWorks', 'step2d3'),
        t(lang, 'howItWorks', 'step2d4'),
      ],
    },
    {
      number: "03",
      icon: Gavel,
      title: t(lang, 'howItWorks', 'step3title'),
      description: t(lang, 'howItWorks', 'step3desc'),
      details: [
        t(lang, 'howItWorks', 'step3d1'),
        t(lang, 'howItWorks', 'step3d2'),
        t(lang, 'howItWorks', 'step3d3'),
        t(lang, 'howItWorks', 'step3d4'),
      ],
    },
    {
      number: "04",
      icon: HeartHandshake,
      title: t(lang, 'howItWorks', 'step4title'),
      description: t(lang, 'howItWorks', 'step4desc'),
      details: [
        t(lang, 'howItWorks', 'step4d1'),
        t(lang, 'howItWorks', 'step4d2'),
        t(lang, 'howItWorks', 'step4d3'),
        t(lang, 'howItWorks', 'step4d4'),
      ],
    },
    {
      number: "05",
      icon: Truck,
      title: t(lang, 'howItWorks', 'step5title'),
      description: t(lang, 'howItWorks', 'step5desc'),
      details: [
        t(lang, 'howItWorks', 'step5d1'),
        t(lang, 'howItWorks', 'step5d2'),
        t(lang, 'howItWorks', 'step5d3'),
        t(lang, 'howItWorks', 'step5d4'),
      ],
    },
  ];

  const faqs = [
    { q: t(lang, 'howItWorks', 'faq1q'), a: t(lang, 'howItWorks', 'faq1a') },
    { q: t(lang, 'howItWorks', 'faq2q'), a: t(lang, 'howItWorks', 'faq2a') },
    { q: t(lang, 'howItWorks', 'faq3q'), a: t(lang, 'howItWorks', 'faq3a') },
    { q: t(lang, 'howItWorks', 'faq4q'), a: t(lang, 'howItWorks', 'faq4a') },
    { q: t(lang, 'howItWorks', 'faq5q'), a: t(lang, 'howItWorks', 'faq5a') },
    { q: t(lang, 'howItWorks', 'faq6q'), a: t(lang, 'howItWorks', 'faq6a') },
  ];

  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      {/* Header */}
      <section className="py-20 bg-[#0a1428] border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            {t(lang, 'howItWorks', 'theProcess')}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            {t(lang, 'howItWorks', 'title')}
          </h1>
          <p className="text-lg text-[#7a8fa8] max-w-xl mx-auto font-[family-name:var(--font-inter)]">
            {t(lang, 'howItWorks', 'subtitle')}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="space-y-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-8 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/25 transition-all group"
            >
              <div className="lg:col-span-1 flex lg:flex-col items-center lg:items-start gap-4">
                <div className="text-5xl font-bold text-[#c9a84c]/20 font-[family-name:var(--font-playfair)] leading-none">
                  {step.number}
                </div>
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center group-hover:bg-[#c9a84c]/15 transition-all">
                  <step.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#a8bfd4] leading-relaxed font-[family-name:var(--font-inter)] text-sm">
                  {step.description}
                </p>
              </div>
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {step.details.map((detail) => (
                  <div key={detail} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#c9a84c] shrink-0" />
                    <span className="text-sm text-[#7a8fa8] font-[family-name:var(--font-inter)]">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#040a18] border-t border-[#c9a84c]/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
              {t(lang, 'howItWorks', 'commonQuestions')}
            </p>
            <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">{t(lang, 'howItWorks', 'faq')}</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="p-6 bg-[#0a1428] rounded-xl border border-[#c9a84c]/10">
                <h4 className="font-bold text-white mb-2 font-[family-name:var(--font-inter)]">{faq.q}</h4>
                <p className="text-sm text-[#7a8fa8] leading-relaxed font-[family-name:var(--font-inter)]">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
          {t(lang, 'howItWorks', 'readyToBid')}
        </h2>
        <p className="text-[#7a8fa8] mb-8 font-[family-name:var(--font-inter)]">
          {t(lang, 'howItWorks', 'ctaDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)]">
            {t(lang, 'howItWorks', 'registerFree')} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)]">
            {t(lang, 'howItWorks', 'speakToSpecialist')}
          </Link>
        </div>
      </section>
    </div>
  );
}
