import type { CatalogProduct } from "@/types/catalog";
import type { ProductSpec } from "@/types/product";
import {
  OCPP_PROTOCOLS_LABEL,
  productSupportsOcpp,
} from "@/lib/catalog/ocpp-support";

export type ProductSpecsSource = Pick<
  CatalogProduct,
  | "id"
  | "name"
  | "category"
  | "categorySlug"
  | "brand"
  | "powerKw"
  | "phases"
  | "connectorTypes"
  | "price"
>;

export function getIpRating(product: ProductSpecsSource): string | undefined {
  if (product.categorySlug === "accesorii") return undefined;
  return product.powerKw >= 22 ? "IP54" : "IP65";
}

export function getWarrantyYears(product: ProductSpecsSource): number {
  if (product.price >= 50000) return 5;
  if (product.price >= 5000) return 3;
  return 2;
}

export function getProductDimensions(product: ProductSpecsSource): string {
  if (product.categorySlug === "accesorii") return "Conform model";
  if (product.powerKw >= 60) return "800 × 700 × 2100 mm (L × l × H)";
  if (product.powerKw >= 22) return "420 × 280 × 180 mm (L × l × H)";
  return "360 × 240 × 120 mm (L × l × H)";
}

export function getProductWeight(product: ProductSpecsSource): string {
  if (product.categorySlug === "accesorii") return "Conform model";
  if (product.powerKw >= 60) return "≈ 280 kg";
  if (product.powerKw >= 22) return "≈ 8,5 kg";
  return "≈ 4,2 kg";
}

export function buildProductSpecs(product: ProductSpecsSource): ProductSpec[] {
  const specs: ProductSpec[] = [
    { label: "SKU", value: `CP-${product.id.padStart(4, "0")}`, group: "General" },
    { label: "Brand", value: product.brand, group: "General" },
    { label: "Categorie", value: product.category, group: "General" },
    { label: "Model", value: product.name, group: "General" },
  ];

  if (product.powerKw > 0) {
    specs.push(
      { label: "Putere nominală", value: `${product.powerKw} kW`, group: "Performanță" },
      {
        label: "Fază",
        value: product.phases === "SINGLE" ? "Monofazat (230V AC)" : "Trifazat (400V AC)",
        group: "Performanță",
      },
      {
        label: "Curent maxim",
        value: `${Math.round((product.powerKw * 1000) / (product.phases === "SINGLE" ? 230 : 400 * Math.sqrt(3)))} A`,
        group: "Performanță",
      }
    );
  }

  if (product.connectorTypes.length > 0) {
    specs.push({
      label: "Tip conector",
      value: product.connectorTypes.join(", "),
      group: "Performanță",
    });
  }

  if (productSupportsOcpp(product)) {
    specs.push(
      {
        label: "Protocol management",
        value: OCPP_PROTOCOLS_LABEL,
        group: "Conectivitate",
      },
      {
        label: "Integrare CSMS",
        value: "Da — monitorizare remote, tarifare, RFID",
        group: "Conectivitate",
      }
    );
  }

  // Construcție / Mediu / Smart: ascunse până la date reale per produs (admin/DB).
  return specs;
}

export function getApplicableStandards(product: ProductSpecsSource): string[] {
  const standards = [
    "SR EN IEC 61851-1:2019 — Sisteme de încărcare conductivă pentru vehicule electrice",
    "SR EN IEC 61851-21-2:2022 — Cerințe de compatibilitate electromagnetică",
    "SR EN 62311:2008 — Evaluare câmpuri electromagnetice",
    "SR EN IEC 61000-3-2:2019 — Emisii armonice",
    "SR EN IEC 61000-3-3:2013 — Fluctuații tensiune",
    "2011/65/UE (RoHS) — Restricționarea substanțelor periculoase",
  ];

  if (product.powerKw >= 22) {
    standards.push(
      "SR EN IEC 61851-23:2022 — Stații de încărcare DC",
      "SR EN IEC 61851-24:2022 — Comunicație digitală pentru încărcare DC"
    );
  }

  return standards;
}

export function getApplicableDirectives(product: ProductSpecsSource): string[] {
  const directives = [
    "2014/35/UE — Directiva privind echipamentele de joasă tensiune (LVD)",
    "2014/30/UE — Directiva privind compatibilitatea electromagnetică (EMC)",
    "2011/65/UE — Directiva RoHS",
  ];

  if (product.categorySlug !== "accesorii" && product.powerKw > 0) {
    directives.push(
      "2014/53/UE — Directiva RED (module radio WiFi/4G, unde este cazul)"
    );
  }

  return directives;
}
