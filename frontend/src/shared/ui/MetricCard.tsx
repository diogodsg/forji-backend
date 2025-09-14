import React from "react";

export type MetricTone = "indigo" | "emerald" | "blue" | "amber" | "red";

const toneMap: Record<MetricTone, string> = {
  indigo: "text-indigo-600 bg-indigo-50",
  emerald: "text-emerald-600 bg-emerald-50",
  blue: "text-blue-600 bg-blue-50",
  amber: "text-amber-600 bg-amber-50",
  red: "text-red-600 bg-red-50",
};

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  tone?: MetricTone;
  hint?: string;
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  tone = "indigo",
  hint,
  loading,
}) => {
  return (
    <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className={`h-8 w-8 inline-flex items-center justify-center rounded-lg ${toneMap[tone]} border border-surface-300/40`}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <div className="text-2xl font-semibold text-gray-900 leading-none min-h-[1.75rem]">
        {loading ? (
          <span className="animate-pulse text-gray-300">•••</span>
        ) : (
          value
        )}
      </div>
      {hint && <div className="text-[11px] text-gray-500">{hint}</div>}
    </div>
  );
};
