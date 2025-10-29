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
 * Página de carregamento com skeleton
 */
export function LoadingPage({}: LoadingPageProps = {}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Skeleton */}
        <div className="animate-pulse mb-6">
          <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar skeleton */}
                <div className="w-16 h-16 bg-surface-200 rounded-xl"></div>
                <div className="space-y-2">
                  {/* Name skeleton */}
                  <div className="h-6 bg-surface-200 rounded w-48"></div>
                  {/* Subtitle skeleton */}
                  <div className="h-4 bg-surface-200 rounded w-64"></div>
                </div>
              </div>
              {/* Back button skeleton */}
              <div className="w-24 h-10 bg-surface-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {/* Goals Section Skeleton */}
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-6">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-surface-200 rounded w-32"></div>
                <div className="w-32 h-10 bg-surface-200 rounded-lg"></div>
              </div>
              {/* Goal cards */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-surface-200 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="h-5 bg-surface-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-8 bg-surface-200 rounded-lg"></div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 bg-surface-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competencies Section Skeleton */}
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-6">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-surface-200 rounded w-40"></div>
                <div className="w-32 h-10 bg-surface-200 rounded-lg"></div>
              </div>
              {/* Competency cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border border-surface-200 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                        <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    {/* Progress */}
                    <div className="h-2 bg-surface-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline Section Skeleton */}
          <div className="animate-pulse">
            <div className="bg-white rounded-2xl border border-surface-200/60 shadow-sm p-6">
              {/* Section header */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-6 bg-surface-200 rounded w-36"></div>
                <div className="w-32 h-10 bg-surface-200 rounded-lg"></div>
              </div>
              {/* Timeline items */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-surface-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-surface-200 rounded w-2/3"></div>
                      <div className="h-4 bg-surface-200 rounded w-full"></div>
                      <div className="h-3 bg-surface-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
