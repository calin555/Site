import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";
import {
  sectionsToHtml,
  faqToHtml,
  internalLinksBlock,
  countWords,
} from "@/lib/seo/content-utils";
import { getInternalLinksForLanding } from "@/lib/seo/commercial/keyword-strategy";

export function comparisonTableToHtml(
  table: NonNullable<CommercialLandingPageData["comparisonTable"]>
): string {
  const caption = table.caption
    ? `<caption>${table.caption}</caption>`
    : "";
  const head = `<thead><tr>${table.headers
    .map((h) => `<th>${h}</th>`)
    .join("")}</tr></thead>`;
  const body = `<tbody>${table.rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
    )
    .join("")}</tbody>`;
  return `<table class="seo-table">${caption}${head}${body}</table>`;
}

export function prosConsToHtml(
  prosCons: NonNullable<CommercialLandingPageData["prosCons"]>
): string {
  return [
    `<h2>Avantaje și dezavantaje</h2>`,
    `<h3>Avantaje</h3>`,
    `<ul>${prosCons.pros.map((p) => `<li>${p}</li>`).join("")}</ul>`,
    `<h3>Dezavantaje / limitări</h3>`,
    `<ul>${prosCons.cons.map((c) => `<li>${c}</li>`).join("")}</ul>`,
  ].join("\n");
}

export function buildCommercialBodyHtml(page: CommercialLandingPageData): string {
  const parts: string[] = [
    `<p class="lead">${page.intro}</p>`,
    sectionsToHtml(page.sections),
  ];

  if (page.comparisonTable) {
    parts.push(`<h2>Tabel comparativ</h2>`);
    parts.push(comparisonTableToHtml(page.comparisonTable));
  }

  if (page.prosCons) {
    parts.push(prosConsToHtml(page.prosCons));
  }

  parts.push(
    internalLinksBlock(getInternalLinksForLanding(page.slug, page))
  );

  parts.push(faqToHtml(page.faq));

  return parts.join("\n\n");
}

export function getCommercialWordCount(page: CommercialLandingPageData): number {
  return countWords(buildCommercialBodyHtml(page));
}
