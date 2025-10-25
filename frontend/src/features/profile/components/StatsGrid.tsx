import React from "react";
import {
  FiStar,
  FiTarget,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import type { OrganizedProfileStats } from "../types/profileStats";

interface StatsGridProps {
  stats: OrganizedProfileStats;
  isPublic?: boolean;
}

interface StatItemProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon?: React.ElementType;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  hint,
  icon: Icon,
  className = "",
}) => (
  <div className={`flex flex-col ${className}`}>
    <div className="flex items-center gap-2 mb-1">
      {Icon && <Icon className="w-4 h-4 text-surface-500" />}
      <div className="text-xs font-medium text-surface-500 uppercase tracking-wide">
        {label}
      </div>
    </div>
    <div className="text-2xl font-bold text-surface-900 tracking-tight mb-1">
      {value}
    </div>
    {hint && <div className="text-xs text-surface-600 font-medium">{hint}</div>}
  </div>
);

const StatsPanel: React.FC<{
  title: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
  className?: string;
}> = ({
  title,
  badge,
  badgeColor = "bg-brand-100 text-brand-700",
  children,
  className = "",
}) => (
  <div
    className={`
    bg-surface-0 rounded-xl border border-surface-300 p-5 
    shadow-sm hover:shadow-md transition-all duration-200
    ${className}
  `}
  >
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
      {badge && (
        <span className={`text-xs font-medium px-2 py-1 rounded ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

export function StatsGrid({ stats, isPublic = false }: StatsGridProps) {
  // Protege contra valores inconsistentes na barra de progresso
  const safeProgressPercentage = Math.min(
    Math.max(stats.gamification.levelProgress.percentage, 0),
    100
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Gamification Panel */}
      <StatsPanel
        title="Gamificação"
        badge="XP"
        badgeColor="bg-brand-100 text-brand-700"
      >
        <StatItem
          label="Total XP"
          value={stats.gamification.totalXP.toLocaleString()}
          hint={`Level ${stats.gamification.level}`}
          icon={FiStar}
        />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp className="w-4 h-4 text-surface-500" />
            <div className="text-xs font-medium text-surface-500 uppercase tracking-wide">
              Progresso
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-surface-600 font-medium">
                {stats.gamification.levelProgress.current} /{" "}
                {stats.gamification.levelProgress.required} XP
              </span>
              <span className="text-brand-600 font-semibold">
                {safeProgressPercentage}%
              </span>
            </div>
            <div className="w-full bg-surface-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300"
                style={{ width: `${safeProgressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <StatItem
          label="Badges"
          value={stats.gamification.badgesEarned}
          hint="Conquistas desbloqueadas"
          icon={FiAward}
        />
      </StatsPanel>

      {/* PDI Panel - Hidden for public profiles */}
      {!isPublic && (
        <StatsPanel
          title="PDI"
          badge="Desenvolvimento"
          badgeColor="bg-emerald-100 text-emerald-700"
        >
          <StatItem
            label="Concluídos"
            value={stats.pdi.completedPDIs}
            hint="PDIs finalizados"
            icon={FiTarget}
          />

          <StatItem
            label="Ativos"
            value={stats.pdi.activePDIs}
            hint="Em andamento"
            icon={FiActivity}
          />

          <StatItem
            label="Taxa de Conclusão"
            value={`${stats.pdi.completionRate}%`}
            hint="Eficiência nos objetivos"
            icon={FiTrendingUp}
          />
        </StatsPanel>
      )}

      {/* Team Panel */}
      <StatsPanel
        title="Colaboração"
        badge="Time"
        badgeColor="bg-purple-100 text-purple-700"
        className={isPublic ? "md:col-span-2 lg:col-span-1" : ""}
      >
        <StatItem
          label="Contribuições"
          value={stats.team.teamContributions}
          hint="Atividades em equipe"
          icon={FiUsers}
        />

        <StatItem
          label="Colaborações"
          value={stats.team.collaborations}
          hint="Projetos colaborativos"
          icon={FiActivity}
        />
      </StatsPanel>
    </div>
  );
}
