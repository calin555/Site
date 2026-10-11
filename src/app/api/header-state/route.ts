import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getAccountNavCounts } from "@/lib/account/get-account-data";
import { getCartSummary } from "@/lib/services/cart.service";
import type { HeaderState } from "@/lib/header-state/types";

/**
 * Starea personalizată din header (coș + utilizator) — citită din cookie-uri,
 * deci mereu dinamică și niciodată cache-uită. Paginile publice rămân statice (ISR)
 * și header-ul o încarcă pe client.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const [summary, user] = await Promise.all([
    getCartSummary().catch(() => null),
    getCurrentUser().catch(() => null),
  ]);

  const accountCounts = user
    ? await getAccountNavCounts(user.id, user.email).catch(() => undefined)
    : undefined;

  const body: HeaderState = {
    cartCount: summary?.itemCount ?? 0,
    user,
    accountCounts,
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}
