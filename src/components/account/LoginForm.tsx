"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { loginAction } from "@/lib/actions/auth.actions";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/cont";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setErrors({});
    startTransition(async () => {
      const result = await loginAction(data);
      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="flex min-h-[calc(100vh-20rem)] items-center py-12">
      <Container size="sm">
        <Card padding="lg" className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-brand">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900">Autentificare</h1>
            <p className="mt-2 text-sm text-surface-500">
              Intră în contul tău {siteConfig.name}
            </p>
          </div>

          {errors._form && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors._form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="demo@chargepro.ro"
              error={errors.email}
              required
            />
            <Input
              label="Parolă"
              name="password"
              type="password"
              placeholder="••••••••"
              error={errors.password}
              required
            />
            <p className="text-xs text-surface-400">
              Demo: demo@chargepro.ro / Demo1234
              <br />
              Admin: admin@chargepro.ro / Admin1234
            </p>
            <Button type="submit" fullWidth size="lg" disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {isPending ? "Se autentifică..." : "Autentifică-te"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            Nu ai cont?{" "}
            <Link
              href="/autentificare/inregistrare"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Înregistrează-te
            </Link>
          </p>
        </Card>
      </Container>
    </div>
  );
}
