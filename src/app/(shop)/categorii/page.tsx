import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { getShopCategories } from "@/lib/services/category.service";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Categorii stații încărcare EV — AC, DC, accesorii",
  description:
    "Explorează categoriile de stații încărcare mașini electrice: AC wallbox, stații rapide DC și accesorii pentru rețea încărcare electrică.",
  path: "/categorii",
});

export default async function CategoriesPage() {
  const categories = await getShopCategories();

  return (
    <>
      <PageHeader
        title="Categorii"
        description="Găsește soluția potrivită: stații AC pentru acasă, DC pentru flote sau accesorii profesionale."
      />
      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Categorii" }]} className="mb-8" />

        <div className="grid gap-6 sm:grid-cols-2">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
          <h3 className="text-xl font-bold text-surface-900">
            Nu ești sigur ce categorie ți se potrivește?
          </h3>
          <p className="mx-auto mt-2 max-w-md text-surface-600">
            Consultanții noștri tehnici te ajută gratuit să alegi echipamentul
            ideal.
          </p>
          <Link
            href="/contact"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Contactează-ne <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </>
  );
}
