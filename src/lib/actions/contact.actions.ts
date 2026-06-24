"use server";

import { getSiteContactSettings } from "@/lib/services/site-contact.service";
import { sendContactMessageEmail } from "@/lib/services/contact-mail.service";
import { isEmailConfigured } from "@/lib/email/send-email";
import { contactFormSchema } from "@/lib/validators/contact";

export async function submitContactMessageAction(
  data: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  if (parsed.data.website?.trim()) {
    return { success: true };
  }

  if (!isEmailConfigured()) {
    return {
      success: false,
      errors: {
        _form:
          "Trimiterea mesajelor nu este configurată. Contactează-ne telefonic sau pe email.",
      },
    };
  }

  try {
    const contact = await getSiteContactSettings();
    await sendContactMessageEmail(contact.email, parsed.data);
    return { success: true };
  } catch (error) {
    console.error("[submitContactMessageAction]", error);
    return {
      success: false,
      errors: {
        _form:
          "Nu am putut trimite mesajul. Încearcă din nou sau contactează-ne direct.",
      },
    };
  }
}
