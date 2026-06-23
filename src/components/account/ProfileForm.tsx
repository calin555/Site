"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateProfileAction } from "@/lib/actions/account.actions";
import type { PublicUser } from "@/types/user";

interface ProfileFormProps {
  user: PublicUser;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    setSaved(false);

    startTransition(async () => {
      const result = await updateProfileAction({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
      });
      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <Card padding="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors._form && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors._form}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <Check className="h-4 w-4" />
            Profilul a fost actualizat.
          </div>
        )}
        <Input
          label="Nume complet"
          name="name"
          defaultValue={user.name}
          error={errors.name}
          required
        />
        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={user.email}
          error={errors.email}
          required
        />
        <Input
          label="Telefon"
          name="phone"
          type="tel"
          defaultValue={user.phone ?? ""}
          placeholder="07xxxxxxxx"
          error={errors.phone}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Salvează modificările
        </Button>
      </form>
    </Card>
  );
}
