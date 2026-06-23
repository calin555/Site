import { cn } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ToolResultPanelProps {
  title: string;
  variant?: "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: "border-brand-200 bg-brand-50/50",
  warning: "border-amber-200 bg-amber-50/50",
  error: "border-red-200 bg-red-50/50",
  info: "border-surface-200 bg-surface-50",
};

const variantIcons = {
  success: CheckCircle2,
  warning: AlertCircle,
  error: XCircle,
  info: AlertCircle,
};

const variantIconColors = {
  success: "text-brand-600",
  warning: "text-amber-600",
  error: "text-red-600",
  info: "text-surface-500",
};

export function ToolResultPanel({
  title,
  variant = "info",
  children,
  className,
}: ToolResultPanelProps) {
  const Icon = variantIcons[variant];

  return (
    <Card
      padding="lg"
      className={cn("border-2", variantStyles[variant], className)}
    >
      <div className="mb-4 flex items-center gap-3">
        <Icon className={cn("h-6 w-6", variantIconColors[variant])} />
        <CardTitle className="text-xl">{title}</CardTitle>
      </div>
      {children}
    </Card>
  );
}

interface StatBoxProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function StatBox({ label, value, highlight }: StatBoxProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 text-center",
        highlight
          ? "border-brand-300 bg-brand-50"
          : "border-surface-200 bg-white"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-surface-500">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-2xl font-bold",
          highlight ? "text-brand-700" : "text-surface-900"
        )}
      >
        {value}
      </p>
    </div>
  );
}
