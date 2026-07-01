import { Star, Quote } from "lucide-react";
import { AnimateIn } from "@/components/shared/AnimateIn";
import { Container } from "@/components/shared/Container";
import { SectionHeading } from "@/components/shared/SectionHeading";
import type { Testimonial } from "@/lib/mock-data";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-surface-200 text-surface-200"
          }`}
        />
      ))}
    </div>
  );
}

export function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <AnimateIn>
          <SectionHeading
            badge="Recenzii"
            title="Ce spun clienții noștri"
            subtitle="Feedback de la clienți care au instalat stații ChargePro."
            align="center"
            className="mb-14"
          />
        </AnimateIn>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <AnimateIn key={item.id} delay={i * 150}>
              <article className="relative flex h-full flex-col rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
                <Quote className="absolute right-5 top-5 h-8 w-8 text-brand-100" />
                <StarRating rating={item.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-surface-600">
                  &ldquo;{item.content}&rdquo;
                </blockquote>
                <div className="mt-6 flex items-center gap-3 border-t border-surface-100 pt-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {item.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-surface-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      {item.role}
                      {item.company && ` · ${item.company}`}
                    </p>
                  </div>
                </div>
              </article>
            </AnimateIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
