import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { usePlayerProfile } from "@/features/gamification";
import type {
  ProfileData,
  UserProfile,
  PrivacySettings,
} from "../types/profile";

export function useProfile(userId?: string) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use gamification hook for current user
  const { profile: gamificationProfile, loading: gamificationLoading } =
    usePlayerProfile();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const targetUserId = userId || user.id.toString();
        const isCurrentUser = targetUserId === user.id.toString();

        console.log("Profile Debug:", {
          userId,
          targetUserId,
          currentUserId: user.id.toString(),
          isCurrentUser,
        });

        // Mock data - replace with actual API calls later
        const mockProfile: UserProfile = {
          id: parseInt(targetUserId),
          name: isCurrentUser ? user.name : "João Silva",
          email: isCurrentUser ? user.email : "joao.silva@empresa.com",
          position: isCurrentUser ? user.position : "Desenvolvedor Senior",
          bio: isCurrentUser
            ? user.bio
            : "Desenvolvedor apaixonado por tecnologia e inovação.",
          githubId: isCurrentUser ? user.githubId : "joaosilva",
          avatar: undefined, // TODO: implement avatar system
          avatarId: isCurrentUser ? "developer" : "designer", // ID do avatar selecionado
          isCurrentUser,
          isTeamMember: !isCurrentUser,
          team: {
            id: 1,
            name: "Equipe Frontend",
          },
          streak: isCurrentUser ? (gamificationProfile?.level || 0) * 2 : 15,
          joinedAt: new Date("2024-01-15"),
        };

        const mockPrivacySettings: PrivacySettings = {
          showBadges: "company",
          showStats: "team",
          showTimeline: "company",
          showPDIProgress: "team",
          showTeamContributions: true,
          showStreak: true,
        };

        const mockData: ProfileData = {
          profile: mockProfile,
          stats: {
            totalXP: gamificationProfile?.totalXP || 2500,
            currentLevel: gamificationProfile?.level || 8,
            levelProgress: {
              current: gamificationProfile?.currentXP || 650,
              required: gamificationProfile?.nextLevelXP || 1000,
              percentage:
                ((gamificationProfile?.currentXP || 650) /
                  (gamificationProfile?.nextLevelXP || 1000)) *
                100,
            },
            completedPDIs: 3,
            activePDIs: 1,
            completionRate: 85,
            teamContributions: 12,
            badgesEarned: gamificationProfile?.badges?.length || 8,
            achievements: {
              totalBadges: gamificationProfile?.badges?.length || 8,
              rareBadges: 2,
              recentBadges: gamificationProfile?.badges?.slice(0, 3) || [],
            },
          },
          timeline: [], // Will be populated by useProfileTimeline
          privacySettings: isCurrentUser ? mockPrivacySettings : undefined,
          canViewPrivateInfo:
            isCurrentUser || !!user.isManager || !!user.isAdmin,
        };

        setProfileData(mockData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar perfil"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId, user, gamificationProfile]);

  const updatePrivacySettings = async (settings: Partial<PrivacySettings>) => {
    if (!profileData?.privacySettings) return;

    try {
      const updated = { ...profileData.privacySettings, ...settings };
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              privacySettings: updated,
            }
          : null
      );

      // TODO: Make API call to update privacy settings
      console.log("Updating privacy settings:", settings);
    } catch (err) {
      setError("Erro ao atualizar configurações de privacidade");
    }
  };

  const updateAvatar = async (avatarId: string) => {
    if (!profileData?.profile.isCurrentUser) return;

    try {
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                avatarId,
              },
            }
          : null
      );

      // TODO: Make API call to update avatar
      console.log("Updating avatar:", avatarId);
    } catch (err) {
      setError("Erro ao atualizar avatar");
    }
  };

  return {
    profileData,
    loading: loading || gamificationLoading,
    error,
    updatePrivacySettings,
    updateAvatar,
    isCurrentUser: profileData?.profile.isCurrentUser || false,
    canEdit: profileData?.canViewPrivateInfo || false,
  };
}
