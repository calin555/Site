"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Loader2, User } from "lucide-react";
import { ACCOUNT_NAV_ITEMS, type AccountNavCounts } from "@/config/account-nav";
import { logoutAction } from "@/lib/actions/auth.actions";
import { cn } from "@/lib/utils";
import type { PublicUser } from "@/types/user";

interface HeaderAccountMenuProps {
  user: PublicUser;
  counts?: AccountNavCounts;
}

export function HeaderAccountMenu({ user, counts }: HeaderAccountMenuProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div ref={menuRef} className="relative z-[1]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Meniu cont — ${user.name}`}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex items-center justify-center rounded-xl p-2.5 transition-colors",
          user.image
            ? "h-9 w-9 overflow-hidden rounded-full ring-2 ring-brand-300 hover:ring-brand-500"
            : "text-surface-600 hover:bg-surface-100"
        )}
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-5 w-5" />
        )}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-[300] w-56 overflow-hidden rounded-xl border border-surface-200 bg-white py-1.5 shadow-xl shadow-surface-900/10"
        >
          <div className="border-b border-surface-100 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-surface-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-surface-500">{user.email}</p>
          </div>

          <nav className="py-1">
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
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-brand-50 font-medium text-brand-700"
                      : "text-surface-700 hover:bg-surface-50"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0 text-surface-400" />
                    {label}
                  </span>
                  {count !== undefined && count > 0 ? (
                    <span className="rounded-full bg-surface-100 px-2 py-0.5 text-[10px] font-semibold text-surface-600">
                      {count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-surface-100 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={isPending}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Deconectare
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
