import React from "react";

/**
 * Props for SidePanel. Keep content lightweight; large forms may need focus mgmt.
 */
export interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  widthClass?: string; // tailwind width e.g., 'max-w-xl'
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

/**
 * Sliding overlay panel. Currently simple: no focus trap / aria labels beyond close button.
 * Add them where accessibility requirements increase.
 */
export function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  widthClass = "max-w-xl",
  children,
  headerActions,
  className = "",
  overlayClassName = "",
}: SidePanelProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex !m-0">
      <div
        className={`flex-1 bg-black/30 backdrop-blur-sm ${overlayClassName}`}
        onClick={onClose}
      />
      <div
        className={`w-full ${widthClass} h-full bg-white/90 backdrop-blur-xl border-l border-surface-300 flex flex-col shadow-2xl ${className}`}
      >
        {(title || headerActions) && (
          <div className="px-6 py-5 border-b border-surface-300 flex items-start justify-between bg-gradient-to-r from-indigo-50 to-sky-50">
            <div>
              {title && (
                <h2 className="text-base font-semibold tracking-wide text-indigo-600">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-[11px] text-gray-500">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar painel"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        <div className="p-6 overflow-y-auto scrollbar-thin flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
