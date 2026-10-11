import { getSiteBaseUrl } from "@/lib/site-url";

export const siteConfig = {
  name: "ChargePro",
  tagline: "Soluții premium de încărcare electrică",
  description:
    "Stație încărcare mașini electrice pentru acasă și afaceri — wallbox AC, stații DC și consultanță tehnică în România.",
  url: getSiteBaseUrl(),
  contact: {
    phone: "+40 774 542 015",
    phoneTechnical: "0759 046 201",
    email: "contact@incarcareauto.ro",
    hours: "Luni – Vineri: 08:30 – 17:00",
    address: "București, România",
  },
  nav: [
    { label: "Acasă", href: "/" },
    { label: "Produse", href: "/produse" },
    { label: "Categorii", href: "/categorii" },
    { label: "Stații încărcare", href: "/statii-incarcare" },
    { label: "Compatibilitate EV", href: "/compatibilitate" },
    { label: "Instrumente", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Despre noi", href: "/despre" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: {
    shop: [
      { label: "Toate produsele", href: "/produse" },
      { label: "Stații AC", href: "/produse/categorie/statii-ac" },
      { label: "Stații DC", href: "/produse/categorie/statii-dc" },
      { label: "Accesorii", href: "/produse/categorie/accesorii" },
    ],
    company: [
      { label: "Compatibilitate EV", href: "/compatibilitate" },
      { label: "Stații încărcare EV", href: "/statii-incarcare" },
      { label: "Stații EV București", href: "/statii-incarcare-bucuresti" },
      { label: "Stații EV Cluj", href: "/statii-incarcare-cluj-napoca" },
      { label: "Stații EV Timișoara", href: "/statii-incarcare-timisoara" },
      { label: "FAQ încărcare EV", href: "/faq" },
      { label: "Ghiduri EV", href: "/ghid" },
      { label: "Baza de cunoștințe", href: "/baza-de-cunoastinte" },
      { label: "Despre noi", href: "/despre" },
      { label: "Proiecte realizate", href: "/proiecte-realizate" },
      { label: "Studii de caz", href: "/studii-de-caz" },
      { label: "Instrumente EV", href: "/tools" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    account: [
      { label: "Contul meu", href: "/cont" },
      { label: "Coș", href: "/cos" },
      { label: "Autentificare", href: "/autentificare" },
    ],
  },
} as const;
