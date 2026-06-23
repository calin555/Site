import type { CheckoutFormData } from "@/types/checkout";
import {
  createAddress,
  getDefaultAddress,
  updateAddress,
} from "@/lib/services/address.service";
import { updateUserProfile } from "@/lib/services/user.service";
import { splitFullName } from "@/lib/auth/google-oauth";

export async function saveCheckoutDetailsForUser(
  userId: string,
  userName: string,
  form: CheckoutFormData
): Promise<void> {
  const phone = form.phone.trim();
  const { firstName, lastName } = form.shipping;

  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`.trim()
      : userName || `${firstName} ${lastName}`.trim();

  await updateUserProfile(userId, {
    name: fullName || userName,
    email: form.email,
    phone: phone || undefined,
  });

  const addressInput = {
    type: "SHIPPING" as const,
    firstName: form.shipping.firstName,
    lastName: form.shipping.lastName,
    street: form.shipping.street,
    city: form.shipping.city,
    county: form.shipping.county,
    postalCode: form.shipping.postalCode,
    country: form.shipping.country,
    phone,
    isDefault: true,
  };

  const existing = await getDefaultAddress(userId);

  if (existing) {
    await updateAddress(userId, existing.id, addressInput);
  } else {
    await createAddress(userId, addressInput);
  }
}

export function mergeUserNameIntoShipping(
  userName: string,
  shipping: CheckoutFormData["shipping"]
): CheckoutFormData["shipping"] {
  if (shipping.firstName && shipping.lastName) return shipping;

  const { firstName, lastName } = splitFullName(userName);
  return {
    ...shipping,
    firstName: shipping.firstName || firstName,
    lastName: shipping.lastName || lastName,
  };
}
