import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAllowedSiteHost, isSiteDomain, normalizeHost } from "@/lib/site-url";

export function middleware(request: NextRequest) {
  const host = normalizeHost(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? ""
  );

  if (!host || host === "localhost" || host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  if (!isAllowedSiteHost(host)) {
    return NextResponse.next();
  }

  // www.incarauto.ro → incarauto.ro (și la fel pentru incarcareauto.ro)
  if (host.startsWith("www.")) {
    const apex = host.slice(4);
    if (isSiteDomain(apex)) {
      const url = request.nextUrl.clone();
      url.hostname = apex;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
