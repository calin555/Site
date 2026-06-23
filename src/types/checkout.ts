export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  country: string;
}

export interface CompanyInvoice {
  enabled: boolean;
  companyName: string;
  cui: string;
  registrationNumber?: string;
  billingStreet?: string;
  billingCity?: string;
  billingCounty?: string;
  billingPostalCode?: string;
}

export interface CheckoutFormData {
  email: string;
  phone: string;
  shipping: CheckoutAddress;
  companyInvoice: CompanyInvoice;
  notes?: string;
  saveForFuture?: boolean;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  subtotalAfterDiscount: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  couponCode?: string;
  couponLabel?: string;
  freeShipping: boolean;
}

export interface CheckoutSession {
  orderNumber: string;
  clientSecret: string | null;
  totals: OrderTotals;
  mockPayment: boolean;
}
