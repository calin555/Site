"use client";

import { useState, useTransition } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  applyCouponAction,
  removeCouponAction,
} from "@/lib/actions/cart.actions";

interface CouponInputProps {
  appliedCode?: string;
  error?: string;
}

export function CouponInput({ appliedCode, error }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState(error);
  const [isPending, startTransition] = useTransition();

  function handleApply() {
    if (!code.trim()) return;
    setLocalError(undefined);
    startTransition(async () => {
      const result = await applyCouponAction(code);
      if (!result.success) {
        setLocalError(result.error);
      } else {
        setCode("");
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCouponAction();
      setLocalError(undefined);
    });
  }

  if (appliedCode && !localError) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-brand-800">
          <Tag className="h-4 w-4" />
          Cupon aplicat: {appliedCode}
        </div>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="rounded-lg p-1 text-brand-600 hover:bg-brand-100"
          aria-label="Elimină cuponul"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Cod reducere (ex: EV10)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1"
          aria-label="Cod reducere"
        />
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={isPending || !code.trim()}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplică"}
        </Button>
      </div>
      {localError && (
        <p className="text-xs text-red-600">{localError}</p>
      )}
      <p className="text-xs text-surface-400">
        Încearcă: EV10, WELCOME50, TRANSPORT
      </p>
    </div>
  );
}
