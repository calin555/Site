"use client";

import Link from "next/link";
import { legalPaths } from "@/config/legal";
import { cn } from "@/lib/utils";

interface LegalConsentCheckboxProps {
  name?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

export function LegalConsentCheckbox({
  name = "acceptTerms",
  checked,
  onCheckedChange,
  defaultChecked,
  required = true,
  error,
  className,
  id = "legal-consent",
}: LegalConsentCheckboxProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-2.5 text-sm leading-relaxed text-surface-600"
      >
        <input
          id={id}
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          defaultChecked={defaultChecked}
          required={required}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
        />
        <span className="min-w-0 break-words">
          Accept{" "}
          <Link
            href={legalPaths.terms}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline-offset-2 hover:text-brand-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Termenii și condițiile
          </Link>
          ,{" "}
          <Link
            href={legalPaths.privacy}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline-offset-2 hover:text-brand-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Politica de confidențialitate
          </Link>{" "}
          și{" "}
          <Link
            href={legalPaths.gdpr}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline-offset-2 hover:text-brand-700 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            informarea GDPR
          </Link>
          .
        </span>
      </label>
      {error ? (
        <p className={cn("mt-1.5 text-xs text-red-600", !className && "ml-6")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
