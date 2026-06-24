import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CartView } from "@/components/shop/cart/CartView";
import {
  getCartSummary,
  calculateOrderTotals,
} from "@/lib/services/cart.service";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Coș de cumpărături",
  description: "Revizuiește produsele din coșul tău.",
  path: "/cos",
  noIndex: true,
});

export default async function CartPage() {
  const summary = await getCartSummary();
  const totals = calculateOrderTotals(
    summary.items,
    summary.couponError ? undefined : summary.couponCode
  );

  return (
    <>
      <PageHeader
        title="Coșul tău"
        description={
          summary.itemCount > 0
            ? `${summary.itemCount} ${summary.itemCount === 1 ? "produs" : "produse"} în coș`
            : "Niciun produs în coș"
        }
      />
      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Coș" }]} className="mb-8" />
        <CartView summary={summary} totals={totals} />
      </Container>
    </>
  );
}
