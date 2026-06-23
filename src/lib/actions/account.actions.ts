"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  updateUserProfile,
  changeUserPassword,
} from "@/lib/services/user.service";
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/services/address.service";
import {
  profileSchema,
  passwordChangeSchema,
  addressSchema,
} from "@/lib/validators/user";
import type { ZodIssue } from "zod";

function parseErrors(issues: ZodIssue[]) {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    errors[issue.path.map(String).join(".")] = issue.message;
  }
  return errors;
}

export async function updateProfileAction(
  formData: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, errors: { _form: "Neautentificat." } };

  const parsed = profileSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parseErrors(parsed.error.issues) };
  }

  const result = await updateUserProfile(user.id, {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || undefined,
  });

  if (!result.success) {
    return { success: false, errors: { _form: result.error } };
  }

  revalidatePath("/cont", "layout");
  return { success: true };
}

export async function changePasswordAction(
  formData: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, errors: { _form: "Neautentificat." } };

  const parsed = passwordChangeSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parseErrors(parsed.error.issues) };
  }

  const result = await changeUserPassword(
    user.id,
    parsed.data.currentPassword,
    parsed.data.newPassword
  );

  if (!result.success) {
    return { success: false, errors: { _form: result.error ?? "Eroare." } };
  }

  return { success: true };
}

export async function saveAddressAction(
  formData: unknown,
  addressId?: string
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  const user = await getCurrentUser();
  if (!user) return { success: false, errors: { _form: "Neautentificat." } };

  const parsed = addressSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, errors: parseErrors(parsed.error.issues) };
  }

  const result = addressId
    ? await updateAddress(user.id, addressId, parsed.data)
    : { success: true as const, address: await createAddress(user.id, parsed.data) };

  if (!result.success) {
    return { success: false, errors: { _form: result.error } };
  }

  revalidatePath("/cont/adrese");
  revalidatePath("/cont");
  return { success: true };
}

export async function deleteAddressAction(
  addressId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Neautentificat." };

  const result = await deleteAddress(user.id, addressId);
  if (result.success) {
    revalidatePath("/cont/adrese");
    revalidatePath("/cont");
  }
  return result;
}
