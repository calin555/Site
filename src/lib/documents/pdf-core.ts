import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";
import {
  PDFDocument,
  PDFPage,
  PDFFont,
  RGB,
  rgb,
  type PDFImage,
} from "pdf-lib";
import { siteConfig } from "@/config/site";

const FONT_FILES = {
  regular: "Roboto-Regular.ttf",
  bold: "Roboto-Bold.ttf",
} as const;

let regularFontBytes: Uint8Array | null = null;
let boldFontBytes: Uint8Array | null = null;

export const PAGE = {
  width: 595.28,
  height: 841.89,
  margin: 50,
} as const;

export const BRAND_COLOR: RGB = rgb(0.09, 0.45, 0.27);

export interface PdfFonts {
  regular: PDFFont;
  bold: PDFFont;
}

/** Elimină caractere pe care fontul Roboto nu le poate randa (ex. chineză din import). */
export function sanitizePdfText(text: string): string {
  return text
    .normalize("NFC")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g, "")
    .replace(
      /[^\u0020-\u024F\u2013\u2014\u2022\u00B0\u0218-\u021B\u0102-\u0103\u00C2-\u00CE\u015E-\u015F\u0162-\u0163]/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}

function resolveFontPath(filename: string): string {
  const candidates = [
    path.join(process.cwd(), "src", "lib", "documents", "fonts", filename),
    path.join(process.cwd(), "public", "fonts", filename),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  throw new Error(
    `Fontul ${filename} lipsește. Verifică src/lib/documents/fonts/ sau public/fonts/.`
  );
}

function readFontBytes(filename: string): Uint8Array {
  const filePath = resolveFontPath(filename);
  return new Uint8Array(fs.readFileSync(filePath));
}

export async function createDocument(): Promise<PDFDocument> {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle("ChargePro Document");
  doc.setProducer(siteConfig.name);
  doc.setCreator(siteConfig.url);
  return doc;
}

export async function embedFonts(doc: PDFDocument): Promise<PdfFonts> {
  if (!regularFontBytes) {
    regularFontBytes = readFontBytes(FONT_FILES.regular);
  }
  if (!boldFontBytes) {
    boldFontBytes = readFontBytes(FONT_FILES.bold);
  }

  const [regular, bold] = await Promise.all([
    doc.embedFont(regularFontBytes),
    doc.embedFont(boldFontBytes),
  ]);

  return { regular, bold };
}

export function contentWidth(): number {
  return PAGE.width - PAGE.margin * 2;
}

export function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const safeText = sanitizePdfText(text);
  const words = safeText.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(test, fontSize) <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

export function drawWrappedText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  options: {
    font: PDFFont;
    fontSize: number;
    maxWidth: number;
    lineHeight?: number;
    color?: RGB;
  }
): number {
  const lineHeight = options.lineHeight ?? options.fontSize * 1.35;
  const lines = wrapText(text, options.font, options.fontSize, options.maxWidth);
  let cursorY = y;

  for (const line of lines) {
    page.drawText(line, {
      x,
      y: cursorY,
      size: options.fontSize,
      font: options.font,
      color: options.color ?? rgb(0.15, 0.15, 0.15),
    });
    cursorY -= lineHeight;
  }

  return cursorY;
}

export function drawPageHeader(
  page: PDFPage,
  fonts: PdfFonts,
  title: string,
  subtitle?: string
): number {
  const safeTitle = sanitizePdfText(title);
  const safeSubtitle = subtitle ? sanitizePdfText(subtitle) : undefined;

  page.drawRectangle({
    x: 0,
    y: PAGE.height - 72,
    width: PAGE.width,
    height: 72,
    color: BRAND_COLOR,
  });

  page.drawText(siteConfig.name, {
    x: PAGE.margin,
    y: PAGE.height - 38,
    size: 16,
    font: fonts.bold,
    color: rgb(1, 1, 1),
  });

  page.drawText(safeTitle, {
    x: PAGE.margin,
    y: PAGE.height - 58,
    size: 10,
    font: fonts.regular,
    color: rgb(0.9, 0.95, 0.92),
  });

  if (safeSubtitle) {
    page.drawText(safeSubtitle, {
      x:
        PAGE.width -
        PAGE.margin -
        fonts.regular.widthOfTextAtSize(safeSubtitle, 9),
      y: PAGE.height - 38,
      size: 9,
      font: fonts.regular,
      color: rgb(0.9, 0.95, 0.92),
    });
  }

  return PAGE.height - 96;
}

export function drawPageFooter(
  page: PDFPage,
  fonts: PdfFonts,
  pageNumber: number,
  totalPages: number
): void {
  const footer = sanitizePdfText(
    `${siteConfig.name} · ${siteConfig.contact.email} · ${siteConfig.contact.phone}`
  );
  page.drawLine({
    start: { x: PAGE.margin, y: 40 },
    end: { x: PAGE.width - PAGE.margin, y: 40 },
    thickness: 0.5,
    color: rgb(0.85, 0.85, 0.85),
  });

  page.drawText(footer, {
    x: PAGE.margin,
    y: 26,
    size: 8,
    font: fonts.regular,
    color: rgb(0.45, 0.45, 0.45),
  });

  const pageLabel = `Pagina ${pageNumber} / ${totalPages}`;
  page.drawText(pageLabel, {
    x: PAGE.width - PAGE.margin - fonts.regular.widthOfTextAtSize(pageLabel, 8),
    y: 26,
    size: 8,
    font: fonts.regular,
    color: rgb(0.45, 0.45, 0.45),
  });
}

export async function fetchImageForPdf(
  doc: PDFDocument,
  url: string
): Promise<PDFImage | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(12000),
      headers: { Accept: "image/jpeg,image/png,image/*" },
    });
    if (!res.ok) return null;

    const bytes = await res.arrayBuffer();
    const contentType = (res.headers.get("content-type") ?? "").toLowerCase();
    const lowerUrl = url.toLowerCase();

    if (contentType.includes("webp") || lowerUrl.includes(".webp")) {
      return null;
    }

    if (contentType.includes("png") || lowerUrl.includes(".png")) {
      return doc.embedPng(bytes);
    }

    if (
      contentType.includes("jpeg") ||
      contentType.includes("jpg") ||
      lowerUrl.includes(".jpg") ||
      lowerUrl.includes(".jpeg")
    ) {
      return doc.embedJpg(bytes);
    }

    // Încearcă JPG ca ultimă variantă (ex. CDN fără content-type corect)
    try {
      return doc.embedJpg(bytes);
    } catch {
      try {
        return doc.embedPng(bytes);
      } catch {
        return null;
      }
    }
  } catch {
    return null;
  }
}

export function drawImageFit(
  page: PDFPage,
  embedded: PDFImage,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number
): void {
  const scale = Math.min(maxWidth / embedded.width, maxHeight / embedded.height);
  const width = embedded.width * scale;
  const height = embedded.height * scale;

  page.drawImage(embedded, {
    x,
    y: y - height,
    width,
    height,
  });
}

export function formatDateRo(date = new Date()): string {
  return sanitizePdfText(
    date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  );
}

export function drawSafeText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  options: { font: PDFFont; size: number; color?: RGB }
): void {
  page.drawText(sanitizePdfText(text), {
    x,
    y,
    size: options.size,
    font: options.font,
    color: options.color ?? rgb(0.15, 0.15, 0.15),
  });
}
