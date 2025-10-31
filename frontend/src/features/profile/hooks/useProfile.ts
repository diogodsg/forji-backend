import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth";
import { usePlayerProfile } from "@/features/gamification";
import { usersApi } from "@/lib/api/endpoints/users";
import { managementApi } from "@/lib/api/endpoints/management";
import {
  getGamificationProfile,
  getGamificationProfileByUserId,
} from "@/lib/api/endpoints/gamification";
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
 * Limpa o cache de management (útil para debug ou após mudanças de hierarquia)
 */
export function clearManagementCache() {
  const size = managementCache.size;
  managementCache.clear();
  console.log("🗑️ Cache de management limpo:", {
    entriesRemoved: size,
    timestamp: new Date().toISOString(),
  });
  return { cleared: size };
}

/**
 * Mostra o conteúdo do cache (debug)
 */
export function debugManagementCache() {
  const entries = Array.from(managementCache.entries()).map(([key, value]) => ({
    key,
    isManaged: value.isManaged,
    age: Math.round((Date.now() - value.timestamp) / 1000) + "s",
    valid: isCacheValid(value.timestamp),
  }));
  console.table(entries);
  return entries;
}

// Expor funções de debug no window para facilitar debug via console
if (typeof window !== "undefined") {
  (window as any).__clearManagementCache = clearManagementCache;
  (window as any).__debugManagementCache = debugManagementCache;
  console.log(
    "🔧 Debug helpers disponíveis: __clearManagementCache(), __debugManagementCache()"
  );
}

/**
 * Valida se o avatarId é um avatar DiceBear válido
 * @param avatarId - ID do avatar a ser validado
 * @returns avatarId válido ou fallback para "avatar-1"
 */
function validateAvatarId(avatarId: string | undefined): string {
  if (!avatarId) return "avatar-1";

  // Aceita avatares customizados do Micah (formato: micah-{seed}-{bg}-{params})
  if (avatarId.startsWith("micah-")) {
    return avatarId;
  }

  // Valida avatares pré-definidos
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
            // Para outros usuários, usar o novo endpoint com userId
            console.log(
              "🔄 Buscando gamificação de outro usuário:",
              targetUserId
            );
            gamificationData = await getGamificationProfileByUserId(
              targetUserId
            );
            console.log("🎯 Gamification data (other user):", gamificationData);
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

        // Verificar permissões - apenas gestor direto pode editar PDI
        // Admin NÃO tem permissão automática, precisa ser manager do subordinado
        let canViewPrivateInfo = false;

        console.log("🔍 Verificação de permissões inicial:", {
          isCurrentUser,
          isAdmin: !!user.isAdmin,
          isManager: !!user.isManager,
          note: "Admin precisa ser manager para ter permissão",
          targetUserId,
          currentUserId: user.id.toString(),
        });

        // Se não é o próprio usuário, verificar se é gestor
        if (!isCurrentUser) {
          const cacheKey = getCacheKey(user.id.toString(), targetUserId);
          const cached = managementCache.get(cacheKey);

          // Verificar cache primeiro
          if (cached && isCacheValid(cached.timestamp)) {
            console.log("✅ [Management Cache] Usando cache válido:", {
              cacheKey,
              isManaged: cached.isManaged,
              age: Math.round((Date.now() - cached.timestamp) / 1000) + "s",
            });
            canViewPrivateInfo = cached.isManaged;
          } else {
            try {
              console.log(
                "🔍 [Management API] Verificando relação de gestão:",
                {
                  managerId: user.id.toString(),
                  subordinateId: targetUserId,
                  workspaceId: user.workspaceId,
                }
              );

              const managementResult = await managementApi.checkIfManaged(
                targetUserId
              );

              console.log("✅ [Management API] Resposta recebida:", {
                isManaged: managementResult.isManaged,
                managerId: user.id.toString(),
                subordinateId: targetUserId,
              });

              // Armazenar no cache
              managementCache.set(cacheKey, {
                isManaged: managementResult.isManaged,
                timestamp: Date.now(),
              });

              canViewPrivateInfo = managementResult.isManaged;

              console.log("🎯 [Management Final] Resultado da verificação:", {
                targetUserId,
                managerId: user.id,
                isManaged: managementResult.isManaged,
                canViewPrivateInfo,
                cached: false,
                showEditButton: managementResult.isManaged,
                isAdmin: !!user.isAdmin,
                note: "Mesmo admin precisa ser manager",
              });
            } catch (error) {
              console.error(
                "❌ [Management Error] Falha ao verificar relação:",
                {
                  error,
                  managerId: user.id.toString(),
                  subordinateId: targetUserId,
                }
              );

              // Em caso de erro, armazenar false no cache por um tempo menor
              managementCache.set(cacheKey, {
                isManaged: false,
                timestamp: Date.now(),
              });

              canViewPrivateInfo = false;
            }
          }
        } else {
          console.log("⏭️ [Management Skip] É o próprio usuário:", {
            isCurrentUser,
            canViewPrivateInfo: false,
            note: "Usuário não vê botão de editar PDI no próprio perfil",
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
    canEdit: profileData?.profile.isCurrentUser || false, // Usuário pode editar o próprio perfil
  };
}
