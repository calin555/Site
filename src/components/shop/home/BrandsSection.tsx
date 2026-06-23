import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Brand } from "@/lib/mock-data";

interface BrandsSectionProps {
  brands: Brand[];
}

export function BrandsSection({ brands }: BrandsSectionProps) {
  return (
    <section className="border-y border-surface-200 bg-white py-16 sm:py-20">
      <Container>
        <AnimateIn>
          <SectionHeading
            badge="Parteneri"
            title="Branduri de top"
            subtitle="Distribuim exclusiv mărci verificate, cu suport local și garanție în România."
            align="center"
            className="mb-12"
          />
        </AnimateIn>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, i) => (
            <AnimateIn key={brand.id} delay={i * 80}>
              <Link
                href={`/produse/brand/${brand.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-surface-200 bg-surface-50 px-4 py-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-lg hover:shadow-brand-500/5"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white text-lg font-bold text-surface-700 shadow-sm ring-1 ring-surface-200 transition-all group-hover:bg-brand-600 group-hover:text-white group-hover:ring-brand-600">
                  {brand.logo}
                </div>
                <p className="mt-3 text-sm font-semibold text-surface-900">
                  {brand.name}
                </p>
                <p className="mt-0.5 text-xs text-surface-400">
                  {brand.productCount} produse
                </p>
              </Link>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={500}>
          <p className="mt-8 text-center text-sm text-surface-500">
            Nu găsești brandul dorit?{" "}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700"
            >
              Contactează-ne pentru ofertă
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </AnimateIn>
      </Container>
    </section>
  );
}
