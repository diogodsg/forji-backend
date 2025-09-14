import React from "react";

const badgeStyles: Record<string, string> = {
  react: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  ts: "bg-blue-50 text-blue-700 border border-blue-200",
  open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  merged: "bg-indigo-50 text-indigo-700 border border-indigo-200",
  closed: "bg-red-50 text-red-700 border border-red-200",
  default: "bg-surface-100 text-gray-700 border border-surface-300",
};

interface BadgeProps {
  variant?: string;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
        badgeStyles[variant] || badgeStyles.default
      } ${className}`}
    >
      {children}
    </span>
  );
};
