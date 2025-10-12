import { useState, useMemo } from 'react';
import {
  FiCalendar,
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiClock,
  FiCheckCircle,
  FiPlay,
  FiPause,
  FiArchive,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiUser,
  FiUsers,
  FiMessageCircle,
  FiBarChart,
  FiInfo,
} from 'react-icons/fi';
import type { TimelineItem, TimelineFilters, TimelineStats } from '../types/timeline';

interface PdiTimelineProps {
  cycles: TimelineItem[];
  loading?: boolean;
  error?: string;
  showStats?: boolean;
  allowFiltering?: boolean;
  className?: string;
}

// Status icon mapping
const statusIconMap = {
  planned: FiClock,
  active: FiPlay,
  paused: FiPause,
  completed: FiCheckCircle,
  archived: FiArchive,
};

const statusColorMap = {
  planned: 'text-gray-500 bg-gray-100',
  active: 'text-blue-600 bg-blue-100',
  paused: 'text-yellow-600 bg-yellow-100',
  completed: 'text-green-600 bg-green-100',
  archived: 'text-gray-600 bg-gray-200',
};

const badgeRarityColors = {
  common: 'bg-gray-100 text-gray-600 border-gray-300',
  rare: 'bg-blue-100 text-blue-600 border-blue-300',
  epic: 'bg-purple-100 text-purple-600 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-600 border-yellow-300',
};

export function PdiTimeline({
  cycles,
  loading = false,
  error,
  showStats = true,
  allowFiltering = true,
  className = '',
}: PdiTimelineProps) {
  const [filters, setFilters] = useState<TimelineFilters>({});
  const [expandedCycles, setExpandedCycles] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Calculate timeline stats
  const stats = useMemo<TimelineStats>(() => {
    const totalCycles = cycles.length;
    const completedCycles = cycles.filter(c => c.status === 'completed').length;
    const totalKRs = cycles.reduce((sum, c) => sum + c.totalKRs, 0);
    const totalKRsAchieved = cycles.reduce((sum, c) => sum + c.achievedKRs, 0);
    const totalBadgesEarned = cycles.reduce((sum, c) => sum + (c.badges?.length || 0), 0);
    
    const averageCompletionRate = totalCycles > 0 
      ? cycles.reduce((sum, c) => sum + (c.completionPercentage || 0), 0) / totalCycles 
      : 0;

    const allCompetencies = new Set<string>();
    cycles.forEach(c => c.pdi.competencies.forEach(comp => allCompetencies.add(comp)));

    return {
      totalCycles,
      completedCycles,
      totalKRs,
      totalKRsAchieved,
      averageCompletionRate,
      totalBadgesEarned,
      currentStreak: 0, // TODO: Calculate from streak data
      competenciesImproved: Array.from(allCompetencies),
    };
  }, [cycles]);

  // Filter cycles based on current filters
  const filteredCycles = useMemo(() => {
    return cycles.filter(cycle => {
      if (filters.status?.length && !filters.status.includes(cycle.status)) {
        return false;
      }
      
      if (filters.dateRange) {
        const cycleStart = new Date(cycle.startDate);
        const filterStart = new Date(filters.dateRange.start);
        const filterEnd = new Date(filters.dateRange.end);
        
        if (cycleStart < filterStart || cycleStart > filterEnd) {
          return false;
        }
      }

      if (filters.competencies?.length) {
        const hasCompetency = filters.competencies.some(comp =>
          cycle.pdi.competencies.includes(comp)
        );
        if (!hasCompetency) return false;
      }

      return true;
    });
  }, [cycles, filters]);

  const toggleCycleExpansion = (cycleId: string) => {
    const newExpanded = new Set(expandedCycles);
    if (newExpanded.has(cycleId)) {
      newExpanded.delete(cycleId);
    } else {
      newExpanded.add(cycleId);
    }
    setExpandedCycles(newExpanded);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-surface-200 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-surface-200 rounded w-3/4"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <FiInfo className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">Erro ao carregar timeline</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <FiCalendar className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalCycles}</div>
                <div className="text-sm text-gray-600">Ciclos Total</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.completedCycles}</div>
                <div className="text-sm text-gray-600">Concluídos</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiTarget className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalKRsAchieved}/{stats.totalKRs}
                </div>
                <div className="text-sm text-gray-600">KRs Atingidas</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                <FiAward className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalBadgesEarned}</div>
                <div className="text-sm text-gray-600">Badges</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {allowFiltering && (
        <div className="rounded-2xl border border-surface-300 bg-white shadow-sm p-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <FiFilter className="w-4 h-4" />
            Filtros
            {showFilters ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </button>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  {(['planned', 'active', 'paused', 'completed', 'archived'] as const).map(status => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status?.includes(status) || false}
                        onChange={(e) => {
                          const currentStatuses = filters.status || [];
                          if (e.target.checked) {
                            setFilters({
                              ...filters,
                              status: [...currentStatuses, status]
                            });
                          } else {
                            setFilters({
                              ...filters,
                              status: currentStatuses.filter(s => s !== status)
                            });
                          }
                        }}
                        className="rounded border-surface-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.dateRange?.start || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value, end: filters.dateRange?.end || '' }
                    })}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm"
                    placeholder="Data início"
                  />
                  <input
                    type="date"
                    value={filters.dateRange?.end || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: filters.dateRange?.start || '', end: e.target.value }
                    })}
                    className="w-full rounded-lg border border-surface-300 px-3 py-2 text-sm"
                    placeholder="Data fim"
                  />
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exibir</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showBadges !== false}
                      onChange={(e) => setFilters({ ...filters, showBadges: e.target.checked })}
                      className="rounded border-surface-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Badges</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.showFeedback !== false}
                      onChange={(e) => setFilters({ ...filters, showFeedback: e.target.checked })}
                      className="rounded border-surface-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Feedback</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-6">
        {filteredCycles.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-surface-300 bg-white shadow-sm">
            <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ciclo encontrado</h3>
            <p className="text-gray-600">Ajuste os filtros ou crie um novo ciclo PDI</p>
          </div>
        ) : (
          filteredCycles.map((cycle, index) => (
            <TimelineCycleCard
              key={cycle.id}
              cycle={cycle}
              isExpanded={expandedCycles.has(cycle.id)}
              onToggleExpansion={() => toggleCycleExpansion(cycle.id)}
              showBadges={filters.showBadges !== false}
              showFeedback={filters.showFeedback !== false}
              isLast={index === filteredCycles.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Individual Timeline Cycle Card Component
interface TimelineCycleCardProps {
  cycle: TimelineItem;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  showBadges: boolean;
  showFeedback: boolean;
  isLast: boolean;
}

function TimelineCycleCard({
  cycle,
  isExpanded,
  onToggleExpansion,
  showBadges,
  showFeedback,
  isLast,
}: TimelineCycleCardProps) {
  const StatusIcon = statusIconMap[cycle.status];
  const statusClass = statusColorMap[cycle.status];
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const completionPercentage = cycle.completionPercentage || 0;

  return (
    <div className="relative">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-surface-200 -z-10"></div>
      )}

      <div className="rounded-2xl border border-surface-300 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {/* Status Indicator */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${statusClass} flex items-center justify-center border-2 border-white shadow-sm`}>
              <StatusIcon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{cycle.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{cycle.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      {formatDate(cycle.startDate)} - {formatDate(cycle.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiTarget className="w-4 h-4" />
                      {cycle.achievedKRs}/{cycle.totalKRs} KRs
                    </span>
                  </div>
                </div>

                <button
                  onClick={onToggleExpansion}
                  className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 hover:bg-surface-100 rounded-lg transition-all duration-200"
                >
                  {isExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Progresso do Ciclo</span>
                  <span>{Math.round(completionPercentage)}%</span>
                </div>
                <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 via-sky-500 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Info */}
              <div className="flex items-center gap-4 mt-4">
                {/* Competencies */}
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {cycle.pdi.competencies.length} competências
                  </span>
                </div>

                {/* Badges */}
                {showBadges && cycle.badges && cycle.badges.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FiAward className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-gray-600">
                      {cycle.badges.length} badges
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="border-t border-surface-200 p-6 space-y-6">
            {/* Work Focus & Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Work Focus */}
              {cycle.workFocus && cycle.workFocus.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiTarget className="w-4 h-4 text-indigo-600" />
                    Foco de Trabalho
                  </h4>
                  <ul className="space-y-2">
                    {cycle.workFocus.map((focus, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                        {focus}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {cycle.achievements && cycle.achievements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <FiStar className="w-4 h-4 text-green-600" />
                    Conquistas
                  </h4>
                  <ul className="space-y-2">
                    {cycle.achievements.map((achievement, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Challenges */}
            {cycle.challenges && cycle.challenges.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiTrendingUp className="w-4 h-4 text-orange-600" />
                  Desafios e Melhorias
                </h4>
                <ul className="space-y-2">
                  {cycle.challenges.map((challenge, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
                      {challenge}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* KRs Detail */}
            {cycle.pdi.krs && cycle.pdi.krs.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiBarChart className="w-4 h-4 text-blue-600" />
                  Key Results
                </h4>
                <div className="space-y-3">
                  {cycle.pdi.krs.map((kr) => (
                    <div key={kr.id} className="rounded-lg border border-surface-300 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">{kr.description}</h5>
                          <p className="text-sm text-gray-600 mb-2">{kr.successCriteria}</p>
                          {kr.currentStatus && (
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Status:</span> {kr.currentStatus}
                            </p>
                          )}
                        </div>
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Atingida
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Earned */}
            {showBadges && cycle.badges && cycle.badges.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiAward className="w-4 h-4 text-yellow-600" />
                  Badges Conquistados
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {cycle.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`rounded-lg border-2 p-3 ${badgeRarityColors[badge.rarity]}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{badge.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium truncate">{badge.name}</h5>
                          <p className="text-xs opacity-75">{badge.rarity}</p>
                        </div>
                      </div>
                      {badge.description && (
                        <p className="text-xs mt-2 opacity-90">{badge.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            {showFeedback && cycle.feedback && cycle.feedback.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <FiMessageCircle className="w-4 h-4 text-purple-600" />
                  Feedback Recebido
                </h4>
                <div className="space-y-3">
                  {cycle.feedback.map((feedback) => (
                    <div key={feedback.id} className="rounded-lg border border-surface-300 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {feedback.type === 'manager' ? (
                            <FiUser className="w-5 h-5 text-indigo-600" />
                          ) : feedback.type === 'peer' ? (
                            <FiUsers className="w-5 h-5 text-green-600" />
                          ) : (
                            <FiMessageCircle className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{feedback.author}</span>
                            <span className="text-xs text-gray-500 capitalize">({feedback.type})</span>
                            {feedback.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < feedback.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700">{feedback.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(feedback.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competencies Progress */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-indigo-600" />
                Progresso em Competências
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cycle.pdi.competencies.map((competency, index) => {
                  const record = cycle.pdi.records.find(r => r.area === competency);
                  return (
                    <div key={index} className="rounded-lg border border-surface-300 p-3">
                      <h5 className="font-medium text-gray-900 mb-1 text-sm">{competency}</h5>
                      {record && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <span>Nível {record.levelBefore || 0}</span>
                          <FiTrendingUp className="w-3 h-3" />
                          <span className="font-medium text-green-600">Nível {record.levelAfter || 0}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}