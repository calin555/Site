import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-user";
import { resolvePermissions, hasPermission } from "@/lib/auth/permissions";
import type { PublicUser } from "@/types/user";

export interface AdminContext {
  user: PublicUser;
  roleSlug: string;
  permissions: string[];
}

export async function getAdminContext(): Promise<AdminContext | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const roleSlug = user.roleSlug;
  const permissions = resolvePermissions(roleSlug);

  const isAdmin =
    roleSlug === "admin" ||
    roleSlug === "super-admin" ||
    permissions.includes("*");

  if (!isAdmin) return null;

  return { user, roleSlug, permissions };
}

export async function requireAdmin(
  redirectTo = "/admin"
): Promise<AdminContext> {
  const ctx = await getAdminContext();
  if (!ctx) {
    redirect(`/autentificare?next=${encodeURIComponent(redirectTo)}`);
  }
  return ctx;
}

export async function requirePermission(
  permission: string,
  redirectTo = "/admin"
): Promise<AdminContext> {
  const ctx = await requireAdmin(redirectTo);
  if (!hasPermission(ctx.permissions, permission)) {
    redirect("/admin");
  }
  return ctx;
}
