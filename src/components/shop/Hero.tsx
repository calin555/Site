import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, Truck, Headphones } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/shared/Container";

export function Hero() {
  return (
    <section className="relative overflow-hidden gradient-dark-grid">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600/10 via-transparent to-accent/10" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

      <Container className="relative py-20 sm:py-28 lg:py-36">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300">
              <Zap className="h-4 w-4" />
              Soluții complete de încărcare EV
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              Energia viitorului,{" "}
              <span className="bg-gradient-to-r from-brand-400 to-accent bg-clip-text text-transparent">
                instalată azi
              </span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-surface-300">
              Stații de încărcare premium pentru acasă, afaceri și flote.
              Consultanță tehnică, instalare profesională și suport dedicat în
              România.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/produse">
                <Button size="lg" className="w-full sm:w-auto">
                  Explorează produsele
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full border-surface-600 bg-transparent text-white hover:border-brand-400 hover:bg-brand-500/10 hover:text-white sm:w-auto"
                >
                  Solicită ofertă
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-4">
              {[
                { icon: Shield, label: "Garanție până la 5 ani" },
                { icon: Truck, label: "Livrare rapidă" },
                { icon: Headphones, label: "Suport tehnic RO" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-sm text-surface-400"
                >
                  <Icon className="h-4 w-4 text-brand-400" />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-surface-700/50 shadow-2xl shadow-brand-500/10">
              <Image
                src="https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=800&h=600&fit=crop"
                alt="Stație de încărcare EV premium"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-950/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-surface-300">Cel mai vândut</p>
                    <p className="text-lg font-bold text-white">
                      ChargePro Home 7.4 kW
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-brand-400">2.899 RON</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
