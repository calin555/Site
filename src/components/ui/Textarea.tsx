import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-800"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-32 w-full max-w-full min-w-0 resize-y rounded-xl border border-surface-200 bg-surface-50/50 px-4 py-3 text-base text-surface-900 sm:text-sm",
            "placeholder:text-surface-400 transition-all duration-200",
            "hover:border-surface-300 hover:bg-white",
            "focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
            error && "border-red-400 focus:border-red-500 focus:ring-red-500/10",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {hint && !error && <p className="text-xs text-surface-600">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
