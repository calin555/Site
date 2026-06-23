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
      className={cn("flex items-center gap-1 text-sm text-surface-500", className)}
    >
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-brand-600"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only">Acasă</span>
      </Link>
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 text-surface-300" />
          {item.href ? (
            <Link
              href={item.href}
              className="transition-colors hover:text-brand-600"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-surface-900">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
