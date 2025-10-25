import { FiBarChart, FiAward, FiStar, FiZap, FiClock } from "react-icons/fi";
import { StatsGrid } from "./StatsGrid";
import { BadgeComponent } from "@/features/gamification/components/BadgeComponent";
import type { ProfileStats } from "../types/profile";
import type { Badge } from "@/features/gamification/types/gamification";
import { transformProfileStats } from "../utils/statsTransform";

interface GamificationTabProps {
  stats: ProfileStats;
  badges: Badge[];
  isPublic?: boolean;
  loading?: boolean;
}

export function GamificationTab({
  stats,
  badges,
  isPublic = false,
  loading = false,
}: GamificationTabProps) {
  if (loading) {
    return (
      <div className="space-y-8">
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-0 rounded-xl p-6 border border-surface-200 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-20" />
                  <div className="h-6 bg-surface-200 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badges Skeleton */}
        <div className="space-y-4">
          <div className="h-6 bg-surface-200 rounded w-32" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-surface-200 animate-pulse"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-surface-200 rounded-lg mx-auto" />
                  <div className="h-4 bg-surface-200 rounded" />
                  <div className="h-3 bg-surface-200 rounded w-2/3 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Statistics Overview */}
      <section>
        <h3 className="text-lg font-semibold text-surface-900 mb-4 flex items-center gap-2 tracking-tight">
          <FiBarChart className="w-5 h-5 text-brand-600" />
          Estatísticas de Desempenho
        </h3>
        <StatsGrid stats={transformProfileStats(stats)} isPublic={isPublic} />
      </section>

      {/* Achievements Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-surface-900 flex items-center gap-2 tracking-tight">
            <FiAward className="w-5 h-5 text-warning-600" />
            Conquistas e Badges
          </h3>
          <div className="text-sm text-surface-600 font-medium">
            {stats.achievements.totalBadges} de {badges.length} badges
            conquistados
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl p-4 border border-warning-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
                <FiAward className="w-5 h-5 text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-warning-800">
                  Total de Badges
                </p>
                <p className="text-xl font-bold text-warning-900">
                  {stats.achievements.totalBadges}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiStar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">
                  Badges Raros
                </p>
                <p className="text-xl font-bold text-purple-900">
                  {stats.achievements.rareBadges}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 border border-success-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
                <FiZap className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-success-800">Recentes</p>
                <p className="text-xl font-bold text-success-900">
                  {stats.achievements.recentBadges.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Badges */}
        {stats.achievements.recentBadges.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-surface-800 mb-3 flex items-center gap-2">
              <FiClock className="w-4 h-4 text-brand-600" />
              Badges Recentes
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {stats.achievements.recentBadges.map((badge) => (
                <BadgeComponent
                  key={badge.id}
                  badge={badge}
                  showProgress={false}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
