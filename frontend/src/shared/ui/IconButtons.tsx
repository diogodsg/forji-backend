import React from "react";

interface IconButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  variant?: "default" | "danger";
}

const base =
  "inline-flex items-center justify-center h-8 w-8 rounded-md border transition focus:outline-none focus:ring-2 focus:ring-indigo-400";
const variants: Record<string, string> = {
  default:
    "border-surface-300 bg-white hover:bg-surface-100 text-gray-600 hover:text-indigo-600",
  danger: "border-red-200 bg-white hover:bg-red-50 text-red-600",
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className={`${base} ${variants[variant]}`}
  >
    <Icon className="w-4 h-4" />
  </button>
);
