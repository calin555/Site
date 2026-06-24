export type StockStatus = "IN_STOCK" | "MANUFACTURER" | "PREORDER";

export const STOCK_STATUS_OPTIONS: {
  value: StockStatus;
  label: string;
  hint: string;
}[] = [
  {
    value: "IN_STOCK",
    label: "Stoc",
    hint: "Disponibil în depozit — livrare 24–48h",
  },
  {
    value: "MANUFACTURER",
    label: "Stoc producător",
    hint: "Livrare de la producător — 5–10 zile lucrătoare",
  },
  {
    value: "PREORDER",
    label: "Precomandă",
    hint: "Comandă în avans — livrare la confirmare",
  },
];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  IN_STOCK: "Stoc",
  MANUFACTURER: "Stoc producător",
  PREORDER: "Precomandă",
};

export function normalizeStockStatus(value: unknown): StockStatus {
  if (value === "MANUFACTURER" || value === "PREORDER") return value;
  return "IN_STOCK";
}

export function isProductPurchasable(
  stockStatus: StockStatus,
  stock: number
): boolean {
  if (stockStatus === "IN_STOCK") return stock > 0;
  return true;
}

export function getMaxOrderQuantity(
  stockStatus: StockStatus,
  stock: number
): number {
  if (stockStatus === "IN_STOCK") {
    return Math.min(Math.max(stock, 0), 10);
  }
  if (stock > 0) return Math.min(stock, 10);
  return 10;
}

export function getStockStatusMessage(
  stockStatus: StockStatus,
  stock: number
): { text: string; tone: "success" | "warning" | "info" | "error" } {
  switch (stockStatus) {
    case "IN_STOCK":
      return stock > 0
        ? {
            text: `În stoc (${stock} buc.) — livrare 24–48h`,
            tone: "success",
          }
        : { text: "Stoc epuizat — contactează-ne pentru disponibilitate", tone: "error" };
    case "MANUFACTURER":
      return {
        text:
          stock > 0
            ? `Stoc producător (${stock} buc.) — livrare 5–10 zile lucrătoare`
            : "Stoc producător — livrare 5–10 zile lucrătoare",
        tone: "warning",
      };
    case "PREORDER":
      return {
        text: "Precomandă — livrare la confirmarea disponibilității",
        tone: "info",
      };
  }
}

export function getSchemaAvailability(
  stockStatus: StockStatus,
  stock: number
): string {
  if (stockStatus === "PREORDER") {
    return "https://schema.org/PreOrder";
  }
  if (stockStatus === "MANUFACTURER") {
    return stock > 0
      ? "https://schema.org/InStock"
      : "https://schema.org/BackOrder";
  }
  return stock > 0
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}
