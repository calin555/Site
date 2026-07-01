import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getLandingsForProduct } from "@/lib/seo/commercial/keyword-strategy";

interface ProductRelatedLandingsProps {
  product: { categorySlug: string; powerKw: number };
}

export function ProductRelatedLandings({ product }: ProductRelatedLandingsProps) {
  const links = getLandingsForProduct(product);
  if (links.length === 0) return null;

  return (
    <section className="mt-8 rounded-2xl border border-surface-200 bg-surface-50 p-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-surface-500">
        Ghiduri relevante
      </h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex items-center rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/statii-incarcare"
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700"
      >
        Toate ghidurile comerciale
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
}
