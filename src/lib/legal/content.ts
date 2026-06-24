import { siteConfig } from "@/config/site";

export interface LegalSection {
  title: string;
  paragraphs: string[];
  list?: string[];
}

const company = siteConfig.name;
const email = siteConfig.contact.email;
const updatedAt = "23 iunie 2025";

export const legalUpdatedAt = updatedAt;

export const termsSections: LegalSection[] = [
  {
    title: "1. Informații generale",
    paragraphs: [
      `Prezentele Termeni și Condiții reglementează utilizarea site-ului și serviciilor oferite de ${company} (denumit în continuare „Operatorul”), accesibile la adresa ${siteConfig.url}.`,
      "Prin accesarea site-ului, crearea unui cont sau plasarea unei comenzi, confirmați că ați citit, înțeles și acceptat integral acești termeni.",
    ],
  },
  {
    title: "2. Definiții",
    paragraphs: [
      "„Utilizator” — orice persoană care accesează site-ul; „Client” — persoana fizică sau juridică care plasează o comandă; „Produs” — stații de încărcare EV, accesorii și servicii conexe listate în magazin.",
    ],
  },
  {
    title: "3. Contul de utilizator",
    paragraphs: [
      "Pentru anumite funcționalități (comenzi, istoric, suport) este necesar un cont. Sunteți responsabil pentru confidențialitatea datelor de autentificare și pentru activitatea desfășurată din contul dvs.",
      "Autentificarea prin Google sau alte furnizori terți este permisă doar dacă acceptați documentele legale ale site-ului la momentul înregistrării.",
    ],
  },
  {
    title: "4. Comenzi și contract",
    paragraphs: [
      "Informațiile despre produse (preț, disponibilitate, specificații) au caracter informativ. Contractul de vânzare se consideră încheiat după confirmarea comenzii de către Operator.",
      "Operatorul își rezervă dreptul de a refuza comenzi în caz de eroare evidentă de preț, indisponibilitate stoc sau suspiciune de fraudă.",
    ],
  },
  {
    title: "5. Prețuri, plată și livrare",
    paragraphs: [
      "Prețurile afișate sunt exprimate în RON și pot include TVA, conform legislației aplicabile. Costurile de livrare sunt comunicate înainte de finalizarea comenzii.",
      "Plata se poate efectua prin metodele disponibile la checkout (card bancar, transfer etc.). Livrarea se face pe teritoriul României, în termenele comunicate la plasarea comenzii.",
    ],
  },
  {
    title: "6. Dreptul de retragere",
    paragraphs: [
      "Consumatorii beneficiază de dreptul de retragere în termen de 14 zile calendaristice de la primirea produsului, conform OUG 34/2014, cu excepțiile prevăzute de lege (produse personalizate, sigilate desigilate etc.).",
      "Pentru exercitarea dreptului de retragere, contactați-ne la adresa de email indicată mai jos.",
    ],
  },
  {
    title: "7. Garanție și conformitate",
    paragraphs: [
      "Produsele comercializate beneficiază de garanția legală de conformitate și, după caz, de garanția comercială a producătorului. Defectele trebuie semnalate în termenul legal, împreună cu dovada achiziției.",
    ],
  },
  {
    title: "8. Proprietate intelectuală",
    paragraphs: [
      "Conținutul site-ului (texte, imagini, logo, structură) este protejat de drepturile de autor. Reproducerea fără acord scris este interzisă.",
    ],
  },
  {
    title: "9. Limitarea răspunderii",
    paragraphs: [
      "Operatorul depune eforturi rezonabile pentru acuratețea informațiilor, însă nu garantează absența erorilor tehnice temporare. Răspunderea este limitată la valoarea comenzii afectate, în măsura permisă de lege.",
    ],
  },
  {
    title: "10. Lege aplicabilă și contact",
    paragraphs: [
      "Prezentele termeni sunt guvernate de legea română. Litigiile se soluționează pe cale amiabilă sau de instanțele competente din România.",
      `Pentru întrebări: <a href="mailto:${email}">${email}</a>.`,
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    title: "1. Operatorul de date",
    paragraphs: [
      `${company} este operatorul datelor cu caracter personal colectate prin intermediul site-ului ${siteConfig.url}.`,
      `Contact protecția datelor: <a href="mailto:${email}">${email}</a>.`,
    ],
  },
  {
    title: "2. Ce date colectăm",
    paragraphs: ["Putem prelucra următoarele categorii de date:"],
    list: [
      "Date de identificare: nume, prenume, email, telefon",
      "Date de cont: parolă (hash), imagine profil (dacă vă autentificați cu Google)",
      "Date de comandă: adresă livrare/facturare, istoric comenzi, date plată (procesate de procesatorul de plăți)",
      "Date tehnice: adresă IP, tip browser, cookie-uri, identificatori analitici (Google Analytics)",
      "Comunicări: mesaje trimise prin formularul de contact",
    ],
  },
  {
    title: "3. Scopuri și temeiuri legale",
    paragraphs: [
      "Prelucrăm datele pentru: executarea comenzilor (art. 6 alin. (1) lit. b GDPR), obligații legale (facturare, contabilitate), interes legitim (securitate site, prevenire fraudă), consimțământ (marketing, cookie-uri non-esențiale).",
    ],
  },
  {
    title: "4. Autentificare socială (Google)",
    paragraphs: [
      "Dacă alegeți autentificarea cu Google, primim de la Google informații precum numele, adresa de email și fotografia de profil, conform permisiunilor acordate. Aceste date sunt folosite exclusiv pentru gestionarea contului dvs. pe site.",
    ],
  },
  {
    title: "5. Destinatari și transferuri",
    paragraphs: [
      "Datele pot fi comunicate furnizorilor de servicii (găzduire, email, plăți, curierat) strict în scopul prestării serviciilor. Nu vindem datele personale către terți.",
      "Unii furnizori pot fi localizați în UE/SEE sau, după caz, în țări cu garanții adecvate (clauze contractuale standard).",
    ],
  },
  {
    title: "6. Perioada de stocare",
    paragraphs: [
      "Păstrăm datele cât timp este necesar pentru scopurile menționate: durata relației contractuale, termene legale de arhivare (ex. documente fiscale), sau până la retragerea consimțământului acolo unde este aplicabil.",
    ],
  },
  {
    title: "7. Securitate",
    paragraphs: [
      "Aplicăm măsuri tehnice și organizatorice rezonabile: conexiuni criptate (HTTPS), parole hash-uite, acces restricționat la date, backup periodic.",
    ],
  },
  {
    title: "8. Drepturile persoanei vizate",
    paragraphs: [
      "Aveți dreptul de acces, rectificare, ștergere, restricționare, portabilitate, opoziție și de a vă retrage consimțământul. Puteți depune plângere la ANSPDCP (www.dataprotection.ro).",
      `Pentru exercitarea drepturilor, scrieți-ne la <a href="mailto:${email}">${email}</a>.`,
    ],
  },
  {
    title: "9. Cookie-uri",
    paragraphs: [
      "Site-ul folosește cookie-uri esențiale pentru funcționare și, după consimțământ, cookie-uri analitice. Detalii suplimentare sunt disponibile în informarea GDPR dedicată.",
    ],
  },
];

export const gdprSections: LegalSection[] = [
  {
    title: "1. Informare conform GDPR",
    paragraphs: [
      "Regulamentul (UE) 2016/679 (GDPR) vă conferă control asupra datelor personale. Această pagină rezumă modul în care vă puteți exercita drepturile și ce opțiuni aveți în relația cu noi.",
    ],
  },
  {
    title: "2. Baza legală a prelucrării",
    paragraphs: ["Prelucrăm datele dvs. pe următoarele temeiuri:"],
    list: [
      "Executarea contractului — procesarea comenzilor, livrare, suport clienți",
      "Obligație legală — emitere facturi, raportări fiscale",
      "Interes legitim — securitate IT, analiză agregată a traficului, prevenire abuz",
      "Consimțământ — newsletter, cookie-uri marketing/analytics (dacă sunt activate)",
    ],
  },
  {
    title: "3. Consimțământul la înregistrare",
    paragraphs: [
      "La crearea contului (email/parolă sau Google), bifați o singură casetă prin care confirmați că ați citit Termenii și condițiile, Politica de confidențialitate și această informare GDPR.",
      "Consimțământul poate fi retras oricând, fără a afecta legalitatea prelucrării efectuate anterior.",
    ],
  },
  {
    title: "4. Drepturile dvs. (Art. 15–22 GDPR)",
    paragraphs: ["Puteți solicita:"],
    list: [
      "Acces la datele personale pe care le deținem despre dvs.",
      "Rectificarea datelor inexacte sau incomplete",
      "Ștergerea datelor („dreptul de a fi uitat”), în condițiile legii",
      "Restricționarea prelucrării",
      "Portabilitatea datelor furnizate de dvs.",
      "Opoziția la prelucrare bazată pe interes legitim",
      "Retragerea consimțământului pentru marketing/cookie-uri",
    ],
  },
  {
    title: "5. Cum ne contactați",
    paragraphs: [
      `Trimiteți solicitarea la <a href="mailto:${email}">${email}</a>, cu subiect „Solicitare GDPR”. Răspundem în termen de maximum 30 de zile, conform legii.`,
      "Pentru plângeri, Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP) este disponibilă la www.dataprotection.ro.",
    ],
  },
  {
    title: "6. Cookie-uri și tracking",
    paragraphs: [
      "Folosim cookie-uri strict necesare (sesiune, coș, autentificare). Google Analytics poate colecta date anonimizate despre utilizarea site-ului. Puteți gestiona cookie-urile din setările browserului.",
    ],
  },
  {
    title: "7. Actualizări",
    paragraphs: [
      "Această informare poate fi actualizată periodic. Modificările semnificative vor fi comunicate pe site. Data ultimei actualizări este afișată în partea de sus a paginii.",
    ],
  },
];
