import type { CommercialLandingPageData } from "@/lib/seo/commercial/types";
import {
  sectionsToHtml,
  faqToHtml,
  internalLinksBlock,
  countWords,
} from "@/lib/seo/content-utils";

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

export function buildSupplementalSections(
  page: CommercialLandingPageData
): import("@/lib/seo/content-utils").ContentSection[] {
  return [
    {
      h2: `De ce ChargePro pentru ${page.primaryKeyword}`,
      paragraphs: [
        `ChargePro / IncarcareAuto.ro este distribuitor autorizat de stații încărcare EV în România din 2019. Pentru ${page.primaryKeyword}, oferim consultanță tehnică gratuită, selecție echipament conform normelor ANRE și coordonare instalare cu parteneri autorizați.`,
        `Nu vindem doar hardware — dimensionăm puterea, verificăm tabloul electric, recomandăm conectori Type 2 sau CCS2 și integrăm OCPP pentru proiecte comerciale. Fiecare ofertă include specificații clare, preț în RON, termen livrare și opțiuni garanție extinsă.`,
        `Clienții noștri beneficiază de suport telefonic în limba română, documentație pentru finanțări ElectricUP/AFM și asistență post-instalare. Peste 2.500 de proiecte finalizate în țară confirmă experiența noastră cu ${page.primaryKeyword} și soluții similare.`,
      ],
    },
    {
      h2: "Pași de la consultanță la punere în funcțiune",
      paragraphs: [
        "Contactați-ne prin formular, telefon sau WhatsApp — primiți răspuns în max. 24h lucrătoare. Audit tehnic: putere disponibilă, distanță tablou, tip rețea, vehicule de încărcat.",
        "Ofertă scrisă cu echipament recomandat, cost instalare estimativ și timeline. Comandă și livrare 3–10 zile din stoc sau la comandă. Instalare electrician ANRE, test funcțional, proces-verbal recepție.",
        "Configurare app/OCPP, instruire utilizare și activare garanție. Pentru proiecte comerciale: integrare CSMS, RFID, rapoarte consum.",
      ],
      list: [
        "Consultanță gratuită — fără obligație",
        "Ofertă transparentă în RON",
        "Livrare națională",
        "Instalare autorizată ANRE",
        "Suport post-vânzare",
      ],
    },
    {
      h2: "Reglementări și conformitate în România",
      paragraphs: [
        "Instalarea stațiilor de încărcare EV în România este supusă normelor I7-2011, reglementărilor ANRE și IEC 61851. ChargePro furnizează echipamente cu declarație CE și documentație completă pentru avize.",
        "Pentru spații publice și comerciale, pot fi necesare autorizații ISU, aviz ISU, notificare primărie. Vă ghidăm prin lista documentelor — nu lăsăm proiectul blocat birocratic.",
        "Facturarea energiei în condominiu sau firmă necesită subcontorizare sau platformă OCPP — am implementat zeci de astfel de scenarii.",
      ],
    },
  ];
}

export function buildCommercialBodyHtml(page: CommercialLandingPageData): string {
  const parts: string[] = [
    `<p class="lead">${page.intro}</p>`,
    sectionsToHtml(page.sections),
    sectionsToHtml(buildSupplementalSections(page)),
  ];

  if (page.comparisonTable) {
    parts.push(`<h2>Tabel comparativ</h2>`);
    parts.push(comparisonTableToHtml(page.comparisonTable));
  }

  if (page.prosCons) {
    parts.push(prosConsToHtml(page.prosCons));
  }

  parts.push(
    internalLinksBlock([
      ...page.relatedProductLinks,
      { href: page.catalogCtaHref, label: page.catalogCtaLabel },
      { href: "/statii-incarcare", label: "Index stații încărcare — arhitectură completă" },
      { href: "/ghid", label: "Ghiduri tehnice EV" },
      { href: "/contact", label: "Solicită ofertă personalizată" },
    ])
  );

  parts.push(faqToHtml(page.faq));

  return parts.join("\n\n");
}

export function getCommercialWordCount(page: CommercialLandingPageData): number {
  return countWords(buildCommercialBodyHtml(page));
}
