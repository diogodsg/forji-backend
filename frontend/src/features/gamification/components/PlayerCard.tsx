import { FiUser } from "react-icons/fi";
import type { PlayerProfile } from "../types/gamification";

interface PlayerCardProps {
  profile: PlayerProfile;
  className?: string;
}

export function PlayerCard({ profile, className = "" }: PlayerCardProps) {
  const progressPercentage = (profile.currentXP / profile.nextLevelXP) * 100;

  const getLevelTitle = (level: number) => {
    if (level >= 20) return "Master Professional";
    if (level >= 15) return "Senior Expert";
    if (level >= 10) return "Advanced Practitioner";
    if (level >= 5) return "Growing Professional";
    return "Rising Talent";
  };

  return (
    <div
      className={`bg-white rounded-xl border border-surface-200 shadow-sm ${className}`}
    >
      <div className="p-6">
        {/* Header com avatar e info básica */}
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar com nível */}
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <FiUser className="w-7 h-7" />
            </div>
            {/* Badge do nível */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center shadow-sm border-2 border-white">
              <span className="text-white font-bold text-xs">
                {profile.level}
              </span>
            </div>
          </div>

          {/* Info do jogador */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-surface-900">
                Player #{profile.userId.toString().padStart(3, "0")}
              </h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                Team Member
              </span>
            </div>
            <p className="text-sm text-surface-600 mb-2">
              • {getLevelTitle(profile.level)}
            </p>
            <div className="flex items-center gap-1 text-sm text-surface-500">
              <span>↗ Nível {profile.level}</span>
              <span className="mx-2">•</span>
              <span>🏆 {profile.badges.length} conquistas</span>
            </div>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900">
              {profile.totalXP}
            </div>
            <div className="text-xs text-surface-500 uppercase tracking-wide">
              XP Total
            </div>
          </div>
          <div className="text-center border-l border-r border-surface-200 px-4">
            <div className="text-2xl font-bold text-surface-900">
              {profile.badges.length}
            </div>
            <div className="text-xs text-surface-500 uppercase tracking-wide">
              Milestones
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-surface-900">
              {profile.rank || 0}
            </div>
            <div className="text-xs text-surface-500 uppercase tracking-wide">
              Key Results
            </div>
          </div>
        </div>

        {/* Barra de progresso para próximo nível */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-surface-600">Progresso do nível</span>
            <span className="text-surface-500">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-surface-500 text-center">
            {profile.nextLevelXP - profile.currentXP} XP para o próximo nível
          </div>
        </div>
      </div>
    </div>
  );
}
