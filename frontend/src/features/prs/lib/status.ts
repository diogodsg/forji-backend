/**
 * Maps PR state to Tailwind utility class string for badge styling.
 */
export function prStatusBadgeClasses(state: string) {
  const map: Record<string, string> = {
    open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    closed: "bg-rose-50 text-rose-700 border-rose-200",
    merged: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return map[state] || "bg-slate-50 text-slate-600 border-slate-200";
}

/**
 * Maps PR state to dot background color class.
 */
export function prStatusDotColor(state: string) {
  if (state === "open") return "bg-emerald-500";
  if (state === "merged") return "bg-indigo-500";
  if (state === "closed") return "bg-rose-500";
  return "bg-slate-400";
}
