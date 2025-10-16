import {
  User,
  TrendingUp,
  Users,
  Award,
  Flame,
  Target,
  TrendingDown,
  ArrowRight,
} from "lucide-react";
import type { PersonalContribution } from "../types";

interface MyContributionProps {
  contribution?: PersonalContribution;
  loading?: boolean;
}

export function MyContribution({
  contribution,
  loading = false,
}: MyContributionProps) {
  if (loading) {
    return (
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-9 w-9 bg-surface-200 rounded-lg"></div>
            <div className="h-6 w-40 bg-surface-200 rounded"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-surface-200 rounded"></div>
            <div className="h-4 w-3/4 bg-surface-200 rounded"></div>
            <div className="h-4 w-1/2 bg-surface-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!contribution) {
    return (
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6">
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-success-50 text-success-600 border border-surface-300/60">
              <User className="w-5 h-5" />
            </span>
            Minha Contribuição
          </h3>
        </header>

        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-100 flex items-center justify-center">
            <User className="w-6 h-6 text-surface-400" />
          </div>
          <p className="text-gray-600 text-sm">Carregando contribuições...</p>
        </div>
      </section>
    );
  }

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4" />;
    return <ArrowRight className="w-4 h-4" />;
  };

  const growthColor =
    contribution.growthVsPreviousMonth > 0
      ? "text-success-600"
      : contribution.growthVsPreviousMonth < 0
      ? "text-error-600"
      : "text-gray-600";

  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-6">
      <header className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-success-50 text-success-600 border border-surface-300/60">
            <User className="w-5 h-5" />
          </span>
          Minha Contribuição
        </h3>
      </header>

      <div className="space-y-4">
        {/* XP Contribution */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-brand-50 to-surface-50 border border-brand-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-brand-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {contribution.xpContributed.toLocaleString()} XP
              </p>
              <p className="text-xs text-gray-600">
                {contribution.xpPercentageOfTeam}% do total da equipe
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Ranking</div>
            <div className="text-sm font-semibold text-brand-600">
              #{contribution.rankInTeam} de {contribution.totalTeamMembers}
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Mentorships */}
          <div className="p-3 rounded-lg border border-surface-300 bg-surface-50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-gray-900">
                {contribution.mentorshipsSessions}
              </span>
            </div>
            <p className="text-xs text-gray-600">Mentorias</p>
          </div>

          {/* Badges */}
          <div className="p-3 rounded-lg border border-surface-300 bg-surface-50">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-warning-600" />
              <span className="text-sm font-medium text-gray-900">
                {contribution.badgesEarned}
              </span>
            </div>
            <p className="text-xs text-gray-600">Badges</p>
          </div>

          {/* Streak */}
          <div className="p-3 rounded-lg border border-surface-300 bg-surface-50">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-warning-500" />
              <span className="text-sm font-medium text-gray-900">
                {contribution.streakDays}
              </span>
            </div>
            <p className="text-xs text-gray-600">Dias seguidos</p>
          </div>

          {/* Team Goals */}
          <div className="p-3 rounded-lg border border-surface-300 bg-surface-50">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-gray-900">
                {contribution.badgesHelpedTeamObjectives}
              </span>
            </div>
            <p className="text-xs text-gray-600">Objetivos da equipe</p>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-50 border border-surface-300">
          <div className="flex items-center gap-2">
            <span className={growthColor}>
              {getGrowthIcon(contribution.growthVsPreviousMonth)}
            </span>
            <span className="text-sm text-gray-700">vs mês anterior</span>
          </div>
          <span className={`text-sm font-semibold ${growthColor}`}>
            {contribution.growthVsPreviousMonth > 0 ? "+" : ""}
            {contribution.growthVsPreviousMonth}%
          </span>
        </div>
      </div>
    </section>
  );
}
