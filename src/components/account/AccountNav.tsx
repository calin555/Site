"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ACCOUNT_NAV_ITEMS, type AccountNavCounts } from "@/config/account-nav";
import { logoutAction } from "@/lib/actions/auth.actions";
import type { PublicUser } from "@/types/user";
import { User } from "lucide-react";

interface AccountNavProps {
  user: PublicUser;
  counts?: AccountNavCounts;
}

export function AccountNav({ user, counts }: AccountNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <Card padding="md" className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-600">
          <User className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-surface-900">{user.name}</p>
          <p className="truncate text-sm text-surface-500">{user.email}</p>
        </div>
      </Card>

      <nav className="space-y-1">
        {ACCOUNT_NAV_ITEMS.map(({ icon: Icon, label, href, countKey }) => {
          const isActive =
            href === "/cont"
              ? pathname === "/cont"
              : pathname.startsWith(href);
          const count = countKey ? counts?.[countKey] : undefined;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-surface-700 hover:bg-surface-50 hover:text-surface-900"
              )}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-surface-400" />
                {label}
              </span>
              {count !== undefined && count > 0 && (
                <Badge variant="outline">{count}</Badge>
              )}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={handleLogout}
          disabled={isPending}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          Deconectare
        </button>
      </nav>
    </div>
  );
}
