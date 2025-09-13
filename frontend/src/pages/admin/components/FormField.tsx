import React from "react";

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, children, className }: Props) {
  return (
    <label className={`text-sm ${className || ""}`}>
      <span className="block text-[11px] uppercase tracking-wide text-gray-500 mb-1 font-medium">
        {label}
      </span>
      {children}
    </label>
  );
}
