"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Award,
  ShoppingCart,
  Users,
  Star,
  FileText,
  Tag,
  Phone,
  Store,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV } from "@/config/permissions";
import { filterNavByPermissions } from "@/lib/auth/permissions";
import { logoutAction } from "@/lib/actions/auth.actions";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  FolderTree,
  Award,
  ShoppingCart,
  Users,
  Star,
  FileText,
  Tag,
  Phone,
};

interface AdminSidebarProps {
  permissions: string[];
  userName: string;
  roleSlug: string;
}

export function AdminSidebar({
  permissions,
  userName,
  roleSlug,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const navItems = filterNavByPermissions(ADMIN_NAV, permissions);

  return (
    <aside className="flex h-full w-64 flex-col border-r border-surface-800 bg-surface-900 text-surface-200">
      <div className="border-b border-surface-800 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">ChargePro</p>
            <p className="text-[10px] uppercase tracking-widest text-brand-400">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon] ?? LayoutDashboard;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-surface-300 hover:bg-surface-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-800 px-4 py-4">
        <p className="truncate text-sm font-medium text-white">{userName}</p>
        <p className="text-xs capitalize text-surface-400">{roleSlug}</p>
        <div className="mt-3 flex gap-2">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-surface-300 hover:bg-surface-800 hover:text-white"
          >
            Magazin
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-surface-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              Ieșire
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
