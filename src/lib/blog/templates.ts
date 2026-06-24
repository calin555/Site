import type { BlogCategory, BlogTag } from "@/types/blog";
import { SEO_ARTICLES } from "@/lib/blog/seo-articles";
import { SEO_ARTICLE_TAGS } from "@/lib/blog/seo-articles/tags";
import { getBlogCoverImage } from "@/lib/blog/blog-cover-images";

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "cat_finantare",
    name: "Finanțare",
    slug: "finantare",
    description: "Programe de finanțare, granturi și fonduri pentru mobilitate electrică.",
  },
  {
    id: "cat_ghiduri",
    name: "Ghiduri",
    slug: "ghiduri",
    description: "Ghiduri practice pentru alegerea și instalarea stațiilor de încărcare.",
  },
  {
    id: "cat_business",
    name: "Business",
    slug: "business",
    description: "Soluții de încărcare EV pentru companii, flote și spații comerciale.",
  },
  {
    id: "cat_tehnic",
    name: "Tehnic",
    slug: "tehnic",
    description: "Articole tehnice despre infrastructură, protocoale și integrări.",
  },
  {
    id: "cat_comparatii",
    name: "Comparații",
    slug: "comparatii",
    description: "Comparații între tehnologii, echipamente și soluții de încărcare EV.",
  },
  {
    id: "cat_costuri",
    name: "Costuri",
    slug: "costuri",
    description: "Analize de cost, ROI, tarife și bugete pentru infrastructura EV.",
  },
];

const EXISTING_TAG_IDS = new Set([
  "tag_afm", "tag_electric_up", "tag_acasa", "tag_business", "tag_solar",
  "tag_flote", "tag_subventii", "tag_instalare",
]);

export const BLOG_TAGS: BlogTag[] = [
  { id: "tag_afm", name: "AFM", slug: "afm" },
  { id: "tag_electric_up", name: "Electric Up", slug: "electric-up" },
  { id: "tag_acasa", name: "Încărcare acasă", slug: "incarcare-acasa" },
  { id: "tag_business", name: "Încărcare business", slug: "incarcare-business" },
  { id: "tag_solar", name: "Solar + EV", slug: "solar-ev" },
  { id: "tag_flote", name: "Flote", slug: "flote" },
  { id: "tag_subventii", name: "Subvenții", slug: "subventii" },
  { id: "tag_instalare", name: "Instalare", slug: "instalare" },
  ...SEO_ARTICLE_TAGS.filter((t) => !EXISTING_TAG_IDS.has(t.id)),
];

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 200));
}

interface ArticleTemplate {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  categoryId: string;
  tagIds: string[];
  author: string;
  publishedAt: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  content: string;
}

const TEMPLATES: ArticleTemplate[] = [
  {
    id: "art_afm",
    slug: "programul-afm-pentru-statii-incarcare-ev",
    title: "Programul AFM pentru stații de încărcare EV: ghid complet 2026",
    excerpt:
      "Cum accesezi finanțarea AFM pentru stații de încărcare, cine este eligibil și ce documente pregătești pentru dosar.",
    coverImage:
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1200&h=630&fit=crop",
    categoryId: "cat_finantare",
    tagIds: ["tag_afm", "tag_subventii", "tag_business"],
    author: "Echipa ChargePro",
    publishedAt: "2026-06-01",
    seo: {
      metaTitle: "Programul AFM stații încărcare EV 2026 | ChargePro",
      metaDescription:
        "Ghid complet AFM pentru finanțarea stațiilor de încărcare electrice în România. Eligibilitate, pași și documente necesare.",
      keywords: ["AFM", "stații încărcare", "finanțare EV", "subvenții"],
    },
    content: `
<h2>Ce este programul AFM pentru mobilitate electrică?</h2>
<p>Administrația Fondului pentru Mediu (AFM) sprijină dezvoltarea infrastructurii de încărcare pentru vehicule electrice prin programe de finanțare dedicate persoanelor juridice, autorităților locale și operatorilor din domeniul transporturilor.</p>
<p>Obiectivul principal este accelerarea tranziției către mobilitatea electrică prin reducerea costurilor de investiție în stații AC și DC.</p>

<h2>Cine poate aplica?</h2>
<ul>
<li>Companii private cu puncte de lucru sau parcări destinate angajaților/clienților</li>
<li>Autorități administrație publică și instituții publice</li>
<li>Operatori de transport rutier și flote comerciale</li>
<li>Dezvoltatori de proiecte imobiliare (rezidențial/comercial)</li>
</ul>

<h2>Ce finanțează programul?</h2>
<p>În funcție de apelul activ, AFM poate acoperi:</p>
<ul>
<li>Stații de încărcare AC (7.4–22 kW) pentru uz rezidențial sau comercial</li>
<li>Stații DC de încărcare rapidă (50–150 kW) pentru hub-uri publice</li>
<li>Costuri de instalare electrică, montaj și punere în funcțiune</li>
<li>Soluții de management și conectivitate (OCPP, facturare)</li>
</ul>

<h2>Pași pentru depunerea dosarului</h2>
<ol>
<li><strong>Verifică ghidul apelului</strong> — citește condițiile de eligibilitate și cotele de finanțare.</li>
<li><strong>Dimensionează proiectul</strong> — alege puterea stațiilor în funcție de trafic și tipul utilizatorilor.</li>
<li><strong>Pregătește documentația</strong> — certificat urbanism, avize, oferte tehnice, plan de amplasament.</li>
<li><strong>Depune dosarul</strong> — prin platforma AFM, în perioada de înscriere.</li>
<li><strong>Implementează și raportează</strong> — montaj, punere în funcțiune, raport final de utilizare.</li>
</ol>

<h2>Sfaturi pentru un dosar câștigător</h2>
<p>Include o analiză clară a consumului estimat, locația geografică strategică și un plan de mentenanță pe 5 ani. Colaborarea cu un integrator certificat (precum ChargePro) crește șansele de aprobare.</p>
<blockquote><p>Consultă echipa noastră tehnică pentru dimensionarea stațiilor eligibile AFM și pregătirea ofertei tehnice.</p></blockquote>
`,
  },
  {
    id: "art_electric_up",
    slug: "electric-up-ghid-finantare-statii-incarcare",
    title: "Electric Up: cum obții finanțare pentru stația ta de încărcare",
    excerpt:
      "Pași practici pentru programul Electric Up — eligibilitate, valoarea finanțării și echipamente acceptate.",
    coverImage:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&h=630&fit=crop",
    categoryId: "cat_finantare",
    tagIds: ["tag_electric_up", "tag_subventii", "tag_acasa"],
    author: "Echipa ChargePro",
    publishedAt: "2026-05-20",
    seo: {
      metaTitle: "Electric Up — finanțare stații încărcare EV | ChargePro",
      metaDescription:
        "Ghid Electric Up: cum beneficiezi de finanțare pentru stația de încărcare acasă sau la firmă. Pași, eligibilitate și echipamente.",
      keywords: ["Electric Up", "finanțare EV", "stație încărcare acasă"],
    },
    content: `
<h2>Despre programul Electric Up</h2>
<p>Electric Up este un program național de sprijin pentru achiziția și instalarea infrastructurii de încărcare a vehiculelor electrice, adresat atât persoanelor fizice, cât și juridicelor.</p>

<h2>Valoarea finanțării</h2>
<p>Finanțarea acoperă un procent din costul stației și al instalației electrice, până la plafonul stabilit în ghidul de finanțare al apelului curent. Stațiile trebuie să fie noi, certificate și instalate de firme autorizate ANRE.</p>

<h2>Echipamente eligibile</h2>
<ul>
<li>Stații wallbox AC 7.4 kW (monofazat) — ideal pentru apartamente și case</li>
<li>Stații AC 11–22 kW (trifazat) — pentru case cu trifazic sau firme mici</li>
<li>Accesorii: cabluri, protecții RCBO, suporturi de perete</li>
</ul>

<h2>Procedura pas cu pas</h2>
<ol>
<li>Achiziționezi un vehicul electric sau hibrid plug-in eligibil</li>
<li>Soliciti ofertă de la un furnizor autorizat (ChargePro)</li>
<li>Depui cererea în platforma programului în perioada deschisă</li>
<li>Primești aprobarea și instalezi stația în termenul prevăzut</li>
<li>Transmiți facturile și procesul-verbal de recepție pentru decontare</li>
</ol>

<h2>Greșeli frecvente</h2>
<p>Multe dosare sunt respinse din cauza instalării neconforme sau a lipsei documentelor electrice. Recomandăm auditul instalației existente înainte de montaj.</p>
`,
  },
  {
    id: "art_acasa",
    slug: "incarcare-ev-acasa-ghid-complet",
    title: "Încărcare EV acasă: ghid complet pentru alegerea stației potrivite",
    excerpt:
      "Monofazat sau trifazat? 7.4 kW sau 22 kW? Tot ce trebuie să știi înainte de a instala un wallbox acasă.",
    coverImage:
      "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=1200&h=630&fit=crop",
    categoryId: "cat_ghiduri",
    tagIds: ["tag_acasa", "tag_instalare"],
    author: "Echipa ChargePro",
    publishedAt: "2026-05-10",
    seo: {
      metaTitle: "Încărcare EV acasă — ghid stație wallbox | ChargePro",
      metaDescription:
        "Cum alegi stația de încărcare pentru acasă: putere, monofazat vs trifazat, costuri instalare și sfaturi practice.",
      keywords: ["încărcare acasă", "wallbox", "stație EV", "7.4 kW"],
    },
    content: `
<h2>De ce ai nevoie de o stație dedicată?</h2>
<p>Încărcarea de la priza standard (Schuko) este lentă și poate suprasolicita instalația electrică. Un wallbox dedicat oferă siguranță, viteză și control prin aplicație mobilă.</p>

<h2>Ce putere alegi?</h2>
<table>
<thead><tr><th>Putere</th><th>Tip rețea</th><th>Timp încărcare*</th><th>Recomandat pentru</th></tr></thead>
<tbody>
<tr><td>3.7 kW</td><td>Monofazat</td><td>~11 h / 100 km</td><td>Condominii, consum redus</td></tr>
<tr><td>7.4 kW</td><td>Monofazat</td><td>~5 h / 100 km</td><td>Case, apartamente</td></tr>
<tr><td>11 kW</td><td>Trifazat</td><td>~3.5 h / 100 km</td><td>Case cu trifazic</td></tr>
<tr><td>22 kW</td><td>Trifazat</td><td>~2 h / 100 km</td><td>Flote mici, case premium</td></tr>
</tbody>
</table>
<p><em>*Estimări pentru un vehicul cu consum mediu de 18 kWh/100 km.</em></p>

<h2>Verificări înainte de instalare</h2>
<ul>
<li>Capacitatea tabloului electric (amperaj disponibil)</li>
<li>Existența circuit trifazic (pentru 11–22 kW)</li>
<li>Distanța între tablou și locul de parcare</li>
<li>Necesitatea autorizației asociației de proprietari (bloc)</li>
</ul>

<h2>Funcții utile</h2>
<p>Stațiile moderne oferă programare încărcare (tarif nocturn), monitorizare consum, RFID pentru acces și actualizări firmware OTA.</p>
`,
  },
  {
    id: "art_business",
    slug: "incarcare-ev-pentru-afaceri-flote",
    title: "Încărcare EV pentru afaceri: soluții pentru flote și spații comerciale",
    excerpt:
      "Cum dimensionezi infrastructura de încărcare pentru angajați, clienți sau flote comerciale — ROI, OCPP și scalabilitate.",
    coverImage:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&h=630&fit=crop",
    categoryId: "cat_business",
    tagIds: ["tag_business", "tag_flote"],
    author: "Echipa ChargePro",
    publishedAt: "2026-04-15",
    seo: {
      metaTitle: "Încărcare EV pentru afaceri și flote | ChargePro",
      metaDescription:
        "Soluții de încărcare EV pentru companii: dimensionare, OCPP, facturare și ROI. Ghid pentru flote și spații comerciale.",
      keywords: ["încărcare business", "flote EV", "stații comerciale", "OCPP"],
    },
    content: `
<h2>De ce investesc companiile în stații de încărcare?</h2>
<p>Stațiile de încărcare la locul de muncă cresc atractivitatea pentru angajați, reduc emisiile flotei și pot genera venituri din servicii publice de încărcare.</p>

<h2>Scenarii de utilizare</h2>
<ul>
<li><strong>Parcare angajați</strong> — stații AC 11–22 kW cu facturare internă</li>
<li><strong>Retail & hospitality</strong> — încărcare gratuită sau cu tarif pentru clienți</li>
<li><strong>Flote de livrare</strong> — încărcare nocturnă + management centralizat</li>
<li><strong>Hub-uri publice</strong> — stații DC 60–120 kW cu plată contactless</li>
</ul>

<h2>Dimensionarea infrastructurii</h2>
<p>Calculează numărul de stații pe baza:</p>
<ol>
<li>Numărul de vehicule electrice actuale și planul de achiziție (3–5 ani)</li>
<li>Timpul mediu de staționare (birou: 8h, retail: 1–2h)</li>
<li>Puterea disponibilă la tabloul electric</li>
<li>Load balancing pentru optimizarea consumului</li>
</ol>

<h2>Management cu OCPP</h2>
<p>Protocolul OCPP permite monitorizarea remote, actualizări firmware, tarifare dinamică și integrare cu platforme de roaming. ChargePro oferă stații compatibile OCPP 1.6J și 2.0.1.</p>

<h2>ROI și finanțare</h2>
<p>Combină investiția cu programe AFM sau fonduri europene. Perioada de recuperare tipică: 3–7 ani, în funcție de tarifare și grad de utilizare.</p>
`,
  },
  {
    id: "art_solar",
    slug: "solar-plus-ev-charging-integrare",
    title: "Solar + încărcare EV: cum integrezi panourile fotovoltaice cu stația ta",
    excerpt:
      "Încarcă mașina cu energie solară proprie. Dimensionare, load balancing și beneficii economice ale integrării PV + EV.",
    coverImage:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=630&fit=crop",
    categoryId: "cat_tehnic",
    tagIds: ["tag_solar", "tag_acasa", "tag_instalare"],
    author: "Echipa ChargePro",
    publishedAt: "2026-03-28",
    seo: {
      metaTitle: "Solar + încărcare EV — integrare fotovoltaică | ChargePro",
      metaDescription:
        "Cum integrezi panouri solare cu stația de încărcare EV. Load balancing, economii și dimensionare sistem PV + wallbox.",
      keywords: ["solar EV", "fotovoltaic", "încărcare solară", "load balancing"],
    },
    content: `
<h2>De ce să combini solar cu EV?</h2>
<p>Încărcarea vehiculului electric cu energie solară proprie reduce costul per kWh la aproape zero în orele de vârf de producție și scade amprenta de carbon a mobilității tale.</p>

<h2>Arhitectura sistemului</h2>
<ul>
<li><strong>Panouri fotovoltaice</strong> — produc energie DC, convertită prin invertor</li>
<li><strong>Invertor hibrid</strong> — gestionează fluxul către casă, baterie sau stație EV</li>
<li><strong>Stație smart EV</strong> — prioritizează surplusul solar prin load balancing</li>
<li><strong>Baterie de stocare (opțional)</strong> — încărcare nocturnă din energie stocată ziua</li>
</ul>

<h2>Load balancing solar</h2>
<p>Stațiile compatibile (ex. ChargePro Home Smart) pot ajusta automat puterea de încărcare în funcție de producția solară disponibilă, evitând importul din rețea în timpul zilei.</p>

<h2>Dimensionare rapidă</h2>
<p>Regulă practică: pentru fiecare 10 km parcurși zilnic ai nevoie de ~2 kWh. Un sistem de 5 kWp produce ~20 kWh/zi (vară), suficient pentru ~100 km de autonomie electrică.</p>

<h2>Beneficii economice</h2>
<p>Combinând Casa Verde Fotovoltaic, Electric Up și tariful rezidențial, perioada de amortizare a întregului sistem (PV + wallbox) poate scădea sub 6 ani.</p>
`,
  },
];

export function buildInitialArticles() {
  const now = new Date().toISOString();
  const templateSlugs = new Set(TEMPLATES.map((t) => t.slug));

  const fromTemplates = TEMPLATES.map((t) => {
    const coverImage = getBlogCoverImage(t.slug, t.coverImage);
    return {
    id: t.id,
    title: t.title,
    slug: t.slug,
    excerpt: t.excerpt,
    content: t.content.trim(),
    coverImage,
    categoryId: t.categoryId,
    tagIds: t.tagIds,
    author: t.author,
    publishedAt: t.publishedAt,
    updatedAt: now,
    readTime: estimateReadTime(t.content),
    isPublished: true,
    seo: {
      metaTitle: t.seo.metaTitle,
      metaDescription: t.seo.metaDescription,
      ogImage: coverImage,
      keywords: t.seo.keywords,
    },
  };
  });

  const fromSeo = SEO_ARTICLES.filter((a) => !templateSlugs.has(a.slug)).map((a) => {
    const coverImage = getBlogCoverImage(a.slug, a.coverImage);
    return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    content: a.content.trim(),
    coverImage,
    categoryId: a.categoryId,
    tagIds: a.tagIds,
    author: a.author,
    publishedAt: a.publishedAt,
    updatedAt: now,
    readTime: estimateReadTime(a.content),
    isPublished: true,
    seo: {
      metaTitle: a.seo.metaTitle,
      metaDescription: a.seo.metaDescription,
      ogImage: coverImage,
      keywords: a.seo.keywords ?? a.targetKeywords,
    },
    faq: a.faq,
  };
  });

  return [...fromTemplates, ...fromSeo];
}
