import { useState } from "react";
import {
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiUsers,
  FiFilter,
  FiClock,
} from "react-icons/fi";
import type { TimelineEntry } from "../types/profile";

interface TimelineSectionProps {
  timeline: TimelineEntry[];
  isPublic?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const typeConfig = {
  badge_earned: {
    icon: FiAward,
    color: "text-warning-600",
    bgColor: "bg-warning-50",
    borderColor: "border-warning-200",
    label: "Badge Conquistado",
  },
  pdi_milestone: {
    icon: FiTarget,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Milestone PDI",
  },
  level_up: {
    icon: FiTrendingUp,
    color: "text-brand-600",
    bgColor: "bg-brand-50",
    borderColor: "border-brand-200",
    label: "Novo Nível",
  },
  team_contribution: {
    icon: FiUsers,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    label: "Contribuição Time",
  },
  key_result: {
    icon: FiTarget,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Key Result",
  },
};

export function TimelineSection({
  timeline,
  isPublic = false,
  loading = false,
  onLoadMore,
  hasMore = false,
}: TimelineSectionProps) {
  const [filterType, setFilterType] = useState<TimelineEntry["type"] | "all">(
    "all"
  );

  // Filter timeline based on public/private access and selected filter
  const filteredTimeline = timeline
    .filter((entry) => !isPublic || entry.isPublic)
    .filter((entry) => filterType === "all" || entry.type === filterType);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  if (loading && timeline.length === 0) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-surface-200 animate-pulse"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-surface-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded w-1/3" />
                <div className="h-3 bg-surface-200 rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <FiFilter className="w-4 h-4 text-surface-600" />
        <span className="text-sm font-medium text-surface-600">
          Filtrar por:
        </span>

        <div className="flex gap-1 flex-wrap">
          {[
            { value: "all", label: "Todas" },
            { value: "badge_earned", label: "Badges" },
            { value: "level_up", label: "Níveis" },
            { value: "team_contribution", label: "Equipe" },
            ...(!isPublic
              ? [
                  { value: "pdi_milestone", label: "PDI" },
                  { value: "key_result", label: "Key Results" },
                ]
              : []),
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value as any)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium transition-all duration-200
                ${
                  filterType === filter.value
                    ? "bg-brand-100 text-brand-700 border border-brand-300"
                    : "bg-surface-50 text-surface-600 border border-surface-200 hover:bg-surface-100"
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filteredTimeline.length === 0 ? (
          <div className="text-center py-8">
            <FiClock className="w-12 h-12 text-surface-400 mx-auto mb-3" />
            <p className="text-surface-600">
              {filterType === "all"
                ? "Nenhuma atividade encontrada"
                : `Nenhuma atividade do tipo "${filterType}" encontrada`}
            </p>
          </div>
        ) : (
          filteredTimeline.map((entry) => {
            const config = typeConfig[entry.type];
            const Icon = config.icon;

            return (
              <div
                key={entry.id}
                className={`
                  bg-white rounded-xl p-4 border transition-all duration-200
                  hover:shadow-soft hover:scale-[1.02] cursor-default
                  ${config.borderColor}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${config.bgColor}
                  `}
                  >
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-surface-900 truncate">
                          {entry.title}
                        </h4>
                        <p className="text-sm text-surface-600 mt-1">
                          {entry.description}
                        </p>
                      </div>

                      {/* XP Badge */}
                      {entry.xpGained && entry.xpGained > 0 && (
                        <div className="flex-shrink-0 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          +{entry.xpGained} XP
                        </div>
                      )}
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-surface-500">
                        {formatTimeAgo(entry.timestamp)}
                      </span>
                      <span className="text-xs text-surface-400">•</span>
                      <span className="text-xs text-surface-500">
                        {config.label}
                      </span>

                      {!entry.isPublic && !isPublic && (
                        <>
                          <span className="text-xs text-surface-400">•</span>
                          <span className="text-xs text-orange-600 font-medium">
                            Privado
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-surface-300 rounded-lg text-sm font-medium text-surface-700 bg-white hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Carregando..." : "Carregar mais atividades"}
          </button>
        </div>
      )}
    </div>
  );
}
