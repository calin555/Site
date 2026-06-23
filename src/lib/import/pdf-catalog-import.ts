import { extractText, getDocumentProxy } from "unpdf";
import { translateEnglishToRomanian } from "@/lib/import/translate.service";

export interface PdfCatalogImportResult {
  catalogPdfUrl: string;
  descriptionEn: string;
  description: string;
  shortDescription: string;
  warning?: string;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function scoreSection(section: string, productName?: string): number {
  if (!productName?.trim()) return section.length;

  const nameTokens = tokenize(productName);
  const sectionLower = section.toLowerCase();
  let score = 0;

  for (const token of nameTokens) {
    if (sectionLower.includes(token)) score += 3;
  }

  if (/\d+\s*k?w/i.test(section) && /\d+\s*k?w/i.test(productName)) {
    score += 5;
  }

  if (/charger|charging|ev|dc|ac|wallbox|ocpp|ccs/i.test(section)) {
    score += 1;
  }

  return score + Math.min(section.length / 500, 4);
}

function pickRelevantSections(
  pages: string[],
  productName?: string
): { text: string; lowMatch: boolean } {
  const sections = pages
    .map((page) => page.trim())
    .filter((page) => page.length > 80);

  if (!sections.length) return { text: "", lowMatch: false };

  const ranked = sections
    .map((section) => ({ section, score: scoreSection(section, productName) }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best) return { text: "", lowMatch: false };

  const lowMatch = Boolean(productName && best.score < 4);

  if (lowMatch) {
    return {
      text: sections.join("\n\n").slice(0, 6000),
      lowMatch: true,
    };
  }

  const selected = [best.section];
  let totalLength = best.section.length;

  for (const item of ranked.slice(1)) {
    if (selected.length >= 3) break;
    if (totalLength + item.section.length > 5000) break;
    if (item.score < best.score * 0.45) break;
    selected.push(item.section);
    totalLength += item.section.length;
  }

  return {
    text: selected.join("\n\n\n"),
    lowMatch: false,
  };
}

function buildShortDescription(text: string): string {
  const firstParagraph = text.split(/\n{2,}/).find((p) => p.trim().length > 20)?.trim() ?? text;
  const flat = firstParagraph.replace(/\s+/g, " ").trim();
  if (flat.length <= 160) return flat;
  return `${flat.slice(0, 157).trim()}...`;
}

export async function extractTextFromPdfBuffer(
  buffer: Uint8Array
): Promise<string[]> {
  const pdf = await getDocumentProxy(buffer);
  const { text } = await extractText(pdf, { mergePages: false });
  return text.map((page) => page.trim()).filter(Boolean);
}

export async function importDescriptionFromPdf(params: {
  buffer: Uint8Array;
  productName?: string;
}): Promise<{
  descriptionEn: string;
  description: string;
  shortDescription: string;
  warning?: string;
}> {
  const pages = await extractTextFromPdfBuffer(params.buffer);
  if (!pages.length) {
    throw new Error("PDF-ul nu conține text care poate fi extras.");
  }

  const picked = pickRelevantSections(pages, params.productName);
  const descriptionEn = picked.text;
  if (!descriptionEn || descriptionEn.length < 40) {
    throw new Error(
      "Nu am găsit suficient text în catalog. Încearcă un PDF cu descriere textuală sau completează manual."
    );
  }

  let warning: string | undefined;
  if (picked.lowMatch) {
    warning =
      "Nu am găsit o secțiune exactă pentru acest produs în catalog. Am tradus conținutul general al PDF-ului — verifică și editează descrierea.";
  }

  const description = await translateEnglishToRomanian(descriptionEn);
  const shortDescription = buildShortDescription(description);

  return {
    descriptionEn,
    description,
    shortDescription,
    warning,
  };
}
