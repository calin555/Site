export const VAT_RATE = 0.19;

export const SHIPPING_CONFIG = {
  flatRate: 49,
  freeThreshold: 5000,
  heavyItemThreshold: 50000,
  heavyItemRate: 199,
} as const;

export interface CouponDefinition {
  code: string;
  label: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
}

export const COUPONS: CouponDefinition[] = [
  {
    code: "EV10",
    label: "10% reducere",
    type: "PERCENTAGE",
    value: 10,
    minOrderAmount: 1000,
    maxDiscount: 2000,
  },
  {
    code: "WELCOME50",
    label: "50 RON reducere",
    type: "FIXED_AMOUNT",
    value: 50,
    minOrderAmount: 500,
  },
  {
    code: "TRANSPORT",
    label: "Transport gratuit",
    type: "FREE_SHIPPING",
    value: 0,
    minOrderAmount: 0,
  },
  {
    code: "FLOTE15",
    label: "15% reducere flote",
    type: "PERCENTAGE",
    value: 15,
    minOrderAmount: 10000,
    maxDiscount: 15000,
  },
];

export const ROMANIAN_COUNTIES = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani",
  "Brașov", "Brăila", "București", "Buzău", "Caraș-Severin", "Călărași",
  "Cluj", "Constanța", "Covasna", "Dâmbovița", "Dolj", "Galați", "Giurgiu",
  "Gorj", "Harghita", "Hunedoara", "Ialomița", "Iași", "Ilfov", "Maramureș",
  "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova", "Satu Mare", "Sălaj",
  "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vaslui", "Vâlcea", "Vrancea",
] as const;
