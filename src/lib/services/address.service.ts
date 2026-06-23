import { getSupabase } from "@/lib/supabase/server";
import { addressStore } from "@/lib/addresses/address.store";
import type { SavedAddress, AddressInput } from "@/types/address";

function generateId(): string {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function persistAddress(address: SavedAddress): Promise<void> {
  try {
    const supabase = getSupabase();
    const now = new Date().toISOString();
    const { error } = await supabase.from("addresses").upsert(
      {
        id: address.id,
        userId: address.userId,
        type: address.type,
        firstName: address.firstName,
        lastName: address.lastName,
        company: address.company ?? null,
        street: address.street,
        city: address.city,
        county: address.county,
        postalCode: address.postalCode,
        country: address.country,
        phone: address.phone,
        isDefault: address.isDefault,
        updatedAt: now,
      },
      { onConflict: "id" }
    );

    if (error) throw error;
  } catch {
    // DB unavailable
  }
}

export async function listUserAddresses(userId: string): Promise<SavedAddress[]> {
  const fromStore = addressStore.listByUser(userId);
  if (fromStore.length > 0) return fromStore;

  try {
    const supabase = getSupabase();
    const { data: dbAddresses, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("userId", userId)
      .order("isDefault", { ascending: false })
      .order("createdAt", { ascending: false });

    if (error) throw error;

    for (const dbAddr of dbAddresses ?? []) {
      const addr: SavedAddress = {
        id: dbAddr.id,
        userId: dbAddr.userId,
        type: dbAddr.type,
        firstName: dbAddr.firstName,
        lastName: dbAddr.lastName,
        company: dbAddr.company ?? undefined,
        street: dbAddr.street,
        city: dbAddr.city,
        county: dbAddr.county,
        postalCode: dbAddr.postalCode,
        country: dbAddr.country,
        phone: dbAddr.phone,
        isDefault: dbAddr.isDefault,
        createdAt: dbAddr.createdAt,
        updatedAt: dbAddr.updatedAt,
      };
      addressStore.save(addr);
    }

    return addressStore.listByUser(userId);
  } catch {
    return fromStore;
  }
}

export async function getDefaultAddress(
  userId: string
): Promise<SavedAddress | null> {
  const addresses = await listUserAddresses(userId);
  return addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
}

export async function createAddress(
  userId: string,
  input: AddressInput
): Promise<SavedAddress> {
  const now = new Date().toISOString();
  const isDefault = input.isDefault ?? false;

  if (isDefault) {
    addressStore.clearDefaultForUser(userId);
  }

  const address: SavedAddress = {
    id: generateId(),
    userId,
    type: input.type,
    firstName: input.firstName,
    lastName: input.lastName,
    company: input.company,
    street: input.street,
    city: input.city,
    county: input.county,
    postalCode: input.postalCode,
    country: input.country ?? "RO",
    phone: input.phone,
    isDefault,
    createdAt: now,
    updatedAt: now,
  };

  const existing = addressStore.listByUser(userId);
  if (existing.length === 0) {
    address.isDefault = true;
  }

  addressStore.save(address);
  await persistAddress(address);
  return address;
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: AddressInput
): Promise<{ success: true; address: SavedAddress } | { success: false; error: string }> {
  const existing = addressStore.getById(addressId);
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Adresa nu a fost găsită." };
  }

  if (input.isDefault) {
    addressStore.clearDefaultForUser(userId);
  }

  const updated = addressStore.update(addressId, {
    type: input.type,
    firstName: input.firstName,
    lastName: input.lastName,
    company: input.company,
    street: input.street,
    city: input.city,
    county: input.county,
    postalCode: input.postalCode,
    country: input.country ?? "RO",
    phone: input.phone,
    isDefault: input.isDefault ?? existing.isDefault,
  });

  if (!updated) return { success: false, error: "Actualizare eșuată." };
  await persistAddress(updated);
  return { success: true, address: updated };
}

export async function deleteAddress(
  userId: string,
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  const existing = addressStore.getById(addressId);
  if (!existing || existing.userId !== userId) {
    return { success: false, error: "Adresa nu a fost găsită." };
  }

  addressStore.delete(addressId);

  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", addressId);

    if (error) throw error;
  } catch {
    // in-memory only
  }

  if (existing.isDefault) {
    const remaining = addressStore.listByUser(userId);
    if (remaining.length > 0) {
      addressStore.update(remaining[0].id, { isDefault: true });
    }
  }

  return { success: true };
}

export async function seedDemoAddress(userId: string): Promise<void> {
  if (addressStore.listByUser(userId).length > 0) return;

  const now = new Date().toISOString();
  addressStore.save({
    id: "addr_demo",
    userId,
    type: "BOTH",
    firstName: "Ion",
    lastName: "Popescu",
    street: "Str. Energiei nr. 10",
    city: "București",
    county: "București",
    postalCode: "030101",
    country: "RO",
    phone: "0721234567",
    isDefault: true,
    createdAt: now,
    updatedAt: now,
  });
}
