import type { CatalogProduct } from "@/types/catalog";
import type { ProductDetail } from "@/types/product";
import { productSupportsOcpp } from "@/lib/catalog/ocpp-support";

type ProductSeoSource = Pick<
  CatalogProduct,
  "name" | "categorySlug" | "powerKw" | "brandSlug" | "shortDescription"
>;

const VEHICLE_TAGS: Record<string, string[]> = {
  chargepro: ["Tesla", "BMW", "Dacia Spring", "VW ID"],
  voltedge: ["flote", "retail", "CCS2 rapid"],
  ecowatt: ["Dacia Spring", "Renault Zoe", "uz rezidențial"],
  powerlink: ["firme", "hoteluri", "OCPP"],
  smartcharge: ["Tesla", "Hyundai", "Kia"],
  gridflow: ["blocuri", "parcări comerciale"],
};

const DEFAULT_VEHICLES = ["Tesla", "BMW", "Dacia Spring", "VW ID"];

/** Titlu SEO comercial — vizibil în meta, schema și H1 produs. */
export function buildProductSeoTitle(product: ProductSeoSource): string {
  const type =
    product.categorySlug === "statii-dc"
      ? "DC rapidă"
      : product.categorySlug === "accesorii"
        ? "Accesoriu EV"
        : "AC";

  const power =
    product.powerKw > 0 ? `${product.powerKw} kW` : "";

  const vehicles =
    VEHICLE_TAGS[product.brandSlug]?.slice(0, 3) ?? DEFAULT_VEHICLES;

  const parts = ["Stație încărcare", type];
  if (power) parts.push(power);
  parts.push(product.name);
  parts.push(`pentru ${vehicles.join(", ")}`);

  return parts.join(" ");
}

/** Nume scurt pentru carduri — păstrează lizibilitatea UI. */
export function buildProductCardTitle(product: ProductSeoSource): string {
  if (product.powerKw <= 0) return product.name;
  const type = product.categorySlug === "statii-dc" ? "DC" : "AC";
  return `${product.name} — ${type} ${product.powerKw} kW`;
}

export function buildProductSeoDescription(product: ProductSeoSource): string {
  const seoTitle = buildProductSeoTitle(product);
  const ocppNote = productSupportsOcpp(product)
    ? ` Suportă OCPP 1.6J și OCPP 2.0.1.`
    : "";
  return `${seoTitle}. ${product.shortDescription}${ocppNote} Livrare România, instalare ANRE, consultanță ChargePro.`;
}
