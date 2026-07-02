import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { AnimateIn } from "@/components/shared/AnimateIn";

const HUB_LINKS = [
  {
    href: "/statii-incarcare",
    label: "Ghid stații încărcare",
    description: "Index complet AC, DC, puteri și mărci",
  },
  {
    href: "/statie-incarcare-ac",
    label: "Stații AC wallbox",
    description: "7.4, 11 și 22 kW pentru acasă",
  },
  {
    href: "/statie-incarcare-acasa",
    label: "Stație acasă",
    description: "Montaj rezidențial ANRE",
  },
  {
    href: "/produse",
    label: "Catalog produse",
    description: "Toate modelele din stoc",
  },
] as const;

export function HomeSeoIntro() {
  return (
    <section className="border-b border-surface-200 bg-white">
      <Container className="py-12 sm:py-16">
        <AnimateIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">
              Stație încărcare mașini electrice — de la alegere la instalare
            </h2>
            <p className="mt-4 text-base leading-relaxed text-surface-600 sm:text-lg">
              Cauți o{" "}
              <strong className="font-semibold text-surface-800">
                stație încărcare mașini electrice
              </strong>{" "}
              potrivită pentru garaj, firmă sau flotă? Îți oferim wallbox AC,
              stații rapide DC și accesorii, cu livrare în România și suport
              tehnic dedicat. Explorează{" "}
              <Link
                href="/statii-incarcare"
                className="font-semibold text-brand-600 hover:text-brand-700 hover:underline"
              >
                ghidul complet pentru stații de încărcare
              </Link>{" "}
              sau mergi direct la produsele potrivite nevoii tale.
            </p>
          </div>
        </AnimateIn>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HUB_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group flex h-full flex-col rounded-2xl border border-surface-200 bg-surface-50/80 p-5 transition-all hover:border-brand-300 hover:bg-white hover:shadow-elev-1"
              >
                <span className="font-semibold text-surface-900 group-hover:text-brand-700">
                  {link.label}
                </span>
                <span className="mt-1 flex-1 text-sm text-surface-500">
                  {link.description}
                </span>
                <ArrowRight className="mt-3 h-4 w-4 text-brand-500 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
