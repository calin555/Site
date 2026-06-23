import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type BadgeVariant = "default" | "brand" | "accent" | "outline" | "dark";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-100 text-surface-700",
  brand: "bg-brand-100 text-brand-800",
  accent: "bg-cyan-100 text-cyan-800",
  outline: "border border-surface-200 bg-white text-surface-600",
  dark: "bg-surface-900 text-white",
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
