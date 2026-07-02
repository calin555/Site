"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import { cn, formatPrice, isExternalImageUrl } from "@/lib/utils";
import type { CatalogProduct } from "@/types/catalog";

const ROTATE_MS = 4200;

function getBadge(product: CatalogProduct): { label: string; tone: string } {
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    return { label: "Ofertă", tone: "bg-accent/20 text-lime-200 ring-accent/40" };
  }
  if (product.isNew) {
    return { label: "Nou", tone: "bg-sky-400/20 text-sky-200 ring-sky-400/40" };
  }
  if (product.isFeatured) {
    return { label: "Bestseller", tone: "bg-brand-500/20 text-brand-200 ring-brand-500/40" };
  }
  return { label: "Recomandat", tone: "bg-white/10 text-surface-200 ring-white/20" };
}

interface HeroProductShowcaseProps {
  products: CatalogProduct[];
}

/**
 * Auto-rotating product showcase for the hero. Pure presentation:
 * consumes existing catalog data, links to existing product pages.
 * Pauses on hover/focus, supports manual dots, honors prefers-reduced-motion.
 */
export function HeroProductShowcase({ products }: HeroProductShowcaseProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  useEffect(() => {
    if (paused || products.length < 2 || reducedMotionRef.current) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % products.length),
      ROTATE_MS
    );
    return () => clearInterval(id);
  }, [paused, products.length]);

  if (products.length === 0) return null;

  const active = products[index] ?? products[0];
  const badge = getBadge(active);
  const discount =
    active.compareAtPrice && active.compareAtPrice > active.price
      ? Math.round((1 - active.price / active.compareAtPrice) * 100)
      : null;

  return (
    <div
      role="region"
      aria-roledescription="carusel"
      aria-label="Produse recomandate"
      className="energy-border-live relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-elev-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Stacked slides — crossfade + scale (GPU only) */}
      {products.map((product, i) => (
        <div
          key={product.id}
          aria-hidden={i !== index}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-out motion-reduce:transition-none",
            i === index
              ? "z-[1] scale-100 opacity-100"
              : "pointer-events-none scale-[1.06] opacity-0"
          )}
        >
          <Image
            src={product.image}
            alt={`Stație încărcare EV ${product.name} — ${product.powerKw} kW`}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized={isExternalImageUrl(product.image)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950/85 via-surface-950/20 to-transparent" />
        </div>
      ))}

      {/* Discount flash */}
      {discount !== null && (
        <div
          key={`disc-${active.id}`}
          className="animate-scale-in absolute right-4 top-4 z-[2] rounded-2xl border border-accent/30 bg-accent/15 px-3.5 py-2 backdrop-blur-md"
        >
          <p className="font-display text-xl font-bold text-white">-{discount}%</p>
        </div>
      )}

      {/* Product info card */}
      <div
        key={active.id}
        className="animate-fade-in glass-dark absolute inset-x-4 bottom-4 z-[2] rounded-2xl p-4"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset",
                  badge.tone
                )}
              >
                {badge.label}
              </span>
              {active.powerKw > 0 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-surface-300">
                  <Zap className="h-3 w-3 text-accent" />
                  {active.powerKw} kW
                </span>
              )}
            </div>
            <p className="mt-1.5 truncate font-display text-sm font-bold text-white">
              {active.name}
            </p>
            <p className="font-display text-lg font-bold tracking-tight text-brand-300">
              {formatPrice(active.price)}
              {active.compareAtPrice && active.compareAtPrice > active.price && (
                <span className="ml-2 text-xs font-medium text-surface-400 line-through">
                  {formatPrice(active.compareAtPrice)}
                </span>
              )}
            </p>
          </div>
          <Link
            href={`/produse/${active.slug}`}
            className="gradient-brand ring-highlight btn-sheen inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-5 text-sm font-semibold text-white shadow-elev-1 transition-all duration-300 hover:shadow-glow-brand"
          >
            Vezi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Manual dots */}
      {products.length > 1 && (
        <div className="absolute left-1/2 top-4 z-[2] flex -translate-x-1/2 items-center gap-2">
          {products.map((product, i) => (
            <button
              key={product.id}
              type="button"
              aria-label={`Arată ${product.name}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-6 bg-accent shadow-[0_0_8px_rgba(163,230,53,0.7)]"
                  : "w-1.5 bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
