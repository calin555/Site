import nodemailer, { type Transporter } from "nodemailer";

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

function smtpPort(): number {
  const raw = process.env.SMTP_PORT?.trim();
  const port = raw ? Number(raw) : 465;
  return Number.isFinite(port) && port > 0 ? port : 465;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "smtp.zoho.eu";
  const port = smtpPort();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.trim();
  const from = process.env.EMAIL_FROM?.trim() || user;

  return { host, port, user, pass, from };
}

export function isEmailConfigured(): boolean {
  const { user, pass, from } = getSmtpConfig();
  return Boolean(user && pass && from);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const { host, port, user, pass } = getSmtpConfig();
  if (!user || !pass) {
    throw new Error("Serviciul de email nu este configurat.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return transporter;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const { from } = getSmtpConfig();
  if (!from) {
    throw new Error("Serviciul de email nu este configurat.");
  }

  const to = Array.isArray(input.to) ? input.to.join(", ") : input.to;

  try {
    await getTransporter().sendMail({
      from,
      to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
    });
  } catch (error) {
    console.error("[send-email] SMTP error:", error);
    throw new Error("Nu am putut trimite emailul.");
  }
}
