import { EditablePdiView } from "../components/EditablePdiView";
import { useRemotePdi } from "../hooks/useRemotePdi";
import { useEffect } from "react";
import type { PdiPlan } from "../types/pdi";

export function MyPdiPage() {
  const { plan, loading, error, upsert } = useRemotePdi();

  // Se não houver plano após carregar, criar um básico
  useEffect(() => {
    if (!loading && !plan && !error) {
      const empty: Omit<PdiPlan, "createdAt" | "updatedAt"> = {
        userId: "me",
        competencies: [],
        milestones: [],
        krs: [],
        records: [],
      };
      upsert(empty);
    }
  }, [loading, plan, error, upsert]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Meu PDI</h1>
      {loading && <div className="text-sm text-gray-500">Carregando...</div>}
      {error && (
        <div className="text-sm text-red-600">Erro ao carregar: {error}</div>
      )}
      {plan && <EditablePdiView initialPlan={plan} />}
    </div>
  );
}
