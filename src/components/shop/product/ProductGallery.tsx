"use client";

import { useState } from "react";
import Image from "next/image";
import { cn, isExternalImageUrl } from "@/lib/utils";
import { dedupeProductImages } from "@/lib/product-images";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const uniqueImages = dedupeProductImages(images);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = uniqueImages[activeIndex] ?? uniqueImages[0];

  if (!active) return null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-surface-200 bg-surface-100">
        <Image
          src={active.url}
          alt={active.alt || productName}
          fill
          className="object-cover transition-opacity duration-300"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          unoptimized={isExternalImageUrl(active.url)}
        />
        {uniqueImages.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-surface-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {uniqueImages.length}
          </div>
        )}
      </div>

      {uniqueImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {uniqueImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Imagine ${i + 1}: ${img.alt}`}
              aria-current={i === activeIndex ? "true" : undefined}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                i === activeIndex
                  ? "border-brand-500 ring-2 ring-brand-500/20"
                  : "border-surface-200 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={isExternalImageUrl(img.url)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
