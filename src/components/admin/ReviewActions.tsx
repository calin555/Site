"use client";

import { useTransition } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { moderateReviewAction } from "@/lib/actions/admin/admin.actions";

interface ReviewActionsProps {
  reviewId: string;
}

export function ReviewActions({ reviewId }: ReviewActionsProps) {
  const [isPending, startTransition] = useTransition();

  function moderate(status: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      await moderateReviewAction(reviewId, status);
    });
  }

  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={() => moderate("APPROVED")}
        disabled={isPending}
        className="rounded-lg p-1.5 text-brand-600 hover:bg-brand-50 disabled:opacity-50"
        aria-label="Aprobă"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </button>
      <button
        type="button"
        onClick={() => moderate("REJECTED")}
        disabled={isPending}
        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
        aria-label="Respinge"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
