import { FiCheck } from "react-icons/fi";
import type { Badge } from "../types/gamification";
import { RARITY_COLORS } from "../types/gamification";

interface BadgeComponentProps {
  badge: Badge;
  size?: "sm" | "md" | "lg";
  showProgress?: boolean;
  className?: string;
}

export function BadgeComponent({
  badge,
  size = "md",
  showProgress = false,
  className = "",
}: BadgeComponentProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-20 h-20 text-3xl",
  };

  const rarityClass = RARITY_COLORS[badge.rarity];
  const hasProgress =
    badge.progress !== undefined && badge.maxProgress !== undefined;
  const progressPercentage = hasProgress
    ? (badge.progress! / badge.maxProgress!) * 100
    : 100;

  return (
    <div className={`relative group ${className}`}>
      {/* Badge Icon */}
      <div
        className={`
          ${sizeClasses[size]} 
          ${rarityClass}
          rounded-full border-2 flex items-center justify-center
          cursor-pointer transition-transform hover:scale-110
          shadow-lg
        `}
        title={badge.description}
      >
        <span className="font-bold">{badge.icon}</span>

        {/* Unlocked indicator */}
        {badge.unlockedAt && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <FiCheck className="w-3 h-3 text-white" />
          </div>
        )}
      </div>

      {/* Progress bar para badges em progresso */}
      {showProgress && hasProgress && badge.progress! < badge.maxProgress! && (
        <div className="absolute -bottom-2 left-0 right-0">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 rounded-full h-1 transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Tooltip expandido */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
        <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
          <div className="font-bold">{badge.name}</div>
          <div className="text-gray-300">{badge.description}</div>
          {hasProgress && (
            <div className="text-xs text-gray-400 mt-1">
              Progress: {badge.progress}/{badge.maxProgress}
            </div>
          )}
          {badge.unlockedAt && (
            <div className="text-xs text-green-400 mt-1">
              Unlocked: {new Date(badge.unlockedAt).toLocaleDateString()}
            </div>
          )}

          {/* Tooltip arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      </div>
    </div>
  );
}
