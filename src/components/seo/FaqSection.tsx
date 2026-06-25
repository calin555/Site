"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/lib/seo/faq-content";

interface FaqSectionProps {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  id?: string;
  className?: string;
}

export function FaqSection({
  items,
  title = "Întrebări frecvente despre încărcarea EV",
  subtitle = "Răspunsuri la cele mai comune întrebări despre stații încărcare, costuri, conectori și diferența AC vs DC.",
  id = "faq",
  className,
}: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id={id} className={cn("scroll-mt-24", className)} aria-labelledby={`${id}-title`}>
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-600">
          FAQ
        </p>
        <h2 id={`${id}-title`} className="text-2xl font-bold text-surface-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-2xl text-surface-600">{subtitle}</p>
        )}
      </div>

      <div className="mx-auto max-w-3xl divide-y divide-surface-200 rounded-2xl border border-surface-200 bg-white">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const panelId = `${id}-panel-${index}`;
          const buttonId = `${id}-button-${index}`;

          return (
            <div key={item.question}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full min-w-0 items-center justify-between gap-3 px-4 py-4 text-left font-semibold text-surface-900 transition-colors hover:text-brand-700 sm:px-5"
                >
                  <span className="min-w-0 flex-1 break-words">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-surface-400 transition-transform",
                      isOpen && "rotate-180 text-brand-600"
                    )}
                  />
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={cn("px-5 pb-4 text-sm leading-relaxed text-surface-600", !isOpen && "hidden")}
              >
                {item.answer}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
