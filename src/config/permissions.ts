export const PERMISSIONS = {
  PRODUCTS_READ: "products:read",
  PRODUCTS_WRITE: "products:write",
  ORDERS_READ: "orders:read",
  ORDERS_WRITE: "orders:write",
  ORDERS_READ_OWN: "orders:read:own",
  CUSTOMERS_READ: "customers:read",
  INVENTORY_WRITE: "inventory:write",
  REVIEWS_MODERATE: "reviews:moderate",
  REVIEWS_WRITE: "reviews:write",
  COUPONS_WRITE: "coupons:write",
  CONTENT_WRITE: "content:write",
  ANALYTICS_READ: "analytics:read",
  ADDRESSES_WRITE: "addresses:write",
  ALL: "*",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS] | string;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  customer: [
    PERMISSIONS.ORDERS_READ_OWN,
    PERMISSIONS.REVIEWS_WRITE,
    PERMISSIONS.ADDRESSES_WRITE,
  ],
  admin: [
    PERMISSIONS.PRODUCTS_READ,
    PERMISSIONS.PRODUCTS_WRITE,
    PERMISSIONS.ORDERS_READ,
    PERMISSIONS.ORDERS_WRITE,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.INVENTORY_WRITE,
    PERMISSIONS.REVIEWS_MODERATE,
    PERMISSIONS.COUPONS_WRITE,
    PERMISSIONS.CONTENT_WRITE,
    PERMISSIONS.ANALYTICS_READ,
  ],
  "super-admin": [PERMISSIONS.ALL],
};

export function getPermissionsForRole(roleSlug: string): string[] {
  return ROLE_PERMISSIONS[roleSlug] ?? [];
}

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string;
  permission?: string;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  {
    label: "Produse",
    href: "/admin/produse",
    icon: "Package",
    permission: PERMISSIONS.PRODUCTS_READ,
  },
  {
    label: "Categorii",
    href: "/admin/categorii",
    icon: "FolderTree",
    permission: PERMISSIONS.PRODUCTS_READ,
  },
  {
    label: "Branduri",
    href: "/admin/branduri",
    icon: "Award",
    permission: PERMISSIONS.PRODUCTS_READ,
  },
  {
    label: "Comenzi",
    href: "/admin/comenzi",
    icon: "ShoppingCart",
    permission: PERMISSIONS.ORDERS_READ,
  },
  {
    label: "Clienți",
    href: "/admin/clienti",
    icon: "Users",
    permission: PERMISSIONS.CUSTOMERS_READ,
  },
  {
    label: "Recenzii",
    href: "/admin/recenzii",
    icon: "Star",
    permission: PERMISSIONS.REVIEWS_MODERATE,
  },
  {
    label: "Blog",
    href: "/admin/blog",
    icon: "FileText",
    permission: PERMISSIONS.CONTENT_WRITE,
  },
  {
    label: "Cupoane",
    href: "/admin/cupoane",
    icon: "Tag",
    permission: PERMISSIONS.COUPONS_WRITE,
  },
  {
    label: "Setări contact",
    href: "/admin/setari/contact",
    icon: "Phone",
    permission: PERMISSIONS.CONTENT_WRITE,
  },
];
