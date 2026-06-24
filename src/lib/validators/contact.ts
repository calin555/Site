import { z } from "zod";

export const contactFormSchema = z.object({
  firstName: z.string().trim().min(2, "Prenumele este obligatoriu"),
  lastName: z.string().trim().min(2, "Numele este obligatoriu"),
  email: z.string().trim().email("Adresa de email nu este validă"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(10, "Mesajul trebuie să aibă cel puțin 10 caractere"),
  website: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
