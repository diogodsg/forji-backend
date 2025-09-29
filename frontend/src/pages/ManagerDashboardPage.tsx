// TODO(refactor): Extrair sidebar, header e painel de PDI para `features/manager/components`.
// Manter esta página apenas como orquestradora de rota.
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMyReports } from "../features/admin";
import {
  ReportCard,
  useManagerDashboardComplete,
  type ReportSummary,
} from "../features/manager";

export function ManagerDashboardPage() {
  const navigate = useNavigate();
  const legacy = useMyReports();
  const {
    data,
    loading: loadingComplete,
    error: completeError,
  } = useManagerDashboardComplete();

  // Foco principal: pessoas que sou manager direto
  const myDirectReports: ReportSummary[] =
    data?.reports ||
    (legacy.reports || []).map((r) => ({
      userId: r.id,
      name: r.name,
      email: r.email,
      position: null,
      bio: null,
      teams: [],
      pdi: { exists: false, progress: 0 },
    }));

  const handleSelectUser = (id: number) => {
    const report = myDirectReports.find((r) => r.userId === id);
    navigate(
      `/manager/users/${id}`,
      report ? { state: { report } } : undefined
    );
  };

  // Times agora vêm do endpoint consolidado
  const allTeams = {
    teams: data?.teams || [],
    loading: loadingComplete,
    error: completeError,
  };
  
  const [expandedTeamId, setExpandedTeamId] = useState<number | null>(null);

  // Derivar times que contêm pessoas que gerencio
  const myTeamsWithMyReports = useMemo(() => {
    if (!allTeams.teams.length || !myDirectReports.length) return [];

    return allTeams.teams
      .map((team) => {
        // Encontrar pessoas que gerencio neste time
        const myReportsInTeam = team.memberships
          .map((m) => {
            const foundReport = myDirectReports.find(
              (r) => Number(r.userId) === Number(m.user.id)
            );
            return foundReport || null;
          })
          .filter(Boolean) as ReportSummary[];
        if (myReportsInTeam.length === 0) return null;

        return {
          ...team,
          myReports: myReportsInTeam,
        };
      })
      .filter(Boolean) as Array<
      (typeof allTeams.teams)[0] & { myReports: ReportSummary[] }
    >;
  }, [allTeams.teams, myDirectReports]);

  // Expandir automaticamente o primeiro time com pessoas que gerencio
  useEffect(() => {
    if (
      !allTeams.loading &&
      expandedTeamId == null &&
      myTeamsWithMyReports.length > 0
    ) {
      const firstId = myTeamsWithMyReports[0].id;
      setExpandedTeamId(firstId);
    }
  }, [allTeams.loading, myTeamsWithMyReports, expandedTeamId]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {summaryError && (
        <div className="mx-4 mb-2 mt-4 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded p-2">
          {summaryError}
        </div>
      )}
      {!loadingSummary && !allTeams.loading && myDirectReports.length === 0 && (
        <div className="p-10 text-sm text-surface-600">
          Você ainda não gerencia ninguém.
        </div>
      )}

      <div className="flex-1 overflow-auto px-6 pb-8">
        <section className="mt-8">
          <div className="relative mb-8">
            {/* Background decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-purple-50/50 to-blue-50/30 rounded-2xl -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-transparent rounded-2xl -z-10"></div>

            {/* Conteúdo do header */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                      myTeamsWithMyReports.length > 0
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                    }`}
                  >
                    <span className="text-xs font-bold text-white">
                      {myTeamsWithMyReports.length}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-surface-900 tracking-tight">
                    Meus Times
                  </h2>
                  <p className="text-surface-600 text-sm mt-1">
                    {myDirectReports.length > 0
                      ? myTeamsWithMyReports.length > 0
                        ? `Gerenciando ${myDirectReports.length} pessoa${
                            myDirectReports.length !== 1 ? "s" : ""
                          } em ${myTeamsWithMyReports.length} time${
                            myTeamsWithMyReports.length !== 1 ? "s" : ""
                          }`
                        : `Gerenciando ${myDirectReports.length} pessoa${
                            myDirectReports.length !== 1 ? "s" : ""
                          } (aguardando organização em times)`
                      : "Organize e acompanhe sua equipe"}
                  </p>
                </div>
              </div>

              {allTeams.loading && (
                <div className="flex items-center gap-3 text-sm text-indigo-700 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-indigo-200/50 shadow-sm">
                  <div className="relative">
                    <div className="animate-spin h-5 w-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full"></div>
                    <div className="absolute inset-0 animate-pulse bg-indigo-100 rounded-full opacity-30"></div>
                  </div>
                  <span className="font-semibold">Carregando times...</span>
                </div>
              )}
            </div>

            {/* Linha decorativa */}
            <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
          </div>

          {allTeams.error && (
            <div className="text-sm text-rose-700 bg-gradient-to-br from-rose-50 to-rose-100/80 border border-rose-200/80 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm">
              <div className="p-1 bg-rose-100 rounded-full">
                <svg
                  className="w-4 h-4 text-rose-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-rose-800">
                  Erro ao carregar times
                </div>
                <div className="mt-1 text-rose-600">{allTeams.error}</div>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {allTeams.loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-surface-200/60 bg-gradient-to-r from-white to-surface-50/50 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-5 bg-surface-200 rounded-lg w-36"></div>
                      <div className="w-4 h-4 bg-surface-200 rounded"></div>
                    </div>
                    <div className="flex gap-3">
                      <div className="h-6 bg-surface-200 rounded-full w-24"></div>
                      <div className="h-6 bg-surface-200 rounded-full w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Seção para mostrar todas as pessoas gerenciadas, mesmo sem times */}
          {!allTeams.loading &&
            myDirectReports.length > 0 &&
            myTeamsWithMyReports.length === 0 && (
              <div className="mt-6">
                <div className="bg-gradient-to-br from-indigo-50 via-blue-50/80 to-purple-50/60 border border-indigo-200/60 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m9 5.197v1M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-900 text-lg">
                        Pessoas que Gerencio
                      </h3>
                      <p className="text-indigo-700 text-sm">
                        {myDirectReports.length} pessoa
                        {myDirectReports.length !== 1 ? "s" : ""} sob sua gestão
                        <span className="text-indigo-500 ml-2">
                          • Aguardando organização em times
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {myDirectReports.map((person) => (
                      <div
                        key={person.userId}
                        className="bg-white rounded-xl p-4 border border-indigo-100/60 hover:border-indigo-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                        onClick={() => handleSelectUser(person.userId)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {person.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-surface-900 group-hover:text-indigo-700 transition-colors">
                                {person.name}
                              </div>
                              <div className="text-sm text-surface-600">
                                {person.email}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* PDI Status */}
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-surface-500">
                                PDI:
                              </div>
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  person.pdi.exists
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                              {person.pdi.exists && (
                                <span className="text-xs text-surface-600">
                                  {Math.round(person.pdi.progress * 100)}%
                                </span>
                              )}
                            </div>

                            {/* Arrow */}
                            <svg
                              className="w-5 h-5 text-surface-400 group-hover:text-indigo-500 transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {!allTeams.loading && (
            <div className="space-y-4">
              {myTeamsWithMyReports.map((t) => {
                const expanded = expandedTeamId === t.id;
                const myPeopleInTeam = t.myReports.length;
                const totalMembers = t.memberships.length;

                return (
                  <div
                    key={t.id}
                    className={`rounded-2xl border bg-gradient-to-r from-white to-surface-50/30 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                      expanded
                        ? "border-indigo-200/80 shadow-md ring-1 ring-indigo-100"
                        : "border-surface-200/60 hover:border-surface-300/80"
                    }`}
                  >
                    <button
                      className={`w-full text-left px-6 py-4 flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-3 focus:ring-indigo-500/20 group ${
                        expanded
                          ? "bg-gradient-to-r from-indigo-50/80 to-purple-50/60"
                          : "bg-surface-50/40 hover:bg-surface-100/70"
                      }`}
                      onClick={async () => {
                        setExpandedTeamId(expanded ? null : t.id);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                            expanded
                              ? "bg-indigo-500"
                              : "bg-surface-400 group-hover:bg-surface-500"
                          }`}
                        ></div>
                        <span className="font-bold text-surface-800 tracking-tight text-base">
                          {t.name}
                        </span>
                        <svg
                          className={`w-5 h-5 text-surface-500 transition-all duration-300 ${
                            expanded
                              ? "rotate-180 text-indigo-600"
                              : "group-hover:text-surface-600"
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border border-emerald-200/80 font-semibold text-sm shadow-sm">
                          {myPeopleInTeam} que gerencio
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/80 font-medium text-sm">
                          {totalMembers} total
                        </span>
                      </div>
                    </button>

                    {expanded && (
                      <div className="px-6 py-5 border-t border-surface-200/50 bg-gradient-to-b from-surface-50/50 to-white animate-in slide-in-from-top-2 duration-300">
                        {
                          <div className="space-y-6">
                            {/* Pessoas que gerencio */}
                            {t.myReports.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  Pessoas que gerencio
                                </h3>
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {t.myReports.map((report) => (
                                    <div
                                      key={report.userId}
                                      className="relative group"
                                    >
                                      <ReportCard
                                        report={report}
                                        active={false}
                                        onSelect={handleSelectUser}
                                      />
                                      <div
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full border-3 border-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                                        title="Você gerencia esta pessoa"
                                      >
                                        <svg
                                          className="w-3 h-3 text-white"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Outros membros do time */}
                            {t.memberships.filter(
                              (m) =>
                                !myDirectReports.some(
                                  (r) => Number(r.userId) === Number(m.user.id)
                                )
                            ).length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold text-surface-500 mb-3 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-surface-400 rounded-full"></div>
                                  Outros membros do time
                                </h3>
                                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                  {t.memberships
                                    .filter(
                                      (m) =>
                                        !myDirectReports.some(
                                          (r) =>
                                            Number(r.userId) ===
                                            Number(m.user.id)
                                        )
                                    )
                                    .map((m) => {
                                      const report: ReportSummary = {
                                        userId: m.user.id,
                                        name: m.user.name,
                                        email: m.user.email,
                                        position: null,
                                        bio: null,
                                        teams: [],
                                        pdi: { exists: false, progress: 0 },
                                      };
                                      return (
                                        <div
                                          key={m.user.id}
                                          className="opacity-60 cursor-not-allowed relative"
                                        >
                                          <ReportCard
                                            report={report}
                                            active={false}
                                            onSelect={() => {}} // Sem ação para não-gerenciados
                                          />
                                          <div className="absolute inset-0 bg-surface-100/20 rounded-xl pointer-events-none"></div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}
                          </div>
                        }
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty state - apenas quando realmente não gerencia ninguém */}
          {myDirectReports.length === 0 && !allTeams.loading && (
            <div className="bg-gradient-to-br from-amber-50 via-orange-50/80 to-yellow-50/60 border border-amber-200/60 rounded-2xl p-12 text-center shadow-sm">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <svg
                  className="w-10 h-10 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-3">
                Nenhuma pessoa encontrada
              </h3>
              <p className="text-amber-700 text-base leading-relaxed max-w-md mx-auto">
                Você ainda não é{" "}
                <span className="font-semibold bg-amber-100 px-2 py-1 rounded-md">
                  manager
                </span>{" "}
                de nenhuma pessoa. Entre em contato com o RH ou administrador
                para configurar sua equipe.
              </p>
              <div className="mt-6 pt-6 border-t border-amber-200/40">
                <p className="text-sm text-amber-600">
                  💡 <span className="font-medium">Dica:</span> Quando você for
                  designado como manager, as pessoas aparecerão organizadas por
                  times aqui.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
