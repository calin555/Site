import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Package } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderList } from "@/components/account/OrderList";
import { Card, CardTitle } from "@/components/ui/Card";
import { getAccountData } from "@/lib/account/get-account-data";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contul meu",
  description: "Dashboard cont client.",
  path: "/cont",
  noIndex: true,
});

export default async function AccountDashboardPage() {
  const { user, orders, addresses, counts } = await getAccountData();
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <AccountShell
      user={user}
      counts={counts}
      title="Dashboard"
      description={`Bun venit, ${user.name}`}
      breadcrumbs={[]}
    >
      <div className="space-y-6">
        <Card padding="lg">
          <div className="mb-5 flex items-center justify-between">
            <CardTitle>Comenzi recente</CardTitle>
            <Link
              href="/cont/comenzi"
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Vezi toate
            </Link>
          </div>
          <OrderList orders={orders} showAll={false} />
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card padding="md">
            <MapPin className="h-5 w-5 text-brand-600" />
            <h3 className="mt-3 font-bold text-surface-900">Adresa principală</h3>
            {defaultAddress ? (
              <p className="mt-1 text-sm text-surface-500">
                {defaultAddress.street}
                <br />
                {defaultAddress.city}, {defaultAddress.county}
              </p>
            ) : (
              <p className="mt-1 text-sm text-surface-500">Nicio adresă salvată</p>
            )}
            <Link
              href="/cont/adrese"
              className="mt-3 inline-block text-sm font-medium text-brand-600"
            >
              Gestionează adrese
            </Link>
          </Card>
          <Card padding="md">
            <Package className="h-5 w-5 text-brand-600" />
            <h3 className="mt-3 font-bold text-surface-900">Comenzi totale</h3>
            <p className="mt-1 text-2xl font-bold text-brand-600">{orders.length}</p>
          </Card>
        </div>
      </div>
    </AccountShell>
  );
}
