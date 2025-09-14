import React from "react";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
      <div className="h-14 w-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-surface-300/60">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-sm font-medium text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      {action}
    </div>
  );
};
