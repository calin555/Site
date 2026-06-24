import type { FaqItem } from "@/lib/seo/faq-content";

export function countWords(text: string): number {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!plain) return 0;
  return plain.split(" ").filter(Boolean).length;
}

export interface ContentSection {
  h2?: string;
  h3?: string;
  paragraphs: string[];
  list?: string[];
}

export function sectionsToHtml(sections: ContentSection[]): string {
  return sections
    .map((section) => {
      const parts: string[] = [];
      if (section.h2) parts.push(`<h2>${section.h2}</h2>`);
      if (section.h3) parts.push(`<h3>${section.h3}</h3>`);
      for (const p of section.paragraphs) parts.push(`<p>${p}</p>`);
      if (section.list?.length) {
        parts.push(
          `<ul>${section.list.map((item) => `<li>${item}</li>`).join("")}</ul>`
        );
      }
      return parts.join("\n");
    })
    .join("\n\n");
}

export function faqToHtml(items: FaqItem[]): string {
  if (!items.length) return "";
  return (
    `<h2>Întrebări frecvente</h2>\n` +
    items
      .map(
        (item) =>
          `<h3>${item.question}</h3>\n<p>${item.answer}</p>`
      )
      .join("\n\n")
  );
}

export function internalLinksBlock(links: { href: string; label: string }[]): string {
  if (!links.length) return "";
  return `<h2>Resurse utile</h2>\n<ul>${links
    .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
    .join("")}</ul>`;
}
