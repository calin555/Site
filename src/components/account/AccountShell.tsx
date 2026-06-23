import { Container } from "@/components/shared/Container";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { AccountNav } from "./AccountNav";
import type { PublicUser } from "@/types/user";

interface AccountShellProps {
  user: PublicUser;
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  counts?: { orders?: number; addresses?: number; invoices?: number };
}

export function AccountShell({
  user,
  children,
  title,
  description,
  breadcrumbs,
  counts,
}: AccountShellProps) {
  return (
    <Container className="py-8">
      <Breadcrumbs
        items={[{ label: "Cont", href: "/cont" }, ...breadcrumbs]}
        className="mb-6"
      />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
        {description && (
          <p className="mt-1 text-surface-500">{description}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="lg:col-span-1">
          <AccountNav user={user} counts={counts} />
        </aside>
        <div className="lg:col-span-2">{children}</div>
      </div>
    </Container>
  );
}
