"use client";

import Link from "next/link";
import { LogIn, UserCheck } from "lucide-react";
import type { PublicUser } from "@/types/user";

interface CheckoutAuthSectionProps {
  user: PublicUser | null;
  googleEnabled: boolean;
  authError?: string | null;
  authSuccess?: boolean;
}

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function CheckoutAuthSection({
  user,
  googleEnabled,
  authError,
  authSuccess,
}: CheckoutAuthSectionProps) {
  if (user) {
    return (
      <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <UserCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-surface-900">
              Autentificat ca {user.name}
            </p>
            <p className="text-sm text-surface-600">{user.email}</p>
            {authSuccess && (
              <p className="mt-1 text-sm text-brand-700">
                Datele tale au fost precompletate automat.
              </p>
            )}
            <Link
              href="/cont"
              className="mt-2 inline-block text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Mergi la contul meu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-surface-200 bg-surface-50/80 p-5">
      <div className="mb-4 flex items-center gap-2">
        <LogIn className="h-5 w-5 text-brand-600" />
        <h2 className="text-lg font-bold text-surface-900">
          Autentificare rapidă
        </h2>
      </div>

      <p className="mb-4 text-sm text-surface-600">
        Conectează-te pentru a precompleta automat datele de livrare la comenzile
        viitoare.
      </p>

      {authError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {authError === "google_not_configured"
            ? "Autentificarea Google nu este configurată pe server."
            : authError === "invalid_state"
              ? "Sesiunea de autentificare a expirat. Încearcă din nou."
              : authError}
        </div>
      )}

      {googleEnabled ? (
        <a
          href="/api/auth/google?returnTo=/checkout"
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm font-semibold text-surface-800 shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50/40"
        >
          <GoogleIcon />
          Continuă cu Google
        </a>
      ) : (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Autentificarea Google nu este disponibilă momentan. Completează
          manual formularul de mai jos sau{" "}
          <Link href="/autentificare?next=/checkout" className="font-medium underline">
            autentifică-te cu email
          </Link>
          .
        </p>
      )}

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-surface-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-surface-50 px-3 text-surface-500">
            sau completează manual
          </span>
        </div>
      </div>
    </div>
  );
}
