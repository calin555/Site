import {
  Shield,
  Wrench,
  Truck,
  Award,
  Headphones,
  BadgeCheck,
} from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";

const benefits = [
  {
    icon: Shield,
    title: "Garanție până la 5 ani",
    description:
      "Acoperire completă pe stațiile ChargePro. Service rapid în rețeaua noastră națională.",
    stat: "5 ani",
    statLabel: "garanție max",
  },
  {
    icon: Wrench,
    title: "Instalare autorizată ANRE",
    description:
      "Echipă certificată pentru montaj sigur. Proiect tehnic și punere în funcțiune incluse.",
    stat: "500+",
    statLabel: "instalări/an",
  },
  {
    icon: Truck,
    title: "Livrare în 24–48h",
    description:
      "Expediere rapidă din depozitul nostru. Transport gratuit peste 5.000 RON.",
    stat: "24h",
    statLabel: "din stoc",
  },
  {
    icon: Headphones,
    title: "Suport tehnic dedicat",
    description:
      "Linie directă cu ingineri EV. Răspuns în maxim 4 ore în zilele lucrătoare.",
    stat: "4h",
    statLabel: "timp răspuns",
  },
  {
    icon: Award,
    title: "Certificare CE & MID",
    description:
      "Toate produsele respectă standardele europene. Testate pentru condiții climatice RO.",
    stat: "100%",
    statLabel: "conform CE",
  },
  {
    icon: BadgeCheck,
    title: "Consultanță gratuită",
    description:
      "Te ajutăm să dimensionezi corect stația în funcție de vehicul, rețea și buget.",
    stat: "0 RON",
    statLabel: "consultanță",
  },
];

export function BenefitsSection() {
  return (
    <section className="gradient-dark relative overflow-hidden py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 pattern-grid opacity-50" />
      <div className="pointer-events-none absolute -left-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />

      <Container className="relative">
        <AnimateIn>
          <SectionHeading
            badge="De ce ChargePro"
            title="Beneficii care fac diferența"
            subtitle="Mai mult decât un magazin — un partener de încredere pentru tranziția ta spre mobilitate electrică."
            align="center"
            className="mb-14 [&_h2]:text-white [&_p]:text-surface-300 [&_span]:bg-brand-500/20 [&_span]:text-brand-300"
          />
        </AnimateIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <AnimateIn key={benefit.title} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-surface-700/50 bg-surface-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand-500/40 hover:bg-surface-800/80">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-brand-400">
                      {benefit.stat}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-surface-500">
                      {benefit.statLabel}
                    </p>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-400">
                  {benefit.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
