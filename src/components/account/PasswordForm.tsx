"use client";

import { useState, useTransition } from "react";
import { Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { changePasswordAction } from "@/lib/actions/account.actions";

export function PasswordForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setErrors({});
    setSaved(false);

    startTransition(async () => {
      const result = await changePasswordAction({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
      });
      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      e.currentTarget.reset();
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
            Parola a fost schimbată cu succes.
          </div>
        )}
        <Input
          label="Parola curentă"
          name="currentPassword"
          type="password"
          error={errors.currentPassword}
          required
        />
        <Input
          label="Parolă nouă"
          name="newPassword"
          type="password"
          hint="Minim 8 caractere, o cifră și o literă mare"
          error={errors.newPassword}
          required
        />
        <Input
          label="Confirmă parola nouă"
          name="confirmPassword"
          type="password"
          error={errors.confirmPassword}
          required
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Schimbă parola
        </Button>
      </form>
    </Card>
  );
}
