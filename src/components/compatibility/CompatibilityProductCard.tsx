import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ProductCardAddButton } from "@/components/shop/ProductCardAddButton";
import { isExternalImageUrl } from "@/lib/utils";
import {
  BADGE_LABELS,
  type CompatibilityBadge,
  type MatchedProduct,
} from "@/lib/compatibility/types";
import type { CatalogProduct } from "@/types/catalog";
import { buildProductCardTitle } from "@/lib/seo/product-seo-name";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect fill='%23f0f4f2' width='400' height='300'/%3E%3Cpath d='M120 180h160l30-45H150l-30 45z' fill='%230fb87e' opacity='0.35'/%3E%3C/svg%3E";

function productImageSrc(url: string | undefined): string {
  const trimmed = url?.trim();
  return trimmed || PLACEHOLDER_SVG;
}

const BADGE_VARIANTS: Record<
  CompatibilityBadge,
  "brand" | "accent" | "default" | "outline" | "dark"
> = {
  perfect_match: "brand",
  recommended: "accent",
  fast_charging: "dark",
  best_value: "brand",
  professional_installation: "outline",
};

interface CompatibilityProductCardProps {
  product: CatalogProduct;
  match: MatchedProduct;
}

export function CompatibilityProductCard({
  product,
  match,
}: CompatibilityProductCardProps) {
  return (
    <article className="group card-lift energy-border relative flex flex-col overflow-hidden rounded-2xl border border-surface-200/80 bg-white shadow-elev-1">
      <Link href={`/produse/${product.slug}`} className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
          <Image
            src={productImageSrc(product.image)}
            alt={buildProductCardTitle(product)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized={
              isExternalImageUrl(product.image) || !product.image?.trim()
            }
          />
          <div className="absolute left-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-1.5">
            {match.badges.map((badge) => (
              <Badge key={badge} variant={BADGE_VARIANTS[badge]}>
                {BADGE_LABELS[badge]}
              </Badge>
            ))}
          </div>
          {product.powerKw > 0 && (
            <span className="glass-dark absolute bottom-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white">
              <Zap className="h-3 w-3 text-accent" />
              {product.powerKw} kW
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Badge variant="outline" className="mb-2 w-fit">
          {product.brand}
        </Badge>
        <Link href={`/produse/${product.slug}`}>
          <h3 className="font-display font-bold tracking-tight text-surface-900 transition-colors group-hover:text-brand-700 line-clamp-2">
            {buildProductCardTitle(product)}
          </h3>
        </Link>
        <p className="mt-1.5 flex-1 text-sm text-surface-500 line-clamp-2">
          {product.shortDescription}
        </p>

        {match.matchReasons.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-surface-100 pt-3">
            {match.matchReasons.slice(0, 2).map((reason) => (
              <li
                key={reason}
                className="flex items-start gap-1.5 text-xs text-brand-700"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-brand-500" />
                {reason}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
          />
          <ProductCardAddButton
            productId={product.id}
            productName={product.name}
            stock={product.stock}
            stockStatus={product.stockStatus}
          />
        </div>
      </div>
    </article>
  );
}
