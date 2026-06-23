"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { addToCartAction } from "@/lib/actions/cart.actions";

interface ProductCardAddButtonProps {
  productId: string;
  productName: string;
  stock: number;
}

export function ProductCardAddButton({
  productId,
  productName,
  stock,
}: ProductCardAddButtonProps) {
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inStock = stock > 0;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock || isPending) return;

    setError(null);
    startTransition(async () => {
      const result = await addToCartAction(productId, 1);
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="relative">
      <Button
        type="button"
        size="sm"
        disabled={!inStock || isPending}
        aria-label={`Adaugă ${productName} în coș`}
        title={inStock ? "Adaugă în coș" : "Stoc epuizat"}
        onClick={handleClick}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : added ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>
      {error && (
        <p className="absolute bottom-full right-0 z-10 mb-1 w-48 rounded-lg bg-red-50 px-2 py-1 text-xs text-red-600 shadow-sm">
          {error}
        </p>
      )}
    </div>
  );
}
