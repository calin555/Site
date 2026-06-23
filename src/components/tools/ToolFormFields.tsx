import { cn } from "@/lib/utils";

interface ToolRadioGroupProps<T extends string> {
  label?: string;
  options: { value: T; label: string; description?: string }[];
  value: T;
  onChange: (value: T) => void;
  columns?: 1 | 2 | 3;
}

export function ToolRadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: ToolRadioGroupProps<T>) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
  };

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm font-medium text-surface-800">{label}</p>
      )}
      <div className={cn("grid gap-3", gridCols[columns])}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-xl border p-4 text-left transition-all",
              value === opt.value
                ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                : "border-surface-200 bg-white hover:border-brand-200"
            )}
          >
            <p className="font-semibold text-surface-900">{opt.label}</p>
            {opt.description && (
              <p className="mt-1 text-xs text-surface-500">{opt.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ToolSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}

export function ToolSelect({
  label,
  value,
  onChange,
  options,
  hint,
}: ToolSelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-surface-800">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-surface-200 bg-white px-4 text-sm text-surface-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-surface-500">{hint}</p>}
    </div>
  );
}
