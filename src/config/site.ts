export const siteConfig = {
  name: "ChargePro",
  tagline: "Soluții premium de încărcare electrică",
  description:
    "Stații de încărcare EV pentru acasă și afaceri. Consultanță tehnică, instalare și suport dedicat în România.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  contact: {
    phone: "0773 985 486",
    phoneTechnical: "0759 046 201",
    email: "contact@chargepro.ro",
    hours: "Luni – Vineri: 08:30 – 17:00",
    address: "București, România",
  },
  nav: [
    { label: "Acasă", href: "/" },
    { label: "Produse", href: "/produse" },
    { label: "Categorii", href: "/categorii" },
    { label: "Instrumente", href: "/tools" },
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/faq" },
    { label: "Despre noi", href: "/despre" },
    { label: "Contact", href: "/contact" },
  ],
  footerLinks: {
    shop: [
      { label: "Toate produsele", href: "/produse" },
      { label: "Stații AC", href: "/categorii/statii-ac" },
      { label: "Stații DC", href: "/categorii/statii-dc" },
      { label: "Accesorii", href: "/categorii/accesorii" },
    ],
    company: [
      { label: "FAQ încărcare EV", href: "/faq" },
      { label: "Despre noi", href: "/despre" },
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
