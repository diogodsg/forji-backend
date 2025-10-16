import { useAuth } from "@/features/auth";
import { usePlayerProfile } from "@/features/gamification";
import {
  WelcomeHeader,
  CollaboratorDashboard,
  ManagerDashboard,
  AdminDashboard,
} from "@/features/homepage";
import { DebugRoleSwitcher, useDebugRole } from "@/shared";

/**
 * Homepage adaptativa que se comporta diferentemente para gestores, colaboradores e admins
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
 *
 * Para Admins (CEOs/Donos):
 * - Visão executiva de toda a empresa
 * - Saúde de todos os times
 * - Alertas críticos e insights estratégicos
 * - Business intelligence e analytics
 */
export default function HomePage() {
  const { user } = useAuth();
  const { profile, loading, error } = usePlayerProfile();

  // Debug: Hook para alternar entre papéis durante desenvolvimento
  const { debugRole, setDebugRole, isManager, isAdmin } =
    useDebugRole("collaborator");

  // Para fins de debug, sobrescrever completamente as permissões do usuário
  const effectiveUser = user
    ? {
        ...user,
        isManager: isManager,
        isAdmin: isAdmin,
      }
    : null;

  if (!effectiveUser) {
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
        {/* Debug Role Switcher - Apenas em desenvolvimento */}
        <div className="flex justify-end">
          <DebugRoleSwitcher
            currentRole={debugRole}
            onRoleChange={setDebugRole}
            size="sm"
            className="bg-white rounded-lg border border-surface-300 p-3 shadow-sm"
          />
        </div>

        {/* Header de boas-vindas personalizado */}
        <WelcomeHeader user={effectiveUser} />

        {/* Layout baseado no perfil do usuário */}
        {effectiveUser.isAdmin ? (
          /* Layout Admin - Visão executiva completa da empresa */
          <AdminDashboard />
        ) : effectiveUser.isManager ? (
          /* Layout Manager - Dashboard completo com visão de equipe */
          <ManagerDashboard />
        ) : (
          /* Layout Colaborador - Foco em progresso pessoal e quick actions */
          <CollaboratorDashboard profile={profile} />
        )}
      </div>
    </div>
  );
}
