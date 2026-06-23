import { NextRequest, NextResponse } from "next/server";
import {
  parseCompareQuery,
  runComparison,
} from "@/lib/comparison/market.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const parsed = parseCompareQuery(request.nextUrl.searchParams);

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await runComparison(parsed);
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("[compare]", err);
    return NextResponse.json(
      { error: "Comparison failed" },
      { status: 500 }
    );
  }
}
