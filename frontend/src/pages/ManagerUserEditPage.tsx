import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ReportDetailsPanel } from "@/features/manager";
import type { ReportSummary } from "@/features/manager";
import { useMyReports } from "@/features/admin";
import { useAllTeamsWithDetails } from "@/features/manager";

/**
 * ManagerUserEditPage
 * Página dedicada de edição/gestão do colaborador selecionado.
 * - Abre via rota: /manager/users/:userId
 * - Possui botão de Voltar
 * - Reaproveita o painel de detalhes (PDI)
 */
export function ManagerUserEditPage() {
  const { userId: userIdParam } = useParams();
  const userId = userIdParam ? Number(userIdParam) : NaN;
  const navigate = useNavigate();
  const location = useLocation() as { state?: { report?: ReportSummary } };
  const passedReport = location.state?.report;

  // Fallback: carrega lista de reports e encontra o colaborador caso a navegação seja direta (deep link)
  const { reports: myReports = [], loading: loadingReports } = useMyReports();
  const fallbackReport = useMemo<ReportSummary | undefined>(() => {
    const found = myReports?.find((r: any) => r.id === userId);
    if (!found) return undefined;
    return {
      userId: found.id,
      name: found.name,
      email: found.email,
      position: null,
      bio: null,
      teams: [],
      pdi: { exists: false, progress: 0 },
    } as ReportSummary;
  }, [myReports, userId]);

  const [foundViaTeams, setFoundViaTeams] = useState<ReportSummary | null>(
    null
  );
  const [searchingTeams, setSearchingTeams] = useState(false);
  const searchedRef = useRef(false);

  // Se o userId for inválido, volta para /manager
  useEffect(() => {
    if (!userId || Number.isNaN(userId)) {
      navigate("/manager", { replace: true });
    }
  }, [userId, navigate]);

  const report = (passedReport ||
    fallbackReport ||
    foundViaTeams ||
    null) as ReportSummary | null;

  // Busca via times gerenciados, caso não tenhamos um report construído
  const allTeams = useAllTeamsWithDetails();
  useEffect(() => {
    if (report || searchingTeams || searchedRef.current) return;
    if (!userId || Number.isNaN(userId)) return;
    if (allTeams.loading) return;
    (async () => {
      setSearchingTeams(true);
      try {
        // Busca em todos os times (já vem com detalhes)
        for (const team of allTeams.teams) {
          const hit = team.memberships.find((m) => m.user.id === userId);
          if (hit) {
            setFoundViaTeams({
              userId: hit.user.id,
              name: hit.user.name,
              email: hit.user.email,
              position: null,
              bio: null,
              teams: [],
              pdi: { exists: false, progress: 0 },
            });
            break;
          }
        }
      } finally {
        setSearchingTeams(false);
        searchedRef.current = true;
      }
    })();
  }, [report, userId, allTeams.loading, allTeams.teams]);

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex-1 overflow-auto px-4 py-6">
        {/* Reutiliza o painel existente, com rótulo de botão customizado */}
        <div id="manager-report-details-panel">
          <ReportDetailsPanel
            report={report}
            onClose={() => navigate(-1)}
            closeLabel="Voltar"
          />
          {!report && (loadingReports || searchingTeams) && (
            <div className="mt-4 text-xs text-surface-500">
              Carregando colaborador...
            </div>
          )}
          {!report && !loadingReports && !searchingTeams && (
            <div className="mt-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">
              Não foi possível carregar os dados do colaborador #{userId}.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerUserEditPage;
