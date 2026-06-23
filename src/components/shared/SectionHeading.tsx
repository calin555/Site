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
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-base text-surface-600 sm:text-lg",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
