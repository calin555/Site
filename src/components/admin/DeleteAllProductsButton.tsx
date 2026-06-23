"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deleteAllProductsAction } from "@/lib/actions/admin/product.actions";

interface DeleteAllProductsButtonProps {
  count: number;
}

export function DeleteAllProductsButton({ count }: DeleteAllProductsButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  if (count === 0) return null;

  function handleDeleteAll() {
    if (
      !confirm(
        `Ștergi toate cele ${count} produse demo? Această acțiune nu poate fi anulată.`
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteAllProductsAction();
      router.refresh();
    });
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDeleteAll} disabled={isPending}>
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
      Șterge toate ({count})
    </Button>
  );
}
