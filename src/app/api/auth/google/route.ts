import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildGoogleAuthUrl, isGoogleOAuthEnabled } from "@/lib/auth/google-oauth";

const STATE_COOKIE = "google_oauth_state";
const RETURN_COOKIE = "google_oauth_return";

export async function GET(request: Request) {
  if (!isGoogleOAuthEnabled()) {
    return NextResponse.redirect(
      new URL("/checkout?auth_error=google_not_configured", request.url)
    );
  }

  const { searchParams } = new URL(request.url);
  let returnTo = searchParams.get("returnTo") ?? "/checkout";
  if (!returnTo.startsWith("/") || returnTo.startsWith("//")) {
    returnTo = "/checkout";
  }

  const state = crypto.randomUUID();
  const cookieStore = await cookies();

  cookieStore.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  cookieStore.set(RETURN_COOKIE, returnTo, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return NextResponse.redirect(buildGoogleAuthUrl(state, new URL(request.url).origin));
}
