import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { usePlayerProfile } from "@/features/gamification";
import { usersApi } from "@/lib/api/endpoints/users";
import { managementApi } from "@/lib/api/endpoints/management";
import { getGamificationProfile } from "@/lib/api/endpoints/gamification";
import { getDiceBearAvatarById } from "../data/dicebearAvatars";
import type {
  ProfileData,
  UserProfile,
  PrivacySettings,
} from "../types/profile";

/**
 * Cache simples para verificações de management
 * Evita chamadas repetidas à API para o mesmo par manager-subordinate
 */
const managementCache = new Map<
  string,
  { isManaged: boolean; timestamp: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

function getCacheKey(managerId: string, subordinateId: string): string {
  return `${managerId}->${subordinateId}`;
}

function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

/**
 * Valida se o avatarId é um avatar DiceBear válido
 * @param avatarId - ID do avatar a ser validado
 * @returns avatarId válido ou fallback para "avatar-1"
 */
function validateAvatarId(avatarId: string | undefined): string {
  if (!avatarId) return "avatar-1";

  const avatar = getDiceBearAvatarById(avatarId);
  return avatar ? avatarId : "avatar-1";
}

export function useProfile(userId?: string) {
  const { user, refreshUser } = useAuth();
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

        console.log("Profile Integration:", {
          userId,
          targetUserId,
          currentUserId: user.id.toString(),
          isCurrentUser,
        });

        // Fetch user data from backend
        let userData;
        try {
          // SEMPRE buscar do backend para garantir dados atualizados
          userData = await usersApi.findOne(targetUserId);
          console.log("🔍 Profile Debug - userData do backend:", userData);
          console.log("🔍 avatarId from backend:", userData.avatarId);
        } catch (userError) {
          console.warn("Failed to fetch user data:", userError);
          // Fallback to current user data if available
          userData = user;
          console.log("⚠️ Usando fallback - userData do context:", userData);
        }

        // Fetch gamification data
        let gamificationData;
        try {
          if (isCurrentUser) {
            // Para o usuário atual, usar a API de gamificação
            gamificationData = await getGamificationProfile();
            console.log(
              "🎯 Gamification data (current user):",
              gamificationData
            );
          } else {
            // Para outros usuários, tentar calcular dados baseados em metas/competências
            console.log(
              "🔄 Calculando gamificação para outro usuário:",
              targetUserId
            );
            try {
              // Buscar dados de PDI para calcular XP
              const [goals] = await Promise.all([
                managementApi.getSubordinateGoals(targetUserId).catch(() => []),
              ]);

              // Calcular XP baseado nas metas concluídas
              const completedGoals = goals.filter(
                (goal: any) => goal.progress === 100
              );
              const totalXP = completedGoals.reduce(
                (sum: number, goal: any) => sum + (goal.xpReward || 100),
                0
              );
              const currentLevel = Math.floor(totalXP / 500) + 1; // 500 XP por nível
              const currentXP = totalXP % 500;
              const nextLevelXP = 500;

              gamificationData = {
                totalXP,
                currentXP,
                nextLevelXP,
                level: currentLevel,
                badges: [], // TODO: implementar badges baseadas em achievements
              };

              console.log("🎯 Gamification calculada (other user):", {
                goals: goals.length,
                completedGoals: completedGoals.length,
                calculatedData: gamificationData,
              });
            } catch (pdiError) {
              console.warn("Erro ao buscar dados de PDI:", pdiError);
              // Fallback para dados padrão
              gamificationData = {
                totalXP: 0,
                currentXP: 0,
                nextLevelXP: 100,
                level: 1,
                badges: [],
              };
            }
          }
        } catch (gamError) {
          console.warn("Failed to fetch gamification data:", gamError);
          // Fallback para dados padrão
          gamificationData = {
            totalXP: 0,
            currentXP: 0,
            nextLevelXP: 100,
            level: 1,
            badges: [],
          };
        }

        // Build profile from real data
        const profileData: UserProfile = {
          ...userData,
          // Garantir que temos um avatarId DiceBear válido
          avatarId: validateAvatarId(userData.avatarId),
          // Converter tipos necessários
          id: parseInt(userData.id) || 0,
          // Adicionar propriedades necessárias para UserProfile
          isCurrentUser,
          streak: 0, // TODO: implement streak tracking
          joinedAt: userData.createdAt
            ? new Date(userData.createdAt)
            : new Date(),
        };
        console.log("🔍 Profile Debug - final profileData:", profileData);
        console.log("🔍 Final avatarId being used:", profileData.avatarId);

        // Privacy settings - TODO: implement backend storage
        const privacySettings: PrivacySettings = {
          showBadges: "company",
          showStats: "team",
          showTimeline: "company",
          showPDIProgress: "team",
          showTeamContributions: true,
          showStreak: true,
        };

        // Build complete profile data usando dados reais
        const profileStats = {
          totalXP: gamificationData?.totalXP || 0,
          currentLevel: gamificationData?.level || 1,
          levelProgress: {
            current: gamificationData?.currentXP || 0,
            required: gamificationData?.nextLevelXP || 100,
            percentage:
              gamificationData?.nextLevelXP && gamificationData?.currentXP
                ? Math.round(
                    (gamificationData.currentXP /
                      gamificationData.nextLevelXP) *
                      100
                  )
                : 0,
          },
          completedPDIs: 0, // TODO: implement PDI backend
          activePDIs: 0, // TODO: implement PDI backend
          completionRate: 0, // TODO: implement PDI backend
          teamContributions: 0, // TODO: implement team contributions
          badgesEarned: Array.isArray(gamificationData?.badges)
            ? gamificationData.badges.length
            : 0,
          achievements: {
            totalBadges: Array.isArray(gamificationData?.badges)
              ? gamificationData.badges.length
              : 0,
            rareBadges: 0, // TODO: calculate rare badges
            recentBadges: [], // TODO: convert badges properly
          },
        };

        console.log("🎯 Profile Stats calculadas:", {
          totalXP: profileStats.totalXP,
          currentLevel: profileStats.currentLevel,
          levelProgress: profileStats.levelProgress,
          badgesEarned: profileStats.badgesEarned,
          gamificationDataOriginal: gamificationData,
        });

        // Verificar permissões - se é o próprio usuário, admin, ou gestor do subordinado
        let canViewPrivateInfo = isCurrentUser || !!user.isAdmin;

        console.log("🔍 Verificação de permissões inicial:", {
          isCurrentUser,
          isAdmin: !!user.isAdmin,
          isManager: !!user.isManager,
          canViewPrivateInfo,
          targetUserId,
          currentUserId: user.id.toString(),
        });

        // Se não é o próprio usuário nem admin, SEMPRE verificar se é gestor
        // Não confiar apenas no campo isManager pois ele pode estar incorreto
        if (!canViewPrivateInfo) {
          const cacheKey = getCacheKey(user.id.toString(), targetUserId);
          const cached = managementCache.get(cacheKey);

          // Verificar cache primeiro
          if (cached && isCacheValid(cached.timestamp)) {
            console.log("🔍 Usando cache para management check:", {
              cacheKey,
              isManaged: cached.isManaged,
            });
            canViewPrivateInfo = cached.isManaged;
          } else {
            try {
              console.log("🔍 Verificando se é gestor de:", targetUserId);
              const managementResult = await managementApi.checkIfManaged(
                targetUserId
              );

              console.log("🔍 Management API Response:", managementResult);

              // Armazenar no cache
              managementCache.set(cacheKey, {
                isManaged: managementResult.isManaged,
                timestamp: Date.now(),
              });

              canViewPrivateInfo = managementResult.isManaged;
              console.log("🔍 Management check resultado FINAL:", {
                targetUserId,
                managerId: user.id,
                isManaged: managementResult.isManaged,
                canViewPrivateInfo,
                cached: false,
              });
            } catch (error) {
              console.warn(
                "❌ Failed to check management relationship:",
                error
              );
              console.error("❌ Error details:", error);

              // Em caso de erro, armazenar false no cache por um tempo menor
              managementCache.set(cacheKey, {
                isManaged: false,
                timestamp: Date.now(),
              });

              canViewPrivateInfo = false;
            }
          }
        } else {
          console.log("🔍 Pular verificação de management:", {
            reason: canViewPrivateInfo
              ? "Já tem permissão (próprio usuário ou admin)"
              : "Motivo desconhecido",
            canViewPrivateInfo,
            isCurrentUser,
            isAdmin: !!user.isAdmin,
          });
        }

        const completeProfileData: ProfileData = {
          profile: profileData,
          stats: profileStats,
          timeline: [], // Will be populated by useProfileTimeline
          privacySettings: isCurrentUser ? privacySettings : undefined,
          canViewPrivateInfo,
        };

        console.log("🎯 PROFILE DATA FINAL:", {
          targetUserId,
          isCurrentUser,
          isAdmin: !!user.isAdmin,
          canViewPrivateInfo,
          profileId: profileData.id,
          userName: profileData.name,
        });

        setProfileData(completeProfileData);
      } catch (err) {
        console.error("Profile fetch error:", err);
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
    if (!profileData?.profile.isCurrentUser || !user) return;

    // Validar se o avatarId é um avatar DiceBear válido
    const validAvatarId = validateAvatarId(avatarId);
    console.log("🔄 updateAvatar - Atualizando para:", validAvatarId);

    try {
      // Atualiza estado otimisticamente
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                avatarId: validAvatarId,
              },
            }
          : null
      );

      console.log("✅ updateAvatar - Estado local atualizado");

      // Faz chamada real para o backend
      const updatedUser = await usersApi.update(user.id.toString(), {
        avatarId: validAvatarId,
      });

      console.log("✅ updateAvatar - Backend respondeu:", updatedUser);
      console.log(
        "✅ updateAvatar - avatarId do backend:",
        updatedUser.avatarId
      );

      // Atualiza o contexto de autenticação com os novos dados
      if (refreshUser) {
        await refreshUser();
        console.log("✅ updateAvatar - Contexto de autenticação atualizado");
      }

      // Atualiza com dados do backend para garantir consistência
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                avatarId: updatedUser.avatarId || validAvatarId,
              },
            }
          : null
      );

      console.log(
        "✅ Avatar atualizado com sucesso no backend:",
        validAvatarId
      );
    } catch (err) {
      console.error("❌ Erro ao atualizar avatar no backend:", err);
      setError("Erro ao atualizar avatar");

      // Reverte estado em caso de erro
      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              profile: {
                ...prev.profile,
                avatarId: "avatar-1", // Volta para avatar padrão válido
              },
            }
          : null
      );
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
