import Link from "next/link";
import { Shield, Video, Gavel, Truck, HeartHandshake, CheckCircle, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Shield,
    title: "Create & Verify Your Account",
    description: "Register in under 2 minutes. Our team reviews and verifies every bidder within 24 hours. You'll need to provide valid ID for account approval — this ensures only serious buyers participate in our auctions.",
    details: ["Free account creation", "ID verification required", "Approval within 24 hours", "Secure & confidential process"],
  },
  {
    number: "02",
    icon: Video,
    title: "Browse & Research",
    description: "Every horse in our catalog comes with professional photography, HD video footage, full vet check documentation, competition records, and complete bloodline certification. No surprises.",
    details: ["HD video of every horse", "Full vet check reports", "Competition history archive", "Bloodline & passport certificates"],
  },
  {
    number: "03",
    icon: Gavel,
    title: "Place Your Bids",
    description: "Bid live in real-time from anywhere in the world. Set automatic maximum bids, receive outbid notifications via email and SMS, and watch the live bidding stream. Our platform handles bids from 60+ countries simultaneously.",
    details: ["Live & online simultaneous bidding", "Automatic maximum bid setting", "Instant outbid notifications", "24/7 support during live auctions"],
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "Win & Confirm",
    description: "When you win, our team contacts you within 2 hours. A buyer's premium of 10% (+ VAT where applicable) is added to the hammer price. Payment is due within 5 business days via bank transfer.",
    details: ["10% buyer's premium", "Payment within 5 business days", "Bank transfer or escrow", "Purchase contract provided"],
  },
  {
    number: "05",
    icon: Truck,
    title: "Collection & Transport",
    description: "We partner with Europe's leading equine transport specialists. Our team coordinates everything — health certificates, export documents, insurance, and door-to-door delivery to any country worldwide.",
    details: ["Worldwide transport arranged", "Health & export certificates", "Insurance during transit", "Coordination with your yard"],
  },
];

const faqs = [
  { q: "Who can bid on Global Horse Auction?", a: "Anyone worldwide. You must be 18+ and complete our identity verification process. We accept bidders from 60+ countries." },
  { q: "What is the buyer's premium?", a: "A 10% buyer's premium is added to the hammer price. VAT is applied where required by law. This is standard practice across the industry." },
  { q: "Can I inspect the horse before the auction?", a: "Yes. We encourage pre-auction viewings at the seller's yard. Contact our team to arrange a visit. All vet checks are fully disclosed in advance." },
  { q: "What payment methods do you accept?", a: "Bank transfer (SWIFT/SEPA) within 5 business days of winning. We also facilitate escrow arrangements for high-value lots on request." },
  { q: "What happens if a horse fails a pre-purchase vet check?", a: "Our auction terms include provisions for failed PPE exams. Disputes are handled by our arbitration committee. All horses are sold subject to our standard conditions of sale." },
  { q: "Can I sell my horse through Global Horse Auction?", a: "Yes. We accept applications from professional sellers, breeders, and serious amateurs. Contact us or use our Sell Your Horse inquiry form. We accept less than 20% of applications." },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      {/* Header */}
      <section className="py-20 bg-[#0a1428] border-b border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            The Process
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
            How It Works
          </h1>
          <p className="text-lg text-[#7a8fa8] max-w-xl mx-auto font-[family-name:var(--font-inter)]">
            Transparent, professional, and designed for serious equestrians worldwide.
            Our five-step process ensures every transaction is smooth and secure.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-24 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="space-y-6">
          {steps.map((step, i) => (
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
              Common Questions
            </p>
            <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">FAQ</h2>
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
          Ready to Start Bidding?
        </h2>
        <p className="text-[#7a8fa8] mb-8 font-[family-name:var(--font-inter)]">
          Create your free account and join 12,000+ professionals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)]">
            Register Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/contact" className="px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)]">
            Speak to a Specialist
          </Link>
        </div>
      </section>
    </div>
  );
}
