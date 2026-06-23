import type { Metadata } from "next";
import { AccountShell } from "@/components/account/AccountShell";
import { ProfileForm } from "@/components/account/ProfileForm";
import { getAccountData } from "@/lib/account/get-account-data";

export const metadata: Metadata = {
  title: "Profil",
  description: "Actualizează datele contului tău.",
};

export default async function ProfilePage() {
  const { user, counts } = await getAccountData();

  return (
    <AccountShell
      user={user}
      counts={counts}
      title="Profil"
      description="Gestionează informațiile personale"
      breadcrumbs={[{ label: "Profil" }]}
    >
      <ProfileForm user={user} />
    </AccountShell>
  );
}
