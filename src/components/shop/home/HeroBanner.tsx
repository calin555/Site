import Link from "next/link";
import Image from "next/image";
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
import { formatPrice, isExternalImageUrl } from "@/lib/utils";
import type { CatalogProduct } from "@/types/catalog";

const stats = [
  { value: "2.500+", label: "Stații instalate" },
  { value: "98%", label: "Clienți mulțumiți" },
  { value: "24h", label: "Livrare din stoc" },
];

interface HeroBannerProps {
  heroProduct?: CatalogProduct;
}

export function HeroBanner({ heroProduct }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden gradient-dark-grid">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float absolute -right-20 top-20 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div
          className="animate-float absolute -left-20 bottom-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        {/* Signature light beam */}
        <div className="absolute -top-40 left-1/2 h-[32rem] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand-400/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-accent/5" />
      </div>

      <Container className="relative py-16 sm:py-24 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8">
            <div className="animate-slide-up glass-dark inline-flex max-w-full flex-wrap items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-brand-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Lider în infrastructură EV din România
            </div>

            <h1 className="animate-slide-up stagger-1 font-display text-balance break-words text-4xl font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Stații încărcare EV{" "}
              <span className="text-gradient-brand">România</span>
              {" "}— AC & DC rapid
            </h1>

            <p className="animate-slide-up stagger-2 max-w-lg text-lg leading-relaxed text-surface-300">
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
                  className="w-full border-surface-600 bg-white/5 text-white backdrop-blur-sm hover:border-brand-400 hover:bg-brand-500/10 hover:text-white"
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
                  className="flex items-center gap-2 text-sm text-surface-400"
                >
                  <CheckCircle2 className="h-4 w-4 text-brand-400" />
                  {label}
                </div>
              ))}
              <div className="flex items-center gap-1 text-sm text-surface-400">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="ml-1 font-medium text-surface-300">
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
                  <p className="mt-0.5 text-xs text-surface-400 sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="animate-fade-in stagger-3 relative">
              <div className="animate-glow relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-elev-3">
                {heroProduct?.image ? (
                  <Image
                    src={heroProduct.image}
                    alt={
                      heroProduct.name
                        ? `Stație încărcare EV ${heroProduct.name} — ${heroProduct.powerKw} kW`
                        : "Stație de încărcare vehicule electrice România"
                    }
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    unoptimized={isExternalImageUrl(heroProduct.image)}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-surface-800 via-surface-900 to-brand-950 p-8 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500/20">
                      <Zap className="h-10 w-10 text-brand-400" />
                    </div>
                    <p className="max-w-xs text-sm text-surface-300">
                      Adaugă primul produs în admin pentru a afișa imaginea aici
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/70 via-transparent to-transparent" />
              </div>

              {heroProduct ? (
                <div className="animate-float glass-dark absolute -bottom-6 -left-6 w-64 rounded-2xl p-4 shadow-elev-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl">
                      <Image
                        src={heroProduct.image}
                        alt={
                      heroProduct.name
                        ? `Stație încărcare EV ${heroProduct.name} — ${heroProduct.powerKw} kW`
                        : "Stație de încărcare vehicule electrice România"
                    }
                        fill
                        className="object-cover"
                        unoptimized={isExternalImageUrl(heroProduct.image)}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-brand-400">
                        Bestseller
                      </p>
                      <p className="text-sm font-bold text-white line-clamp-1">
                        {heroProduct.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xl font-bold text-brand-400">
                      {formatPrice(heroProduct.price)}
                    </p>
                    <Link href={`/produse/${heroProduct.slug}`}>
                      <Button size="sm">Vezi</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="animate-float glass-dark absolute -bottom-6 -left-6 w-64 rounded-2xl p-4 shadow-elev-3">
                  <p className="text-sm font-medium text-white">
                    Catalog în pregătire
                  </p>
                  <p className="mt-1 text-xs text-surface-400">
                    Adaugă primul produs din admin
                  </p>
                  <Link href="/admin/produse/nou" className="mt-3 block">
                    <Button size="sm" className="w-full">
                      Adaugă produs
                    </Button>
                  </Link>
                </div>
              )}
              <div className="animate-pulse-soft absolute -right-4 top-8 rounded-2xl border border-accent/30 bg-accent/15 px-4 py-3 backdrop-blur-md">
                <p className="font-display text-2xl font-bold text-white">-12%</p>
                <p className="text-xs text-lime-200">Ofertă limitată</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
