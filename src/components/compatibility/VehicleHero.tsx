import Image from "next/image";
import Link from "next/link";
import { Battery, Plug, Zap, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { isExternalImageUrl } from "@/lib/utils";
import type { EvVehicle } from "@/lib/compatibility/types";
import { VehicleSilhouette } from "@/components/compatibility/VehicleSilhouette";

interface VehicleHeroProps {
  vehicle: EvVehicle;
  chargingTimeHome: string;
  chargingTimeFast: string;
}

export function VehicleHero({
  vehicle,
  chargingTimeHome,
  chargingTimeFast,
}: VehicleHeroProps) {
  const yearLabel = vehicle.yearTo
    ? `${vehicle.yearFrom}–${vehicle.yearTo}`
    : `${vehicle.yearFrom}+`;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-surface-200/80 bg-gradient-to-br from-white via-brand-50/30 to-surface-50 p-6 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="brand">{vehicle.brand}</Badge>
            <Badge variant="outline">{yearLabel}</Badge>
            <Badge variant="accent">
              {vehicle.phases === "SINGLE" ? "Monofazat" : "Trifazat"}
            </Badge>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl lg:text-5xl">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="mt-3 max-w-xl text-lg text-surface-600">
              Stații de încărcare verificate compatibile cu {vehicle.brand}{" "}
              {vehicle.model} — filtrate automat din catalogul ChargePro.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              icon={<Battery className="h-5 w-5 text-brand-600" />}
              label="Baterie"
              value={`${vehicle.batteryKwh} kWh`}
            />
            <StatCard
              icon={<Plug className="h-5 w-5 text-brand-600" />}
              label="Conector AC"
              value={vehicle.acConnector}
            />
            <StatCard
              icon={<Zap className="h-5 w-5 text-accent" />}
              label="Max AC / DC"
              value={`${vehicle.acMaxKw} / ${vehicle.dcMaxKw} kW`}
            />
            <StatCard
              icon={<Gauge className="h-5 w-5 text-brand-600" />}
              label="Recomandat acasă"
              value={`${vehicle.recommendedHomeChargerKw} kW`}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="#produse-compatibile"
              className="gradient-brand ring-highlight btn-ripple inline-flex h-12 items-center rounded-full px-8 text-base font-semibold text-white shadow-elev-1 transition-all hover:shadow-glow-brand"
            >
              Vezi încărcătoarele compatibile
            </Link>
            {vehicle.relatedLanding && (
              <Link
                href={vehicle.relatedLanding}
                className="inline-flex h-12 items-center rounded-full border border-surface-300 bg-white px-8 text-base font-semibold text-surface-900 transition-all hover:border-brand-500 hover:text-brand-700"
              >
                Ghid {vehicle.brand}
              </Link>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-surface-200 bg-surface-900">
            <Image
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model} — încărcare electrică`}
              fill
              className="object-cover opacity-90"
              unoptimized={isExternalImageUrl(vehicle.image)}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-surface-950/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
              <p className="text-sm font-medium text-brand-200">
                Estimări încărcare
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <p className="text-xs text-surface-300">Acasă 20→80%</p>
                  <p className="font-display text-lg font-bold">{chargingTimeHome}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3 backdrop-blur-sm">
                  <p className="text-xs text-surface-300">Rapid DC 10→80%</p>
                  <p className="font-display text-lg font-bold">{chargingTimeFast}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="connector-animation mt-4 hidden rounded-2xl border border-brand-200/60 bg-brand-50/50 p-4 sm:block">
            <VehicleSilhouette className="mx-auto h-20 w-64 text-brand-400" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
      {icon}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-surface-500">
          {label}
        </p>
        <p className="font-display font-bold text-surface-900">{value}</p>
      </div>
    </div>
  );
}
