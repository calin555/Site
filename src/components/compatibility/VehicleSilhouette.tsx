import { cn } from "@/lib/utils";

interface VehicleSilhouetteProps {
  className?: string;
}

export function VehicleSilhouette({ className }: VehicleSilhouetteProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("vehicle-silhouette relative", className)}
    >
      <svg
        viewBox="0 0 320 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <path
          className="vehicle-silhouette-body"
          d="M40 78h240c4 0 8-3 8-7V58c0-8-6-14-14-14h-28l-18-22c-3-4-8-6-13-6H72c-5 0-10 2-13 6L41 44H27c-8 0-14 6-14 14v17c0 4 4 7 8 7h19z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle
          className="vehicle-silhouette-wheel"
          cx="88"
          cy="78"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          className="vehicle-silhouette-wheel"
          cx="232"
          cy="78"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          className="charging-cable"
          d="M280 50 L300 35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle
          className="connector-pulse-dot"
          cx="300"
          cy="35"
          r="5"
          fill="currentColor"
        />
      </svg>
      <div className="charging-bar-track absolute bottom-2 left-1/2 h-1 w-2/3 -translate-x-1/2 overflow-hidden rounded-full bg-brand-100">
        <div className="charging-bar-fill h-full rounded-full bg-brand-500" />
      </div>
    </div>
  );
}
