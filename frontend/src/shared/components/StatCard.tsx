import React from "react";

/**
 * Small metric card showing a label + value with a colored dot.
 * Keep logic outside (only presentation). Use for lightweight dashboard stats.
 */

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  color?: "slate" | "emerald" | "indigo" | "rose" | "amber" | string;
  small?: boolean;
  className?: string;
}

const palette: Record<string, string> = {
  slate: "bg-slate-200 text-slate-600",
  emerald: "bg-emerald-200 text-emerald-600",
  indigo: "bg-indigo-200 text-indigo-600",
  rose: "bg-rose-200 text-rose-600",
  amber: "bg-amber-200 text-amber-600",
};

/**
 * Stateless visual component. Pass pre-formatted value if formatting needed.
 */
export function StatCard({
  label,
  value,
  color = "slate",
  small,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`relative rounded-lg border border-surface-300/70 bg-white/60 backdrop-blur px-3 py-2 flex flex-col ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span
          className={`w-2 h-2 rounded-full ${palette[color] || palette.slate}`}
        ></span>
        <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
          {label}
        </span>
      </div>
      <span
        className={`font-semibold ${
          small ? "text-sm" : "text-base"
        } text-gray-800 mt-0.5`}
      >
        {value}
      </span>
    </div>
  );
}
