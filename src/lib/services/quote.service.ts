import { formatPrice, formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { VAT_RATE } from "@/config/commerce";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";
import type { QuoteRequest } from "@/types/tools";

const quoteStore = new Map<string, QuoteRequest>();

export function saveQuote(quote: QuoteRequest): void {
  quoteStore.set(quote.id, quote);
}

export function getQuote(id: string): QuoteRequest | undefined {
  return quoteStore.get(id);
}

export function generateQuoteReference(): string {
  const num = String(Date.now()).slice(-8);
  return `OF-${num}`;
}

export function calculateQuoteTotals(quote: QuoteRequest) {
  const subtotal = quote.items.reduce(
    (sum, item) => sum + item.unitPriceRon * item.quantity,
    0
  );
  const installation = quote.installationRon;
  const grantDiscount = quote.grantDiscountRon;
  const beforeVat = subtotal + installation - grantDiscount;
  const vat = beforeVat * VAT_RATE;
  const total = beforeVat + vat;

  return {
    subtotal,
    installation,
    grantDiscount,
    beforeVat,
    vat,
    total,
  };
}

export async function generateOfferHtml(quote: QuoteRequest): Promise<string> {
  const contact = await getSiteContactSettings();
  const totals = calculateQuoteTotals(quote);
  const issueDate = formatDate(quote.createdAt);
  const validUntil = formatDate(quote.validUntil);

  const itemRows = quote.items
    .map(
      (item) => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">${formatPrice(item.unitPriceRon)}</td>
        <td style="text-align:right">${formatPrice(item.unitPriceRon * item.quantity)}</td>
      </tr>
      ${item.description ? `<tr><td colspan="4" style="font-size:12px;color:#666;padding-top:0">${item.description}</td></tr>` : ""}`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>Ofertă ${quote.reference}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #059669; margin-bottom: 4px; }
    .meta { color: #666; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .box { background: #f8fafc; border-radius: 8px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; }
    th { background: #f1f5f9; font-size: 13px; }
    .totals { margin-left: auto; width: 320px; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
    .totals .total { font-weight: bold; font-size: 18px; border-top: 2px solid #059669; padding-top: 10px; color: #059669; }
    .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
    .badge { display: inline-block; background: #ecfdf5; color: #059669; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>${siteConfig.name}</h1>
  <p class="meta">Ofertă comercială · <span class="badge">${quote.reference}</span> · ${issueDate}</p>
  <p style="color:#666;font-size:14px">Valabilă până la: <strong>${validUntil}</strong></p>

  <div class="grid">
    <div class="box">
      <h3 style="margin:0 0 8px;font-size:14px;color:#666">Furnizor</h3>
      <p style="margin:0"><strong>${siteConfig.name}</strong></p>
      <p style="margin:4px 0 0;font-size:13px">${contact.email}</p>
      <p style="margin:4px 0 0;font-size:13px">${contact.phoneOrders}</p>
    </div>
    <div class="box">
      <h3 style="margin:0 0 8px;font-size:14px;color:#666">Client</h3>
      <p style="margin:0"><strong>${quote.clientName}</strong></p>
      ${quote.companyName ? `<p style="margin:4px 0 0;font-size:13px">${quote.companyName}</p>` : ""}
      <p style="margin:4px 0 0;font-size:13px">${quote.clientEmail}</p>
      <p style="margin:4px 0 0;font-size:13px">${quote.clientPhone}</p>
      <p style="margin:4px 0 0;font-size:13px">${quote.city}, ${quote.county}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Produs / Serviciu</th>
        <th style="text-align:center">Cant.</th>
        <th style="text-align:right">Preț unitar</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal produse</span><span>${formatPrice(totals.subtotal)}</span></div>
    ${totals.installation > 0 ? `<div><span>Instalare</span><span>${formatPrice(totals.installation)}</span></div>` : ""}
    ${totals.grantDiscount > 0 ? `<div><span>Finanțare / grant</span><span>-${formatPrice(totals.grantDiscount)}</span></div>` : ""}
    <div><span>Total fără TVA</span><span>${formatPrice(totals.beforeVat)}</span></div>
    <div><span>TVA ${VAT_RATE * 100}%</span><span>${formatPrice(totals.vat)}</span></div>
    <div class="total"><span>Total ofertă</span><span>${formatPrice(totals.total)}</span></div>
  </div>

  ${quote.notes ? `<div class="box" style="margin-top:24px"><h3 style="margin:0 0 8px;font-size:14px">Note</h3><p style="margin:0;font-size:13px">${quote.notes}</p></div>` : ""}

  <div class="footer">
    <p>${siteConfig.name} · ${contact.address} · ${contact.email}</p>
    <p>Ofertă generată electronic — nu necesită semnătură pentru consultare.</p>
  </div>
</body>
</html>`;
}
