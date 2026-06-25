"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, FileText, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { addToCartAction } from "@/lib/actions/cart.actions";
import {
  getMaxOrderQuantity,
  isProductPurchasable,
} from "@/lib/catalog/stock-status";
import type { ProductDetail } from "@/types/product";

interface ProductActionsProps {
  product: Pick<
    ProductDetail,
    "id" | "slug" | "name" | "price" | "stock" | "stockStatus" | "sku"
  >;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const canPurchase = isProductPurchasable(product.stockStatus, product.stock);
  const maxQty = getMaxOrderQuantity(product.stockStatus, product.stock);

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(maxQty, q + 1));
  }

  function handleAddToCart() {
    setError(null);
    startTransition(async () => {
      const result = await addToCartAction(product.id, quantity);
      if (result.success) {
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
      } else {
        setError(result.error);
      }
    });
  }

  const quoteUrl = `/contact?oferta=${encodeURIComponent(product.slug)}&produs=${encodeURIComponent(product.name)}`;

  return (
    <div className="min-w-0 max-w-full space-y-4">
      <div className="flex w-full min-w-0 flex-col gap-3">
        <div className="flex w-full min-w-0 items-center rounded-xl border border-surface-200">
          <button
            type="button"
            onClick={decrement}
            disabled={!canPurchase || quantity <= 1}
            className="flex h-12 w-12 items-center justify-center text-surface-500 transition-colors hover:text-surface-900 disabled:opacity-40"
            aria-label="Scade cantitatea"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="flex h-12 w-14 items-center justify-center text-base font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increment}
            disabled={!canPurchase || quantity >= maxQty}
            className="flex h-12 w-12 items-center justify-center text-surface-500 transition-colors hover:text-surface-900 disabled:opacity-40"
            aria-label="Crește cantitatea"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          size="lg"
          className="w-full min-w-0 sm:flex-1"
          disabled={!canPurchase || isPending}
          onClick={handleAddToCart}
        >
          {isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Se adaugă...
            </>
          ) : added ? (
            <>
              <Check className="h-5 w-5" />
              Adăugat în coș!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              {product.stockStatus === "PREORDER" ? "Precomandă" : "Adaugă în coș"}
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <Link href={quoteUrl} className="block">
        <Button variant="outline" size="lg" fullWidth>
          <FileText className="h-5 w-5" />
          Solicită ofertă personalizată
        </Button>
      </Link>

      <p className="text-center text-xs text-surface-400">
        SKU: {product.sku} · Consultanță tehnică gratuită
      </p>
    </div>
  );
}
