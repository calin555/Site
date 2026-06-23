import { getSupabase } from "@/lib/supabase/server";
import { isDatabaseEnabled } from "@/lib/db/config";
import { userStore } from "@/lib/users/user.store";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import type { UserRecord, PublicUser } from "@/types/user";

let demoSeeded = false;

function generateId(): string {
  return `usr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function ensureUsers(): Promise<void> {
  if (demoSeeded || isDatabaseEnabled()) return;
  demoSeeded = true;

  const now = new Date().toISOString();

  if (!userStore.getByEmail("demo@chargepro.ro")) {
    userStore.save({
      id: "usr_demo",
      name: "Ion Popescu",
      email: "demo@chargepro.ro",
      phone: "0721234567",
      passwordHash: await hashPassword("Demo1234"),
      roleSlug: "customer",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (!userStore.getByEmail("admin@chargepro.ro")) {
    userStore.save({
      id: "usr_admin",
      name: "Admin ChargePro",
      email: "admin@chargepro.ro",
      phone: "0730000001",
      passwordHash: await hashPassword("Admin1234"),
      roleSlug: "admin",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }

  if (!userStore.getByEmail("super@chargepro.ro")) {
    userStore.save({
      id: "usr_super",
      name: "Super Admin",
      email: "super@chargepro.ro",
      passwordHash: await hashPassword("Super1234"),
      roleSlug: "super-admin",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
  }
}

async function persistUser(user: UserRecord): Promise<void> {
  try {
    const supabase = getSupabase();
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("slug", user.roleSlug)
      .maybeSingle();

    if (roleError || !role) return;

    const now = new Date().toISOString();
    const { error } = await supabase.from("users").upsert(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone ?? null,
        passwordHash: user.passwordHash,
        roleId: role.id,
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

export async function getUserById(id: string): Promise<UserRecord | null> {
  if (isDatabaseEnabled()) {
    try {
      const supabase = getSupabase();
      const { data: dbUser, error } = await supabase
        .from("users")
        .select("*, role:roles!users_roleId_fkey(slug)")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;

      if (dbUser?.passwordHash) {
        const role = dbUser.role as { slug: string };
        const user: UserRecord = {
          id: dbUser.id,
          name: dbUser.name ?? "",
          email: dbUser.email,
          phone: dbUser.phone ?? undefined,
          passwordHash: dbUser.passwordHash,
          roleSlug: role.slug,
          isActive: dbUser.isActive,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        };
        userStore.save(user);
        return user;
      }
    } catch {
      // fall through to memory store
    }
  }

  await ensureUsers();
  return userStore.getById(id);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  if (isDatabaseEnabled()) {
    try {
      const supabase = getSupabase();
      const { data: dbUser, error } = await supabase
        .from("users")
        .select("*, role:roles!users_roleId_fkey(slug)")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (error) throw error;

      if (dbUser?.passwordHash) {
        const role = dbUser.role as { slug: string };
        const user: UserRecord = {
          id: dbUser.id,
          name: dbUser.name ?? "",
          email: dbUser.email,
          phone: dbUser.phone ?? undefined,
          passwordHash: dbUser.passwordHash,
          roleSlug: role.slug,
          isActive: dbUser.isActive,
          createdAt: dbUser.createdAt,
          updatedAt: dbUser.updatedAt,
        };
        userStore.save(user);
        return user;
      }
    } catch {
      // fall through to memory store
    }
  }

  await ensureUsers();
  return userStore.getByEmail(email);
}

export async function registerUser(params: {
  name: string;
  email: string;
  phone?: string;
  password: string;
}): Promise<{ success: true; user: UserRecord } | { success: false; error: string }> {
  await ensureUsers();

  const existing = await getUserByEmail(params.email);
  if (existing) {
    return { success: false, error: "Există deja un cont cu acest email." };
  }

  const passwordHash = await hashPassword(params.password);
  const now = new Date().toISOString();

  const user: UserRecord = {
    id: generateId(),
    name: params.name,
    email: params.email.toLowerCase(),
    phone: params.phone || undefined,
    passwordHash,
    roleSlug: "customer",
    createdAt: now,
    updatedAt: now,
  };

  userStore.save(user);
  await persistUser(user);
  return { success: true, user };
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<UserRecord | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const valid = await verifyPassword(password, user.passwordHash);
  return valid ? user : null;
}

export async function updateUserProfile(
  userId: string,
  data: { name: string; email: string; phone?: string }
): Promise<{ success: true; user: UserRecord } | { success: false; error: string }> {
  const existing = userStore.getById(userId);
  if (!existing) return { success: false, error: "Utilizator negăsit." };

  if (data.email.toLowerCase() !== existing.email.toLowerCase()) {
    const taken = userStore.getByEmail(data.email);
    if (taken && taken.id !== userId) {
      return { success: false, error: "Emailul este deja folosit." };
    }
  }

  const updated = userStore.update(userId, {
    name: data.name,
    email: data.email.toLowerCase(),
    phone: data.phone || undefined,
  });

  if (!updated) return { success: false, error: "Actualizare eșuată." };
  await persistUser(updated);
  return { success: true, user: updated };
}

export async function listCustomers(): Promise<PublicUser[]> {
  await ensureUsers();
  return userStore
    .listAll()
    .filter((u) => u.roleSlug === "customer")
    .map(({ passwordHash: _, ...u }) => u);
}

export async function listAllUsers(): Promise<PublicUser[]> {
  await ensureUsers();
  return userStore.listAll().map(({ passwordHash: _, ...u }) => u);
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const user = userStore.getById(userId);
  if (!user) return { success: false, error: "Utilizator negăsit." };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { success: false, error: "Parola curentă este incorectă." };

  const passwordHash = await hashPassword(newPassword);
  const updated = userStore.update(userId, { passwordHash });
  if (!updated) return { success: false, error: "Actualizare eșuată." };

  await persistUser(updated);
  return { success: true };
}
