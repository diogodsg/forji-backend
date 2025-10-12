import React, { useState, useEffect } from "react";
import { FaBolt, FaPlus, FaTrophy } from "react-icons/fa";
import { api } from "@/lib/apiClient";

interface XPIndicatorProps {
  size?: "sm" | "md" | "lg";
  showAddButton?: boolean;
  onAddXP?: () => void;
  className?: string;
}

interface UserXP {
  currentXP: number;
  level: number;
  nextLevelXP: number;
  progress: number;
  weeklyXP: number;
}

const XPIndicator: React.FC<XPIndicatorProps> = ({
  size = "md",
  showAddButton = false,
  onAddXP,
  className = "",
}) => {
  const [xpData, setXpData] = useState<UserXP | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchXPData();
  }, []);

  const fetchXPData = async () => {
    try {
      const data = await api<UserXP>("/gamification/my-xp", { auth: true });
      setXpData(data);
    } catch (error) {
      console.error("Erro ao buscar XP:", error);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: {
      container: "px-2 py-1",
      text: "text-xs",
      icon: "w-3 h-3",
      progress: "h-1",
    },
    md: {
      container: "px-3 py-2",
      text: "text-sm",
      icon: "w-4 h-4",
      progress: "h-2",
    },
    lg: {
      container: "px-4 py-3",
      text: "text-base",
      icon: "w-5 h-5",
      progress: "h-3",
    },
  };

  if (loading || !xpData) {
    return (
      <div
        className={`animate-pulse bg-gray-100 rounded-lg ${sizeClasses[size].container} ${className}`}
      >
        <div className="flex items-center gap-2">
          <div className={`bg-gray-300 rounded ${sizeClasses[size].icon}`} />
          <div className="bg-gray-300 rounded w-16 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 ${sizeClasses[size].container} ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <FaTrophy className={`text-yellow-500 ${sizeClasses[size].icon}`} />
            <span
              className={`font-bold text-gray-800 ${sizeClasses[size].text}`}
            >
              Nv. {xpData.level}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <FaBolt className={`text-blue-500 ${sizeClasses[size].icon}`} />
            <span
              className={`font-medium text-blue-700 ${sizeClasses[size].text}`}
            >
              {xpData.currentXP.toLocaleString()}
            </span>
          </div>
        </div>

        {showAddButton && onAddXP && (
          <button
            onClick={onAddXP}
            className={`bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors ${sizeClasses[size].icon}`}
          >
            <FaPlus className="w-2 h-2" />
          </button>
        )}
      </div>

      {size !== "sm" && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progresso para Nv. {xpData.level + 1}</span>
            <span>{xpData.nextLevelXP - xpData.currentXP} XP restantes</span>
          </div>
          <div
            className={`bg-gray-200 rounded-full ${sizeClasses[size].progress}`}
          >
            <div
              className={`bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ${sizeClasses[size].progress}`}
              style={{ width: `${xpData.progress}%` }}
            />
          </div>
          {xpData.weeklyXP > 0 && (
            <div className="text-xs text-green-600 mt-1">
              +{xpData.weeklyXP} XP esta semana
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default XPIndicator;
