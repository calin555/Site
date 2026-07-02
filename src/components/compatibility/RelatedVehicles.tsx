import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import type { EvVehicle } from "@/lib/compatibility/types";

interface RelatedVehiclesProps {
  vehicles: EvVehicle[];
  currentSlug: string;
}

export function RelatedVehicles({ vehicles, currentSlug }: RelatedVehiclesProps) {
  const filtered = vehicles.filter((v) => v.slug !== currentSlug);
  if (filtered.length === 0) return null;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-surface-900">
          Vehicule similare
        </h2>
        <p className="mt-2 text-surface-600">
          Verifică compatibilitatea pentru alte modele electrice populare.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((vehicle) => (
          <Link
            key={vehicle.slug}
            href={`/compatibilitate/${vehicle.slug}`}
            className="card-lift group flex items-center gap-3 rounded-2xl border border-surface-200 bg-white p-4 transition-colors hover:border-brand-300"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-100">
              <Car className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-surface-900 group-hover:text-brand-700">
                {vehicle.brand} {vehicle.model}
              </span>
              <span className="block text-sm text-surface-500">
                {vehicle.recommendedHomeChargerKw} kW · {vehicle.acConnector}
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-surface-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-600" />
          </Link>
        ))}
      </div>
    </section>
  );
}
