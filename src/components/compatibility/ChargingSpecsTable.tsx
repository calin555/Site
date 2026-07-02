import type { EvVehicle } from "@/lib/compatibility/types";

interface ChargingSpecsTableProps {
  vehicle: EvVehicle;
  chargingTimeHome: string;
  chargingTimeFast: string;
}

export function ChargingSpecsTable({
  vehicle,
  chargingTimeHome,
  chargingTimeFast,
}: ChargingSpecsTableProps) {
  const rows = [
    { label: "Capacitate baterie", value: `${vehicle.batteryKwh} kWh` },
    { label: "Conector AC", value: vehicle.acConnector },
    { label: "Conector DC rapid", value: vehicle.dcConnector },
    { label: "Putere AC maximă", value: `${vehicle.acMaxKw} kW` },
    { label: "Putere DC maximă", value: `${vehicle.dcMaxKw} kW` },
    { label: "Fază recomandată", value: vehicle.phases === "SINGLE" ? "Monofazat" : "Trifazat" },
    { label: "Wallbox recomandat", value: `${vehicle.recommendedHomeChargerKw} kW` },
    { label: "Încărcător portabil", value: vehicle.recommendedPortableCharger },
    { label: "Timp acasă (20→80%)", value: chargingTimeHome },
    { label: "Timp rapid DC (10→80%)", value: chargingTimeFast },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-surface-200 bg-surface-50">
            <th className="px-5 py-3 font-semibold text-surface-700">
              Specificație
            </th>
            <th className="px-5 py-3 font-semibold text-surface-700">Valoare</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {rows.map((row) => (
            <tr key={row.label} className="transition-colors hover:bg-brand-50/30">
              <td className="px-5 py-3.5 font-medium text-surface-600">
                {row.label}
              </td>
              <td className="px-5 py-3.5 font-semibold text-surface-900">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
