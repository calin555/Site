import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/services/user.service";
import type { PublicUser } from "@/types/user";

export async function getCurrentUser(): Promise<PublicUser | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await getUserById(session.userId);
  if (!user) return null;

  const { passwordHash: _, ...publicUser } = user;
  return publicUser;
}

export async function requireAuth(redirectTo = "/cont"): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/autentificare?next=${encodeURIComponent(redirectTo)}`);
  }
  return user;
}
