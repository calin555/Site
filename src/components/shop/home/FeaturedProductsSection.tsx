import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";
import type { CatalogProduct } from "@/types/catalog";

interface FeaturedProductsSectionProps {
  products: CatalogProduct[];
}

export function FeaturedProductsSection({
  products,
}: FeaturedProductsSectionProps) {
  return (
    <section className="relative isolate overflow-hidden bg-surface-50 py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-brand-100/50 blur-3xl" />
      </div>

      <Container className="relative">
        <AnimateIn>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                <Flame className="h-3.5 w-3.5" />
                Cele mai vândute
              </div>
              <SectionHeading
                title="Produse recomandate"
                subtitle="Selectate de inginerii noștri tehnici. Calitate verificată, stoc disponibil."
              />
            </div>
            <Link href="/produse">
              <Button>
                Vezi tot catalogul
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </AnimateIn>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.length > 0 ? (
            products.map((product, i) => (
              <AnimateIn key={product.id} delay={i * 120}>
                <ProductCard product={product} />
              </AnimateIn>
            ))
          ) : (
            <AnimateIn className="col-span-full">
              <div className="rounded-2xl border border-dashed border-surface-300 bg-white px-6 py-12 text-center">
                <p className="text-lg font-semibold text-surface-800">
                  Niciun produs încă
                </p>
                <p className="mt-2 text-sm text-surface-500">
                  Adaugă produse din panoul de admin pentru a le afișa aici.
                </p>
                <Link href="/admin/produse/nou" className="mt-4 inline-block">
                  <Button size="sm">Adaugă primul produs</Button>
                </Link>
              </div>
            </AnimateIn>
          )}
        </div>
        {/* Conversion nudge */}
        <AnimateIn delay={400}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-6 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-surface-700">
              <span className="font-semibold text-surface-900">
                Transport gratuit
              </span>{" "}
              pentru comenzi peste 5.000 RON · Plata în rate disponibilă
            </p>
            <Link href="/produse">
              <Button size="sm" variant="outline" className="shrink-0 border-brand-300 text-brand-700 hover:bg-brand-100">
                Începe cumpărăturile
              </Button>
            </Link>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
