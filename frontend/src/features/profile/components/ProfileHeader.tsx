import { useState } from "react";
import {
  FiUser,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiUsers,
  FiEdit2,
} from "react-icons/fi";
import type { UserProfile, ProfileStats } from "../types/profile";
import { ClickableAvatar } from "./Avatar";
import { UnifiedAvatarSelector } from "./UnifiedAvatarSelector";

interface ProfileHeaderProps {
  profile: UserProfile;
  stats: ProfileStats;
  canEdit: boolean;
  onEditProfile?: () => void;
  onUpdateAvatar?: (avatarId: string) => void;
}

export function ProfileHeader({
  profile,
  stats,
  canEdit,
  onUpdateAvatar,
}: ProfileHeaderProps) {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const progressPercentage = stats.levelProgress.percentage;

  const handleAvatarSelect = (avatarId: string) => {
    onUpdateAvatar?.(avatarId);
    setShowAvatarSelector(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl p-6 text-surface-900 shadow-soft relative overflow-hidden border border-brand-200">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-brand-300/30 blur-xl transform translate-x-8 -translate-y-8" />
          <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-brand-300/30 blur-xl transform -translate-x-4 translate-y-4" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start gap-6">
          {/* Avatar Section */}
          <div className="relative group">
            {profile.avatarId ? (
              <ClickableAvatar
                avatarId={profile.avatarId}
                size="2xl"
                onClick={
                  canEdit && profile.isCurrentUser
                    ? () => setShowAvatarSelector(true)
                    : undefined
                }
                isEditable={canEdit && profile.isCurrentUser}
              />
            ) : (
              <div className="relative">
                <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-surface-0/80 backdrop-blur-sm border-2 border-brand-300 overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:shadow-glow">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser className="w-12 h-12 lg:w-14 lg:h-14 text-surface-600" />
                    </div>
                  )}
                </div>

                {/* Edit button for current user */}
                {canEdit && profile.isCurrentUser && (
                  <button
                    onClick={() => setShowAvatarSelector(true)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border-2 border-surface-0 transition-all duration-200 hover:bg-brand-700 hover:scale-110 group"
                  >
                    <FiEdit2 className="w-4 h-4 text-surface-0" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-4">
            {/* Name and Position */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-surface-900">
                {profile.name}
              </h1>
              {profile.position && (
                <p className="text-brand-700 text-lg font-medium">
                  {profile.position}
                </p>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-surface-700 leading-relaxed max-w-2xl font-medium">
                {profile.bio}
              </p>
            )}

            {/* Quick Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Level */}
              <div className="flex items-center gap-2 text-brand-700">
                <FiAward className="w-4 h-4" />
                <span className="font-medium">Nível {stats.currentLevel}</span>
              </div>

              {/* Team */}
              {profile.team && (
                <div className="flex items-center gap-2 text-brand-700">
                  <FiUsers className="w-4 h-4" />
                  <span className="font-medium">{profile.team.name}</span>
                </div>
              )}

              {/* Streak */}
              <div className="flex items-center gap-2 text-brand-700">
                <FiCalendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {profile.streak} dias consecutivos
                </span>
                <FiTrendingUp className="w-4 h-4 text-success-600" />
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="w-full lg:w-auto lg:min-w-[200px] text-right space-y-3">
            <div className="text-sm text-surface-600">
              <span className="font-medium">
                {stats.levelProgress.current.toLocaleString()}
              </span>
              <span className="mx-1">/</span>
              <span>{stats.levelProgress.required.toLocaleString()} XP</span>
            </div>

            <div className="w-full lg:w-48 h-2 bg-surface-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-500 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="text-xs text-surface-500">
              <span className="font-medium">
                {Math.round(progressPercentage)}%
              </span>
              <span className="ml-1">para próximo nível</span>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-end gap-4 pt-2">
              <div className="text-center">
                <div className="text-lg font-bold text-surface-900">
                  {stats.totalXP.toLocaleString()}
                </div>
                <div className="text-xs text-surface-500">XP Total</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-surface-900">
                  {stats.badgesEarned}
                </div>
                <div className="text-xs text-surface-500">Badges</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selector Modal */}
      <UnifiedAvatarSelector
        currentAvatar={profile.avatarId}
        onSelectAvatar={handleAvatarSelect}
        onClose={() => setShowAvatarSelector(false)}
        isOpen={showAvatarSelector}
      />
    </>
  );
}
