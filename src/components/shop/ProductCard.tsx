import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ProductCardAddButton } from "@/components/shop/ProductCardAddButton";
import { isExternalImageUrl } from "@/lib/utils";
import { isProductPurchasable } from "@/lib/catalog/stock-status";
import type { CatalogProduct } from "@/types/catalog";
import {
  buildProductCardTitle,
  buildProductSeoTitle,
} from "@/lib/seo/product-seo-name";

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const isReady = isProductPurchasable(product.stockStatus, product.stock);

  return (
    <article className="group card-lift energy-border relative flex flex-col overflow-hidden rounded-2xl border border-surface-200/80 bg-white shadow-elev-1 hover:border-brand-300/60">
      {/* Top gradient hairline — signature detail */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <Link href={`/produse/${product.slug}`} className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
          <Image
            src={product.image}
            alt={buildProductSeoTitle(product)}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            unoptimized={isExternalImageUrl(product.image)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="accent">Nou</Badge>}
            {product.isFeatured && <Badge variant="brand">Popular</Badge>}
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
        <div className="mb-2 flex items-center justify-between gap-2">
          <Badge variant="outline">{product.brand}</Badge>
          {/* Charging-status LED (derived from existing stock data, display only) */}
          <span
            className={`flex items-center gap-1.5 text-[11px] font-medium ${
              isReady ? "text-brand-600" : "text-surface-400"
            }`}
          >
            <span className={isReady ? "charge-led text-brand-500" : "inline-flex h-1.5 w-1.5 rounded-full bg-surface-300"} />
            {!isReady
              ? "Stoc epuizat"
              : product.stockStatus === "PREORDER"
                ? "Precomandă"
                : "Disponibil"}
          </span>
        </div>

        <Link href={`/produse/${product.slug}`}>
          <h3 className="font-display font-bold tracking-tight text-surface-900 transition-colors duration-200 group-hover:text-brand-700 line-clamp-2">
            {buildProductCardTitle(product)}
          </h3>
        </Link>

        <p className="mt-1.5 flex-1 text-sm text-surface-500 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
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
