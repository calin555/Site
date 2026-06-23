import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatCard({
  label,
  value,
  change,
  icon: Icon,
  trend = "neutral",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-surface-900">{value}</p>
          {change && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend === "up" && "text-brand-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-surface-400"
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
