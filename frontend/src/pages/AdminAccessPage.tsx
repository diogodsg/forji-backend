import { useMemo, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
/**
 * AdminAccessPage
 *
 * Route-level page for user and access management. Aggregates smaller admin feature
 * components (toolbar, table, creation modal, manager relationship drawer) and wires
 * them to the administrative data hook `useAdminUsers`.
 *
 * Portuguese UI copy is preserved (product decision), while documentation/comments
 * are in English for code readability and onboarding.
 *
 * Responsibilities:
 * - Fetch & hold admin user list state via `useAdminUsers`.
 * - Provide client-side search filter (name/email) with a lightweight memoized filter.
 * - Handle user creation errors translating backend messages to friendly text.
 * - Gate access: non-admin users see an `AccessDeniedPanel` early return.
 * - Orchestrate subordinate manager assignment through `ManagerDrawer`.
 *
 * Not in scope here:
 * - Table row rendering details (delegated to feature components).
 * - Complex caching; relies on underlying hook.
 */
import { useAuth } from "@/features/auth";
import {
  useAdminUsers,
  useAdminTeams,
  CreateUserModal,
  AdminUsersToolbar,
  AdminUsersTable,
  AdminTeamsToolbar,
  AdminTeamsTable,
  TeamDetailPanel,
  CreateTeamModal,
  TeamMetricsCards,
  AccessDeniedPanel,
} from "@/features/admin";

type TabKey = "users" | "teams";

export default function AdminAccessPage() {
  const { user } = useAuth();
  const {
    users,
    loading,
    error,
    create,
    setGithub: setGithubId,
    toggleAdmin,
    removeUser: deleteUser,
    addManager: setManager,
    removeManager,
    busy,
  } = useAdminUsers();
  const teams = useAdminTeams();
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  // Drawer removed; manager selection now inline popover per-row.

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, query]);

  async function handleCreateUser(data: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    githubId?: string;
  }) {
    setCreateError(null);
    try {
      await create(data as any);
    } catch (err: any) {
      const msg = String(err?.message || "");
      let display: string;
      if (/Email já está em uso|email.+exists/i.test(msg))
        display = "Email already in use";
      else if (/githubId.+uso|githubId.+exists|github/i.test(msg))
        display = "GitHub ID already in use";
      else display = "Failed to create user";
      setCreateError(display);
      throw new Error(display);
    }
  }

  // Early auth/role gate – avoids rendering internal admin structure needlessly.
  if (!user?.isAdmin) return <AccessDeniedPanel />;

  // Equipes agora usam filtros do hook (search, roleFilter, teamFilter)

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-800">
          Administração
        </h1>
        <p className="text-sm text-gray-500">
          Gerencie contas, permissões e relacionamentos de gestão.
        </p>
      </header>
      <div>
        <div className="flex gap-2 mb-4 border-b border-surface-300/70">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              activeTab === "users"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`px-4 py-2 text-sm font-medium -mb-px border-b-2 transition-colors ${
              activeTab === "teams"
                ? "border-indigo-600 text-indigo-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Equipes
          </button>
        </div>
        {activeTab === "users" && (
          <section className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-5">
            <AdminUsersToolbar
              query={query}
              setQuery={setQuery}
              onNew={() => setShowCreate(true)}
            />
            <AdminUsersTable
              users={users}
              filtered={filteredUsers}
              loading={loading}
              error={error}
              onToggleAdmin={toggleAdmin}
              onUpdateGithub={setGithubId}
              onAddManager={setManager}
              onRemoveManager={removeManager}
              onRemove={deleteUser}
            />
          </section>
        )}
        {activeTab === "teams" && (
          <section className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-5">
            {!teams.selectedTeam && (
              <div className="space-y-6">
                <TeamMetricsCards
                  metrics={teams.metrics}
                  loading={teams.loading}
                />
                <AdminTeamsToolbar
                  search={teams.search}
                  onSearch={teams.setSearch}
                  role={teams.roleFilter}
                  onRole={teams.setRoleFilter}
                  teamId={teams.teamFilter}
                  onTeam={teams.setTeamFilter}
                  teams={teams.teams}
                  onNew={() => setShowCreateTeam(true)}
                  hint="Clique em uma equipe para ver detalhes"
                />
                <AdminTeamsTable
                  filtered={teams.filteredTeams}
                  loading={teams.loading}
                  error={teams.error}
                  onSelect={(id) => teams.selectTeam(id)}
                  selectedId={
                    (teams.selectedTeam && (teams.selectedTeam as any).id) ||
                    null
                  }
                  onRemove={(id) => teams.deleteTeam(id)}
                  onRename={(id, name) => teams.updateTeam(id, { name })}
                />
              </div>
            )}
            {teams.selectedTeam && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => teams.selectTeam(null)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      <FiArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800 tracking-tight">
                      Detalhes da equipe
                    </h2>
                  </div>
                </div>
                <div className="border-t border-surface-200/70 pt-4">
                  <TeamDetailPanel
                    team={teams.selectedTeam}
                    busy={teams.refreshingTeam}
                    onAddMember={(userId, role) =>
                      teams.addMember(teams.selectedTeam!.id, userId, role)
                    }
                    onUpdateRole={(userId, role) =>
                      teams.updateMemberRole(
                        teams.selectedTeam!.id,
                        userId,
                        role
                      )
                    }
                    onRemove={(userId) =>
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
            )}
          </section>
        )}
      </div>

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateUser}
        creating={busy.creating}
        error={createError}
      />
      <CreateTeamModal
        open={showCreateTeam}
        onClose={() => setShowCreateTeam(false)}
        onCreate={async (data) => {
          await teams.create(data);
          setShowCreateTeam(false);
        }}
        creating={teams.creating}
        error={teams.error}
      />
      {/* ManagerDrawer removed */}
    </div>
  );
}
