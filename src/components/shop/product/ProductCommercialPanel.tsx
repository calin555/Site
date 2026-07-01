import Link from "next/link";
import { FaqSection } from "@/components/seo/FaqSection";
import { getProductCommercialContext } from "@/lib/catalog/product-commercial-context";
import type { ProductDetail } from "@/types/product";

interface ProductCommercialPanelProps {
  product: ProductDetail;
}

export function ProductCommercialPanel({ product }: ProductCommercialPanelProps) {
  const ctx = getProductCommercialContext({
    slug: product.slug,
    categorySlug: product.categorySlug,
    powerKw: product.powerKw,
    phases: product.phases,
  });

  if (product.categorySlug === "accesorii" && ctx.faq.length === 0 && ctx.chargingTimeExamples.length === 0) {
    return (
      <p className="text-surface-600">
        Accesoriu compatibil cu stațiile AC Type 2 din catalog.{" "}
        <Link href="/produse/categorie/statii-ac" className="text-brand-600 hover:underline">
          Vezi stații AC
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-500">
            Tip încărcare
          </h3>
          <p className="mt-1 text-lg font-semibold text-surface-900">{ctx.chargeType}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-surface-500">
            Rețea electrică
          </h3>
          <p className="mt-1 text-lg font-semibold text-surface-900">{ctx.phases}</p>
        </div>
      </div>

      {ctx.recommendedVehicles.length > 0 && (
        <div>
          <h3 className="font-semibold text-surface-900">Recomandat pentru</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ctx.recommendedVehicles.map((v) => (
              <li
                key={v}
                className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700"
              >
                {v}
              </li>
            ))}
          </ul>
        </div>
      )}

      {ctx.useCases.length > 0 && (
        <div>
          <h3 className="font-semibold text-surface-900">Unde se instalează</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-surface-700">
            {ctx.useCases.map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      )}

      {ctx.chargingTimeExamples.length > 0 && (
        <div>
          <h3 className="font-semibold text-surface-900">Timp estimat de încărcare</h3>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {ctx.chargingTimeExamples.map((ex) => (
                <tr key={ex.label} className="border-b border-surface-100">
                  <td className="py-2 pr-4 text-surface-600">{ex.label}</td>
                  <td className="py-2 font-semibold text-surface-900">{ex.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-sm text-surface-500">
            Estimări AC la putere nominală.{" "}
            <Link href="/tools/calculator-timp-incarcare" className="text-brand-600 hover:underline">
              Calculator personalizat
            </Link>
          </p>
        </div>
      )}

      {ctx.landingLinks.length > 0 && (
        <div>
          <h3 className="font-semibold text-surface-900">Ghiduri conexe</h3>
          <ul className="mt-2 space-y-1">
            {ctx.landingLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-brand-600 hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ctx.faq.length > 0 && (
        <FaqSection title="Întrebări despre acest produs" items={ctx.faq} />
      )}
    </div>
  );
}
