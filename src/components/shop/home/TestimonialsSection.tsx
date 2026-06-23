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
            subtitle="Peste 2.500 de instalări și o rată de satisfacție de 98%. Iată câteva povești reale."
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

        {/* Social proof bar */}
        <AnimateIn delay={450}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 rounded-2xl bg-surface-50 px-6 py-5">
            <div className="text-center">
              <p className="text-2xl font-bold text-surface-900">4.9/5</p>
              <p className="text-xs text-surface-500">Rating mediu</p>
            </div>
            <div className="hidden h-8 w-px bg-surface-200 sm:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-surface-900">320+</p>
              <p className="text-xs text-surface-500">Recenzii verificate</p>
            </div>
            <div className="hidden h-8 w-px bg-surface-200 sm:block" />
            <div className="text-center">
              <p className="text-2xl font-bold text-surface-900">98%</p>
              <p className="text-xs text-surface-500">Recomandă ChargePro</p>
            </div>
          </div>
        </AnimateIn>
      </Container>
    </section>
  );
}
