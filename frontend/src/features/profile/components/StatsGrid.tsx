import {
  FiStar,
  FiTarget,
  FiCalendar,
  FiTrendingUp,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import type { ProfileStats } from "../types/profile";

interface StatsGridProps {
  stats: ProfileStats;
  isPublic?: boolean;
}

export function StatsGrid({ stats, isPublic = false }: StatsGridProps) {
  const statItems = [
    {
      icon: FiStar,
      label: "XP Total",
      value: stats.totalXP.toLocaleString(),
      color: "from-warning-400 to-warning-500",
      bgColor: "bg-warning-50",
      iconColor: "text-warning-600",
      show: true,
    },
    {
      icon: FiTarget,
      label: "PDIs Concluídos",
      value: stats.completedPDIs,
      color: "from-success-400 to-success-500",
      bgColor: "bg-success-50",
      iconColor: "text-success-600",
      show: !isPublic, // Hide PDI details for public profiles
    },
    {
      icon: FiCalendar,
      label: "PDIs Ativos",
      value: stats.activePDIs,
      color: "from-blue-400 to-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      show: !isPublic,
    },
    {
      icon: FiTrendingUp,
      label: "Taxa de Conclusão",
      value: `${stats.completionRate}%`,
      color: "from-brand-400 to-brand-500",
      bgColor: "bg-brand-50",
      iconColor: "text-brand-600",
      show: !isPublic,
    },
    {
      icon: FiUsers,
      label: "Contribuições Time",
      value: stats.teamContributions,
      color: "from-purple-400 to-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      show: true,
    },
    {
      icon: FiAward,
      label: "Badges Conquistados",
      value: stats.badgesEarned,
      color: "from-orange-400 to-orange-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      show: true,
    },
  ];

  const visibleStats = statItems.filter((stat) => stat.show);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {visibleStats.map((stat, index) => (
        <div
          key={index}
          className="group bg-surface-0 rounded-xl p-6 shadow-soft border border-surface-200 transition-all duration-200 hover:shadow-glow hover:scale-105 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            {/* Icon Container */}
            <div
              className={`
              w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200
              ${stat.bgColor} group-hover:scale-110
            `}
            >
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>

            {/* Stats Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-600 truncate">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-surface-900 mt-1 tracking-tight">
                {stat.value}
              </p>
            </div>

            {/* Gradient Indicator */}
            <div
              className={`
              w-1 h-12 rounded-full bg-gradient-to-b ${stat.color} 
              opacity-60 group-hover:opacity-100 transition-opacity duration-200
            `}
            />
          </div>

          {/* Hover Effect Background */}
          <div
            className={`
            absolute inset-0 rounded-xl bg-gradient-to-br ${stat.color} 
            opacity-0 group-hover:opacity-5 transition-opacity duration-200 pointer-events-none
          `}
          />
        </div>
      ))}
    </div>
  );
}
