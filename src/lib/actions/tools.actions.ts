"use server";

import { z } from "zod";
import {
  saveQuote,
  generateQuoteReference,
  getQuote,
} from "@/lib/services/quote.service";
import type { QuoteLineItem } from "@/types/tools";

const quoteSchema = z.object({
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(6),
  companyName: z.string().optional(),
  county: z.string().min(1),
  city: z.string().min(1),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productSlug: z.string().optional(),
        name: z.string().min(1),
        quantity: z.number().min(1),
        unitPriceRon: z.number().min(0),
        description: z.string().optional(),
      })
    )
    .min(1),
  installationRon: z.number().min(0).default(0),
  grantDiscountRon: z.number().min(0).default(0),
});

export async function createQuoteAction(
  data: unknown
): Promise<
  | { success: true; quoteId: string; reference: string }
  | { success: false; errors: Record<string, string> }
> {
  const parsed = quoteSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  const id = `quote_${Date.now()}`;
  const reference = generateQuoteReference();
  const now = new Date();
  const validUntil = new Date(now);
  validUntil.setDate(validUntil.getDate() + 30);

  const quote = {
    id,
    reference,
    createdAt: now.toISOString(),
    clientName: parsed.data.clientName,
    clientEmail: parsed.data.clientEmail,
    clientPhone: parsed.data.clientPhone,
    companyName: parsed.data.companyName,
    county: parsed.data.county,
    city: parsed.data.city,
    notes: parsed.data.notes ?? "",
    items: parsed.data.items as QuoteLineItem[],
    installationRon: parsed.data.installationRon,
    grantDiscountRon: parsed.data.grantDiscountRon,
    validUntil: validUntil.toISOString(),
  };

  saveQuote(quote);

  return { success: true, quoteId: id, reference };
}

export async function getQuoteAction(quoteId: string) {
  const quote = getQuote(quoteId);
  if (!quote) return { success: false as const };
  return { success: true as const, quote };
}

const installerRequestSchema = z.object({
  installerId: z.string(),
  clientName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().min(6),
  message: z.string().min(10),
  county: z.string(),
});

export async function requestInstallerAction(
  data: unknown
): Promise<
  | { success: true }
  | { success: false; errors: Record<string, string> }
> {
  const parsed = installerRequestSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.map(String).join(".")] = issue.message;
    }
    return { success: false, errors };
  }

  return { success: true };
}
