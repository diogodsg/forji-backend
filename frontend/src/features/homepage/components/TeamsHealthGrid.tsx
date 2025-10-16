import {
  Users,
  Crown,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  User,
} from "lucide-react";

interface TeamHealthData {
  id: string;
  name: string;
  managerName: string;
  health: number; // 0-100
  memberCount: number;
  weeklyXp: number;
  weeklyXpChange: number; // percentage change
  pdiCompletionRate: number; // 0-100
  lastActivity: string;
  achievements: number;
  isStarTeam?: boolean;
  needsAttention?: boolean;
}

interface TeamsHealthGridProps {
  teams: TeamHealthData[];
  onTeamClick?: (teamId: string) => void;
  className?: string;
}

/**
 * Grid com overview de todos os times da empresa
 * Para CEOs terem visibilidade da performance de cada time
 */
export function TeamsHealthGrid({
  teams,
  onTeamClick,
  className = "",
}: TeamsHealthGridProps) {
  const getHealthConfig = (health: number) => {
    if (health >= 85) {
      return {
        bgColor: "bg-success-50",
        borderColor: "border-success-200",
        textColor: "text-success-700",
        dotColor: "bg-success-500",
        status: "Excelente",
      };
    } else if (health >= 70) {
      return {
        bgColor: "bg-brand-50",
        borderColor: "border-brand-200",
        textColor: "text-brand-700",
        dotColor: "bg-brand-500",
        status: "Boa",
      };
    } else if (health >= 50) {
      return {
        bgColor: "bg-warning-50",
        borderColor: "border-warning-200",
        textColor: "text-warning-700",
        dotColor: "bg-warning-500",
        status: "Atenção",
      };
    } else {
      return {
        bgColor: "bg-error-50",
        borderColor: "border-error-200",
        textColor: "text-error-700",
        dotColor: "bg-error-500",
        status: "Crítico",
      };
    }
  };

  const formatXpChange = (change: number) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    return {
      icon: isPositive ? TrendingUp : isNegative ? TrendingDown : null,
      color: isPositive
        ? "text-success-600"
        : isNegative
        ? "text-error-600"
        : "text-surface-600",
      text: isPositive
        ? `+${Math.abs(change)}%`
        : isNegative
        ? `-${Math.abs(change)}%`
        : "0%",
    };
  };

  const sortedTeams = [...teams].sort((a, b) => {
    // Star teams first, then by health score
    if (a.isStarTeam && !b.isStarTeam) return -1;
    if (!a.isStarTeam && b.isStarTeam) return 1;
    return b.health - a.health;
  });

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-surface-300 p-8 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-surface-800">
              Saúde dos Times
            </h2>
            <p className="text-surface-600">
              Performance e status de todos os {teams.length} times
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="text-xl font-bold text-success-600">
              {teams.filter((t) => t.health >= 85).length}
            </div>
            <div className="text-sm text-surface-500">Excelentes</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-warning-600">
              {teams.filter((t) => t.health < 70).length}
            </div>
            <div className="text-sm text-surface-500">Precisam atenção</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-error-600">
              {teams.filter((t) => t.health < 50).length}
            </div>
            <div className="text-sm text-surface-500">Críticos</div>
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedTeams.map((team) => {
          const healthConfig = getHealthConfig(team.health);
          const xpChangeConfig = formatXpChange(team.weeklyXpChange);
          const XpChangeIcon = xpChangeConfig.icon;

          return (
            <div
              key={team.id}
              onClick={() => onTeamClick?.(team.id)}
              className={`
                relative border-2 rounded-xl p-5 transition-all duration-200 cursor-pointer
                hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                ${healthConfig.bgColor} ${healthConfig.borderColor}
                ${team.isStarTeam ? "ring-2 ring-yellow-400 ring-offset-2" : ""}
              `}
            >
              {/* Team Status Indicators */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {team.isStarTeam && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                  {team.needsAttention && (
                    <AlertTriangle className="w-5 h-5 text-warning-500" />
                  )}
                  <div
                    className={`w-3 h-3 rounded-full ${healthConfig.dotColor}`}
                  />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-surface-800">
                    {team.health}%
                  </div>
                  <div
                    className={`text-sm font-medium ${healthConfig.textColor}`}
                  >
                    {healthConfig.status}
                  </div>
                </div>
              </div>

              {/* Team Name */}
              <h3 className="font-semibold text-surface-800 mb-3 truncate">
                {team.name}
              </h3>

              {/* Manager Info */}
              <div className="flex items-center gap-2 mb-4">
                <User className="w-4 h-4 text-surface-500" />
                <span className="text-sm text-surface-600 truncate">
                  {team.managerName}
                </span>
              </div>

              {/* Team Metrics */}
              <div className="space-y-2">
                {/* Members Count */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-600">Membros:</span>
                  <span className="font-medium text-surface-800">
                    {team.memberCount}
                  </span>
                </div>

                {/* Weekly XP */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-600">XP semanal:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-surface-800">
                      {team.weeklyXp.toLocaleString()}
                    </span>
                    {XpChangeIcon && (
                      <div
                        className={`flex items-center ${xpChangeConfig.color}`}
                      >
                        <XpChangeIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {xpChangeConfig.text}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* PDI Completion */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-600">PDI:</span>
                  <span className="font-medium text-surface-800">
                    {team.pdiCompletionRate}%
                  </span>
                </div>

                {/* Achievements */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-600">Conquistas:</span>
                  <span className="font-medium text-brand-600">
                    {team.achievements}
                  </span>
                </div>
              </div>

              {/* Last Activity */}
              <div className="mt-3 pt-3 border-t border-surface-200">
                <p className="text-xs text-surface-500">
                  Última atividade: {team.lastActivity}
                </p>
              </div>

              {/* Star Team Badge */}
              {team.isStarTeam && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                  <Crown className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Summary */}
      <div className="mt-6 pt-6 border-t border-surface-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-800 mb-1">
              {teams.reduce((sum, team) => sum + team.memberCount, 0)}
            </div>
            <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
              TOTAL PESSOAS
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-brand-600 mb-1">
              {Math.round(
                teams.reduce((sum, team) => sum + team.health, 0) / teams.length
              )}
              %
            </div>
            <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
              SAÚDE MÉDIA
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              {teams
                .reduce((sum, team) => sum + team.weeklyXp, 0)
                .toLocaleString()}
            </div>
            <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
              XP TOTAL SEMANAL
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">
              {Math.round(
                teams.reduce((sum, team) => sum + team.pdiCompletionRate, 0) /
                  teams.length
              )}
              %
            </div>
            <div className="text-xs uppercase tracking-wide text-surface-500 font-medium">
              PDI MÉDIO
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
