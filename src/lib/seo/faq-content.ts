export interface FaqItem {
  question: string;
  answer: string;
}

export const EV_FAQ_ITEMS: FaqItem[] = [
  {
    question: "Cât costă încărcarea unui vehicul electric acasă?",
    answer:
      "Costul depinde de tariful energiei electrice și puterea stației. Pentru o stație AC de 7,4 kW, o încărcare completă (50 kWh) costă aproximativ 35–55 RON la tarif rezidențial. Stațiile smart permit programarea încărcării în orele cu tarif redus pentru economii suplimentare.",
  },
  {
    question: "Cât durează încărcarea completă a unei mașini electrice?",
    answer:
      "Stațiile AC (7,4–22 kW) încarcă de la 4 la 10 ore pentru un SUV electric. Stațiile DC rapide (50–150 kW) pot adăuga 200–400 km autonomie în 20–40 minute. Timpul exact depinde de capacitatea bateriei și puterea acceptată de vehicul.",
  },
  {
    question: "Ce tipuri de conectori există pentru încărcare EV?",
    answer:
      "În România și Europa, conectorul standard este Type 2 (Mennekes) pentru AC. Pentru încărcare rapidă DC se folosește CCS2 (Combined Charging System). Modelele mai vechi Nissan pot folosi CHAdeMO. Stațiile noastre acoperă Type 2, CCS2 și opțiuni multi-standard.",
  },
  {
    question: "Care este diferența între stațiile AC și DC?",
    answer:
      "Stațiile AC (alternating current) convertesc curentul din rețea și sunt ideale acasă sau la birou (7,4–22 kW). Stațiile DC (direct current) livrează putere mare direct în baterie (50–350 kW) — perfecte pentru flote, parcări publice și stații de alimentare pe autostradă.",
  },
  {
    question: "Am nevoie de autorizație ANRE pentru instalarea unei stații?",
    answer:
      "Pentru stații AC monofazate/trifazate sub 22 kW, instalarea se face de un electrician autorizat ANRE conform Normelor I7-2011. Pentru stații DC comerciale sau puteri mari, poate fi necesar aviz de racordare de la distribuitorul de energie. Oferim consultanță și instalare autorizată.",
  },
  {
    question: "Livrați stații de încărcare EV în toată România?",
    answer:
      "Da. Livrăm încărcătoare EV, stații AC wallbox, stații DC rapide și accesorii în toată România, cu suport tehnic în limba română și garanție de până la 5 ani pentru echipamente selectate.",
  },
  {
    question: "Pot integra stația într-o rețea de încărcare pentru flotă?",
    answer:
      "Da. Majoritatea stațiilor noastre comerciale suportă OCPP 1.6J (și opțional 2.0.1), management cloud, facturare per sesiune și load balancing — esențial pentru rețele de încărcare electrică la scară.",
  },
  {
    question: "Există o hartă cu stații de încărcare publică în România?",
    answer:
      "Rețeaua publică de încărcare EV din România crește rapid. Pentru planificarea traseelor folosiți aplicații precum PlugShare sau Chargemap. Noi vă ajutăm să proiectați și să instalați propria infrastructură AC/DC acasă sau la sediul firmei.",
  },
];
