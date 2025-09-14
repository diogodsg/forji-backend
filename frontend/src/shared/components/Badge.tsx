import React from "react";

/**
 * Generic visual label for short statuses or metadata.
 * Keeps styling generic (no domain terms). Extend via className or add a new variant.
 */
export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual style palette */
  variant?: BadgeVariant;
  /** Compact sizes only to discourage arbitrary scaling */
  size?: "xs" | "sm";
  /** Corner rounding preset */
  rounded?: "sm" | "full";
  /** Optional leading dot (supply bg-* utility) */
  dotColorClassName?: string;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  neutral:
    "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-600",
  primary:
    "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-400/40",
  success:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/40",
  danger:
    "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-400/40",
  warning:
    "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/40",
  info: "bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-400/40",
  outline:
    "bg-transparent text-slate-600 border border-slate-300 dark:text-slate-300 dark:border-slate-600",
};

const SIZE_STYLES: Record<NonNullable<BadgeProps["size"]>, string> = {
  xs: "text-[10px] px-2 py-0.5",
  sm: "text-xs px-2.5 py-1",
};

/**
 * Presentational component – no semantics beyond <span>.
 * Wrap with <div role="status"> etc if you need screen reader meaning.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "xs",
  rounded = "full",
  dotColorClassName,
  className = "",
  children,
  ...rest
}) => {
  const base =
    "inline-flex items-center gap-1 font-medium select-none whitespace-nowrap";
  const shape = rounded === "full" ? "rounded-full" : "rounded";
  return (
    <span
      className={[
        base,
        shape,
        SIZE_STYLES[size],
        VARIANT_STYLES[variant],
        className,
      ].join(" ")}
      {...rest}
    >
      {dotColorClassName && (
        <span
          className={"w-1.5 h-1.5 rounded-full " + dotColorClassName}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

/**
 * Maps an arbitrary status string to badge visual config.
 * Supply a mapping to override specific statuses while keeping a sane fallback.
 */
export interface SemanticStatusOptions {
  status: string; // e.g., open | closed | merged | active | disabled
  mapping?: Partial<Record<string, { variant?: BadgeVariant; dot?: string }>>;
  fallbackVariant?: BadgeVariant;
  fallbackDot?: string;
}

/**
 * Returns props to feed into <Badge> (except children which uses returned label).
 */
export function semanticStatusBadge({
  status,
  mapping = {},
  fallbackVariant = "neutral",
  fallbackDot = "bg-slate-400",
}: SemanticStatusOptions) {
  const key = status.toLowerCase();
  const conf = mapping[key] || {};
  return {
    variant: conf.variant || fallbackVariant,
    dotColorClassName: conf.dot || fallbackDot,
    label: status,
  };
}
