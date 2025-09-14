import { EditablePdiView, useRemotePdi, useEnsurePdi } from "../features/pdi";
import { FiTarget } from "react-icons/fi";
import { StatGridPdi } from "../features/pdi/components/StatGridPdi";
import { PdiPageSkeleton } from "../features/pdi/components/PdiPageSkeleton";
import { getPdiStats } from "../lib/stats";

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
  useEnsurePdi({ plan, loading, error, upsert, userId: "me" });

  const { competenciesCount, openKrs, meetings, avgProgressPct } = getPdiStats(
    plan || undefined
  );

  return (
    <div className="min-h-full w-full bg-[#f8fafc] p-6 space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
            <FiTarget className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              Meu PDI
            </h1>
            <p className="text-xs text-gray-500">
              Metas, evolução e resultados do seu desenvolvimento.
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <PdiPageSkeleton />
      ) : (
        <StatGridPdi
          competenciesCount={competenciesCount}
          openKrs={openKrs}
          meetings={meetings}
          avgProgressPct={avgProgressPct}
          loading={loading}
        />
      )}
      {error && (
        <div className="text-sm text-red-600">Erro ao carregar: {error}</div>
      )}

      {plan && <EditablePdiView initialPlan={plan} />}
    </div>
  );
}
