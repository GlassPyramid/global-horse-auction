import Image from "next/image";
import Link from "next/link";
import { Globe, Shield, Trophy, Users, ArrowRight } from "lucide-react";

const values = [
  { icon: Shield, title: "Integrity First", desc: "Every horse is vet-checked, every claim verified. We refuse listings that don't meet our standards. Our reputation is built on yours." },
  { icon: Globe, title: "Truly Global", desc: "We connect buyers and sellers across 60+ countries. Language, currency, and borders are never an obstacle when you work with us." },
  { icon: Trophy, title: "Elite Standard", desc: "We curate fewer than 20% of horse submissions. Every lot in a Global Horse Auction represents the best in its category." },
  { icon: Users, title: "Expert Team", desc: "Our team combines decades of international competition, breeding, and equestrian business experience across Europe, the Americas, and the Middle East." },
];

const team = [
  { name: "Alexandra van den Berg", role: "Founder & CEO", country: "Netherlands", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80" },
  { name: "Carlos Mendez-Ruiz", role: "Head of Sport Horse Selection", country: "Spain", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Sophia Hartmann", role: "Head of Breeding & Investment", country: "Germany", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
  { name: "James O'Sullivan", role: "Director of International Sales", country: "Ireland", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060c1d] pt-20">
      {/* Hero */}
      <section className="relative py-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1573246123716-6b1782bfc499?w=1920&q=90"
            alt="About Global Horse Auction"
            fill
            className="object-cover opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060c1d]/70 to-[#060c1d]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            Our Story
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white font-[family-name:var(--font-playfair)] mb-6">
            Redefining the<br />
            <span style={{ color: "#c9a84c" }}>Horse Auction</span>
          </h1>
          <p className="text-lg text-[#a8bfd4] max-w-2xl mx-auto font-[family-name:var(--font-inter)] leading-relaxed">
            Global Horse Auction was founded with one conviction: the world's most exceptional sport horses deserve a marketplace that matches their quality. We built the platform we always wished existed.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-4 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
              Our Mission
            </p>
            <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-6">
              Exceptional horses deserve an exceptional marketplace
            </h2>
            <p className="text-[#a8bfd4] leading-relaxed font-[family-name:var(--font-inter)] mb-4">
              The traditional horse industry has been opaque, geographically limited, and inconsistent in standards. Buyers couldn't trust what they were buying. Sellers couldn't reach the right buyers. The best horses were changing hands behind closed doors.
            </p>
            <p className="text-[#a8bfd4] leading-relaxed font-[family-name:var(--font-inter)] mb-4">
              We changed that. Global Horse Auction brings transparency, trust, and a global audience to every transaction. Every horse is vetted, every claim verified, every buyer educated. We don't just facilitate sales — we curate futures.
            </p>
            <p className="text-[#a8bfd4] leading-relaxed font-[family-name:var(--font-inter)]">
              Since our founding, we've facilitated over €2.4 billion in transactions across 60+ countries, connecting the world's most discerning buyers with its most exceptional horses.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "€2.4B+", label: "Total Sales Volume" },
              { value: "4,800+", label: "Horses Sold" },
              { value: "60+", label: "Countries" },
              { value: "12,000+", label: "Registered Bidders" },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 p-6 text-center">
                <div className="text-3xl font-bold text-[#c9a84c] font-[family-name:var(--font-playfair)] mb-2">{stat.value}</div>
                <div className="text-xs text-[#7a8fa8] uppercase tracking-wider font-[family-name:var(--font-inter)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-[#040a18] border-y border-[#c9a84c]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
              What We Stand For
            </p>
            <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-6 bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-all group">
                <div className="w-12 h-12 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center mb-4 group-hover:bg-[#c9a84c]/15 transition-all">
                  <v.icon className="w-5 h-5 text-[#c9a84c]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">{v.title}</h3>
                <p className="text-sm text-[#7a8fa8] leading-relaxed font-[family-name:var(--font-inter)]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#c9a84c] tracking-widest uppercase mb-3 font-[family-name:var(--font-inter)]" style={{ letterSpacing: "0.3em" }}>
            The People Behind GHA
          </p>
          <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">Our Team</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="group bg-[#0a1428] rounded-2xl border border-[#c9a84c]/10 overflow-hidden hover:border-[#c9a84c]/30 transition-all">
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={member.img}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] to-transparent opacity-60" />
              </div>
              <div className="p-5">
                <h4 className="font-bold text-white font-[family-name:var(--font-playfair)]">{member.name}</h4>
                <p className="text-xs text-[#c9a84c] font-[family-name:var(--font-inter)] mt-1">{member.role}</p>
                <p className="text-xs text-[#4a5a70] font-[family-name:var(--font-inter)] mt-0.5">{member.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center bg-[#040a18] border-t border-[#c9a84c]/10">
        <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-4">
          Join the Global Standard
        </h2>
        <p className="text-[#7a8fa8] mb-8 font-[family-name:var(--font-inter)] max-w-lg mx-auto">
          Whether you&apos;re buying your first top-level horse or your twentieth, we&apos;re here to make it the best experience of your equestrian career.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="flex items-center gap-2 px-8 py-4 bg-[#c9a84c] text-[#060c1d] font-bold text-sm tracking-widest uppercase hover:bg-[#e2c97e] transition-all glow-gold font-[family-name:var(--font-inter)]">
            Create Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/sell" className="px-8 py-4 border border-[#c9a84c]/40 text-[#c9a84c] font-semibold text-sm tracking-widest uppercase hover:bg-[#c9a84c]/10 transition-all font-[family-name:var(--font-inter)]">
            Sell Your Horse
          </Link>
        </div>
      </section>
    </div>
  );
}
