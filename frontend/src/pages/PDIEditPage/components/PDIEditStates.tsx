import { Shield, AlertTriangle } from "lucide-react";

interface PermissionDeniedPageProps {
  onNavigateHome: () => void;
  onNavigateProfile?: () => void;
  userId?: string;
}

/**
 * Página de acesso negado para PDI Edit
 */
export function PermissionDeniedPage({
  onNavigateHome,
  onNavigateProfile,
  userId,
}: PermissionDeniedPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Acesso Não Autorizado
          </h2>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para editar o PDI deste usuário. Apenas
            gestores podem editar o PDI de seus subordinados diretos.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Voltar ao Dashboard
            </button>
            {userId && onNavigateProfile && (
              <button
                onClick={onNavigateProfile}
                className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
              >
                Ver Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface UserNotFoundPageProps {
  onNavigateHome: () => void;
}

/**
 * Página de usuário não encontrado
 */
export function UserNotFoundPage({ onNavigateHome }: UserNotFoundPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg border border-amber-200 p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Usuário Não Encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            Não foi possível carregar os dados do usuário solicitado.
          </p>
          <button
            onClick={onNavigateHome}
            className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
}

/**
 * Página de carregamento
 */
export function LoadingPage({
  message = "Verificando permissões e carregando dados...",
}: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-8 h-8 bg-brand-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}
