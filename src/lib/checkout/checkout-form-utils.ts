import { splitFullName } from "@/lib/auth/google-oauth";
import type { CheckoutFormData } from "@/types/checkout";
import type { PublicUser } from "@/types/user";
import type { SavedAddress } from "@/types/address";

const emptyShipping = {
  firstName: "",
  lastName: "",
  street: "",
  city: "",
  county: "",
  postalCode: "",
  country: "RO",
};

export function emptyCheckoutForm(): CheckoutFormData {
  return {
    email: "",
    phone: "",
    shipping: { ...emptyShipping },
    companyInvoice: { enabled: false, companyName: "", cui: "" },
    notes: "",
    saveForFuture: true,
  };
}

export function addressToCheckoutForm(
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
