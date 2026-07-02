import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  dark?: boolean;
}

export function PageHeader({
  title,
  description,
  dark,
  className,
  children,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden border-b",
        dark
          ? "gradient-dark-grid border-surface-800"
          : "border-surface-200 bg-surface-50 pattern-grid",
        className
      )}
      {...props}
    >
      {!dark && (
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-100/60 blur-3xl" />
      )}
      <div className="relative mx-auto w-full min-w-0 max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-3">
            <h1
              className={cn(
                "font-display text-balance break-words text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl",
                dark ? "text-white" : "text-surface-900"
              )}
            >
              {title}
            </h1>
            {description && (
              <p
                className={cn(
                  "max-w-2xl break-words text-base sm:text-lg",
                  dark ? "text-surface-200" : "text-surface-600"
                )}
              >
                {description}
              </p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
