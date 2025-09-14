import React from "react";

interface SectionCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  subtle?: boolean;
  className?: string;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  icon: Icon,
  title,
  action,
  children,
  subtle = false,
  className = "",
}) => {
  return (
    <section
      className={`rounded-2xl border border-surface-300 ${
        subtle ? "bg-white/90" : "bg-white"
      } shadow-sm p-5 space-y-4 ${className}`}
    >
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
            <Icon className="w-5 h-5" />
          </span>
          {title}
        </h2>
        {action && <div className="shrink-0">{action}</div>}
      </header>
      {children}
    </section>
  );
};
