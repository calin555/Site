import { getPermissionsForRole } from "@/config/permissions";

export function hasPermission(
  permissions: string[],
  required: string
): boolean {
  if (permissions.includes("*")) return true;
  return permissions.includes(required);
}

export function hasAnyPermission(
  permissions: string[],
  required: string[]
): boolean {
  return required.some((p) => hasPermission(permissions, p));
}

export function resolvePermissions(roleSlug: string): string[] {
  return getPermissionsForRole(roleSlug);
}

export function filterNavByPermissions<T extends { permission?: string }>(
  items: T[],
  permissions: string[]
): T[] {
  return items.filter(
    (item) => !item.permission || hasPermission(permissions, item.permission)
  );
}
