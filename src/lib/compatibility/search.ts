import { EV_VEHICLES } from "@/lib/compatibility/vehicles";
import type { VehicleSearchResult } from "@/lib/compatibility/types";

export function searchVehicles(
  query: string,
  limit = 8
): VehicleSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  return EV_VEHICLES.map((vehicle) => {
    const haystack =
      `${vehicle.brand} ${vehicle.model} ${vehicle.slug}`.toLowerCase();
    const brandLower = vehicle.brand.toLowerCase();
    const modelLower = vehicle.model.toLowerCase();

    let score = 0;
    if (haystack === q) score += 100;
    if (haystack.startsWith(q)) score += 50;
    if (brandLower.startsWith(tokens[0] ?? "")) score += 25;
    if (modelLower.includes(tokens[tokens.length - 1] ?? "")) score += 20;
    if (tokens.every((token) => haystack.includes(token))) score += 40;

    const yearLabel = vehicle.yearTo
      ? `${vehicle.yearFrom}–${vehicle.yearTo}`
      : `${vehicle.yearFrom}+`;

    return {
      vehicle,
      score,
      result: {
        slug: vehicle.slug,
        label: `${vehicle.brand} ${vehicle.model}`,
        brand: vehicle.brand,
        model: vehicle.model,
        subtitle: `${yearLabel} · ${vehicle.batteryKwh} kWh · ${vehicle.acMaxKw} kW AC`,
      },
    };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.result);
}
