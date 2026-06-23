export type AddressType = "SHIPPING" | "BILLING" | "BOTH";

export interface SavedAddress {
  id: string;
  userId: string;
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressInput {
  type: AddressType;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country?: string;
  phone: string;
  isDefault?: boolean;
}
