"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Strips ?auth=success from the URL and refreshes server components (session in header). */
export function AuthSessionHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("auth") !== "success") return;

    const url = new URL(window.location.href);
    url.searchParams.delete("auth");
    const clean = url.pathname + url.search;

    router.replace(clean || "/");
    router.refresh();
  }, [searchParams, router]);

  return null;
}
