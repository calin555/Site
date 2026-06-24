"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { formatPrice, isExternalImageUrl } from "@/lib/utils";
import {
  updateQuantityAction,
  removeItemAction,
} from "@/lib/actions/cart.actions";
import { getMaxOrderQuantity } from "@/lib/catalog/stock-status";
import type { CartLineItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartLineItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const [isPending, startTransition] = useTransition();
  const maxQty = getMaxOrderQuantity(item.stockStatus, item.stock);

  function updateQty(qty: number) {
    startTransition(async () => {
      await updateQuantityAction(item.productId, qty);
    });
  }

  function remove() {
    startTransition(async () => {
      await removeItemAction(item.productId);
    });
  }

  return (
    <Card
      padding="md"
      className={`flex flex-col gap-4 sm:flex-row sm:items-center ${isPending ? "opacity-60" : ""}`}
    >
      <Link
        href={`/produse/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-100"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          unoptimized={isExternalImageUrl(item.image)}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          href={`/produse/${item.slug}`}
          className="font-bold text-surface-900 hover:text-brand-700 line-clamp-2"
        >
          {item.name}
        </Link>
        <p className="mt-0.5 text-sm text-surface-500">{item.brand}</p>
        <p className="mt-1 text-xs text-surface-400">SKU: {item.sku}</p>
        <div className="mt-2 sm:hidden">
          <PriceDisplay price={item.price} compareAtPrice={item.compareAtPrice} size="sm" />
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <PriceDisplay price={item.price} compareAtPrice={item.compareAtPrice} size="sm" />
        <p className="mt-1 text-sm font-semibold text-surface-900">
          {formatPrice(item.lineTotal)}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center rounded-xl border border-surface-200">
          <button
            type="button"
            onClick={() => updateQty(item.quantity - 1)}
            disabled={isPending || item.quantity <= 1}
            className="flex h-9 w-9 items-center justify-center text-surface-500 hover:text-surface-900 disabled:opacity-40"
            aria-label="Scade cantitatea"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="flex h-9 w-8 items-center justify-center text-sm font-semibold">
            {isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              item.quantity
            )}
          </span>
          <button
            type="button"
            onClick={() => updateQty(item.quantity + 1)}
            disabled={isPending || item.quantity >= maxQty}
            className="flex h-9 w-9 items-center justify-center text-surface-500 hover:text-surface-900 disabled:opacity-40"
            aria-label="Crește cantitatea"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Șterge produsul"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
