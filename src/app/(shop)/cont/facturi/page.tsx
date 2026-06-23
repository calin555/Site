import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { InvoiceList } from "@/components/account/InvoiceList";
import { getAccountData } from "@/lib/account/get-account-data";

export const metadata: Metadata = {
  title: "Facturi",
  description: "Descarcă facturile comenzilor tale.",
};

export default async function InvoicesPage() {
  const { user, orders, counts } = await getAccountData();

  return (
    <AccountShell
      user={user}
      counts={counts}
      title="Facturi"
      description="Descarcă facturile pentru comenzile plătite"
      breadcrumbs={[{ label: "Facturi" }]}
    >
      <InvoiceList orders={orders} />
    </AccountShell>
  );
}
