import Link from "next/link";
import Image from "next/image";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ProductCardAddButton } from "@/components/shop/ProductCardAddButton";
import { isExternalImageUrl } from "@/lib/utils";
import type { CatalogProduct } from "@/types/catalog";
import {
  buildProductCardTitle,
  buildProductSeoTitle,
} from "@/lib/seo/product-seo-name";

interface ProductCardProps {
  product: CatalogProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/5">
      <Link href={`/produse/${product.slug}`} className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
          <Image
            src={product.image}
            alt={buildProductSeoTitle(product)}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={isExternalImageUrl(product.image)}
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="accent">Nou</Badge>}
            {product.isFeatured && <Badge variant="brand">Popular</Badge>}
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline">{product.brand}</Badge>
          {product.powerKw > 0 && (
            <span className="flex items-center gap-1 text-xs font-medium text-surface-500">
              <Zap className="h-3 w-3 text-brand-500" />
              {product.powerKw} kW
            </span>
          )}
        </div>

        <Link href={`/produse/${product.slug}`}>
          <h3 className="font-bold text-surface-900 transition-colors group-hover:text-brand-700 line-clamp-2">
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
