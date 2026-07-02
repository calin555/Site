"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Phone,
  Mail,
  Clock,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/Container";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { HeaderAccountMenu } from "@/components/layout/HeaderAccountMenu";
import { phoneToTel, type SiteContactSettings } from "@/types/site-contact";
import type { PublicUser } from "@/types/user";
import type { AccountNavCounts } from "@/config/account-nav";

interface HeaderProps {
  cartCount?: number;
  contact: SiteContactSettings;
  user?: PublicUser | null;
  accountCounts?: AccountNavCounts;
}

export function Header({ cartCount = 0, contact, user = null, accountCounts }: HeaderProps) {
  const isLoggedIn = Boolean(user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky inset-x-0 top-0 z-50 w-full min-w-0 max-w-full overflow-visible">
      {/* Top bar */}
      <div className="gradient-dark hidden border-b border-white/5 text-sm text-surface-300 lg:block">
        <Container>
          <div className="flex h-10 items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-400" />
                {contact.hours}
              </span>
              <a
                href={`tel:${phoneToTel(contact.phoneOrders)}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Phone className="h-3.5 w-3.5 text-brand-400" />
                {contact.phoneOrders}
              </a>
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-brand-400" />
                {contact.email}
              </a>
            </div>
            <p className="text-brand-300">{contact.headerTagline}</p>
          </div>
        </Container>
      </div>

      {/* Main nav */}
      <div className="glass border-b border-surface-200/70">
        <Container>
          <div className="flex h-16 min-w-0 items-center justify-between gap-2 sm:gap-4 lg:h-20">
            {/* Logo — living electric identity */}
            <Link href="/" className="logo-electric group flex items-center gap-2.5 shrink-0">
              <div className="logo-glow flex h-10 w-10 items-center justify-center rounded-xl gradient-brand ring-highlight transition-shadow duration-300 group-hover:shadow-glow-brand">
                <Zap className="logo-bolt h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-lg font-bold tracking-tight text-surface-900">
                  {siteConfig.name}
                </span>
                <span className="block text-[10px] font-medium uppercase tracking-widest text-brand-600">
                  EV Charging
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 lg:flex">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={pathname === item.href}
                  className={cn(
                    "nav-link rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                    pathname === item.href
                      ? "text-brand-700"
                      : "text-surface-600 hover:text-surface-900"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="relative z-[1] flex shrink-0 items-center gap-0.5 sm:gap-2">
              <HeaderSearch />
              {isLoggedIn ? (
                <HeaderAccountMenu user={user!} counts={accountCounts} />
              ) : (
                <Link
                  href="/autentificare"
                  className="relative z-[1] flex items-center justify-center rounded-xl p-2.5 text-surface-600 transition-colors hover:bg-surface-100"
                  aria-label="Autentificare"
                  title="Autentificare"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
              <Link
                href="/cos"
                className="relative rounded-full p-2.5 text-surface-600 transition-all duration-200 hover:bg-surface-100 hover:text-surface-900"
                aria-label="Coș"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="animate-scale-in absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full gradient-brand text-[10px] font-bold text-white shadow-elev-1">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="rounded-xl p-2.5 text-surface-600 transition-colors hover:bg-surface-100 lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? "Închide meniu" : "Deschide meniu"}
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="animate-fade-in border-t border-surface-200/70 bg-white/95 backdrop-blur-lg lg:hidden">
            <Container className="py-4">
              <nav className="flex flex-col gap-1">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-brand-50 text-brand-700"
                        : "text-surface-700 hover:bg-surface-50"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2 border-surface-200" />
                {isLoggedIn ? (
                  <Link
                    href="/cont"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-brand-700 hover:bg-brand-50"
                  >
                    {user!.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user!.image}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-200"
                      />
                    ) : null}
                    Contul meu ({user!.name})
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/cont"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50"
                    >
                      Contul meu
                    </Link>
                    <Link
                      href="/autentificare"
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-3 text-sm font-medium text-surface-700 hover:bg-surface-50"
                    >
                      Autentificare
                    </Link>
                  </>
                )}
              </nav>
            </Container>
          </div>
        )}
      </div>
    </header>
  );
}
