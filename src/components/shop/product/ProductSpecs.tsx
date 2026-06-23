import type { ProductSpec } from "@/types/product";

interface ProductSpecsProps {
  specs: ProductSpec[];
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  const groups = specs.reduce<Record<string, ProductSpec[]>>((acc, spec) => {
    const group = spec.group ?? "Altele";
    if (!acc[group]) acc[group] = [];
    acc[group].push(spec);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([group, groupSpecs]) => (
        <div key={group}>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-surface-900">
            {group}
          </h3>
          <dl className="divide-y divide-surface-100 rounded-2xl border border-surface-200 bg-white">
            {groupSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <dt className="text-sm text-surface-500">{spec.label}</dt>
                <dd className="text-sm font-semibold text-surface-900 sm:text-right">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
