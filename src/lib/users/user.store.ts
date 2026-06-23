import type { UserRecord } from "@/types/user";

class UserStore {
  private byId = new Map<string, UserRecord>();
  private byEmail = new Map<string, string>();

  save(user: UserRecord): void {
    this.byId.set(user.id, user);
    this.byEmail.set(user.email.toLowerCase(), user.id);
  }

  getById(id: string): UserRecord | null {
    return this.byId.get(id) ?? null;
  }

  getByEmail(email: string): UserRecord | null {
    const id = this.byEmail.get(email.toLowerCase());
    if (!id) return null;
    return this.byId.get(id) ?? null;
  }

  listAll(): UserRecord[] {
    return Array.from(this.byId.values()).sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  update(id: string, patch: Partial<UserRecord>): UserRecord | null {
    const existing = this.byId.get(id);
    if (!existing) return null;

    const updated: UserRecord = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    if (patch.email && patch.email.toLowerCase() !== existing.email.toLowerCase()) {
      this.byEmail.delete(existing.email.toLowerCase());
      this.byEmail.set(patch.email.toLowerCase(), id);
    }

    this.byId.set(id, updated);
    return updated;
  }
}

export const userStore = new UserStore();
