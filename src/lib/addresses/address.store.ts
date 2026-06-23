import type { SavedAddress } from "@/types/address";

class AddressStore {
  private byId = new Map<string, SavedAddress>();
  private byUser = new Map<string, Set<string>>();

  save(address: SavedAddress): void {
    this.byId.set(address.id, address);
    if (!this.byUser.has(address.userId)) {
      this.byUser.set(address.userId, new Set());
    }
    this.byUser.get(address.userId)!.add(address.id);
  }

  getById(id: string): SavedAddress | null {
    return this.byId.get(id) ?? null;
  }

  listByUser(userId: string): SavedAddress[] {
    const ids = this.byUser.get(userId);
    if (!ids) return [];
    return Array.from(ids)
      .map((id) => this.byId.get(id))
      .filter((a): a is SavedAddress => a !== undefined)
      .sort(
        (a, b) =>
          Number(b.isDefault) - Number(a.isDefault) ||
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  update(id: string, patch: Partial<SavedAddress>): SavedAddress | null {
    const existing = this.byId.get(id);
    if (!existing) return null;

    const updated: SavedAddress = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.byId.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    const existing = this.byId.get(id);
    if (!existing) return false;
    this.byId.delete(id);
    this.byUser.get(existing.userId)?.delete(id);
    return true;
  }

  clearDefaultForUser(userId: string): void {
    const ids = this.byUser.get(userId);
    if (!ids) return;
    for (const id of ids) {
      const addr = this.byId.get(id);
      if (addr?.isDefault) {
        this.byId.set(id, { ...addr, isDefault: false, updatedAt: new Date().toISOString() });
      }
    }
  }
}

export const addressStore = new AddressStore();
