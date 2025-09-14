import React from "react";

interface ProgressBarProps {
  value: number; // 0-100
  color?: "indigo" | "emerald" | "blue" | "amber" | "red";
  height?: number;
}

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-500",
  emerald: "bg-emerald-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "indigo",
  height = 8,
}) => {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div
      className="w-full rounded-full bg-surface-200 overflow-hidden"
      style={{ height }}
    >
      <div
        className={`${
          colorMap[color] || colorMap.indigo
        } h-full transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
