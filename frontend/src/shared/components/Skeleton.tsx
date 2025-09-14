export interface SkeletonProps {
  className?: string;
  /** When rendering a multi-line block skeleton */
  lines?: number;
  /** Apply rounded-full for circular shapes (e.g., avatar) */
  circle?: boolean;
  /** Visual tone (light | default | dark) */
  tone?: "light" | "default" | "dark";
}

/**
 * Generic animated skeleton placeholder. For multi-line, pass `lines`.
 */
export function Skeleton({
  className = "",
  lines = 1,
  circle,
  tone = "light",
}: SkeletonProps) {
  const toneClass =
    tone === "light"
      ? "bg-slate-100/80 dark:bg-slate--400"
      : tone === "dark"
      ? "bg-slate-300/80 dark:bg-slate-500"
      : "bg-slate-200/70 dark:bg-slate-600";
  if (lines <= 1) {
    return (
      <div
        className={`animate-pulse ${toneClass} h-4 rounded ${
          circle ? "rounded-full" : "rounded-md"
        } ${className}`}
      />
    );
  }
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse ${toneClass} h-4 rounded-md ${
            i < lines - 1 ? "mb-2" : ""
          }`}
          style={{ width: i === lines - 1 ? "60%" : undefined }}
        />
      ))}
    </div>
  );
}
