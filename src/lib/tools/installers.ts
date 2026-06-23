import type { Installer, InstallerFilter } from "@/types/tools";

const INSTALLERS: Installer[] = [
  {
    id: "inst_1",
    name: "ElectroInstall Pro",
    slug: "electroinstall-pro",
    county: "București",
    city: "București",
    rating: 4.9,
    reviewCount: 127,
    certifications: ["ANRE", "ISO 9001", "partener ChargePro"],
    services: ["Montaj rezidențial", "Montaj comercial", "Proiectare", "Service"],
    minProjectRon: 3000,
    responseTimeHours: 4,
    phone: "0721 100 200",
    email: "contact@electroinstall.ro",
    description: "Peste 500 instalări wallbox în București și Ilfov. Echipă autorizată ANRE.",
    completedProjects: 512,
  },
  {
    id: "inst_2",
    name: "GreenVolt Instalații",
    slug: "greenvolt-instalatii",
    county: "Cluj",
    city: "Cluj-Napoca",
    rating: 4.8,
    reviewCount: 89,
    certifications: ["ANRE", "partener ChargePro", "Solar certified"],
    services: ["Montaj rezidențial", "Solar + EV", "Montaj comercial"],
    minProjectRon: 2500,
    responseTimeHours: 8,
    phone: "0740 200 300",
    email: "office@greenvolt.ro",
    description: "Specialiști în integrare solar + EV. Acoperire Transilvania.",
    completedProjects: 340,
  },
  {
    id: "inst_3",
    name: "PowerGrid Solutions",
    slug: "powergrid-solutions",
    county: "Timiș",
    city: "Timișoara",
    rating: 4.7,
    reviewCount: 64,
    certifications: ["ANRE", "ISO 14001"],
    services: ["Montaj comercial", "Stații DC", "Flote", "Mentenanță"],
    minProjectRon: 15000,
    responseTimeHours: 12,
    phone: "0735 400 500",
    email: "proiecte@powergrid.ro",
    description: "Proiecte comerciale și stații DC rapide pentru flote și retail.",
    completedProjects: 180,
  },
  {
    id: "inst_4",
    name: "EcoCharge Brașov",
    slug: "ecocharge-brasov",
    county: "Brașov",
    city: "Brașov",
    rating: 4.9,
    reviewCount: 45,
    certifications: ["ANRE", "partener ChargePro"],
    services: ["Montaj rezidențial", "Montaj comercial", "Consultanță AFM"],
    minProjectRon: 2800,
    responseTimeHours: 6,
    phone: "0722 600 700",
    email: "brasov@ecocharge.ro",
    description: "Instalări rapide în Brașov, Sibiu și Covasna. Suport dosare finanțare.",
    completedProjects: 210,
  },
  {
    id: "inst_5",
    name: "Delta Electric Constanța",
    slug: "delta-electric-constanta",
    county: "Constanța",
    city: "Constanța",
    rating: 4.6,
    reviewCount: 38,
    certifications: ["ANRE"],
    services: ["Montaj rezidențial", "Montaj comercial", "Proiectare"],
    minProjectRon: 3000,
    responseTimeHours: 24,
    phone: "0766 800 900",
    email: "info@delta-electric.ro",
    description: "Acoperire Dobrogea — rezidențial și HoReCa.",
    completedProjects: 95,
  },
  {
    id: "inst_6",
    name: "Volt Masters Iași",
    slug: "volt-masters-iasi",
    county: "Iași",
    city: "Iași",
    rating: 4.8,
    reviewCount: 52,
    certifications: ["ANRE", "partener ChargePro", "Electric Up consultant"],
    services: ["Montaj rezidențial", "Montaj comercial", "Consultanță Electric Up"],
    minProjectRon: 2500,
    responseTimeHours: 8,
    phone: "0745 100 400",
    email: "iasi@voltmasters.ro",
    description: "Partener oficial pentru proiecte Electric Up în Moldova.",
    completedProjects: 165,
  },
  {
    id: "inst_7",
    name: "SolarCharge Prahova",
    slug: "solarcharge-prahova",
    county: "Prahova",
    city: "Ploiești",
    rating: 4.5,
    reviewCount: 31,
    certifications: ["ANRE", "Solar certified"],
    services: ["Solar + EV", "Montaj rezidențial", "Proiectare"],
    minProjectRon: 5000,
    responseTimeHours: 16,
    phone: "0733 500 600",
    email: "ploiesti@solarcharge.ro",
    description: "Integrare fotovoltaic + wallbox pentru autoconsum maxim.",
    completedProjects: 78,
  },
  {
    id: "inst_8",
    name: "Nord Instal EV",
    slug: "nord-instal-ev",
    county: "Mureș",
    city: "Târgu Mureș",
    rating: 4.7,
    reviewCount: 27,
    certifications: ["ANRE", "partener ChargePro"],
    services: ["Montaj rezidențial", "Montaj comercial", "Service"],
    minProjectRon: 2800,
    responseTimeHours: 12,
    phone: "0750 700 800",
    email: "contact@nordinstal.ro",
    description: "Instalări certificate în regiunea Nord-Est și Centru.",
    completedProjects: 120,
  },
];

export function getInstallers(filter?: InstallerFilter): Installer[] {
  let result = [...INSTALLERS];

  if (filter?.county) {
    result = result.filter((i) => i.county === filter.county);
  }
  if (filter?.service) {
    result = result.filter((i) =>
      i.services.some((s) =>
        s.toLowerCase().includes(filter.service!.toLowerCase())
      )
    );
  }
  if (filter?.minRating) {
    result = result.filter((i) => i.rating >= filter.minRating!);
  }

  return result.sort((a, b) => b.rating - a.rating);
}

export function getInstallerBySlug(slug: string): Installer | undefined {
  return INSTALLERS.find((i) => i.slug === slug);
}

export function getInstallerCounties(): string[] {
  return [...new Set(INSTALLERS.map((i) => i.county))].sort();
}

export function getInstallerServices(): string[] {
  const services = new Set<string>();
  for (const inst of INSTALLERS) {
    for (const s of inst.services) services.add(s);
  }
  return [...services].sort();
}
