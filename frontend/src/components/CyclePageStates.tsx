import { SkeletonCyclePage } from "./Skeleton";

interface CyclePageStatesProps {
  loading: {
    cycle: boolean;
  };
  error: {
    cycle: string | null;
  };
  refresh: () => Promise<void>;
  userData: any;
  cycleData: any;
}

export function CyclePageStates({
  loading,
  error,
  refresh,
  userData,
  cycleData,
}: CyclePageStatesProps) {
  // Loading State - Show skeleton
  if (loading.cycle) {
    return <SkeletonCyclePage />;
  }

  // Error State
  if (error.cycle && !loading.cycle) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="bg-error-50 border border-error-200 rounded-2xl p-6 text-center shadow-sm">
          <p className="text-error-700 font-semibold mb-2">
            Erro ao carregar ciclo
          </p>
          <p className="text-error-600 text-sm mb-4">{error.cycle}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-error-500 text-white rounded-lg hover:bg-error-600 transition-colors focus:outline-none focus:ring-2 focus:ring-error-400"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Empty State - No cycle or user data
  if (!loading.cycle && !error.cycle && (!userData || !cycleData)) {
    return (
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="bg-gradient-to-r from-white to-surface-50 border border-surface-300 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-surface-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-surface-600 font-medium mb-2">
            Nenhum ciclo ativo encontrado
          </p>
          <p className="text-sm text-surface-500">
            Entre em contato com o administrador para configurar um ciclo
          </p>
        </div>
      </div>
    );
  }

  // Return null if everything is loaded successfully
  return null;
}
