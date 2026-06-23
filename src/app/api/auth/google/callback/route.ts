import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchGoogleUserProfile } from "@/lib/auth/google-oauth";
import { findOrCreateGoogleUser } from "@/lib/services/google-auth.service";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  buildSessionToken,
} from "@/lib/auth/session";

const STATE_COOKIE = "google_oauth_state";
const RETURN_COOKIE = "google_oauth_return";

function redirectWithError(origin: string, message: string): NextResponse {
  return NextResponse.redirect(
    `${origin}/checkout?auth_error=${encodeURIComponent(message)}`
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;

  try {
    const { searchParams } = requestUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    const cookieStore = await cookies();
    const savedState = cookieStore.get(STATE_COOKIE)?.value;
    const returnTo = cookieStore.get(RETURN_COOKIE)?.value ?? "/checkout";

    cookieStore.delete(STATE_COOKIE);
    cookieStore.delete(RETURN_COOKIE);

    if (oauthError) {
      return redirectWithError(origin, oauthError);
    }

    if (!code || !state || !savedState || state !== savedState) {
      return redirectWithError(origin, "invalid_state");
    }

    const profile = await fetchGoogleUserProfile(code, origin);
    const user = await findOrCreateGoogleUser(profile);

    if (!user?.id) {
      return redirectWithError(origin, "Nu am putut crea contul utilizator.");
    }

    const safeReturn =
      returnTo.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : "/checkout";

    const response = NextResponse.redirect(
      `${origin}${safeReturn}?auth=success`
    );
    response.cookies.set(
      SESSION_COOKIE,
      buildSessionToken(user.id),
      SESSION_COOKIE_OPTIONS
    );

    return response;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Autentificare eșuată";
    console.error("[google/callback]", err);
    return redirectWithError(origin, message);
  }
}
