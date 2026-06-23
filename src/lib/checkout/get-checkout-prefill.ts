import { getCurrentUser } from "@/lib/auth/get-user";
import { isGoogleOAuthEnabled } from "@/lib/auth/google-oauth";
import {
  getDefaultAddress,
  listUserAddresses,
} from "@/lib/services/address.service";
import {
  addressToCheckoutForm,
  emptyCheckoutForm,
} from "@/lib/checkout/checkout-form-utils";
import type { CheckoutFormData } from "@/types/checkout";
import type { PublicUser } from "@/types/user";
import type { SavedAddress } from "@/types/address";

export interface CheckoutPrefillData {
  user: PublicUser | null;
  initialForm: CheckoutFormData;
  addresses: SavedAddress[];
  googleEnabled: boolean;
}

export async function getCheckoutPrefill(): Promise<CheckoutPrefillData> {
  const user = await getCurrentUser();
  const googleEnabled = isGoogleOAuthEnabled();

  if (!user) {
    return {
      user: null,
      initialForm: emptyCheckoutForm(),
      addresses: [],
      googleEnabled,
    };
  }

  const addresses = await listUserAddresses(user.id);
  const defaultAddress = await getDefaultAddress(user.id);

  return {
    user,
    initialForm: addressToCheckoutForm(user, defaultAddress),
    addresses,
    googleEnabled,
  };
}
