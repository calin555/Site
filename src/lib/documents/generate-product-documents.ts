import type { ProductDetail } from "@/types/product";
import {
  buildProductSpecs,
  getApplicableDirectives,
  getApplicableStandards,
} from "@/lib/catalog/product-specs";
import {
  BRAND_COLOR,
  PAGE,
  contentWidth,
  createDocument,
  drawImageFit,
  drawPageFooter,
  drawPageHeader,
  drawSafeText,
  drawWrappedText,
  embedFonts,
  fetchImageForPdf,
  formatDateRo,
  sanitizePdfText,
  type PdfFonts,
} from "@/lib/documents/pdf-core";
import { siteConfig } from "@/config/site";
import type { PDFDocument, PDFPage } from "pdf-lib";
import { rgb } from "pdf-lib";

export interface ProductDocumentContext {
  product: ProductDetail;
  specs: ReturnType<typeof buildProductSpecs>;
  directives: string[];
  standards: string[];
}

export function buildDocumentContext(product: ProductDetail): ProductDocumentContext {
  return {
    product,
    specs: buildProductSpecs(product),
    directives: getApplicableDirectives(product),
    standards: getApplicableStandards(product),
  };
}

function groupSpecs(ctx: ProductDocumentContext) {
  const groups = new Map<string, { label: string; value: string }[]>();
  for (const spec of ctx.specs) {
    const group = spec.group ?? "General";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push({ label: spec.label, value: spec.value });
  }
  return groups;
}

function addFootersToAllPages(doc: PDFDocument, fonts: PdfFonts): void {
  const pages = doc.getPages();
  const total = pages.length;
  pages.forEach((page, index) => {
    drawPageFooter(page, fonts, index + 1, total);
  });
}

export async function generateDatasheetPdf(product: ProductDetail): Promise<Uint8Array> {
  const ctx = buildDocumentContext(product);
  const doc = await createDocument();
  const fonts = await embedFonts(doc);
  doc.setTitle(`Fișă tehnică — ${product.name}`);

  const cover = doc.addPage([PAGE.width, PAGE.height]);
  let y = drawPageHeader(cover, fonts, "Fișă tehnică", product.sku);

  cover.drawText(sanitizePdfText(product.name), {
    x: PAGE.margin,
    y,
    size: 20,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 28;

  y = drawWrappedText(cover, product.shortDescription, PAGE.margin, y, {
    font: fonts.regular,
    fontSize: 11,
    maxWidth: contentWidth() * 0.55,
    color: rgb(0.35, 0.35, 0.35),
  });
  y -= 8;

  const metaLines = [
    `Brand: ${product.brand}`,
    `Categorie: ${product.category}`,
    `SKU: ${product.sku}`,
    `Putere: ${product.powerKw > 0 ? `${product.powerKw} kW` : "—"}`,
  ];

  for (const line of metaLines) {
    drawSafeText(cover, line, PAGE.margin, y, {
      font: fonts.regular,
      size: 10,
      color: rgb(0.25, 0.25, 0.25),
    });
    y -= 16;
  }

  const heroImage = await fetchImageForPdf(doc, product.image);
  if (heroImage) {
    drawImageFit(
      cover,
      heroImage,
      PAGE.width - PAGE.margin - 200,
      PAGE.height - 120,
      200,
      200
    );
  }

  const specsPage = doc.addPage([PAGE.width, PAGE.height]);
  y = drawPageHeader(specsPage, fonts, "Specificații tehnice", product.name);
  y -= 4;

  specsPage.drawText("Specificații tehnice complete", {
    x: PAGE.margin,
    y,
    size: 14,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 24;

  for (const [group, items] of groupSpecs(ctx)) {
    if (y < 100) break;

    specsPage.drawText(group, {
      x: PAGE.margin,
      y,
      size: 11,
      font: fonts.bold,
      color: BRAND_COLOR,
    });
    y -= 18;

    for (const item of items) {
      if (y < 80) break;

      specsPage.drawText(item.label, {
        x: PAGE.margin,
        y,
        size: 9,
        font: fonts.bold,
        color: rgb(0.2, 0.2, 0.2),
      });

      const valueLines = drawWrappedText(
        specsPage,
        item.value,
        PAGE.margin + 180,
        y,
        {
          font: fonts.regular,
          fontSize: 9,
          maxWidth: contentWidth() - 180,
        }
      );

      y = Math.min(y - 14, valueLines - 4);
    }

    y -= 10;
  }

  const imageUrls = product.images.map((img) => img.url).slice(0, 6);
  if (imageUrls.length > 0) {
    let galleryPage = doc.addPage([PAGE.width, PAGE.height]);
    y = drawPageHeader(galleryPage, fonts, "Catalog fotografic", product.name);
    y -= 4;

    galleryPage.drawText("Catalog fotografic", {
      x: PAGE.margin,
      y,
      size: 14,
      font: fonts.bold,
      color: rgb(0.1, 0.1, 0.1),
    });
    y -= 10;

    galleryPage.drawText(
      "Imagini reprezentative ale stației de încărcare — modelul comandat poate diferi ușor.",
      {
        x: PAGE.margin,
        y,
        size: 9,
        font: fonts.regular,
        color: rgb(0.45, 0.45, 0.45),
      }
    );
    y -= 24;

    const cols = 2;
    const cellW = (contentWidth() - 16) / cols;
    const cellH = 220;
    let col = 0;
    let rowY = y;

    for (let i = 0; i < imageUrls.length; i++) {
      const embedded = await fetchImageForPdf(doc, imageUrls[i]);
      if (!embedded) continue;

      const x = PAGE.margin + col * (cellW + 16);
      galleryPage.drawRectangle({
        x,
        y: rowY - cellH,
        width: cellW,
        height: cellH,
        borderColor: rgb(0.88, 0.88, 0.88),
        borderWidth: 1,
        color: rgb(0.98, 0.98, 0.98),
      });

      drawImageFit(galleryPage, embedded, x + 8, rowY - 8, cellW - 16, cellH - 36);

      const caption = product.images[i]?.alt ?? `Imagine ${i + 1}`;
      galleryPage.drawText(caption, {
        x: x + 8,
        y: rowY - cellH + 12,
        size: 8,
        font: fonts.regular,
        color: rgb(0.4, 0.4, 0.4),
      });

      col++;
      if (col >= cols) {
        col = 0;
        rowY -= cellH + 20;
        if (rowY < 120 && i < imageUrls.length - 1) {
          galleryPage = doc.addPage([PAGE.width, PAGE.height]);
          rowY = drawPageHeader(galleryPage, fonts, "Catalog fotografic", product.name) - 20;
        }
      }
    }
  }

  addFootersToAllPages(doc, fonts);
  return doc.save();
}

function drawSectionTitle(
  page: PDFPage,
  fonts: PdfFonts,
  title: string,
  y: number
): number {
  page.drawText(title, {
    x: PAGE.margin,
    y,
    size: 12,
    font: fonts.bold,
    color: BRAND_COLOR,
  });
  return y - 20;
}

function drawBulletList(
  page: PDFPage,
  fonts: PdfFonts,
  items: string[],
  y: number,
  maxWidth: number
): number {
  for (const item of items) {
    y = drawWrappedText(page, `• ${item}`, PAGE.margin + 8, y, {
      font: fonts.regular,
      fontSize: 10,
      maxWidth: maxWidth - 8,
      lineHeight: 14,
    });
    y -= 4;
  }
  return y;
}

export async function generateInstallationManualPdf(
  product: ProductDetail
): Promise<Uint8Array> {
  const doc = await createDocument();
  const fonts = await embedFonts(doc);
  doc.setTitle(`Manual de instalare — ${product.name}`);

  const phasesLabel =
    product.phases === "SINGLE" ? "monofazat 230V AC" : "trifazat 400V AC";

  const sections: { title: string; paragraphs: string[]; bullets?: string[] }[] = [
    {
      title: "1. Informații generale",
      paragraphs: [
        `Acest manual de instalare se aplică stației de încărcare ${product.name} (SKU: ${product.sku}), produs ${product.brand}, destinat pieței din România.`,
        "Documentul este elaborat conform SR EN IEC 61851-1, Normelor I7-2011 privind instalațiile electrice de joasă tensiune și cerințelor ANRE pentru infrastructura de reîncărcare a vehiculelor electrice.",
      ],
    },
    {
      title: "2. Avertismente de siguranță",
      paragraphs: [
        "Instalarea trebuie efectuată exclusiv de un electrician autorizat ANRE. Nerespectarea instrucțiunilor poate duce la electrocutare, incendiu sau deteriorarea echipamentului.",
      ],
      bullets: [
        "Deconectați alimentarea înainte de orice intervenție.",
        "Respectați distanțele minime față de surse de apă și inflamabile.",
        "Utilizați protecție diferențială RCD Tip A sau A6, conform SR EN IEC 61851-1.",
        "Nu utilizați stația dacă carcasa este fisurată sau dacă există urme de ardere.",
        "Păstrați acces liber la tabloul electric și la stație pentru mentenanță.",
      ],
    },
    {
      title: "3. Date tehnice de instalare",
      paragraphs: [
        `Putere nominală: ${product.powerKw} kW · Alimentare: ${phasesLabel}.`,
        `Conectori: ${product.connectorTypes.join(", ") || "conform model"}. Dimensiuni și greutate: consultați documentația producătorului.`,
      ],
      bullets: [
        "Secțiune cablu recomandată: calculată de electrician conform distanței și curentului (min. 3×6 mm² pentru 7,4 kW monofazat).",
        "Disjunctor dedicat dimensionat la 125% din curentul nominal.",
        "Împământare funcțională ≤ 0,1 Ω la borna stației.",
        "Montaj: perete/stâlp, vertical, cu spațiu minim 300 mm lateral pentru ventilație.",
      ],
    },
    {
      title: "4. Procedură de montaj",
      paragraphs: ["Urmați pașii de mai jos în ordinea indicată:"],
      bullets: [
        "Verificați integritatea coletului și a accesoriilor din cutie.",
        "Marcați poziția de montaj conform șablonului (4× Ø8 mm pentru fixare perete).",
        "Traseați cablajul de alimentare până la punctul de conectare.",
        "Fixați suportul/backplate-ul pe perete cu dibluri adecvate tipului de zidărie.",
        "Conectați L1/L2/L3/N/PE conform schemei electrice (monofazat: L/N/PE).",
        "Montați carcasa stației și strângeți șuruburile la cuplul recomandat (≈ 2,5 N·m).",
        "Efectuați test RCD și verificarea continuității de împământare.",
        "Alimentați stația și verificați LED-urile de status.",
      ],
    },
    {
      title: "5. Punere în funcțiune",
      paragraphs: [
        "Configurați rețeaua WiFi/Ethernet din aplicația mobilă ChargePro sau portalul web indicat pe etichetă.",
        "Setați curentul maxim de încărcare ≤ valoarea aprobată de electrician și a tabloului.",
        "Efectuați o sesiune test de minimum 15 minute și verificați temperatura carcasei.",
      ],
    },
    {
      title: "6. Mentenanță și depanare",
      bullets: [
        "Inspecție vizuală anuală: cablu, conector, carcasă, etichete.",
        "Curățare cu lavetă umedă; nu folosiți solventi agresivi.",
        "Reset din aplicație la erori de comunicație; contactați suportul ChargePro dacă persistă.",
        "Înlocuiți stația dacă RCD declanșează repetat fără sarcină conectată.",
      ],
      paragraphs: [
        `Suport tehnic: ${siteConfig.contact.phoneTechnical} · ${siteConfig.contact.email}`,
      ],
    },
    {
      title: "7. Declarație de conformitate instalare",
      paragraphs: [
        "Prin finalizarea instalării conform acestui manual, executorul confirmă respectarea SR EN IEC 61851-1, a Normelor I7-2011 și a reglementărilor ANRE aplicabile.",
        "Păstrați procesul-verbal de recepție și schema electrică actualizată împreună cu acest manual.",
      ],
    },
  ];

  let page = doc.addPage([PAGE.width, PAGE.height]);
  let y = drawPageHeader(page, fonts, "Manual de instalare", product.sku);

  page.drawText(product.name, {
    x: PAGE.margin,
    y,
    size: 16,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 30;

  for (const section of sections) {
    if (y < 120) {
      page = doc.addPage([PAGE.width, PAGE.height]);
      y = drawPageHeader(page, fonts, "Manual de instalare", product.name) - 10;
    }

    y = drawSectionTitle(page, fonts, section.title, y);

    for (const paragraph of section.paragraphs) {
      y = drawWrappedText(page, paragraph, PAGE.margin, y, {
        font: fonts.regular,
        fontSize: 10,
        maxWidth: contentWidth(),
        lineHeight: 14,
      });
      y -= 8;
    }

    if (section.bullets) {
      y = drawBulletList(page, fonts, section.bullets, y, contentWidth());
      y -= 8;
    }

    y -= 6;
  }

  addFootersToAllPages(doc, fonts);
  return doc.save();
}

export async function generateCeCertificatePdf(
  product: ProductDetail
): Promise<Uint8Array> {
  const ctx = buildDocumentContext(product);
  const doc = await createDocument();
  const fonts = await embedFonts(doc);
  doc.setTitle(`Certificat CE — ${product.name}`);

  const certNumber = `CE-${product.sku}-${new Date().getFullYear()}`;
  const issueDate = formatDateRo();

  let page = doc.addPage([PAGE.width, PAGE.height]);
  let y = drawPageHeader(page, fonts, "Declarație de conformitate UE", certNumber);

  page.drawText("DECLARAȚIE DE CONFORMITATE UE", {
    x: PAGE.margin,
    y,
    size: 16,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.1),
  });
  y -= 22;

  page.drawText("EU DECLARATION OF CONFORMITY", {
    x: PAGE.margin,
    y,
    size: 11,
    font: fonts.regular,
    color: rgb(0.4, 0.4, 0.4),
  });
  y -= 28;

  const blocks: { label: string; value: string }[] = [
    {
      label: "Nr. document / Document No.",
      value: certNumber,
    },
    {
      label: "Producător / Manufacturer",
      value: `${product.brand}\n${siteConfig.contact.address}\nEmail: ${siteConfig.contact.email}`,
    },
    {
      label: "Importator / Distributor (RO)",
      value: `${siteConfig.name}\n${siteConfig.contact.address}\nTel: ${siteConfig.contact.phone}`,
    },
    {
      label: "Descriere produs / Product description",
      value: `${product.name}\nModel / SKU: ${product.sku}\nCategorie: ${product.category}\nPutere: ${product.powerKw > 0 ? `${product.powerKw} kW` : "N/A"}`,
    },
    {
      label: "Obiectul declarației / Object of declaration",
      value:
        "Stație de încărcare pentru vehicule electrice / Electric vehicle charging station",
    },
  ];

  for (const block of blocks) {
    page.drawText(block.label, {
      x: PAGE.margin,
      y,
      size: 10,
      font: fonts.bold,
      color: BRAND_COLOR,
    });
    y -= 16;

    y = drawWrappedText(page, block.value, PAGE.margin, y, {
      font: fonts.regular,
      fontSize: 10,
      maxWidth: contentWidth(),
      lineHeight: 14,
    });
    y -= 16;
  }

  if (y < 280) {
    page = doc.addPage([PAGE.width, PAGE.height]);
    y = drawPageHeader(page, fonts, "Declarație de conformitate UE", certNumber) - 10;
  }

  y = drawSectionTitle(page, fonts, "Directive UE aplicabile / Applicable EU Directives", y);
  y = drawBulletList(page, fonts, ctx.directives, y, contentWidth());
  y -= 12;

  y = drawSectionTitle(
    page,
    fonts,
    "Standarde armonizate aplicate / Applied harmonised standards",
    y
  );
  y = drawBulletList(page, fonts, ctx.standards, y, contentWidth());
  y -= 12;

  y = drawSectionTitle(page, fonts, "Declarație / Statement", y);
  y = drawWrappedText(
    page,
    "Sub semnătura noastră, declarăm că produsul descris mai sus este conform cu directivele UE enumerate. Declarația se bazează pe evaluarea conformității și pe documentația tehnică disponibilă.",
    PAGE.margin,
    y,
    { font: fonts.regular, fontSize: 10, maxWidth: contentWidth(), lineHeight: 14 }
  );
  y -= 8;

  y = drawWrappedText(
    page,
    "We hereby declare under our sole responsibility that the product described above conforms to the listed EU directives, based on conformity assessment and available technical documentation.",
    PAGE.margin,
    y,
    { font: fonts.regular, fontSize: 9, maxWidth: contentWidth(), lineHeight: 13, color: rgb(0.4, 0.4, 0.4) }
  );
  y -= 24;

  page.drawText("Loc și data / Place and date:", {
    x: PAGE.margin,
    y,
    size: 10,
    font: fonts.bold,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 16;
  page.drawText(`${siteConfig.contact.address}, ${issueDate}`, {
    x: PAGE.margin,
    y,
    size: 10,
    font: fonts.regular,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 36;

  page.drawText("Semnătură autorizată / Authorised signature:", {
    x: PAGE.margin,
    y,
    size: 10,
    font: fonts.bold,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 40;

  page.drawLine({
    start: { x: PAGE.margin, y },
    end: { x: PAGE.margin + 220, y },
    thickness: 0.5,
    color: rgb(0.3, 0.3, 0.3),
  });
  y -= 16;

  page.drawText("Responsabil conformitate / Compliance officer", {
    x: PAGE.margin,
    y,
    size: 9,
    font: fonts.regular,
    color: rgb(0.35, 0.35, 0.35),
  });
  page.drawText(siteConfig.name, {
    x: PAGE.margin,
    y: y - 14,
    size: 9,
    font: fonts.bold,
    color: rgb(0.2, 0.2, 0.2),
  });

  addFootersToAllPages(doc, fonts);
  return doc.save();
}

export type ProductDocumentType = "datasheet" | "manual" | "certificate";

export async function generateProductDocumentPdf(
  type: ProductDocumentType,
  product: ProductDetail
): Promise<Uint8Array> {
  switch (type) {
    case "datasheet":
      return generateDatasheetPdf(product);
    case "manual":
      return generateInstallationManualPdf(product);
    case "certificate":
      return generateCeCertificatePdf(product);
  }
}

export const DOCUMENT_FILENAMES: Record<ProductDocumentType, string> = {
  datasheet: "fisa-tehnica",
  manual: "manual-instalare",
  certificate: "certificat-ce",
};
