"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/lib/auth/require-admin";
import { PERMISSIONS } from "@/config/permissions";
import { saveSiteContactSettings } from "@/lib/services/site-contact.service";

const contactSchema = z.object({
  sectionTitle: z.string().min(1, "Titlul secțiunii este obligatoriu"),
  phoneOrdersLabel: z.string().min(1, "Eticheta pentru comenzi este obligatorie"),
  phoneOrders: z.string().min(6, "Numărul de telefon este prea scurt"),
  phoneTechnicalLabel: z
    .string()
    .min(1, "Eticheta pentru suport tehnic este obligatorie"),
  phoneTechnical: z.string().min(6, "Numărul de telefon este prea scurt"),
  email: z.string().email("Adresa de email nu este validă"),
  address: z.string().min(2, "Adresa este obligatorie"),
  hours: z.string().min(2, "Programul este obligatoriu"),
  headerTagline: z.string().min(2, "Textul din header este obligatoriu"),
});

export async function saveSiteContactAction(
  data: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  await requirePermission(PERMISSIONS.CONTENT_WRITE);

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  const saved = await saveSiteContactSettings(parsed.data);
  if (!saved) {
    return {
      success: false,
      errors: { form: "Setările nu pot fi salvate. Verifică conexiunea la baza de date." },
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/setari/contact");

  return { success: true };
}
