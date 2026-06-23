import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { price: "text-base", compare: "text-sm" },
  md: { price: "text-xl", compare: "text-sm" },
  lg: { price: "text-3xl", compare: "text-base" },
};

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={cn("font-bold text-surface-900", sizes[size].price)}
      >
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <span
          className={cn(
            "text-surface-400 line-through",
            sizes[size].compare
          )}
        >
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
