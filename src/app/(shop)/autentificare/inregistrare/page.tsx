import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/account/RegisterForm";
import { isGoogleOAuthEnabled } from "@/lib/auth/google-oauth";

export const metadata: Metadata = {
  title: "Înregistrare",
  description: "Creează un cont ChargePro.",
};

export default function RegisterPage() {
  const googleEnabled = isGoogleOAuthEnabled();

  return (
    <Suspense>
      <RegisterForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
