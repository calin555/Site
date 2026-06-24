import Link from "next/link";
import {
  Zap,
  Shield,
  Truck,
  Wrench,
  Star,
  Check,
  Clock,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { ProductActions } from "./ProductActions";
import { getStockStatusMessage } from "@/lib/catalog/stock-status";
import type { ProductDetail } from "@/types/product";

interface ProductInfoProps {
  product: ProductDetail;
}

const TONE_STYLES = {
  success: "text-brand-600",
  warning: "text-amber-600",
  info: "text-blue-600",
  error: "text-red-600",
} as const;

const TONE_ICONS = {
  success: Check,
  warning: Package,
  info: Clock,
  error: Check,
} as const;

export function ProductInfo({ product }: ProductInfoProps) {
  const stockMessage = getStockStatusMessage(product.stockStatus, product.stock);
  const StockIcon = TONE_ICONS[stockMessage.tone];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href={`/produse/brand/${product.brandSlug}`}>
          <Badge variant="outline">{product.brand}</Badge>
        </Link>
        <Link href={`/produse/categorie/${product.categorySlug}`}>
          <Badge variant="brand">{product.category}</Badge>
        </Link>
        {product.isNew && <Badge variant="accent">Nou</Badge>}
        {product.isFeatured && <Badge variant="dark">Popular</Badge>}
      </div>

      <h1 className="text-3xl font-bold leading-tight text-surface-900 sm:text-4xl">
        {product.name}
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(product.averageRating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-surface-200 text-surface-200"
              }`}
            />
          ))}
        </div>
        <span className="text-sm font-medium text-surface-700">
          {product.averageRating}
        </span>
        <a
          href="#recenzii"
          className="text-sm text-brand-600 hover:text-brand-700 hover:underline"
        >
          ({product.reviewCount} recenzii)
        </a>
      </div>

      <p className="text-lg leading-relaxed text-surface-600">
        {product.shortDescription}
      </p>

      <PriceDisplay
        price={product.price}
        compareAtPrice={product.compareAtPrice}
        size="lg"
      />

      <p
        className={`flex items-center gap-2 text-sm font-medium ${TONE_STYLES[stockMessage.tone]}`}
      >
        <StockIcon className="h-4 w-4" />
        {stockMessage.text}
      </p>

      <ProductActions product={product} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: Shield, label: `Garanție ${product.warrantyYears} ani` },
          { icon: Truck, label: "Livrare rapidă" },
          { icon: Zap, label: "Suport tehnic RO" },
          ...(product.installationRequired
            ? [{ icon: Wrench, label: "Instalare ANRE" }]
            : []),
        ].map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-center"
          >
            <Icon className="mx-auto h-5 w-5 text-brand-600" />
            <p className="mt-1.5 text-[11px] font-medium leading-tight text-surface-600">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
