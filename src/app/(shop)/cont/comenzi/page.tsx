import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { OrderList } from "@/components/account/OrderList";
import { getAccountData } from "@/lib/account/get-account-data";

export const metadata: Metadata = {
  title: "Comenzile mele",
  description: "Istoricul comenzilor tale ChargePro.",
};

export default async function OrdersPage() {
  const { user, orders, counts } = await getAccountData();

  return (
    <AccountShell
      user={user}
      counts={counts}
      title="Comenzile mele"
      description={`${orders.length} comenzi în total`}
      breadcrumbs={[{ label: "Comenzi" }]}
    >
      <OrderList orders={orders} />
    </AccountShell>
  );
}
