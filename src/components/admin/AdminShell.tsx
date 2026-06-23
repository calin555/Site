import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  children: React.ReactNode;
  userName: string;
  roleSlug: string;
  permissions: string[];
  title: string;
  description?: string;
}

export function AdminShell({
  children,
  userName,
  roleSlug,
  permissions,
  title,
  description,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen bg-surface-100">
      <AdminSidebar
        permissions={permissions}
        userName={userName}
        roleSlug={roleSlug}
      />
      <div className="flex flex-1 flex-col">
        <header className="border-b border-surface-200 bg-white px-8 py-6">
          <h1 className="text-2xl font-bold text-surface-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-surface-500">{description}</p>
          )}
        </header>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
}
