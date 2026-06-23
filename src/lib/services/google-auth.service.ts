import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";
import { userStore } from "@/lib/users/user.store";
import type { GoogleUserProfile } from "@/lib/auth/google-oauth";
import type { UserRecord } from "@/types/user";

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function getCustomerRoleId(): Promise<string | null> {
  if (!isDatabaseEnabled()) return null;

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("roles")
      .select("id")
      .eq("slug", "customer")
      .maybeSingle();

    if (error) throw error;
    return data?.id ?? null;
  } catch {
    return null;
  }
}

async function findUserByGoogleAccount(
  providerAccountId: string
): Promise<UserRecord | null> {
  if (!isDatabaseEnabled()) return null;

  try {
    const supabase = getSupabase();
    const { data: account, error } = await supabase
      .from("accounts")
      .select("userId")
      .eq("provider", "google")
      .eq("providerAccountId", providerAccountId)
      .maybeSingle();

    if (error) throw error;
    if (!account?.userId) return null;

    const { getUserById } = await import("@/lib/services/user.service");
    return getUserById(account.userId);
  } catch {
    return null;
  }
}

async function linkGoogleAccount(
  userId: string,
  profile: GoogleUserProfile,
  accessToken?: string
): Promise<void> {
  if (!isDatabaseEnabled()) return;

  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("accounts")
      .select("id")
      .eq("provider", "google")
      .eq("providerAccountId", profile.sub)
      .maybeSingle();

    const payload = {
      userId,
      type: "oauth",
      provider: "google",
      providerAccountId: profile.sub,
      access_token: accessToken ?? null,
      id_token: null,
      scope: "openid email profile",
    };

    if (existing?.id) {
      await supabase.from("accounts").update(payload).eq("id", existing.id);
    } else {
      await supabase.from("accounts").insert({
        id: generateId("acc"),
        ...payload,
      });
    }
  } catch {
    // in-memory fallback
  }
}

async function persistGoogleUser(user: UserRecord, image?: string): Promise<void> {
  if (!isDatabaseEnabled()) return;

  try {
    const supabase = getSupabase();
    const roleId = await getCustomerRoleId();
    if (!roleId) return;

    const now = new Date().toISOString();
    const { error } = await supabase.from("users").upsert(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
        passwordHash: null,
        roleId,
        image: image ?? null,
        emailVerified: now,
        isActive: true,
        updatedAt: now,
      },
      { onConflict: "email" }
    );

    if (error) throw error;
  } catch {
    // DB unavailable
  }
}

export async function findOrCreateGoogleUser(
  profile: GoogleUserProfile,
  accessToken?: string
): Promise<UserRecord> {
  const byAccount = await findUserByGoogleAccount(profile.sub);
  if (byAccount) {
    userStore.save(byAccount);
    await linkGoogleAccount(byAccount.id, profile, accessToken);
    return byAccount;
  }

  const { getUserByEmail } = await import("@/lib/services/user.service");
  const existing = await getUserByEmail(profile.email);

  if (existing) {
    await linkGoogleAccount(existing.id, profile, accessToken);
    const updated = userStore.update(existing.id, {
      name: existing.name || profile.name,
      image: profile.picture,
    }) ?? existing;
    await persistGoogleUser(updated, profile.picture);
    return updated;
  }

  const now = new Date().toISOString();
  const user: UserRecord = {
    id: generateId("usr"),
    name: profile.name,
    email: profile.email.toLowerCase(),
    passwordHash: "",
    roleSlug: "customer",
    isActive: true,
    image: profile.picture,
    createdAt: now,
    updatedAt: now,
  };

  userStore.save(user);
  await persistGoogleUser(user, profile.picture);
  await linkGoogleAccount(user.id, profile, accessToken);

  return user;
}
