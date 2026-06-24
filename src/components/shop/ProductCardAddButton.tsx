"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { addToCartAction } from "@/lib/actions/cart.actions";
import {
  isProductPurchasable,
  type StockStatus,
} from "@/lib/catalog/stock-status";

interface ProductCardAddButtonProps {
  productId: string;
  productName: string;
  stock: number;
  stockStatus: StockStatus;
}

export function ProductCardAddButton({
  productId,
  productName,
  stock,
  stockStatus,
}: ProductCardAddButtonProps) {
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canPurchase = isProductPurchasable(stockStatus, stock);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!canPurchase || isPending) return;

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

  const title = canPurchase
    ? stockStatus === "PREORDER"
      ? "Precomandă"
      : "Adaugă în coș"
    : "Indisponibil";

  return (
    <div className="relative">
      <Button
        type="button"
        size="sm"
        disabled={!canPurchase || isPending}
        aria-label={`Adaugă ${productName} în coș`}
        title={title}
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
