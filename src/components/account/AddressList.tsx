"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, MapPin, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AddressForm } from "./AddressForm";
import { deleteAddressAction } from "@/lib/actions/account.actions";
import type { SavedAddress } from "@/types/address";

const TYPE_LABELS: Record<SavedAddress["type"], string> = {
  SHIPPING: "Livrare",
  BILLING: "Facturare",
  BOTH: "Livrare & facturare",
};

interface AddressListProps {
  addresses: SavedAddress[];
}

export function AddressList({ addresses: initial }: AddressListProps) {
  const [addresses, setAddresses] = useState(initial);
  const [editing, setEditing] = useState<SavedAddress | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteAddressAction(id);
      if (result.success) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
      setDeletingId(null);
    });
  }

  function handleSaved() {
    setShowForm(false);
    setEditing(null);
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      {!showForm && !editing && (
        <Button onClick={() => setShowForm(true)} variant="outline">
          <Plus className="h-4 w-4" />
          Adaugă adresă
        </Button>
      )}

      {(showForm || editing) && (
        <Card padding="lg">
          <h3 className="mb-4 font-bold text-surface-900">
            {editing ? "Editează adresa" : "Adresă nouă"}
          </h3>
          <AddressForm
            address={editing ?? undefined}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSaved={handleSaved}
          />
        </Card>
      )}

      {addresses.length === 0 && !showForm ? (
        <Card padding="lg" className="text-center">
          <MapPin className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-surface-500">Nu ai adrese salvate.</p>
        </Card>
      ) : (
        addresses.map((address) => (
          <Card key={address.id} padding="md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-surface-900">
                    {address.firstName} {address.lastName}
                  </p>
                  {address.isDefault && <Badge variant="brand">Principală</Badge>}
                  <Badge variant="outline">{TYPE_LABELS[address.type]}</Badge>
                </div>
                {address.company && (
                  <p className="mt-1 text-sm text-surface-500">{address.company}</p>
                )}
                <p className="mt-2 text-sm text-surface-600">
                  {address.street}
                  <br />
                  {address.city}, {address.county} {address.postalCode}
                  <br />
                  {address.phone}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setEditing(address)}
                  className="rounded-lg p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-700"
                  aria-label="Editează"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  disabled={isPending && deletingId === address.id}
                  className="rounded-lg p-2 text-surface-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label="Șterge"
                >
                  {deletingId === address.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
