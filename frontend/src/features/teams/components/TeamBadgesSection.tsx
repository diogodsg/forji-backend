import type { TeamBadge } from "../types";

interface TeamBadgesSectionProps {
  badges: TeamBadge[];
  maxVisible?: number;
}

export function TeamBadgesSection({
  badges,
  maxVisible = 6,
}: TeamBadgesSectionProps) {
  if (badges.length === 0) {
    return (
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5 space-y-4">
        <header className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
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
            Conquistas Colaborativas
          </h3>
        </header>
        <div className="text-center py-8 text-gray-500">
          <svg
            className="w-12 h-12 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <p className="text-sm text-gray-500 mb-1">Nenhuma conquista ainda</p>
          <p className="text-xs text-gray-400">
            Trabalhem juntos para desbloquear badges!
          </p>
        </div>
      </section>
    );
  }

  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "hoje";
    if (diffInDays === 1) return "há 1 dia";
    if (diffInDays < 7) return `há ${diffInDays} dias`;
    if (diffInDays < 14) return "há 1 semana";
    if (diffInDays < 30) return `há ${Math.floor(diffInDays / 7)} semanas`;
    return `há ${Math.floor(diffInDays / 30)} meses`;
  };

  return (
    <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5 space-y-4">
      <header className="flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-800 flex items-center gap-2">
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
          Conquistas Colaborativas
        </h3>
        {badges.length > maxVisible && (
          <span className="text-xs text-gray-500 bg-surface-100 px-2 py-1 rounded-full">
            +{remainingCount} mais
          </span>
        )}
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {visibleBadges.map((badge) => (
          <div
            key={badge.id}
            className="group text-center p-3 bg-gradient-to-br from-brand-50 to-brand-100 rounded-lg border border-brand-200 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
              {badge.icon}
            </div>
            <div className="font-medium text-sm text-gray-900 mb-1">
              {badge.name}
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {badge.description}
            </div>
            <div className="text-xs text-brand-600 font-medium">
              {formatTimeAgo(badge.earnedAt)}
            </div>

            {/* Badge type indicator */}
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                badge.type === "collaborative"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {badge.type === "collaborative" ? (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Equipe
                </>
              ) : (
                <>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Individual
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {badges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-gray-900 tabular-nums">
                {badges.filter((b) => b.type === "collaborative").length}
              </div>
              <div className="text-xs text-gray-500">Badges Colaborativos</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900 tabular-nums">
                {
                  badges.filter(
                    (b) =>
                      new Date().getTime() - b.earnedAt.getTime() <
                      7 * 24 * 60 * 60 * 1000
                  ).length
                }
              </div>
              <div className="text-xs text-gray-500">Esta Semana</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
