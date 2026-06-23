import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/auth/require-admin";
import { hasPermission } from "@/lib/auth/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { refreshMarketData } from "@/lib/comparison/scraper/sync-catalog";

export async function POST() {
  const ctx = await getAdminContext();
  if (!ctx) {
    return NextResponse.json({ error: "Neautorizat" }, { status: 401 });
  }
  if (!hasPermission(ctx.permissions, PERMISSIONS.ANALYTICS_READ)) {
    return NextResponse.json({ error: "Fără permisiune" }, { status: 403 });
  }

  try {
    const result = await refreshMarketData();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[refresh-market]", err);
    return NextResponse.json(
      { error: "Refresh failed" },
      { status: 500 }
    );
  }
}
