import { z } from "zod";
import { ROMANIAN_COUNTIES } from "@/config/commerce";

export const loginSchema = z.object({
  email: z.string().email("Email invalid"),
  password: z.string().min(1, "Parola este obligatorie"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Numele este obligatoriu"),
    email: z.string().email("Email invalid"),
    phone: z
      .string()
      .regex(/^(\+40|0)[0-9]{9}$/, "Număr de telefon invalid")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(8, "Minim 8 caractere")
      .regex(/[A-Z]/, "Cel puțin o literă mare")
      .regex(/[0-9]/, "Cel puțin o cifră"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message:
        "Acceptă termenii, politica de confidențialitate și informarea GDPR",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu coincid",
    path: ["confirmPassword"],
  });

export const profileSchema = z.object({
  name: z.string().min(2, "Numele este obligatoriu"),
  email: z.string().email("Email invalid"),
  phone: z
    .string()
    .regex(/^(\+40|0)[0-9]{9}$/, "Număr de telefon invalid")
    .optional()
    .or(z.literal("")),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Parola curentă este obligatorie"),
    newPassword: z
      .string()
      .min(8, "Minim 8 caractere")
      .regex(/[A-Z]/, "Cel puțin o literă mare")
      .regex(/[0-9]/, "Cel puțin o cifră"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Parolele nu coincid",
    path: ["confirmPassword"],
  });

export const addressSchema = z.object({
  type: z.enum(["SHIPPING", "BILLING", "BOTH"]),
  firstName: z.string().min(2, "Prenumele este obligatoriu"),
  lastName: z.string().min(2, "Numele este obligatoriu"),
  company: z.string().optional(),
  street: z.string().min(5, "Adresa este obligatorie"),
  city: z.string().min(2, "Orașul este obligatoriu"),
  county: z.enum(ROMANIAN_COUNTIES as unknown as [string, ...string[]], {
    message: "Selectează un județ valid",
  }),
  postalCode: z.string().regex(/^\d{6}$/, "Cod poștal invalid (6 cifre)"),
  country: z.string().default("RO"),
  phone: z.string().regex(/^(\+40|0)[0-9]{9}$/, "Telefon invalid"),
  isDefault: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
