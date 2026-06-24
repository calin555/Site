import { siteConfig } from "@/config/site";
import { sendEmail } from "@/lib/email/send-email";
import type { ContactFormData } from "@/lib/validators/contact";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactMessageEmail(
  recipientEmail: string,
  data: ContactFormData
): Promise<void> {
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const subject =
    data.subject?.trim() ||
    `Mesaj contact ${siteConfig.name} — ${fullName}`;

  const phoneLine = data.phone?.trim()
    ? `Telefon: ${data.phone.trim()}`
    : "Telefon: —";

  const text = [
    `Mesaj nou de pe pagina Contact — ${siteConfig.name}`,
    "",
    `Nume: ${fullName}`,
    `Email: ${data.email}`,
    phoneLine,
    `Subiect: ${subject}`,
    "",
    "Mesaj:",
    data.message,
  ].join("\n");

  const html = `
    <h2>Mesaj nou de pe pagina Contact</h2>
    <p><strong>Nume:</strong> ${escapeHtml(fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Telefon:</strong> ${escapeHtml(data.phone?.trim() || "—")}</p>
    <p><strong>Subiect:</strong> ${escapeHtml(subject)}</p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
  `.trim();

  await sendEmail({
    to: recipientEmail,
    subject: `[Contact] ${subject}`,
    text,
    html,
    replyTo: data.email,
  });
}
