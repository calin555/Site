import type { CatalogProduct } from "@/types/catalog";

/** Etichete oficiale protocoale OCPP folosite în comunicare comercială. */
export const OCPP_PROTOCOLS_LABEL = "OCPP 1.6J și OCPP 2.0.1";

export const OCPP_DESCRIPTION_PARAGRAPH =
  "Suportă protocoalele OCPP 1.6J și OCPP 2.0.1 (Open Charge Point Protocol) pentru integrare cu platforme CSMS, monitorizare remote, tarifare dinamică, autentificare RFID și actualizări firmware over-the-air.";

export function productSupportsOcpp(
  product: Pick<CatalogProduct, "categorySlug" | "powerKw">
): boolean {
  if (product.categorySlug === "accesorii") return false;
  return (
    product.categorySlug === "statii-ac" ||
    product.categorySlug === "statii-dc" ||
    product.categorySlug === "smart-ocpp" ||
    product.powerKw > 0
  );
}

export function appendOcppToDescription(
  description: string,
  product: Pick<CatalogProduct, "categorySlug" | "powerKw">
): string {
  if (!productSupportsOcpp(product)) return description;
  if (/ocpp/i.test(description)) return description;
  const trimmed = description.trim();
  if (!trimmed) return OCPP_DESCRIPTION_PARAGRAPH;
  return `${trimmed}\n\n${OCPP_DESCRIPTION_PARAGRAPH}`;
}

export function appendOcppToShortDescription(
  shortDescription: string,
  product: Pick<CatalogProduct, "categorySlug" | "powerKw">
): string {
  if (!productSupportsOcpp(product)) return shortDescription;
  if (/ocpp/i.test(shortDescription)) return shortDescription;
  const trimmed = shortDescription.trim();
  if (!trimmed) return `Suportă ${OCPP_PROTOCOLS_LABEL}.`;
  return `${trimmed} Suportă ${OCPP_PROTOCOLS_LABEL}.`;
}
