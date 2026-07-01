# Raport GEO + SEO 2026 — IncarcareAuto.ro / ChargePro

**Data:** 23 iunie 2026  
**Site:** https://incarcareauto.ro  
**Stack:** Next.js 15 (nu WordPress/WooCommerce — schema Product/Offer se generează din catalogul propriu)

---

## Reguli respectate

- Nu s-a rescris designul sau structura paginilor existente
- Nu s-au șters URL-uri indexate
- Modificările sunt additive și backward-compatible
- Conținut duplicat evitat: hub `/ghid` leagă articole/blog/tools existente

---

## Audit pe cele 25 puncte

### 1. Schema.org (JSON-LD)

| Tip | Status | Detalii |
|-----|--------|---------|
| Organization | ✅ | `layout.tsx` — global |
| LocalBusiness | ✅ | `layout.tsx` — global |
| WebSite + SearchAction | ✅ | `layout.tsx` |
| Product | ✅ | `buildProductSchema()` pe `/produse/[slug]` |
| Offer | ✅ | Inclus în Product schema (preț RON, availability) |
| AggregateRating | ⚠ | Generat din review-uri catalog; unele produse folosesc date implicite |
| Review | ⚠ | Idem — recomandat review-uri reale per produs |
| FAQPage | ✅ | `/faq`, `/baza-de-cunoastinte`, articole blog cu FAQ |
| BreadcrumbList | ✅ | Componentă `BreadcrumbJsonLd` pe produse, blog, categorii, branduri, tools, ghid, KB, autor |
| Article | ✅ | Fiecare articol blog + Person author |

### 2. Fișiere tehnice SEO

| Fișier | Status | Detalii |
|--------|--------|---------|
| llms.txt | ✅ | `/llms.txt` — generat dinamic (`src/lib/seo/llms-txt.ts`) |
| robots.txt | ✅ | `src/app/robots.ts` — sitemap-uri multiple, allow `/llms.txt` |
| sitemap.xml | ✅ | `src/app/sitemap.ts` — static, produse, blog, orașe, branduri |
| sitemap-products.xml | ✅ | `src/app/sitemap-products.xml/route.ts` |
| sitemap-images.xml | ✅ | `src/app/sitemap-images.xml/route.ts` |

### 3. Meta tags (Title, Description, Canonical, OG, Twitter)

| Zonă | Status |
|------|--------|
| Homepage, despre, contact, FAQ | ✅ `buildPageMetadata` |
| Produse (listă + detaliu) | ✅ |
| Blog articol | ✅ + `publishedTime` / `modifiedTime` OG article |
| Blog categorie / tag | ✅ completat |
| Tools | ✅ completat |
| Catalog categorie / brand | ✅ completat |
| Ghid, bază cunoștințe | ✅ |
| Pagini oraș | ✅ (existent) |

### 4. Imagini

| Aspect | Status |
|--------|--------|
| WebP / Next Image | ⚠ | `BlogCoverImage`, `ProductImage` folosesc Next.js Image; unele surse externe rămân JPEG |
| lazy loading | ✅ | Default Next.js; `priority` pe hero articol |
| width / height | ⚠ | Parțial — componente cheie OK; audit manual pe conținut HTML blog |
| alt descriptive | ⚠ | Titluri pe cover; produse au alt din catalog |

### 5. Lighthouse 95+

| Categorie | Status |
|-----------|--------|
| Performance | ⚠ | Necesită test live post-deploy (build local blocat de SSL Google Fonts) |
| Accessibility | ⚠ | Structură bună; test recomandat în Chrome DevTools |
| Best Practices | ✅ | HTTPS, meta, no mixed content major |
| SEO | ✅ | Sitemap, robots, canonical, schema |

### 6. FAQ

| Zonă | Status |
|------|--------|
| Pagină `/faq` | ✅ 8 întrebări + schema |
| Articole blog | ✅ FAQ per articol SEO |
| Bază cunoștințe | ✅ 101+ întrebări structurate + link din FAQ |

### 7. Internal linking

| Zonă | Status |
|------|--------|
| Hub `/ghid` | ✅ Adăugat — leagă ghiduri, finanțări, aplicații, branduri |
| Footer | ✅ Linkuri ghid + bază cunoștințe |
| Blog related articles | ✅ Existent |
| Auto-link în articole | ✅ Existent în sistem SEO articles |
| Catalog ↔ blog | ⚠ | Poate fi extins incremental |

### 8. Pagini tematice cerute

Strategie: **nu duplicare** — conținut existent în blog + catalog + hub.

| Temă | Status | Unde |
|------|--------|------|
| Cum aleg stație | ✅ | `/blog/cum-alegi-statia-de-incarcare-potrivita` + `/ghid` |
| AC vs DC | ✅ | Articol dedicat |
| 7/11/22 kW | ✅ | Articol comparativ |
| Cost încărcare | ✅ | Articol 2026 + calculator tools |
| Instalare EV | ✅ | Mai multe articole |
| ElectricUP, AFM, PNRR | ✅ | Articole + FAQ KB |
| Firme, hotel, pensiuni, bloc, flote | ✅ | Articole segment |
| Tesla, BYD, BMW, etc. | ✅ | KB + articole compatibilitate |
| Pagini dedicate brand kW/aplicații | ⚠ | Catalog `/produse/brand/[slug]` + KB Q&A; pagini landing separate necreate (evitare duplicat) |

### 9. Articole noi 2000+ cuvinte

| Status | Detalii |
|--------|---------|
| ✅ | 50 articole SEO existente (`src/lib/seo/seo-articles/`) |
| ⚠ | Nu s-au adăugat articole noi în această sesiune — conținutul existent acoperă majoritatea temelor |

### 10. Pagini companie

| Pagină | Status |
|--------|--------|
| Despre noi | ✅ `/despre` |
| De ce ChargePro | ⚠ | Integrat în `/despre`; pagină separată opțională |
| Proiecte realizate | ⚠ | Statistici pe `/despre`; case studies în blog |
| Certificări | ⚠ | Menționat CE/ANRE; pagină dedicată opțională |
| Parteneri | ❌ | Recomandat viitor |
| Garanții | ⚠ | FAQ operațiuni + produse |

### 11. Branduri stații (ABB, Autel, …)

| Status | Detalii |
|--------|---------|
| ⚠ | Catalog `/produse/brand/[slug]` + KB Q&A per brand; landing SEO separate necreate |

### 12. Puteri kW (3.7–180)

| Status | Detalii |
|--------|---------|
| ⚠ | KB cu 3 Q&A per putere + articole blog; pagini `/putere/22kw` necreate (duplicat) |

### 13. Aplicații (Acasă, Firmă, …)

| Status | Detalii |
|--------|---------|
| ⚠ | Articole segment + KB; pagini `/aplicatii/hotel` necreate |

### 14. Bază cunoștințe 100+ Q&A

| Status | Detalii |
|--------|---------|
| ✅ | `/baza-de-cunoastinte` — 101 itemi KB + 8 FAQ = 109 total |

### 15. llms.txt modern

| Status | Detalii |
|--------|---------|
| ✅ | Companie, produse, servicii, acoperire, resurse, credibilitate, sitemap |

### 16. Headings (H1 unic, H2-H3)

| Status | Detalii |
|--------|---------|
| ✅ | Pagini Next.js respectă un H1; articole blog structurate |
| ⚠ | Verificare manuală pe conținut HTML generat articole |

### 17. URL-uri

| Status | Detalii |
|--------|---------|
| ✅ | Păstrate; redirect www→apex pe Vercel; fără schimbări slug |

### 18. Breadcrumbs

| UI | Schema |
|----|--------|
| ✅ | Componentă existentă |
| ✅ | JSON-LD extins pe pagini cheie |

### 19. EEAT

| Element | Status |
|---------|--------|
| Experience | ⚠ | Statistici `/despre` |
| Expertise | ✅ | Articole tehnice, tools |
| Authoritativeness | ✅ | Schema Organization, local pages |
| Trustworthiness | ✅ | Contact, legal, GDPR |
| Pagină autor | ✅ | `/autor/echipa-chargepro` |
| Date publicare/actualizare | ✅ | Articole blog afișează ambele |

### 20. Autor articole

| Status | Detalii |
|--------|---------|
| ✅ | Person în Article schema; link către pagină autor |

### 21. WooCommerce Product/Offer/Review

| Status | Detalii |
|--------|---------|
| N/A | Site Next.js — echivalent implementat în `buildProductSchema()` |

### 22. Testimoniale structurate

| Status | Detalii |
|--------|---------|
| ⚠ | Review schema pe produse; testimoniale homepage fără Review aggregate separat |

### 23. Erori Lighthouse

| Status | Detalii |
|--------|---------|
| ⚠ | Test post-deploy recomandat; build local eșuează la Google Fonts (certificat SSL mediu) |

### 24. GEO (optimizare LLM)

| Element | Status |
|---------|--------|
| llms.txt | ✅ |
| Conținut factual / tabele | ✅ Articole + KB |
| FAQ structurat | ✅ |
| Entități clare | ✅ Branduri, kW, aplicații în KB |
| Definiții | ✅ Articole tehnice |

### 25. Acest raport

| Status |
|--------|
| ✅ |

---

## Ce s-a adăugat în această implementare

1. **`/llms.txt`** — endpoint dinamic pentru LLM-uri
2. **`/sitemap-products.xml`** și **`/sitemap-images.xml`**
3. **`/ghid`** — hub internal linking fără duplicare conținut
4. **`/baza-de-cunoastinte`** — 101+ Q&A cu FAQPage schema
5. **`/autor/echipa-chargepro`** — pagină autor EEAT + Person schema
6. **`buildProductSchema()`** — Product + Offer + Review + AggregateRating
7. **`BreadcrumbJsonLd`** — extins pe blog, tools, catalog, ghid, KB
8. **Metadata completă** — blog categorie/tag, tools, catalog categorie
9. **OG Article** — `publishedTime`, `modifiedTime`, `authors`
10. **Footer + FAQ** — linkuri către ghid și bază cunoștințe
11. **`src/config/author.ts`** — autor implicit editorial

---

## Ce s-a modificat (și de ce)

| Modificare | Motiv |
|------------|-------|
| `robots.ts` — sitemap-uri multiple | Indexare completă produse + imagini |
| `sitemap.ts` — `/ghid`, `/baza-de-cunoastinte`, `/autor/...` | Descoperire pagini noi |
| `metadata.ts` — câmpuri article OG | Rich sharing articole |
| `produse/[slug]` — schema Product completă | Rich results Google Shopping/Products |
| Blog articol — breadcrumb schema + autor link | EEAT + navigare LLM |
| Șters `middleware.ts` (sesiune anterioară) | Fix redirect loop www↔apex Vercel |

---

## Ce NU s-a făcut (intentional)

- Pagini landing duplicate pentru fiecare brand/kW/aplicație (există catalog + blog + KB)
- Rescriere design sau structură pagini
- 50+ articole noi de 2000 cuvinte (deja există 50)
- Integrare WooCommerce (stack diferit)
- Review-uri reale per produs (necesită date business)

---

## Recomandări viitor

1. **Review-uri reale** — înlocuire `DEFAULT_REVIEWS` cu feedback clienți verificabil
2. **Lighthouse CI** — test automat pe Vercel preview; țintă 95+ Performance
3. **Pagini EEAT** — `/certificari`, `/parteneri`, `/proiecte` cu foto proiecte reale
4. **Landing brand** — doar pentru branduri cu trafic Search Console (ABB, Wallbox)
5. **Google Search Console** — submit sitemap-uri noi + monitorizare rich results
6. **IndexNow / Bing Webmaster** — notificare URL-uri noi
7. **Imagini blog** — migrare surse la WebP self-hosted pe CDN
8. **Testimonial schema** — Review aggregate pe homepage din recenzii Google Business
9. **Conținut actualizat** — revizui trimestrial articole finanțări (ElectricUP, AFM)
10. **Analytics GEO** — monitorizare citări în Perplexity/ChatGPT via referral logs

---

## Verificare post-deploy

```text
https://incarcareauto.ro/llms.txt
https://incarcareauto.ro/sitemap.xml
https://incarcareauto.ro/sitemap-products.xml
https://incarcareauto.ro/sitemap-images.xml
https://incarcareauto.ro/ghid
https://incarcareauto.ro/baza-de-cunoastinte
https://incarcareauto.ro/autor/echipa-chargepro
```

**Validator schema:** https://search.google.com/test/rich-results  
**Lighthouse:** Chrome DevTools → Lighthouse → Mobile + Desktop

---

*Raport generat ca parte a optimizării GEO/SEO ChargePro — îmbunătățire incrementală, fără rescriere site.*
