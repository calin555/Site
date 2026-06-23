import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/LoginForm";

export const metadata: Metadata = {
  title: "Autentificare",
  description: "Autentifică-te în contul tău ChargePro.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
