import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiGithub,
  FiArrowLeft,
  FiMessageCircle,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";
import { api } from "@/lib/apiClient";
import { GamificationFeedbackPanel } from "@/features/gamification/components/GamificationFeedbackPanel";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  position?: string;
  bio?: string;
  githubId?: string;
  createdAt: string;
  updatedAt: string;
}

interface GamificationProfile {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    rarity: string;
    unlockedAt: string;
  }>;
  recentActivities: Array<{
    id: string;
    action: string;
    points: number;
    createdAt: string;
  }>;
}

export function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [gamificationProfile, setGamificationProfile] =
    useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate("/users/search");
      return;
    }

    loadUserProfile();
    loadGamificationProfile();
  }, [userId, navigate]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      // Buscar perfil básico do usuário
      const userProfile = await api<UserProfile>(`/auth/users/${userId}`, {
        auth: true,
      });
      setUser(userProfile);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      setError("Usuário não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const loadGamificationProfile = async () => {
    try {
      // Buscar dados de gamificação
      const gamProfile = await api<GamificationProfile>(
        `/gamification/profile/${userId}`,
        {
          auth: true,
        }
      );
      setGamificationProfile(gamProfile);
    } catch (error) {
      console.error("Erro ao carregar perfil de gamificação:", error);
      // Não é erro crítico, apenas não mostra dados de gamificação
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressPercentage = () => {
    if (!gamificationProfile) return 0;
    const { currentXP, nextLevelXP } = gamificationProfile;
    if (nextLevelXP === 0) return 100;
    return Math.min(100, (currentXP / nextLevelXP) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || "Usuário não encontrado"}
          </h2>
          <button
            onClick={() => navigate("/users/search")}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            ← Voltar à busca
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Perfil do Usuário
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Informações do Usuário */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal do Usuário */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-32"></div>
              <div className="px-6 pb-6">
                <div className="flex items-start -mt-16 mb-4">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {getInitials(user.name)}
                    </div>
                  </div>
                  <div className="ml-6 flex-1 pt-4">
                    <button
                      onClick={() => setShowFeedbackPanel(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <FiMessageCircle className="w-4 h-4 mr-2" />
                      Dar Feedback
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {user.name}
                    </h2>
                    {user.position && (
                      <p className="text-lg text-gray-600">{user.position}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FiMail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                    {user.githubId && (
                      <div className="flex items-center">
                        <FiGithub className="w-4 h-4 mr-2" />
                        {user.githubId}
                      </div>
                    )}
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      Membro desde {formatDate(user.createdAt)}
                    </div>
                  </div>

                  {user.bio && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Sobre</h3>
                      <p className="text-gray-700">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Atividades Recentes */}
            {gamificationProfile?.recentActivities && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Atividades Recentes
                </h3>
                <div className="space-y-3">
                  {gamificationProfile.recentActivities
                    .slice(0, 5)
                    .map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <FiTrendingUp className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          +{activity.points} XP
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Gamificação */}
          <div className="space-y-6">
            {gamificationProfile && (
              <>
                {/* Card de Level e XP */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Progresso de Nível
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-indigo-600 mb-1">
                      Nível {gamificationProfile.level}
                    </div>
                    <div className="text-sm text-gray-600">
                      {gamificationProfile.currentXP} /{" "}
                      {gamificationProfile.nextLevelXP} XP
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    Total: {gamificationProfile.totalXP.toLocaleString()} XP
                  </div>
                </div>

                {/* Badges */}
                {gamificationProfile.badges.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Conquistas ({gamificationProfile.badges.length})
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {gamificationProfile.badges.slice(0, 6).map((badge) => (
                        <div
                          key={badge.id}
                          className="bg-gray-50 rounded-lg p-3 text-center"
                          title={badge.description}
                        >
                          <div className="text-2xl mb-1">{badge.icon}</div>
                          <div className="text-xs font-medium text-gray-900">
                            {badge.name}
                          </div>
                          <div className="text-xs text-gray-500 capitalize">
                            {badge.rarity}
                          </div>
                        </div>
                      ))}
                    </div>
                    {gamificationProfile.badges.length > 6 && (
                      <div className="mt-3 text-center">
                        <span className="text-sm text-gray-500">
                          +{gamificationProfile.badges.length - 6} mais
                          conquistas
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Feedback */}
      {showFeedbackPanel && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <GamificationFeedbackPanel
              targetUserId={String(user.id)}
              targetUserName={user.name}
              onClose={() => setShowFeedbackPanel(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
