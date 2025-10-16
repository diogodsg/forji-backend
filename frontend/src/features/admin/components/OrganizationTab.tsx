import {
  AdminTeamsToolbar,
  AdminTeamsTable,
  TeamDetailPanel,
  CreateTeamModal,
  TeamMetricsCards,
  useAdminTeams,
} from "../index";

interface OrganizationTabProps {
  showCreateTeam: boolean;
  setShowCreateTeam: (show: boolean) => void;
  teams: ReturnType<typeof useAdminTeams>;
  users: Array<{
    id: number;
    name: string;
    email: string;
    isAdmin?: boolean;
    githubId?: string | null;
    managers: any[];
    reports: any[];
  }>;
}

export function OrganizationTab({
  showCreateTeam,
  setShowCreateTeam,
  teams,
  users,
}: OrganizationTabProps) {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header da seção */}
      <div className="flex items-center gap-3 pb-4">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 tracking-tight">
            Gestão de Equipes
          </h2>
          <p className="text-sm text-gray-500">
            Gerencie times, responsáveis e membros da organização
          </p>
        </div>
      </div>

      {/* Métricas das Equipes */}
      {!teams.selectedTeam && (
        <>
          <TeamMetricsCards metrics={teams.metrics} loading={teams.loading} />

          <div className="rounded-xl border border-surface-300 bg-white shadow-sm p-6">
            <AdminTeamsToolbar
              search={teams.search}
              onSearch={teams.setSearch}
              role={teams.roleFilter}
              onRole={teams.setRoleFilter}
              teamId={teams.teamFilter}
              onTeam={teams.setTeamFilter}
              teams={teams.teams}
              onNew={() => setShowCreateTeam(true)}
              hint="Clique em uma equipe para ver detalhes e gerenciar membros"
            />
            <AdminTeamsTable
              filtered={teams.filteredTeams}
              loading={teams.loading}
              error={teams.error}
              onSelect={(id: any) => teams.selectTeam(id)}
              selectedId={
                (teams.selectedTeam && (teams.selectedTeam as any).id) || null
              }
              onRemove={(id: any) => teams.deleteTeam(id)}
              onRename={(id: any, name: any) => teams.updateTeam(id, { name })}
            />
          </div>
        </>
      )}

      {/* Detalhes da Equipe Selecionada */}
      {teams.selectedTeam && (
        <div className="rounded-xl border border-surface-300 bg-white shadow-sm p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => teams.selectTeam(null)}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Voltar para lista de equipes
                </button>
                <h3 className="text-lg font-semibold text-gray-800 tracking-tight">
                  Detalhes da Equipe
                </h3>
              </div>
            </div>
            <div className="border-t border-surface-200 pt-4">
              <TeamDetailPanel
                team={teams.selectedTeam}
                busy={teams.refreshingTeam}
                onAddMember={(userId: any, role: any) =>
                  teams.addMember(teams.selectedTeam!.id, userId, role)
                }
                onUpdateRole={(userId: any, role: any) =>
                  teams.updateMemberRole(teams.selectedTeam!.id, userId, role)
                }
                onRemove={(userId: any) =>
                  teams.removeMember(teams.selectedTeam!.id, userId)
                }
                availableUsers={users.map((u) => ({
                  id: u.id,
                  name: u.name,
                  email: u.email,
                }))}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de Criação de Equipe */}
      <CreateTeamModal
        open={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        onCreate={async (data: any) => {
          await teams.create(data);
          setShowCreateTeam(false);
        }}
        creating={teams.creating}
        error={teams.error}
      />
    </section>
  );
}
