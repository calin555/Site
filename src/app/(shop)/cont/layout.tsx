import { requireAuth } from "@/lib/auth/get-user";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <>{children}</>;
}
