/** Converts a Romanian phone number to a WhatsApp wa.me link. */
export function phoneToWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("40")
    ? digits
    : `40${digits.replace(/^0/, "")}`;
  return `https://wa.me/${international}`;
}

export function buildWhatsAppUrl(
  phone: string,
  message = "Salut! Am o întrebare despre produsele ChargePro."
): string {
  const base = phoneToWhatsApp(phone);
  return `${base}?text=${encodeURIComponent(message)}`;
}
