import { cn } from "@/lib/utils";

interface WizardStepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export function WizardStepper({ steps, currentStep, className }: WizardStepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, i) => (
        <div key={step} className="flex flex-1 items-center gap-2">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                i < currentStep
                  ? "bg-brand-600 text-white"
                  : i === currentStep
                    ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500"
                    : "bg-surface-100 text-surface-400"
              )}
            >
              {i < currentStep ? "✓" : i + 1}
            </div>
            <span
              className={cn(
                "hidden text-center text-xs sm:block",
                i <= currentStep ? "font-medium text-surface-800" : "text-surface-400"
              )}
            >
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mb-5 h-0.5 flex-1",
                i < currentStep ? "bg-brand-500" : "bg-surface-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
