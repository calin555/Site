import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  MapPin,
  User,
  Lock,
  FileText,
} from "lucide-react";

export type AccountNavCountKey = "orders" | "addresses" | "invoices";

export interface AccountNavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  countKey?: AccountNavCountKey;
}

export const ACCOUNT_NAV_ITEMS: AccountNavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/cont" },
  {
    icon: Package,
    label: "Comenzile mele",
    href: "/cont/comenzi",
    countKey: "orders",
  },
  {
    icon: MapPin,
    label: "Adrese salvate",
    href: "/cont/adrese",
    countKey: "addresses",
  },
  { icon: User, label: "Profil", href: "/cont/profil" },
  { icon: Lock, label: "Schimbă parola", href: "/cont/parola" },
  {
    icon: FileText,
    label: "Facturi",
    href: "/cont/facturi",
    countKey: "invoices",
  },
];

export type AccountNavCounts = {
  orders?: number;
  addresses?: number;
  invoices?: number;
};
