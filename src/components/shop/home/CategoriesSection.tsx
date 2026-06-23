import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { CategoryCard } from "@/components/shop/CategoryCard";
import { Button } from "@/components/ui/Button";
import type { Category } from "@/lib/mock-data";

interface CategoriesSectionProps {
  categories: Category[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <AnimateIn>
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              badge="Categorii"
              title="Găsește soluția potrivită"
              subtitle="De la wallbox-uri rezidențiale la stații DC pentru flote — totul într-un singur loc."
            />
            <Link href="/categorii">
              <Button variant="outline">
                Toate categoriile
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </AnimateIn>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <AnimateIn key={category.id} delay={i * 100}>
              <CategoryCard category={category} />
            </AnimateIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
