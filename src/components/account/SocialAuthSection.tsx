"use client";

import { useState } from "react";
import { LegalConsentCheckbox } from "@/components/legal/LegalConsentCheckbox";
import { cn } from "@/lib/utils";

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

function AppleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
      />
    </svg>
  );
}

const socialButtonClass =
  "flex w-full items-center justify-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm font-semibold text-surface-800 shadow-sm transition-colors hover:border-brand-200 hover:bg-brand-50/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-surface-200 disabled:hover:bg-white";

function formatAuthError(error: string): string {
  if (error === "google_not_configured") {
    return "Autentificarea Google nu este configurată pe server.";
  }
  if (error === "invalid_state") {
    return "Sesiunea de autentificare a expirat. Încearcă din nou.";
  }
  return error;
}

interface SocialAuthSectionProps {
  returnTo: string;
  googleEnabled: boolean;
  authError?: string | null;
}

export function SocialAuthSection({
  returnTo,
  googleEnabled,
  authError,
}: SocialAuthSectionProps) {
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const googleHref = `/api/auth/google?returnTo=${encodeURIComponent(returnTo)}`;

  function handleGoogleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (consentAccepted) return;
    e.preventDefault();
    setConsentError(true);
  }

  return (
    <div className="space-y-3">
      {authError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formatAuthError(authError)}
        </div>
      ) : null}

      <LegalConsentCheckbox
        id="social-auth-consent"
        checked={consentAccepted}
        onCheckedChange={(checked) => {
          setConsentAccepted(checked);
          if (checked) setConsentError(false);
        }}
        required={false}
        error={
          consentError
            ? "Acceptă termenii, politica de confidențialitate și informarea GDPR pentru a continua."
            : undefined
        }
      />

      {googleEnabled ? (
        <a
          href={googleHref}
          onClick={handleGoogleClick}
          aria-disabled={!consentAccepted}
          className={cn(
            socialButtonClass,
            !consentAccepted && "pointer-events-auto opacity-60"
          )}
        >
          <GoogleIcon />
          Continuă cu Google
        </a>
      ) : (
        <button type="button" disabled className={socialButtonClass}>
          <GoogleIcon />
          Continuă cu Google
        </button>
      )}

      <button
        type="button"
        disabled
        title="Disponibil în curând"
        className={socialButtonClass}
      >
        <AppleIcon />
        Continuă cu Apple
      </button>

      {!googleEnabled ? (
        <p className="text-center text-xs text-surface-400">
          Autentificarea Google necesită configurare server (GOOGLE_CLIENT_ID).
        </p>
      ) : null}
    </div>
  );
}

export function AuthDivider({ label = "sau cu email" }: { label?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-surface-200" />
      </div>
      <div className="relative flex justify-center text-xs uppercase tracking-wide">
        <span className="bg-white px-3 text-surface-500">{label}</span>
      </div>
    </div>
  );
}

export { GoogleIcon };
