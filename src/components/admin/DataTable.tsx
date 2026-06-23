import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((row: T) => string);
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  emptyMessage = "Niciun rezultat.",
}: DataTableProps<T>) {
  function getKey(row: T): string {
    if (typeof keyField === "function") return keyField(row);
    return String(row[keyField]);
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-200 bg-white px-6 py-12 text-center text-sm text-surface-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-surface-200 bg-surface-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 font-semibold text-surface-600",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={getKey(row)}
                className="border-b border-surface-100 last:border-0 hover:bg-surface-50/50"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3", col.className)}>
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
