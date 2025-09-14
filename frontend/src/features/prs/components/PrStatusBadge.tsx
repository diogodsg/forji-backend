import React from "react";
import {
  prStatusBadgeClasses,
  prStatusDotColor,
} from "@/features/prs/lib/status";

/**
 * Props for unified PR status badge UI.
 */
export interface PrStatusBadgeProps {
  state: string;
  withDot?: boolean;
  className?: string;
  children?: React.ReactNode; // allow override label
}

/**
 * Unified PR status badge. Optional colored dot for compact table usage.
 */
export function PrStatusBadge({
  state,
  withDot = true,
  className = "",
  children,
}: PrStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full border ${prStatusBadgeClasses(
        state
      )} ${className}`}
    >
      {withDot && (
        <span
          className={`inline-block w-1.5 h-1.5 rounded-full ${prStatusDotColor(
            state
          )}`}
        />
      )}
      {children || state}
    </span>
  );
}
