import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, isExternalImageUrl } from "@/lib/utils";
import {
  BADGE_LABELS,
  type MatchedProduct,
} from "@/lib/compatibility/types";
import type { CatalogProduct } from "@/types/catalog";

const PLACEHOLDER_SVG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='90' viewBox='0 0 120 90'%3E%3Crect fill='%23e8f5f0' width='120' height='90' rx='8'/%3E%3Cpath d='M40 55h40l8-12H48l-8 12z' fill='%230fb87e' opacity='0.5'/%3E%3C/svg%3E";

function productImageSrc(url: string | undefined): string {
  const trimmed = url?.trim();
  return trimmed || PLACEHOLDER_SVG;
}

interface CompatibleStationsPreviewProps {
  stations: Array<CatalogProduct & { match: MatchedProduct }>;
  chargingTimeHome: string;
  chargingTimeFast: string;
}

export function CompatibleStationsPreview({
  stations,
  chargingTimeHome,
  chargingTimeFast,
}: CompatibleStationsPreviewProps) {
  const preview = stations.slice(0, 4);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-brand-200/60 bg-gradient-to-br from-brand-50 via-white to-surface-50 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-surface-900">
          Stații compatibile
        </h2>
        {stations.length > 0 && (
          <Badge variant="brand">{stations.length} produse</Badge>
        )}
      </div>

      {preview.length > 0 ? (
        <ul className="flex-1 space-y-3">
          {preview.map((product) => (
            <li key={product.id}>
              <Link
                href={`/produse/${product.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-surface-200/80 bg-white p-3 transition-all hover:border-brand-300 hover:shadow-elev-1"
              >
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-100">
                  <Image
                    src={productImageSrc(product.image)}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized={
                      isExternalImageUrl(product.image) ||
                      !product.image?.trim()
                    }
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-surface-900 group-hover:text-brand-700">
                    {product.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-sm text-surface-500">
                    {product.powerKw > 0 && (
                      <span className="inline-flex items-center gap-0.5">
                        <Zap className="h-3 w-3 text-accent" />
                        {product.powerKw} kW
                      </span>
                    )}
                    <span>{formatPrice(product.price)}</span>
                  </p>
                  {product.match.badges[0] && (
                    <span className="mt-1 inline-block text-xs font-medium text-brand-600">
                      {BADGE_LABELS[product.match.badges[0]]}
                    </span>
                  )}
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-surface-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 bg-surface-50 px-4 py-8 text-center">
          <Zap className="mb-2 h-8 w-8 text-surface-400" />
          <p className="text-sm text-surface-600">
            Nu am găsit stații în catalog pentru acest vehicul.
          </p>
          <Link
            href="/contact"
            className="mt-3 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Contactează-ne pentru recomandare →
          </Link>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-surface-200 pt-4">
        <div className="rounded-xl bg-brand-50/80 p-3">
          <p className="text-xs font-medium text-brand-700">Acasă 20→80%</p>
          <p className="font-display text-base font-bold text-surface-900">
            {chargingTimeHome}
          </p>
        </div>
        <div className="rounded-xl bg-brand-50/80 p-3">
          <p className="text-xs font-medium text-brand-700">Rapid DC 10→80%</p>
          <p className="font-display text-base font-bold text-surface-900">
            {chargingTimeFast}
          </p>
        </div>
      </div>

      {stations.length > preview.length && (
        <Link
          href="#produse-compatibile"
          className="mt-4 text-center text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Vezi toate cele {stations.length} produse →
        </Link>
      )}
    </div>
  );
}
