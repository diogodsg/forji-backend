import { useParams } from "react-router-dom";
import { ProfileHeader } from "./ProfileHeader";
import { GamificationTab } from "./GamificationTab";
import { useProfile } from "../hooks/useProfile";
import { usePlayerProfile } from "@/features/gamification";

export function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  // Fetch profile data
  const {
    profileData,
    loading: profileLoading,
    error: profileError,
    isCurrentUser,
    canEdit,
    updateAvatar,
  } = useProfile(userId);

  // Fetch gamification data
  const { profile: gamificationProfile, loading: gamificationLoading } =
    usePlayerProfile();

  const handleEditProfile = () => {
    // TODO: Open edit profile modal or navigate to edit page
    console.log("Edit profile clicked");
  };

  // Determinar se pode editar PDI (gestores podem editar subordinados)
  const canEditPDI = canEdit && !isCurrentUser;

  console.log("ProfilePage Debug:", {
    userId,
    profileData,
    profileLoading,
    profileError,
    isCurrentUser,
    canEdit,
    canViewPrivateInfo: profileData?.canViewPrivateInfo,
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-surface-200 rounded-xl h-64 mb-8 animate-pulse" />

          {/* Tabs Skeleton */}
          <div className="bg-white rounded-t-xl h-16 mb-0 animate-pulse" />

          {/* Content Skeleton */}
          <div className="bg-white rounded-b-xl p-6 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-surface-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profileData) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-xl font-semibold text-surface-900 mb-2 tracking-tight">
            Perfil não encontrado
          </h2>
          <p className="text-surface-600 mb-4 font-medium">
            {profileError || "Não foi possível carregar os dados do perfil."}
          </p>

          {/* Debug Info */}
          <div className="bg-surface-100 rounded-lg p-3 text-left text-xs text-surface-700 mt-4">
            <strong>Debug Info:</strong>
            <br />
            UserId from URL: {userId || "undefined"}
            <br />
            Profile Data: {profileData ? "✅ Loaded" : "❌ Not loaded"}
            <br />
            Loading: {profileLoading ? "Yes" : "No"}
            <br />
            Error: {profileError || "None"}
          </div>
        </div>
      </div>
    );
  }

  const { profile, stats } = profileData;
  const isPublic = !isCurrentUser && !canEdit;
  
  // Determinar se pode editar PDI (gestores podem editar subordinados)
  const canEditPDI = canEdit && !isCurrentUser;

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <ProfileHeader
            profile={profile}
            stats={stats}
            canEdit={canEdit}
            canEditPDI={canEditPDI}
            onEditProfile={handleEditProfile}
            onUpdateAvatar={updateAvatar}
          />
        </div>

        {/* Gamification Content */}
        <div className="bg-surface-0 rounded-xl shadow-soft border border-surface-200 p-6">
          <GamificationTab
            stats={stats}
            badges={gamificationProfile?.badges || []}
            isPublic={isPublic}
            loading={gamificationLoading}
          />
        </div>
      </div>
    </div>
  );
}
}

/**
 * Componente da aba PDI com botão de editar para gestores
 */
function PDITabContent({
  userId,
  isCurrentUser,
  canViewPrivateInfo,
  userProfile,
  navigate,
}: {
  userId?: string;
  isCurrentUser: boolean;
  canViewPrivateInfo: boolean;
  userProfile: any;
  navigate: (path: string) => void;
}) {
  console.log("PDITabContent Debug:", {
    userId,
    isCurrentUser,
    canViewPrivateInfo,
    userProfile: userProfile?.name,
    shouldShowEditButton: !isCurrentUser && canViewPrivateInfo,
  });
  // Se é o próprio usuário, mostra o PDI completo
  if (isCurrentUser) {
    return <CurrentCyclePageOptimized />;
  }

  // Se não tem permissão para ver informações privadas
  if (!canViewPrivateInfo) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v2m0-2h2m-2 0h-2m3-12V3m0 0V1m0 2h2M9 3V1m0 2H7"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          PDI Privado
        </h3>
        <p className="text-gray-600 text-sm">
          Você não tem permissão para visualizar o PDI deste usuário.
        </p>
      </div>
    );
  }

  // Para gestores visualizando subordinados
  return (
    <div className="space-y-6">
      {/* Header com botão de editar */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                PDI - {userProfile?.name}
              </h3>
              <p className="text-sm text-blue-700">
                Plano de Desenvolvimento Individual
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate(`/users/${userId}/pdi/edit`)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all font-medium shadow-lg"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            ✏️ Editar PDI
          </button>
        </div>
      </div>

      {/* Conteúdo do PDI em modo visualização */}
      <CurrentCyclePageOptimized />
    </div>
  );
}
