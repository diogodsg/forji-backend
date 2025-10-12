import { FiTrendingUp, FiTrendingDown, FiMinus, FiAward } from "react-icons/fi";
import type { LeaderboardEntry } from "../types/gamification";

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: number;
  title?: React.ReactNode;
  showWeeklyXP?: boolean;
  className?: string;
}

export function Leaderboard({
  entries,
  currentUserId,
  title = (
    <div className="flex items-center gap-2">
      <FiAward className="w-5 h-5 text-yellow-600" /> Leaderboard
    </div>
  ),
  showWeeklyXP = false,
  className = "",
}: LeaderboardProps) {
  const getTrendIcon = (trend: LeaderboardEntry["trend"]) => {
    switch (trend) {
      case "up":
        return <FiTrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <FiTrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <FiMinus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 bg-yellow-50";
      case 2:
        return "text-gray-600 bg-gray-50";
      case 3:
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-700 bg-white";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return rank.toString();
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
            <FiAward className="w-4 h-4 text-amber-600" />
          </div>
          {title}
        </h3>
      </div>

      {/* Entries */}
      <div className="divide-y divide-gray-100">
        {entries.map((entry) => {
          const isCurrentUser = entry.userId === currentUserId;

          return (
            <div
              key={entry.userId}
              className={`
                p-4 flex items-center space-x-4
                ${isCurrentUser ? "bg-blue-50" : "hover:bg-gray-50"}
              `}
            >
              {/* Rank */}
              <div
                className={`
                w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm
                ${getRankColor(entry.rank)}
              `}
              >
                {getRankIcon(entry.rank)}
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold text-sm">
                {entry.name.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p
                    className={`font-medium truncate ${
                      isCurrentUser ? "text-blue-700" : "text-gray-900"
                    }`}
                  >
                    {entry.name}
                    {isCurrentUser && (
                      <span className="text-blue-500 ml-1">(Você)</span>
                    )}
                  </p>
                  {getTrendIcon(entry.trend)}
                </div>
                <p className="text-sm text-gray-600">
                  Nível {entry.level} • {entry.totalXP.toLocaleString()} XP
                </p>
              </div>

              {/* Weekly XP (optional) */}
              {showWeeklyXP && (
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    +{entry.weeklyXP}
                  </p>
                  <p className="text-xs text-gray-500">esta semana</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FiAward className="w-8 h-8 text-gray-400" />
          </div>
          <p>Nenhum dado disponível</p>
        </div>
      )}
    </div>
  );
}
