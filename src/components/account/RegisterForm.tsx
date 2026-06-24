"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Zap, Loader2 } from "lucide-react";
import { Container } from "@/components/shared/Container";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";
import { registerAction } from "@/lib/actions/auth.actions";
import { AuthDivider, SocialAuthSection } from "@/components/account/SocialAuthSection";

interface RegisterFormProps {
  googleEnabled: boolean;
}

export function RegisterForm({ googleEnabled }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams.get("auth_error");
  const authSuccess = searchParams.get("auth") === "success";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!authSuccess) return;
    router.replace("/cont");
    router.refresh();
  }, [authSuccess, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      acceptTerms: formData.get("acceptTerms") === "on",
    };

    setErrors({});
    startTransition(async () => {
      const result = await registerAction(data);
      if (!result.success) {
        setErrors(result.errors);
        return;
      }
      router.push("/cont");
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
            <h1 className="text-2xl font-bold text-surface-900">Creează cont</h1>
            <p className="mt-2 text-sm text-surface-500">
              Alătură-te comunității {siteConfig.name}
            </p>
          </div>

          {errors._form && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errors._form}
            </div>
          )}

          <SocialAuthSection
            returnTo="/autentificare/inregistrare"
            googleEnabled={googleEnabled}
            authError={authError}
          />
          <AuthDivider label="sau completează formularul" />

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nume complet"
              name="name"
              placeholder="Ion Popescu"
              error={errors.name}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="ion@exemplu.ro"
              error={errors.email}
              required
            />
            <Input
              label="Telefon"
              name="phone"
              type="tel"
              placeholder="07xxxxxxxx"
              error={errors.phone}
            />
            <Input
              label="Parolă"
              name="password"
              type="password"
              placeholder="Minim 8 caractere"
              hint="Minim 8 caractere, o cifră și o literă mare"
              error={errors.password}
              required
            />
            <Input
              label="Confirmă parola"
              name="confirmPassword"
              type="password"
              error={errors.confirmPassword}
              required
            />
            <label className="flex items-start gap-2 text-sm text-surface-600">
              <input
                type="checkbox"
                name="acceptTerms"
                className="mt-0.5 h-4 w-4 rounded border-surface-300 text-brand-600"
                required
              />
              Accept termenii și condițiile și politica de confidențialitate
            </label>
            {errors.acceptTerms && (
              <p className="text-xs text-red-600">{errors.acceptTerms}</p>
            )}
            <Button type="submit" fullWidth size="lg" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isPending ? "Se creează..." : "Creează contul"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-surface-500">
            Ai deja cont?{" "}
            <Link
              href="/autentificare"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Autentifică-te
            </Link>
          </p>
        </Card>
      </Container>
    </div>
  );
}
