import { EditablePdiView } from "../features/pdi/components/EditablePdiView";
import { useRemotePdi } from "../features/pdi/hooks/useRemotePdi";
import { useEnsurePdi } from "../features/pdi/hooks/useEnsurePdi";
import { FiTarget } from "react-icons/fi";

/**
 * MyPdiPage
 *
 * Displays the current user's Personal Development Plan (PDI). Ensures an empty
 * plan is provisioned automatically (via `useEnsurePdi`) so that the editor UI
 * can appear without a manual "create" flow. Portuguese UI copy kept on purpose.
 *
 * Data flow:
 * - Fetch plan with `useRemotePdi`.
 * - Hook `useEnsurePdi` triggers creation when no plan exists and not loading.
 * - Once plan is available it is passed to `EditablePdiView` for editing.
 */
export function MyPdiPage() {
  const { plan, loading, error, upsert } = useRemotePdi();
  // Garante criação automática de PDI vazio
  useEnsurePdi({ plan, loading, error, upsert, userId: "me" });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
        <FiTarget className="w-6 h-6 text-indigo-600" /> Meu PDI
      </h1>
      {loading && <div className="text-sm text-gray-500">Carregando...</div>}
      {error && (
        <div className="text-sm text-red-600">Erro ao carregar: {error}</div>
      )}
      {plan && <EditablePdiView initialPlan={plan} />}
    </div>
  );
}
