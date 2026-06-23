import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatDate } from "@/lib/utils";
import { ORDER_STATUS_LABELS, type OrderRecord } from "@/types/order";
import { canDownloadInvoice } from "@/lib/invoices/generate-invoice";

interface InvoiceListProps {
  orders: OrderRecord[];
}

export function InvoiceList({ orders }: InvoiceListProps) {
  const invoiceable = orders.filter(canDownloadInvoice);

  if (invoiceable.length === 0) {
    return (
      <Card padding="lg" className="text-center">
        <FileText className="mx-auto h-10 w-10 text-surface-300" />
        <p className="mt-3 text-surface-500">
          Nu ai facturi disponibile. Facturile apar după confirmarea plății.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {invoiceable.map((order) => (
        <Card key={order.orderNumber} padding="md">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-surface-900">
                FACT-{order.orderNumber}
              </p>
              <p className="text-sm text-surface-500">
                Comandă {order.orderNumber} · {formatDate(order.paidAt ?? order.createdAt)}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="brand">{ORDER_STATUS_LABELS[order.status]}</Badge>
                <span className="text-sm font-medium text-surface-700">
                  {formatPrice(order.totals.total)}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`/api/invoices/${order.orderNumber}`} download>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  Descarcă
                </Button>
              </a>
              <Link href={`/cont/comenzi/${order.orderNumber}`}>
                <Button variant="outline" size="sm">
                  Detalii
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
