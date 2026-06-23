import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return <>{children}</>;
}