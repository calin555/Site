export interface CompletedProject {
  id: string;
  slug: string;
  title: string;
  location: string;
  clientType: string;
  stationInstalled: string;
  duration: string;
  photos: { url: string; alt: string }[];
  challenges: string[];
  result: string;
  relatedLanding?: string;
}

export const COMPLETED_PROJECTS: CompletedProject[] = [
  {
    id: "p1",
    slug: "vila-bucuresti-11kw",
    title: "Wallbox 11 kW — vilă Pipera",
    location: "București, Pipera",
    clientType: "Rezidențial — vilă",
    stationInstalled: "ChargePro Wall 11 kW trifazat, Type 2",
    duration: "2 zile (audit + montaj)",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1593941707882-a5bba14938ca?w=800&h=500&fit=crop",
        alt: "Wallbox 11 kW montat pe perete garaj vilă Pipera",
      },
    ],
    challenges: [
      "Tablou electric vechi fără loc liber — adăugat sub-tablou dedicat EV",
      "Distanță 18 m cablu — secțiune 6 mm² dimensionată corect",
    ],
    result:
      "Tesla Model Y — încărcare completă 20→80% în 3,5 h. Client raportează economie ~420 RON/lună vs stații publice.",
    relatedLanding: "/statie-incarcare-acasa",
  },
  {
    id: "p2",
    slug: "firma-cluj-4x22kw",
    title: "4× stații 22 kW — parcare firmă IT",
    location: "Cluj-Napoca",
    clientType: "Firmă — 80 angajați",
    stationInstalled: "ChargePro Pro 22 kW × 4, OCPP, RFID",
    duration: "5 zile",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=500&fit=crop",
        alt: "Parcare firmă cu 4 stații AC 22 kW Cluj",
      },
    ],
    challenges: [
      "Load balancing pe putere contractată 100 kW",
      "Integrare RFID cu sistem HR pentru alocare locuri",
    ],
    result:
      "Utilizare medie 78% din capacitate. Payback estimat 28 luni incluzând Electric Up.",
    relatedLanding: "/statie-incarcare-firma",
  },
  {
    id: "p3",
    slug: "hotel-brasov-2x11kw",
    title: "2× wallbox overnight — hotel 4 stele",
    location: "Brașov, centru",
    clientType: "Hotel — 45 camere",
    stationInstalled: "ChargePro Wall 11 kW × 2, rezervare prin recepție",
    duration: "3 zile",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=500&fit=crop",
        alt: "Stații încărcare parcare hotel Brașov",
      },
    ],
    challenges: [
      "Parcare subterană — ventilație și traseu cablu prin rampă",
      "Facturare serviciu ca extra per noapte",
    ],
    result:
      "Mențiuni pozitive Booking legate de EV. Tarif 49 RON/noapte încărcare — ocupare 62% posturi.",
    relatedLanding: "/statie-incarcare-hotel",
  },
  {
    id: "p4",
    slug: "bloc-ilfov-8-locuri",
    title: "8 locuri EV — condominiu Ilfov",
    location: "Ilfov, Otopeni",
    clientType: "Bloc — asociație proprietari",
    stationInstalled: "EcoWatt Business 22 kW × 4 + load balancing",
    duration: "12 zile (AGA + execuție)",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop",
        alt: "Instalare stații EV parcare subterană bloc Otopeni",
      },
    ],
    challenges: [
      "Aviz asociație și subcontorizare individuală",
      "Coloană electrică limitată — prioritizare dinamică",
    ],
    result:
      "8 apartamente cu acces dedicat. Cost mediu 180 RON/loc/lună facturat individual.",
    relatedLanding: "/statie-incarcare-bloc",
  },
];

export function getProjectBySlug(slug: string): CompletedProject | undefined {
  return COMPLETED_PROJECTS.find((p) => p.slug === slug);
}
