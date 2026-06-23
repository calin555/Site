import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { fetchGoogleUserProfile } from "@/lib/auth/google-oauth";
import { findOrCreateGoogleUser } from "@/lib/services/google-auth.service";
import { createSession } from "@/lib/auth/session";

const STATE_COOKIE = "google_oauth_state";
const RETURN_COOKIE = "google_oauth_return";

export async function GET(request: Request) {
  const appUrl = (
    process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin
  ).replace(/\/$/, "");

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get(STATE_COOKIE)?.value;
  const returnTo = cookieStore.get(RETURN_COOKIE)?.value ?? "/checkout";

  cookieStore.delete(STATE_COOKIE);
  cookieStore.delete(RETURN_COOKIE);

  if (oauthError) {
    return NextResponse.redirect(
      `${appUrl}/checkout?auth_error=${encodeURIComponent(oauthError)}`
    );
  }

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(
      `${appUrl}/checkout?auth_error=invalid_state`
    );
  }

  try {
    const origin = new URL(request.url).origin;
    const profile = await fetchGoogleUserProfile(code, origin);
    const user = await findOrCreateGoogleUser(profile);
    await createSession(user.id);

    const safeReturn =
      returnTo.startsWith("/") && !returnTo.startsWith("//")
        ? returnTo
        : "/checkout";

    return NextResponse.redirect(`${appUrl}${safeReturn}?auth=success`);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Autentificare eșuată";
    return NextResponse.redirect(
      `${appUrl}/checkout?auth_error=${encodeURIComponent(message)}`
    );
  }
}
