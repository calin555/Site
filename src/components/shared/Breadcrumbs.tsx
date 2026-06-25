import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex min-w-0 flex-wrap items-center gap-x-1 gap-y-1 text-sm text-surface-500",
        className
      )}
    >
      <Link
        href="/"
        className="flex shrink-0 items-center gap-1 transition-colors hover:text-brand-600"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Acasă</span>
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex min-w-0 max-w-full items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-surface-300" />
          {item.href ? (
            <Link
              href={item.href}
              className="truncate transition-colors hover:text-brand-600"
              title={item.label}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="truncate font-medium text-surface-900"
              title={item.label}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
