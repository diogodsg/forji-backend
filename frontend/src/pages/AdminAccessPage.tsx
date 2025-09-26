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
  AdminTeamsToolbar,
  AdminTeamsTable,
  TeamDetailPanel,
  CreateTeamModal,
  TeamMetricsCards,
  AccessDeniedPanel,
  UserMetricsCards,
  SimplifiedUsersTable,
  EnhancedUsersToolbar,
  Breadcrumb,
} from "@/features/admin";

type TabKey = "users" | "teams";

export default function AdminAccessPage() {
  const { user } = useAuth();
  const {
    users,
    loading,
    error,
    create,
    removeUser: deleteUser,
    busy,
  } = useAdminUsers();
  const teams = useAdminTeams();
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [githubFilter, setGithubFilter] = useState<"all" | "with" | "without">(
    "all"
  );
  const [showCreate, setShowCreate] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  // Drawer removed; manager selection now inline popover per-row.

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    // Role filter
    if (roleFilter === "admin") {
      filtered = filtered.filter((u) => u.isAdmin);
    } else if (roleFilter === "user") {
      filtered = filtered.filter((u) => !u.isAdmin);
    }

    // GitHub filter
    if (githubFilter === "with") {
      filtered = filtered.filter((u) => u.githubId);
    } else if (githubFilter === "without") {
      filtered = filtered.filter((u) => !u.githubId);
    }

    return filtered;
  }, [users, query, roleFilter, githubFilter]);

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
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Painel", href: "/" },
          { label: "Administração", current: true },
        ]}
      />

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Administração
        </h1>
        <p className="text-gray-600">
          Gerencie usuários, permissões e equipes da plataforma.
        </p>
      </header>
      <div>
        {/* Modern Tab Navigation */}
        <div className="bg-gray-100 p-1 rounded-lg mb-6 inline-flex">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "users"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            👥 Usuários ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all duration-200 ${
              activeTab === "teams"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            🏢 Equipes ({teams.teams.length})
          </button>
        </div>
        {activeTab === "users" && (
          <section className="space-y-6">
            <UserMetricsCards users={users} loading={loading} />

            <div className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-6">
              <EnhancedUsersToolbar
                query={query}
                setQuery={setQuery}
                roleFilter={roleFilter}
                setRoleFilter={setRoleFilter}
                githubFilter={githubFilter}
                setGithubFilter={setGithubFilter}
                onNew={() => setShowCreate(true)}
                totalUsers={users.length}
                filteredCount={filteredUsers.length}
              />

              <SimplifiedUsersTable
                users={users}
                filtered={filteredUsers}
                loading={loading}
                error={error}
                onRemove={deleteUser}
              />
            </div>
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
