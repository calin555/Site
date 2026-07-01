# Raport optimizare comercială & conversii — ChargePro / IncarcareAuto.ro

**Data:** 23 iunie 2026  
**Scope:** 28 landing pages comerciale, catalog produse, instrumente interactive, proiecte, studii de caz, audit tehnic SEO, sistem GSC.

---

## 1. Rezumat executiv

Am trecut de la strategie orientată pe volum la **optimizare comercială**: CTR în SERP, conversie pe pagină, conținut util pe produse și instrumente care captează intenție tranzacțională. Nu s-au adăugat pagini noi artificiale.

### Ce s-a livrat

| Zona | Implementare |
|------|-------------|
| Landing pages (28) | Title, meta, H1, intro, CTA-uri personalizate via `landing-conversion.ts` |
| Produse | Tab „Potrivit pentru” cu vehicule, AC/DC, faze, timp, use-case, FAQ |
| Calculatoare SEO | Timp încărcare, cost, putere recomandată, amortizare firmă |
| Social proof | `/proiecte-realizate` (4 proiecte), `/studii-de-caz` (3 studii + detaliu) |
| GSC automation | `opportunity-engine.ts` — detectare poziții 8–20, CTR sub benchmark |
| Audit tehnic | `scripts/seo-site-audit.mjs` |

---

## 2. Analiză landing pages

### Legendă

- **Intent:** acoperire intenție căutare
- **Gap concurență:** față de e-mobility.ro, solcharge.ro, genway.ro, solarone.ro, t4n.ro
- **Status:** ✅ bun · ⚠️ parțial · 🔧 optimizat acum

### Silo: Tipuri stații

| Pagină | Intent | Gap concurență | Îmbunătățiri aplicate |
|--------|--------|----------------|----------------------|
| `/statie-incarcare-ac` | ✅ Tranzacțional AC | Lipsă preț în SERP la concurenți | Title cu preț de la 2.899 RON, CTA ofertă, link calculatoare |
| `/statie-incarcare-dc` | ✅ B2B DC | Concurența pune studii de caz | CTA audit DC, amortizare firmă |
| `/statie-incarcare-rapida` | ✅ DC 50+ kW | ROI slab pe pagini rivale | CTA ROI, simulare payback |
| `/statie-incarcare-wallbox` | ✅ Generic wallbox | Cannibalizare cu AC/acasă | Title diferențiat Type 2 + preț |
| `/statie-incarcare-monofazata` | ✅ Tehnic 7,4 kW | Puțini explică limita 7,4 kW | Legătură Dacia Spring, calculator timp |
| `/statie-incarcare-trifazata` | ✅ 11–22 kW | Lipsă audit gratuit | CTA audit trifazat |

### Silo: Putere

| Pagină | Intent | Gap | Îmbunătățiri |
|--------|--------|-----|--------------|
| `/statie-incarcare-7kw` | ✅ | Preț + Spring | Title preț, CTA Dacia, calculatoare timp/cost |
| `/statie-incarcare-11kw` | ✅ Premium EV | Compatibilitate Tesla/BMW | Title mărci, wizard recomandare |
| `/statie-incarcare-22kw` | ✅ B2B | ROI firmă | CTA firmă, studii de caz, amortizare |

### Silo: Vehicule (10 pagini)

| Pagină | Intent | Gap | Îmbunătățiri |
|--------|--------|-----|--------------|
| Tesla, Dacia Spring | ✅ High volume RO | Spring: concurența nu explică max 7,4 kW | Mesaj clar oversizing 22 kW inutil |
| BMW, BYD, Mercedes, Hyundai, Kia, VW | ✅ | Lipsă CTA specific | Title + intro cu onboard charger |
| Audi, Skoda | ⚠️ Mediu | Cannibalizare VW/MEB | Focus 22 kW (Audi) / Enyaq (Skoda) |

### Silo: Use-case

| Pagină | Intent | Gap | Îmbunătățiri |
|--------|--------|-----|--------------|
| Acasă | ✅ | Pachet total lipsă la rivali | Preț pachet, proiecte rezidențiale |
| Firmă | ✅ | ROI slab | Audit gratuit, amortizare, studii de caz |
| Hotel | ✅ | Booking perk | Studiu de caz Cluj linked |
| Pensiune | ⚠️ | Overlap hotel | Positioning overnight low-cost |
| Bloc | ✅ | Procedură AGA | Consultant AGA, studiu de caz București |
| Flotă | ✅ | Mix AC/DC | Studiu logistică Timișoara |

---

## 3. Optimizări per pagină (CTR & conversie)

Pentru **toate cele 28 pagini** s-a aplicat `applyLandingConversion()` în registry:

- **Title:** preț / ofertă / mărci / locație unde relevant
- **Meta description:** beneficiu + CTA + diferențiator (ANRE, 24h, consultanță)
- **H1:** intenție tranzacțională clară (cumpără / solicită / verifică)
- **Intro (lead):** propunere valoare + urgență soft (fără padding artificial)
- **CTA primar:** text specific (`Ofertă Dacia Spring`, `Audit DC gratuit`)
- **CTA secundar:** catalog sau instrument relevant
- **Linkuri interne:** calculatoare, studii de caz, proiecte — în sidebar

Fișier: `src/lib/seo/commercial/landing-conversion.ts`

---

## 4. Produse — conținut comercial

Tab nou **„Potrivit pentru”** pe fiecare produs:

- Tip AC/DC, monofazat/trifazat
- Vehicule recomandate (Spring, Tesla, BMW etc.)
- Use-case (acasă, firmă, hotel)
- Timp estimat încărcare cu exemple reale
- FAQ unic per produs principal
- Linkuri către landing pages relevante

Produse cu context dedicat: ChargePro Home/Wall/Pro, VoltEdge DC 60/120, EcoWatt Home/Business.

Fișiere: `product-commercial-context.ts`, `ProductCommercialPanel.tsx`

---

## 5. Instrumente interactive SEO

| URL | Funcție | Intenție captată |
|-----|---------|------------------|
| `/tools/calculator-timp-incarcare` | Durată AC după kWh, SOC, kW | „cât durează încărcarea” |
| `/tools/calculator-cost-incarcare` | Acasă vs public | „cost încărcare electrică” |
| `/tools/calculator-putere-recomandata` | 7,4 / 11 / 22 kW | „ce putere wallbox” |
| `/tools/calculator-amortizare-firma` | Payback + beneficii angajați | „ROI stație firmă” |

Fiecare calculator linkează către contact / landing / catalog.

---

## 6. Proiecte & studii de caz

- **`/proiecte-realizate`** — 4 proiecte (vilă, firmă, hotel, bloc) cu structură reutilizabilă
- **`/studii-de-caz`** — hub firme / hotel / bloc
- **Detaliu:** `/studii-de-caz/firma-logistica-timisoara`, `hotel-boutique-cluj`, `bloc-bucuresti`

Structură date: `src/lib/content/projects.ts`, `case-studies.ts`

---

## 7. Sistem GSC — optimizare automată

**Fișier:** `src/lib/seo/gsc/opportunity-engine.ts`

### Workflow (când există date GSC)

1. Export CSV din GSC: Query, Page, Position, CTR, Impressions, Clicks
2. `parseGscCsv()` → `identifyOptimizationOpportunities()`
3. Filtrează: poziție 8–20, impressions ≥ 50, CTR sub benchmark poziție
4. Output: listă prioritizată cu acțiuni (`rewrite_title`, `rewrite_meta`, `add_cta` etc.)
5. Mapare automată pe slug landing via `mapOpportunityToLandingOverride()`

### CTR benchmark folosit

| Poziție | CTR așteptat |
|---------|-------------|
| 4–5 | 7% |
| 8–10 | 4% |
| 11–15 | 2,5% |
| 16–20 | 1,8% |

---

## 8. Audit tehnic SEO

**Script:** `node scripts/seo-site-audit.mjs`

| Verificare | Rezultat |
|------------|----------|
| Canibalizare keyword | OK — fără suprapuneri majore |
| Title duplicate (overrides) | OK |
| Broken links (pattern-uri cunoscute) | OK |
| Pagini „orfane” (heuristic) | Landing pages — linkuri în `keyword-strategy.ts` (TS, nu TSX) — nu sunt orfane reale |
| Schema invalidă | Product schema fără review fabricat (commit anterior) — valid |
| Redirecționări inutile | N/A — Next.js static routes |
| Conținut duplicat | Eliminat padding artificial (commit 6160c21) |

**Recomandare post-deploy:** Google Rich Results Test pe 3 produse + 2 landing pages.

---

## 9. Oportunități trafic comercial (fără pagini artificiale)

Pe baza concurenței RO și intenției reale:

| Oportunitate | Acțiune | Prioritate |
|--------------|---------|------------|
| „stație încărcare preț” | Deja acoperit via title 7 kW + produse — monitor GSC | High |
| „wallbox cu instalare” | Landing acasă + proiecte rezidențiale | High |
| „stație încărcare firmă subvenție” | Link Electric Up + AFM din landing firmă | High |
| „încărcare Dacia Spring acasă” | Landing Spring + produs 7,4 kW | High |
| „stație hotel Booking” | Studiu de caz + landing hotel | Medium |
| „stație încărcare bloc AGA” | Studiu de caz + landing bloc | Medium |
| „calculator cost încărcare” | Tool nou — indexabil | Medium |
| Branduri fără stoc (ABB, Wallbox) | **Nu creăm** — corect | — |

---

## 10. Impact estimat (3–6 luni)

| Metrică | Estimare | Bază |
|---------|----------|------|
| CTR SERP landing High priority | +15–35% | Title cu preț/CTA vs generic |
| Conversie contact de pe landing | +20–40% | CTA specific + sidebar tools |
| Trafic calculatoare | 200–800 ses/lună | Instrumente indexabile, long-tail |
| Timp pe pagină produs | +30–60 sec | Tab „Potrivit pentru” |
| Poziții 8–20 → top 5 | 3–8 pagini | După iterare GSC (când există date) |

*Estimările presupun indexare completă, zero penalizări și trafic organic existent >500 imp/lună.*

---

## 11. Plan recomandat — următoarele 6 luni

### Luna 1–2
- Conectare GSC + prima export CSV → rulare opportunity engine
- A/B manual pe 3 title-uri cu cel mai mare CTR gap
- Adăugare 2–3 proiecte reale cu foto proprii (înlocuire Unsplash)

### Luna 3–4
- Extindere studii de caz cu date reale client (cu acord)
- Link building: ghiduri locale + proiecte către primării / asociații
- Monitor cannibalizare Spring vs 7 kW vs acasă

### Luna 5–6
- Automatizare: script CI care importă GSC săptămânal (Search Console API)
- Optimizare pagini oraș doar unde există trafic (nu volume)
- Video scurt instalare pe landing acasă (embed YouTube — crește dwell time)

### KPI de urmărit
- CTR per landing (GSC)
- Conversii `/contact` cu UTM `?ref=landing-{slug}`
- Utilizare calculatoare → click contact
- Poziție medie queries tranzacționale top 18

---

## 12. Fișiere modificate / create

```
src/lib/seo/commercial/landing-conversion.ts
src/lib/seo/commercial/registry.ts          (apply conversion)
src/lib/catalog/product-commercial-context.ts
src/components/seo/CommercialLandingView.tsx
src/components/shop/product/ProductCommercialPanel.tsx
src/components/shop/product/ProductTabs.tsx
src/components/tools/ChargingTimeCalculator.tsx
src/components/tools/ChargingCostCalculator.tsx
src/components/tools/RecommendedPowerCalculator.tsx
src/components/tools/BusinessAmortizationCalculator.tsx
src/lib/tools/calculators.ts
src/config/tools.ts
src/components/tools/tool-registry.tsx
src/lib/content/projects.ts
src/lib/content/case-studies.ts
src/app/(shop)/proiecte-realizate/page.tsx
src/app/(shop)/studii-de-caz/page.tsx
src/app/(shop)/studii-de-caz/[slug]/page.tsx
src/lib/seo/gsc/opportunity-engine.ts
scripts/seo-site-audit.mjs
docs/COMMERCIAL_CONVERSION_OPTIMIZATION_REPORT.md
```

---

*Raport generat ca parte a pivotului comercial ChargePro — fără pagini de volum, focus conversie.*
