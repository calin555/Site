interface SalesChartProps {
  data: { label: string; value: number }[];
}

export function SalesChart({ data }: SalesChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-48 items-end justify-between gap-2">
      {data.map((point) => {
        const height = Math.max((point.value / max) * 100, 4);
        return (
          <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-36 w-full items-end justify-center">
              <div
                className="w-full max-w-10 rounded-t-lg bg-brand-500 transition-all"
                style={{ height: `${height}%` }}
                title={`${point.value} RON`}
              />
            </div>
            <span className="text-xs font-medium text-surface-500">
              {point.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
