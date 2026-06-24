import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/LoginForm";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Autentificare",
  description: "Autentificare cont client.",
  path: "/autentificare",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
