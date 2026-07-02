import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  badge?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "left",
  badge,
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-3",
        align === "center" && "text-center",
        className
      )}
      {...props}
    >
      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700 ring-1 ring-inset ring-brand-200/70">
          <span className="h-1 w-1 rounded-full bg-brand-500" />
          {badge}
        </span>
      )}
      <h2 className="font-display text-balance break-words text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl break-words text-base text-surface-600 sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
