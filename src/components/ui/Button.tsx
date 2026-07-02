import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "gradient-brand text-white ring-highlight btn-ripple btn-sheen shadow-elev-1 hover:shadow-glow-brand focus-visible:ring-brand-500",
  secondary:
    "bg-surface-900 text-white ring-highlight btn-ripple hover:bg-surface-800 shadow-elev-1 focus-visible:ring-surface-800",
  outline:
    "border border-surface-300 bg-white text-surface-900 hover:border-brand-500 hover:text-brand-700 hover:shadow-elev-1 focus-visible:ring-brand-500",
  ghost:
    "text-surface-700 hover:bg-surface-100 hover:text-surface-900 focus-visible:ring-brand-500",
  danger:
    "bg-red-600 text-white btn-ripple hover:bg-red-700 shadow-elev-1 focus-visible:ring-red-500",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      type = "button",
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
        "transition-all duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
