// Painel PDI do gestor
import { EditablePdiView } from "../../pdi";

interface ManagerPdiPanelProps {
  loading: boolean;
  error: string | null;
  plan: any;
  currentUserId?: string;
  onCreate: () => void;
}

export function ManagerPdiPanel({
  loading,
  error,
  plan,
  currentUserId,
  onCreate,
}: ManagerPdiPanelProps) {
  return (
    <div className="p-5">
      {loading && (
        <div className="text-sm text-gray-500">Carregando PDI...</div>
      )}
      {error && (
        <div className="text-sm text-red-600">Erro ao carregar: {error}</div>
      )}
      {!loading && !plan && currentUserId && (
        <div className="text-sm text-gray-700 space-y-3">
          <div>Nenhum PDI criado para esta pessoa ainda.</div>
          <button
            className="px-3 py-1.5 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-500 disabled:opacity-50"
            disabled={!currentUserId}
            onClick={onCreate}
          >
            Criar PDI
          </button>
        </div>
      )}
      {plan && currentUserId && (
        <EditablePdiView
          key={currentUserId}
          initialPlan={plan}
          saveForUserId={Number(currentUserId)}
        />
      )}
    </div>
  );
}
