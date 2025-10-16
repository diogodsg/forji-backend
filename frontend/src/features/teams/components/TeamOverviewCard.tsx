import type { Team, TeamMetrics } from "../types";

interface TeamOverviewCardProps {
  team: Team;
  metrics?: TeamMetrics;
}

export function TeamOverviewCard({ team, metrics }: TeamOverviewCardProps) {
  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
          <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-surface-300/60">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </span>
          {team.name}
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            team.performanceScore >= 80
              ? "bg-success-50 text-success-700 border border-success-200"
              : team.performanceScore >= 70
              ? "bg-warning-50 text-warning-700 border border-warning-200"
              : "bg-error-50 text-error-700 border border-error-200"
          }`}
        >
          {team.performanceScore}% performance
        </div>
      </header>

      {team.description && (
        <p className="text-sm text-gray-600">{team.description}</p>
      )}

      {/* StatCards Grid - Design System Compliant */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="relative rounded-2xl border border-surface-300/70 bg-white shadow-md px-4 py-3 flex flex-col transition-transform duration-200 ease-out hover:scale-[1.04] hover:shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
              Membros
            </span>
          </div>
          <span className="font-semibold text-lg text-gray-800 mt-1 tabular-nums">
            {team.members.length}
          </span>
        </div>

        <div className="relative rounded-2xl border border-surface-300/70 bg-white shadow-md px-4 py-3 flex flex-col transition-transform duration-200 ease-out hover:scale-[1.04] hover:shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
              XP Coletivo
            </span>
          </div>
          <span className="font-semibold text-lg text-gray-800 mt-1 tabular-nums">
            {team.totalXP.toLocaleString()}
          </span>
        </div>

        <div className="relative rounded-2xl border border-surface-300/70 bg-white shadow-md px-4 py-3 flex flex-col transition-transform duration-200 ease-out hover:scale-[1.04] hover:shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
              Nível Médio
            </span>
          </div>
          <span className="font-semibold text-lg text-gray-800 mt-1 tabular-nums">
            Lv {Math.round(team.averageLevel)}
          </span>
        </div>

        <div className="relative rounded-2xl border border-surface-300/70 bg-white shadow-md px-4 py-3 flex flex-col transition-transform duration-200 ease-out hover:scale-[1.04] hover:shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span className="text-[10px] uppercase tracking-wide font-semibold text-gray-500">
              Dias Streak
            </span>
          </div>
          <span className="font-semibold text-lg text-gray-800 mt-1 tabular-nums">
            {team.streakDays}
          </span>
        </div>
      </div>

      {metrics && (
        <div className="pt-4 border-t border-surface-300">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 tabular-nums">
                #{metrics.ranking.position}
              </div>
              <div className="text-xs text-gray-500">
                de {metrics.ranking.totalTeams} equipes
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 tabular-nums">
                +{metrics.weeklyGrowth.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">XP esta semana</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 tabular-nums">
                {metrics.engagementRate}%
              </div>
              <div className="text-xs text-gray-500">Engagement</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
