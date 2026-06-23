import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Download, ArrowLeft } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { OrderSummary } from "@/components/shop/cart/OrderSummary";
import { getAccountData } from "@/lib/account/get-account-data";
import {
  getOrderByNumber,
  userOwnsOrder,
} from "@/lib/services/order.service";
import { ORDER_STATUS_LABELS } from "@/types/order";
import { canDownloadInvoice } from "@/lib/invoices/generate-invoice";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderDetailPageProps {
  params: Promise<{ orderNumber: string }>;
}

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Comandă ${orderNumber}` };
}

function statusVariant(status: string) {
  if (["PAID", "DELIVERED", "COMPLETED"].includes(status)) return "brand" as const;
  if (["CANCELLED", "REFUNDED"].includes(status)) return "outline" as const;
  return "default" as const;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderNumber } = await params;
  const { user, counts } = await getAccountData();
  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  const owns = await userOwnsOrder(order, user.id, user.email);
  if (!owns) redirect("/cont/comenzi");

  const showInvoice = canDownloadInvoice(order);

  return (
    <AccountShell
      user={user}
      counts={counts}
      title={`Comandă ${order.orderNumber}`}
      description={`Plasată pe ${formatDate(order.createdAt)}`}
      breadcrumbs={[
        { label: "Comenzi", href: "/cont/comenzi" },
        { label: order.orderNumber },
      ]}
    >
      <div className="space-y-6">
        <Link
          href="/cont/comenzi"
          className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Înapoi la comenzi
        </Link>

        <Card padding="lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <Badge variant={statusVariant(order.status)}>
                {ORDER_STATUS_LABELS[order.status]}
              </Badge>
              {order.paidAt && (
                <p className="mt-2 text-sm text-surface-500">
                  Plătită pe {formatDate(order.paidAt)}
                </p>
              )}
            </div>
            {showInvoice && (
              <a href={`/api/invoices/${order.orderNumber}`} download>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Descarcă factura
                </Button>
              </a>
            )}
          </div>
        </Card>

        <Card padding="lg">
          <h3 className="mb-4 font-bold text-surface-900">Produse</h3>
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li
                key={`${item.sku}-${item.quantity}`}
                className="flex justify-between gap-4 border-b border-surface-100 pb-3 text-sm last:border-0"
              >
                <div>
                  <p className="font-medium text-surface-900">{item.name}</p>
                  <p className="text-surface-500">
                    SKU: {item.sku} · ×{item.quantity}
                  </p>
                </div>
                <span className="shrink-0 font-medium">
                  {formatPrice(item.total)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-surface-200 pt-4">
            <OrderSummary totals={order.totals} />
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card padding="md">
            <h3 className="font-bold text-surface-900">Livrare</h3>
            <p className="mt-2 text-sm text-surface-600">
              {order.shipping.firstName} {order.shipping.lastName}
              <br />
              {order.shipping.street}
              <br />
              {order.shipping.city}, {order.shipping.county}{" "}
              {order.shipping.postalCode}
              <br />
              {order.phone}
            </p>
          </Card>
          {order.companyInvoice.enabled && (
            <Card padding="md">
              <h3 className="font-bold text-surface-900">Facturare firmă</h3>
              <p className="mt-2 text-sm text-surface-600">
                {order.companyInvoice.companyName}
                <br />
                CUI: {order.companyInvoice.cui}
                {order.companyInvoice.registrationNumber && (
                  <>
                    <br />
                    Reg. Com.: {order.companyInvoice.registrationNumber}
                  </>
                )}
              </p>
            </Card>
          )}
        </div>
      </div>
    </AccountShell>
  );
}
