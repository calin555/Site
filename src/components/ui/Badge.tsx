import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "brand" | "accent" | "outline" | "dark";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-100 text-surface-700 ring-1 ring-inset ring-surface-200/60",
  brand: "bg-brand-50 text-brand-800 ring-1 ring-inset ring-brand-200/70",
  accent: "bg-lime-50 text-lime-800 ring-1 ring-inset ring-lime-200/70",
  outline: "border border-surface-200 bg-white text-surface-600",
  dark: "bg-surface-900 text-white ring-highlight",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
