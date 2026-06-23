import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { AddressList } from "@/components/account/AddressList";
import { getAccountData } from "@/lib/account/get-account-data";

export const metadata: Metadata = {
  title: "Adrese salvate",
  description: "Gestionează adresele de livrare și facturare.",
};

export default async function AddressesPage() {
  const { user, addresses, counts } = await getAccountData();

  return (
    <AccountShell
      user={user}
      counts={counts}
      title="Adrese salvate"
      description="Adaugă și editează adresele tale"
      breadcrumbs={[{ label: "Adrese" }]}
    >
      <AddressList addresses={addresses} />
    </AccountShell>
  );
}
