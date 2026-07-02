import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Shield,
  Truck,
  Headphones,
  Star,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/shared/Container";
import { EnergyField, ChargePulse } from "@/components/shared/EnergyField";
import { HeroProductShowcase } from "@/components/shop/home/HeroProductShowcase";
import type { CatalogProduct } from "@/types/catalog";

const stats = [
  { value: "2.500+", label: "Stații instalate" },
  { value: "98%", label: "Clienți mulțumiți" },
  { value: "24h", label: "Livrare din stoc" },
];

interface HeroBannerProps {
  heroProducts?: CatalogProduct[];
}

export function HeroBanner({ heroProducts = [] }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden gradient-dark-grid">
      {/* Animated energy field: aurora + sparks + circuit traces */}
      <EnergyField variant="dark" particles circuits />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Signature light beams */}
        <div className="absolute -top-40 left-1/2 h-[32rem] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-400/40 to-transparent" />
        <div className="absolute -top-24 left-1/4 h-80 w-px bg-gradient-to-b from-transparent via-sky-400/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-accent/5" />
        {/* Smart-grid horizon floor */}
        <div className="grid-floor absolute inset-x-[-20%] bottom-0 h-56" />
      </div>

      <Container className="relative py-16 sm:py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8">
            <div className="animate-slide-up glass-dark inline-flex max-w-full flex-wrap items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-brand-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Lider în infrastructură EV din România
            </div>

            <h1 className="animate-slide-up stagger-1 font-display text-balance break-words text-4xl font-bold leading-[1.06] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] sm:text-5xl lg:text-6xl">
              Stații încărcare EV{" "}
              <span className="text-gradient-brand text-glow">România</span>
              {" "}— AC & DC rapid
            </h1>

            <p className="animate-slide-up stagger-2 max-w-lg text-lg leading-relaxed text-surface-200">
              Încărcătoare EV, stații rapide DC și wallbox AC pentru încărcare auto
              electrică acasă, afaceri și flote. Consultanță gratuită, instalare ANRE.
            </p>

            <div className="animate-slide-up stagger-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/produse" className="w-full sm:w-auto">
                <Button size="lg" className="w-full shadow-lg shadow-brand-600/30">
                  Vezi produsele
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-white/25 bg-white/5 text-white backdrop-blur-sm hover:border-brand-400 hover:bg-brand-500/10 hover:text-white"
                >
                  Ofertă personalizată
                </Button>
              </Link>
            </div>

            <div className="animate-slide-up stagger-4 flex flex-wrap items-center gap-x-6 gap-y-3 pt-2">
              {[
                { icon: Shield, label: "Garanție 5 ani" },
                { icon: Truck, label: "Livrare 24–48h" },
                { icon: Headphones, label: "Suport tehnic RO" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm font-medium text-surface-200"
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-400" />
                  {label}
                </div>
              ))}
              <div className="flex items-center gap-1 text-sm text-surface-300">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="ml-1 font-medium text-surface-200">
                  4.9/5 din 320+ recenzii
                </span>
              </div>
            </div>

            <div className="animate-slide-up stagger-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-surface-300 sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Charge-pulse rings radiating from the station */}
            <ChargePulse className="scale-125" />

            {/* Glowing charging cable flowing toward the product */}
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 top-1/2 hidden h-24 w-32 -translate-y-1/2 lg:block"
              viewBox="0 0 128 96"
              fill="none"
            >
              <path
                d="M0 48 H60 q12 0 12 -12 V20 q0 -12 12 -12 H128"
                stroke="rgba(15,184,126,0.15)"
                strokeWidth="1.5"
              />
              <path
                d="M0 48 H60 q12 0 12 12 V76 q0 12 12 12 H128"
                stroke="rgba(56,189,248,0.12)"
                strokeWidth="1.5"
              />
              <path
                className="energy-flow-slow"
                d="M0 48 H60 q12 0 12 -12 V20 q0 -12 12 -12 H128"
                stroke="#a3e635"
                strokeWidth="2"
                strokeOpacity="0.7"
              />
            </svg>

            <div className="animate-fade-in stagger-3 relative">
              {heroProducts.length > 0 ? (
                <HeroProductShowcase products={heroProducts} />
              ) : (
                <div className="animate-glow relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-elev-3">
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-800 via-surface-900 to-brand-950 p-8 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/20">
                      <Zap className="h-10 w-10 text-brand-400" />
                    </div>
                    <p className="max-w-xs text-sm text-surface-300">
                      Adaugă primul produs în admin pentru a afișa imaginea aici
                    </p>
                    <Link href="/admin/produse/nou">
                      <Button size="sm">Adaugă produs</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
