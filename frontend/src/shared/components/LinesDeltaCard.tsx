/**
 * Displays additions vs deletions with percentages and absolute counts.
 * Suitable for compact diff summaries.
 */

export interface LinesDeltaCardProps {
  additions: number;
  deletions: number;
  loading?: boolean;
  className?: string;
  label?: string;
}

/**
 * Pure presentational; parent controls loading state and numbers.
 */
export function LinesDeltaCard({
  additions,
  deletions,
  loading,
  className = "",
  label = "Linhas",
}: LinesDeltaCardProps) {
  const total = additions + deletions;
  const addPctRaw = total ? (additions / total) * 100 : 0;
  const delPctRaw = total ? (deletions / total) * 100 : 0;
  const addPct = addPctRaw;
  const delPct = delPctRaw;
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
              className="h-2 rounded-full bg-surface-200 overflow-hidden flex"
              title={`Add: ${additions}  Del: ${deletions}`}
              data-total={total}
              data-add={additions}
              data-del={deletions}
            >
              {additions > 0 && (
                <span
                  className="h-full bg-emerald-400/70"
                  style={{ width: `${addPct}%` }}
                  data-seg="add"
                />
              )}
              {deletions > 0 && (
                <span
                  className="h-full bg-rose-400/70"
                  style={{ width: `${delPct}%` }}
                  data-seg="del"
                />
              )}
            </div>
            <span className="text-[9px] tracking-wide text-gray-400">
              {total ? (
                <>
                  {addPct.toFixed(1)}% + / {delPct.toFixed(1)}% - (total {total}
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
