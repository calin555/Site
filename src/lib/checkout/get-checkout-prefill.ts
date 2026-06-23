import { getCurrentUser } from "@/lib/auth/get-user";
import { isGoogleOAuthEnabled, splitFullName } from "@/lib/auth/google-oauth";
import {
  getDefaultAddress,
  listUserAddresses,
} from "@/lib/services/address.service";
import type { CheckoutFormData } from "@/types/checkout";
import type { PublicUser } from "@/types/user";
import type { SavedAddress } from "@/types/address";

export interface CheckoutPrefillData {
  user: PublicUser | null;
  initialForm: CheckoutFormData;
  addresses: SavedAddress[];
  googleEnabled: boolean;
}

const emptyShipping = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  county: "",
  postalCode: "",
  country: "RO",
};

function addressToForm(
  user: PublicUser,
  address: SavedAddress | null
): CheckoutFormData {
  const fromName = splitFullName(user.name);

  return {
    email: user.email,
    phone: address?.phone ?? user.phone ?? "",
    shipping: address
      ? {
          firstName: address.firstName,
          lastName: address.lastName,
          street: address.street,
          city: address.city,
          county: address.county,
          postalCode: address.postalCode,
          country: address.country,
        }
      : {
          ...emptyShipping,
          firstName: fromName.firstName,
          lastName: fromName.lastName,
        },
    companyInvoice: {
      enabled: false,
      companyName: "",
      cui: "",
    },
    notes: "",
    saveForFuture: true,
  };
}

export async function getCheckoutPrefill(): Promise<CheckoutPrefillData> {
  const user = await getCurrentUser();
  const googleEnabled = isGoogleOAuthEnabled();

  const baseForm: CheckoutFormData = {
    email: "",
    phone: "",
    shipping: { ...emptyShipping },
    companyInvoice: { enabled: false, companyName: "", cui: "" },
    notes: "",
    saveForFuture: true,
  };

  if (!user) {
    return {
      user: null,
      initialForm: baseForm,
      addresses: [],
      googleEnabled,
    };
  }

  const addresses = await listUserAddresses(user.id);
  const defaultAddress = await getDefaultAddress(user.id);

  return {
    user,
    initialForm: addressToForm(user, defaultAddress),
    addresses,
    googleEnabled,
  };
}

export function addressToCheckoutForm(
  user: PublicUser,
  address: SavedAddress
): CheckoutFormData {
  return addressToForm(user, address);
}
