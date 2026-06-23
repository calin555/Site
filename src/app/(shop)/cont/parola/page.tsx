import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { PasswordForm } from "@/components/account/PasswordForm";
import { getAccountData } from "@/lib/account/get-account-data";

export const metadata: Metadata = {
  title: "Schimbă parola",
  description: "Actualizează parola contului tău.",
};

export default async function PasswordPage() {
  const { user, counts } = await getAccountData();

  return (
    <AccountShell
      user={user}
      counts={counts}
      title="Schimbă parola"
      description="Asigură-te că folosești o parolă puternică"
      breadcrumbs={[{ label: "Parolă" }]}
    >
      <PasswordForm />
    </AccountShell>
  );
}
