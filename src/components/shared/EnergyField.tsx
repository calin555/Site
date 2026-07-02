import { cn } from "@/lib/utils";

interface EnergyFieldProps {
  /** dark = hero/benefits sections; light = white sections */
  variant?: "dark" | "light";
  /** Show drifting spark particles */
  particles?: boolean;
  /** Show animated circuit traces */
  circuits?: boolean;
  className?: string;
}

/** Hardcoded so server render is deterministic (no hydration mismatch). */
const PARTICLES = [
  { left: "8%", top: "62%", size: 5, variant: "", delay: "0s" },
  { left: "16%", top: "28%", size: 3, variant: "particle-b", delay: "1.2s" },
  { left: "32%", top: "74%", size: 4, variant: "particle-c", delay: "2.5s" },
  { left: "54%", top: "18%", size: 3, variant: "", delay: "0.8s" },
  { left: "68%", top: "66%", size: 5, variant: "particle-b", delay: "3.4s" },
  { left: "81%", top: "34%", size: 4, variant: "particle-c", delay: "1.9s" },
  { left: "91%", top: "58%", size: 3, variant: "", delay: "4.2s" },
] as const;

/**
 * Decorative animated energy background — aurora blobs (GPU transform drift),
 * spark particles and circuit traces with flowing current. Pure CSS animations,
 * respects prefers-reduced-motion, zero layout impact (absolute + pointer-events-none).
 */
export function EnergyField({
  variant = "dark",
  particles = true,
  circuits = false,
  className,
}: EnergyFieldProps) {
  const dark = variant === "dark";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      {/* Aurora energy blobs — blue / green / violet */}
      <div
        className={cn(
          "aurora-blob absolute -left-24 top-1/4 h-96 w-96 rounded-full blur-3xl",
          dark ? "bg-brand-500/15" : "bg-brand-200/40"
        )}
      />
      <div
        className={cn(
          "aurora-blob-b absolute -right-20 -top-16 h-80 w-80 rounded-full blur-3xl",
          dark ? "bg-violet-500/10" : "bg-violet-200/30"
        )}
      />
      <div
        className={cn(
          "aurora-blob-c absolute bottom-0 left-1/3 h-72 w-72 rounded-full blur-3xl",
          dark ? "bg-sky-400/10" : "bg-sky-200/30"
        )}
      />

      {/* Spark particles */}
      {particles &&
        PARTICLES.map((p, i) => (
          <span
            key={i}
            className={cn("particle", p.variant)}
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}

      {/* Circuit traces with flowing current */}
      {circuits && (
        <svg
          className={cn(
            "absolute inset-x-0 bottom-0 h-64 w-full",
            dark ? "opacity-30" : "opacity-20"
          )}
          viewBox="0 0 1200 240"
          fill="none"
          preserveAspectRatio="xMidYMax slice"
        >
          {/* Base traces */}
          <path
            d="M-20 60 H280 q16 0 16 16 V150 q0 16 16 16 H620 q16 0 16 -16 V90 q0 -16 16 -16 H1220"
            stroke={dark ? "rgba(15,184,126,0.18)" : "rgba(15,184,126,0.25)"}
            strokeWidth="1.5"
          />
          <path
            d="M-20 200 H180 q16 0 16 -16 V120 q0 -16 16 -16 H460 q16 0 16 16 V190 q0 16 16 16 H1220"
            stroke={dark ? "rgba(56,189,248,0.14)" : "rgba(56,189,248,0.2)"}
            strokeWidth="1.5"
          />
          {/* Flowing current pulses */}
          <path
            className="energy-flow"
            d="M-20 60 H280 q16 0 16 16 V150 q0 16 16 16 H620 q16 0 16 -16 V90 q0 -16 16 -16 H1220"
            stroke="url(#energyGradA)"
            strokeWidth="2"
          />
          <path
            className="energy-flow-slow"
            d="M-20 200 H180 q16 0 16 -16 V120 q0 -16 16 -16 H460 q16 0 16 16 V190 q0 16 16 16 H1220"
            stroke="url(#energyGradB)"
            strokeWidth="2"
          />
          {/* Connection nodes */}
          {[
            { cx: 296, cy: 100 },
            { cx: 636, cy: 120 },
            { cx: 196, cy: 160 },
            { cx: 476, cy: 140 },
          ].map((n, i) => (
            <circle
              key={i}
              cx={n.cx}
              cy={n.cy}
              r="3"
              fill={dark ? "rgba(163,230,53,0.5)" : "rgba(15,184,126,0.5)"}
            />
          ))}
          <defs>
            <linearGradient id="energyGradA" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0fb87e" stopOpacity="0" />
              <stop offset="50%" stopColor="#a3e635" />
              <stop offset="100%" stopColor="#0fb87e" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="energyGradB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}

/**
 * Expanding charge-pulse rings, centered on the parent.
 * Parent needs `relative`; rings are decorative only.
 */
export function ChargePulse({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center",
        className
      )}
    >
      <span className="pulse-ring h-3/4 w-3/4" />
      <span className="pulse-ring h-3/4 w-3/4" style={{ animationDelay: "1.1s" }} />
      <span className="pulse-ring h-3/4 w-3/4" style={{ animationDelay: "2.2s" }} />
    </div>
  );
}
