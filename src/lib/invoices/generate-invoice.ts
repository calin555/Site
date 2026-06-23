import type { OrderRecord } from "@/types/order";
import { formatPrice, formatDate } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { getSiteContactSettings } from "@/lib/services/site-contact.service";

const INVOICEABLE_STATUSES = new Set([
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "COMPLETED",
  "REFUNDED",
]);

export function canDownloadInvoice(order: OrderRecord): boolean {
  return INVOICEABLE_STATUSES.has(order.status);
}

export async function generateInvoiceHtml(order: OrderRecord): Promise<string> {
  const contact = await getSiteContactSettings();
  const invoiceNumber = `FACT-${order.orderNumber}`;
  const issueDate = formatDate(order.paidAt ?? order.createdAt);
  const buyerName = order.companyInvoice.enabled
    ? order.companyInvoice.companyName
    : `${order.shipping.firstName} ${order.shipping.lastName}`;

  const buyerAddress = order.companyInvoice.enabled
    ? [
        order.companyInvoice.billingStreet ?? order.shipping.street,
        order.companyInvoice.billingCity ?? order.shipping.city,
        order.companyInvoice.billingCounty ?? order.shipping.county,
      ].join(", ")
    : [
        order.shipping.street,
        `${order.shipping.city}, ${order.shipping.county}`,
        order.shipping.postalCode,
      ].join("<br>");

  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td>${item.sku}</td>
        <td>${item.name}</td>
        <td style="text-align:center">${item.quantity}</td>
        <td style="text-align:right">${formatPrice(item.price)}</td>
        <td style="text-align:right">${formatPrice(item.total)}</td>
      </tr>`
    )
    .join("");

  const companyBlock = order.companyInvoice.enabled
    ? `<p><strong>CUI:</strong> ${order.companyInvoice.cui}</p>
       ${order.companyInvoice.registrationNumber ? `<p><strong>Reg. Com.:</strong> ${order.companyInvoice.registrationNumber}</p>` : ""}`
    : "";

  return `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <title>Factură ${invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #059669; margin-bottom: 4px; }
    .meta { color: #666; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .box { background: #f8fafc; border-radius: 8px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; }
    th { background: #f1f5f9; font-size: 13px; }
    .totals { margin-left: auto; width: 280px; }
    .totals div { display: flex; justify-content: space-between; padding: 6px 0; }
    .totals .total { font-weight: bold; font-size: 18px; border-top: 2px solid #111; padding-top: 10px; }
    .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; }
  </style>
</head>
<body>
  <h1>${siteConfig.name}</h1>
  <p class="meta">Factură fiscală · ${invoiceNumber} · ${issueDate}</p>

  <div class="grid">
    <div class="box">
      <strong>Furnizor</strong>
      <p>${siteConfig.name}<br>
      ${contact.email}<br>
      ${contact.phoneOrders}</p>
    </div>
    <div class="box">
      <strong>Client</strong>
      <p>${buyerName}<br>${buyerAddress}</p>
      ${companyBlock}
      <p>${order.email}</p>
    </div>
  </div>

  <p><strong>Comandă:</strong> ${order.orderNumber}</p>

  <table>
    <thead>
      <tr>
        <th>SKU</th>
        <th>Produs</th>
        <th>Cant.</th>
        <th>Preț unitar</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>${itemsRows}</tbody>
  </table>

  <div class="totals">
    <div><span>Subtotal</span><span>${formatPrice(order.totals.subtotal)}</span></div>
    ${order.totals.discount > 0 ? `<div><span>Reducere</span><span>-${formatPrice(order.totals.discount)}</span></div>` : ""}
    <div><span>Transport</span><span>${order.totals.shipping === 0 ? "Gratuit" : formatPrice(order.totals.shipping)}</span></div>
    <div><span>TVA (${Math.round(order.totals.vatRate * 100)}%)</span><span>${formatPrice(order.totals.vatAmount)}</span></div>
    <div class="total"><span>Total</span><span>${formatPrice(order.totals.total)}</span></div>
  </div>

  <div class="footer">
    Document generat electronic. Prețurile includ TVA ${Math.round(order.totals.vatRate * 100)}%.<br>
    ${siteConfig.name} · ${contact.email}
  </div>
</body>
</html>`;
}
