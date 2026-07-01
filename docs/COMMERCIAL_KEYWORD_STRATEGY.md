# Strategie SEO comercială — IncarcareAuto.ro

**Data:** 23 iunie 2026  
**Obiectiv:** Dominare căutări comerciale „stație încărcare + [intent]” în România, fără canibalizare și fără conținut artificial.

---

## Analiză concurență România

### Cine rankează acum (distribuitori / magazine EV)

| Concurent | URL tipic | Ce fac bine | Unde suntem mai bine |
|-----------|-----------|-------------|----------------------|
| **e-mobility.ro** | `/statii-de-incarcare`, produse Autel MaxiCharger | Hub categorii AC/DC/ElectricUP/PNRR; titluri produse SEO („Stație încărcare AC 22 kW”); OCPP, specs | Landing per **marcă auto** (Dacia Spring, Tesla); siloz explicit; conținut local RO |
| **solcharge.ro** | `/shop/statii-de-incarcare-auto/` | Lektri.co fabricat RO, integrare PV | Acoperire multi-brand + ghiduri + catalog unificat |
| **genway.ro** | Pagini produs Fronius Wattpilot | Integrare fotovoltaic, conținut tehnic | Pagini intent (firmă, hotel, bloc) + tools |
| **t4n.ro / solarone.ro** | Categorii AC 22 kW | Preț vizibil, Easee/DEYE | Landing putere + vehicul + CTA consultanță |
| **Magazine generale** | Categorii e-commerce | Autoritate domeniu vechi | Specializare 100% EV + schema Product + FAQ |

### Pattern-uri SERP observate

1. **Intent transactional** — „stație încărcare 22 kW”, „wallbox 11 kW” → pagini produs + categorie
2. **Intent commercial** — „stație încărcare Tesla acasă”, „stație firmă” → mix ghid + produs (puțini concurenți cu landing dedicat)
3. **Intent informational** — „AC vs DC”, „cost instalare” → blog (noi: `/ghid` + `/blog`, nu duplicăm pe landing)

### Decizii strategice ChargePro

- **Landing comercial** = cumpărare / comparare (produse + CTA)
- **Blog** = informațional (fără overlap H1 cu landing)
- **Fără landing brand stație** (ABB, Autel, Schneider…) până nu există produse în catalog — evită thin content
- **Ierarhie siloz** — copil linkează spre părinte (↑ AC, ↑ 7 kW) pentru a evita canibalizarea
- **Fără padding de cuvinte** — conținut util per intent, nu blocuri generice repetate

---

## Matrice keyword → URL

| Keyword principal | URL | Intenție | Dificultate | Prioritate |
|-------------------|-----|----------|-------------|------------|
| stație încărcare AC | `/statie-incarcare-ac` | Transactional | High | **High** |
| stație încărcare DC | `/statie-incarcare-dc` | Transactional | High | **High** |
| stație încărcare rapidă | `/statie-incarcare-rapida` | Commercial | Medium | **High** |
| stație încărcare 7 kW | `/statie-incarcare-7kw` | Transactional | Medium | **High** |
| stație încărcare 11 kW | `/statie-incarcare-11kw` | Transactional | Medium | **High** |
| stație încărcare 22 kW | `/statie-incarcare-22kw` | Transactional | High | **High** |
| stație încărcare Tesla | `/statie-incarcare-tesla` | Commercial | Medium | **High** |
| stație încărcare Dacia Spring | `/statie-incarcare-dacia-spring` | Commercial | Low | **High** |
| stație încărcare BMW | `/statie-incarcare-bmw` | Commercial | Medium | **High** |
| stație încărcare BYD | `/statie-incarcare-byd` | Commercial | Low | **High** |
| stație încărcare Mercedes | `/statie-incarcare-mercedes` | Commercial | Medium | **High** |
| stație încărcare Hyundai | `/statie-incarcare-hyundai` | Commercial | Low | **High** |
| stație încărcare Kia | `/statie-incarcare-kia` | Commercial | Low | **High** |
| stație încărcare Volkswagen | `/statie-incarcare-volkswagen` | Commercial | Medium | **High** |
| stație încărcare acasă | `/statie-incarcare-acasa` | Transactional | High | **High** |
| stație încărcare firmă | `/statie-incarcare-firma` | Transactional | Medium | **High** |
| stație încărcare hotel | `/statie-incarcare-hotel` | Commercial | Low | **High** |
| stație încărcare bloc | `/statie-incarcare-bloc` | Commercial | Medium | **High** |
| stație încărcare wallbox | `/statie-incarcare-wallbox` | Commercial | Medium | Medium |
| stație încărcare monofazată | `/statie-incarcare-monofazata` | Commercial | Low | Medium |
| stație încărcare trifazată | `/statie-incarcare-trifazata` | Commercial | Low | Medium |
| stație încărcare flotă | `/statie-incarcare-flota` | Transactional | Medium | Medium |
| stație încărcare 60 kW | `/statie-incarcare-60kw` | Transactional | Medium | Medium |
| stație încărcare pensiune | `/statie-incarcare-pensiune` | Commercial | Low | Low |
| stație încărcare Audi | `/statie-incarcare-audi` | Commercial | Low | Low |
| stație încărcare Skoda | `/statie-incarcare-skoda` | Commercial | Low | Low |
| stație încărcare 30 kW | `/statie-incarcare-30kw` | Transactional | Low | Low |
| stație încărcare 120 kW | `/statie-incarcare-120kw` | Transactional | Medium | Low |

**Sursă date live:** `src/lib/seo/commercial/keyword-strategy.ts`

---

## Ierarhie siloz (anti-canibalizare)

```
/statii-incarcare (hub)
├── /statie-incarcare-ac
│   ├── /statie-incarcare-7kw
│   │   ├── /statie-incarcare-dacia-spring
│   │   └── /statie-incarcare-monofazata
│   ├── /statie-incarcare-11kw
│   │   ├── /statie-incarcare-tesla
│   │   ├── /statie-incarcare-bmw, byd, mercedes, hyundai, kia, vw
│   ├── /statie-incarcare-22kw
│   │   └── /statie-incarcare-trifazata, /statie-incarcare-firma
│   ├── /statie-incarcare-wallbox
│   └── /statie-incarcare-acasa → /statie-incarcare-bloc
├── /statie-incarcare-dc
│   ├── /statie-incarcare-rapida
│   ├── /statie-incarcare-30kw, 60kw, 120kw
│   └── /statie-incarcare-flota
└── /statie-incarcare-hotel → /statie-incarcare-pensiune
```

Regulă: paginile copil conțin link explicit „↑ părinte” către pagina ierarhic superioară.

---

## Branduri stații (ABB, Wallbox, Autel…)

**Status: NU implementat** — catalogul conține doar branduri proprii (ChargePro, VoltEdge, EcoWatt…).  
**Când adăugăm produse Autel/ABB:** creăm `/produse/brand/[slug]` (existent) + eventual landing dacă volum căutări GSC > 100/lună.

---

## Optimizare produse (căutări generice)

- **Meta + H1 + Schema:** `Stație încărcare AC 22 kW [Nume] pentru Tesla, BMW, Dacia Spring`
- **Card catalog:** titlu scurt `Nume — AC 22 kW` + alt SEO complet
- **Legături inverse:** fiecare produs → 4–6 landing pages relevante (`ProductRelatedLandings`)

---

## Acțiuni recomandate (post-lansare)

1. Google Search Console — monitor impresii per URL High priority
2. Backlinks către `/statie-incarcare-dacia-spring` și `/statie-incarcare-22kw` (low competition RO)
3. Adăugare produse Autel/Fronius → activare `/produse/brand/autel` + mențiune în landing 22 kW
4. **Nu** crea landing brand fără stoc real

---

*Document generat din analiză concurență + implementare `keyword-strategy.ts`.*
