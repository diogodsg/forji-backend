import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DebugSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export function DebugSection({
  title,
  icon,
  children,
  defaultExpanded = false,
}: DebugSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-gray-800">{title}</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}
