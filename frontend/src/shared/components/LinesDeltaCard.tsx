import React from "react";

export interface LinesDeltaCardProps {
  additions: number;
  deletions: number;
  loading?: boolean;
  className?: string;
  label?: string;
}

export function LinesDeltaCard({
  additions,
  deletions,
  loading,
  className = "",
  label = "Linhas",
}: LinesDeltaCardProps) {
  const total = additions + deletions;
  const addPct = total ? (additions / total) * 100 : 0;
  const delPct = total ? (deletions / total) * 100 : 0;
  return (
    <div
      className={`relative rounded-lg border border-surface-300/70 bg-white/60 backdrop-blur px-3 py-2 flex flex-col justify-between ${className}`}
    >
      <div className="relative flex flex-col gap-1">
        <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
          {label}
        </span>
        {loading ? (
          <span className="text-sm font-semibold text-gray-700">...</span>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[11px] font-medium">
              <span className="text-emerald-600">+{additions}</span>
              <span className="text-rose-600">-{deletions}</span>
              <span className="text-gray-400 text-[10px]">
                = {additions - deletions >= 0 ? "+" : ""}
                {additions - deletions}
              </span>
            </div>
            <div
              className="h-2 rounded-full bg-surface-200 overflow-hidden relative"
              title={`Add: ${additions}  Del: ${deletions}`}
            >
              <div
                className="absolute left-0 top-0 h-full bg-emerald-400/70"
                style={{ width: addPct + "%" }}
              />
              <div
                className="absolute right-0 top-0 h-full bg-rose-400/70"
                style={{ width: delPct + "%" }}
              />
            </div>
            <span className="text-[9px] tracking-wide text-gray-400">
              {total ? (
                <>
                  {addPct.toFixed(0)}% + / {delPct.toFixed(0)}% - (total {total}
                  )
                </>
              ) : (
                "Sem mudanças"
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
