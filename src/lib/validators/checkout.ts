import { z } from "zod";
import { ROMANIAN_COUNTIES } from "@/config/commerce";

const addressSchema = z.object({
  firstName: z.string().min(2, "Prenumele este obligatoriu"),
  lastName: z.string().min(2, "Numele este obligatoriu"),
  street: z.string().min(5, "Adresa este obligatorie"),
  city: z.string().min(2, "Orașul este obligatoriu"),
  county: z.enum(ROMANIAN_COUNTIES as unknown as [string, ...string[]], {
    message: "Selectează un județ valid",
  }),
  postalCode: z
    .string()
    .regex(/^\d{6}$/, "Codul poștal trebuie să aibă 6 cifre"),
  country: z.string().default("RO"),
});

const companyInvoiceSchema = z
  .object({
    enabled: z.boolean(),
    companyName: z.string().default(""),
    cui: z.string().default(""),
    registrationNumber: z.string().optional(),
    billingStreet: z.string().optional(),
    billingCity: z.string().optional(),
    billingCounty: z.string().optional(),
    billingPostalCode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.enabled) return;

    if (!data.companyName || data.companyName.length < 2) {
      ctx.addIssue({
        code: "custom",
        message: "Denumirea firmei este obligatorie",
        path: ["companyName"],
      });
    }
    if (!data.cui || !/^(RO)?\d{2,10}$/i.test(data.cui.replace(/\s/g, ""))) {
      ctx.addIssue({
        code: "custom",
        message: "CUI invalid (ex: RO12345678)",
        path: ["cui"],
      });
    }
  });

export const checkoutFormSchema = z.object({
  email: z.string().email("Email invalid"),
  phone: z
    .string()
    .regex(/^(\+40|0)[0-9]{9}$/, "Număr de telefon invalid")
    .transform((v) => v.replace(/\s/g, "")),
  shipping: addressSchema,
  companyInvoice: companyInvoiceSchema,
  notes: z.string().max(500).optional(),
});

export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>;
