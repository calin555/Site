import { siteConfig } from "@/config/site";

export interface SiteContactSettings {
  sectionTitle: string;
  phoneOrdersLabel: string;
  phoneOrders: string;
  phoneTechnicalLabel: string;
  phoneTechnical: string;
  email: string;
  address: string;
  hours: string;
  headerTagline: string;
}

export const DEFAULT_SITE_CONTACT: SiteContactSettings = {
  sectionTitle: "Contact",
  phoneOrdersLabel: "Comenzi",
  phoneOrders: siteConfig.contact.phone,
  phoneTechnicalLabel: "Tehnic",
  phoneTechnical: siteConfig.contact.phoneTechnical,
  email: siteConfig.contact.email,
  address: siteConfig.contact.address,
  hours: siteConfig.contact.hours,
  headerTagline: "Consultanță tehnică gratuită · Livrare în toată țara",
};

export function phoneToTel(phone: string): string {
  return phone.replace(/\s/g, "");
}
