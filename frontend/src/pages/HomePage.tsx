import { useAuth } from "@/features/auth";
import { PlayerCard, BadgeComponent, usePlayerProfile } from "@/features/gamification";
import { 
  WelcomeHeader, 
  PersonalPDISection, 
  ManagerTeamOverview, 
  QuickActions 
} from "@/features/homepage";

/**
 * Homepage adaptativa que se comporta diferentemente para gestores e colaboradores
 * 
 * Para Colaboradores:
 * - Dashboard gamificado focado no desenvolvimento pessoal
 * - Card de níveis, badges e progresso individual
 * - Resumo do PDI pessoal
 * 
 * Para Gestores:
 * - Todas as funcionalidades de colaborador
 * - Seção adicional com visão da equipe
 * - Métricas e top performers da equipe
 * - Acesso rápido ao dashboard de manager
 */
export default function HomePage() {
  const { user } = useAuth();
  const { profile, loading, error } = usePlayerProfile();

  if (!user) {
    return null; // Não deveria acontecer pois já passou pela autenticação
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erro ao carregar perfil
          </h1>
          <p className="text-gray-600">
            {error || "Não foi possível carregar seu perfil de gamificação."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header de boas-vindas personalizado */}
        <WelcomeHeader user={user} />

        {/* Layout principal */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Coluna principal - Dashboard gamificado */}
          <div className="xl:col-span-2 space-y-8">
            {/* Dashboard de gamificação simplificado */}
            <div className="space-y-6">
              <PlayerCard profile={profile} />
              {profile.badges.length > 0 && (
                <div className="p-6 bg-card rounded-xl border border-border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Conquistas</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {profile.badges.slice(0, 6).map((badge) => (
                      <BadgeComponent key={badge.id} badge={badge} size="sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Seção do PDI pessoal */}
            <PersonalPDISection />

            {/* Seção específica para gestores */}
            {user.isManager && (
              <ManagerTeamOverview />
            )}
          </div>

          {/* Sidebar - Ações rápidas */}
          <div className="space-y-6">
            <QuickActions user={user} />

            {/* Card de resumo do perfil */}
            <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="font-semibold text-surface-900 mb-1">
                  {user.name}
                </div>
                {user.position && (
                  <div className="text-sm text-surface-600 mb-3">
                    {user.position}
                  </div>
                )}
                <div className="flex items-center justify-center gap-2">
                  {user.isAdmin && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Admin
                    </span>
                  )}
                  {user.isManager && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Gestor
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Colaborador
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
