import { useMemo, useState, useEffect, useCallback } from "react";
import { FiArrowLeft } from "react-icons/fi";
/**
 * AdminAccessPage
 *
 * Route-level page for user and access management. Aggregates smaller admin feature
 * components (toolbar, table, creation modal, manager relationship drawer) and wires
 * them to the administrative data hook `useAdminUsers`.
 *
 * Portuguese UI copy is preserved (product decision), while documentation/comments
 * are in English for code                     })}
                  />
                  </div>
                </div>
              </div>
            )}bility and onboarding.
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
  AdminSubordinatesManagement,
} from "@/features/admin";

type TabKey = "users" | "teams" | "subordinates";

export default function AdminAccessPage() {
  const { user } = useAuth();
  const {
    users,
    loading,
    error,
    create,
    removeUser: deleteUser,
    changePassword,
    busy,
  } = useAdminUsers();
  const teams = useAdminTeams();
  const [activeTab, setActiveTab] = useState<TabKey>("users");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [githubFilter, setGithubFilter] = useState<"all" | "with" | "without">(
    "all"
  );
  const [showCreate, setShowCreate] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  // Drawer removed; manager selection now inline popover per-row.

  const handleTabChange = useCallback(
    (newTab: TabKey) => {
      if (newTab === activeTab) return;

      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(newTab);
        setIsTransitioning(false);
      }, 150); // Short transition delay
    },
    [activeTab]
  );

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
    isAdmin: boolean;
    githubId?: string;
    position?: string;
  }) {
    setCreateError(null);
    try {
      const result = await create(data as any);
      return result; // Retornar o resultado que inclui generatedPassword
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

  // Keyboard shortcuts for tab navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case "1":
            e.preventDefault();
            handleTabChange("users");
            break;
          case "2":
            e.preventDefault();
            handleTabChange("teams");
            break;
          case "3":
            e.preventDefault();
            handleTabChange("subordinates");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Early auth/role gate – avoids rendering internal admin structure needlessly.
  if (!user?.isAdmin) return <AccessDeniedPanel />;

  // Equipes agora usam filtros do hook (search, roleFilter, teamFilter)

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Painel", href: "/" },
          { label: "Administração" },
          {
            label:
              activeTab === "users"
                ? "Usuários"
                : activeTab === "teams"
                ? "Equipes"
                : "Subordinados",
            current: true,
          },
        ]}
      />

      <header className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Administração
          </h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-gray-600">
              Gerencie usuários, permissões e equipes da plataforma.
            </p>
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
              <span>Atalhos:</span>
              <div className="flex items-center gap-1">
                <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border text-gray-500">
                  Alt
                </kbd>
                <span>+</span>
                <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border text-gray-500">
                  1-3
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100/80 p-2 rounded-2xl border border-gray-200/60 shadow-sm">
          <nav className="flex space-x-2" role="tablist">
            <button
              onClick={() => handleTabChange("users")}
              className={`group relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === "users"
                  ? "bg-white text-indigo-700 shadow-lg shadow-indigo-500/10 border border-indigo-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
              role="tab"
              aria-selected={activeTab === "users"}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === "users"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                }`}
              >
                <svg
                  className="w-5 h-5"
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
              <div className="text-left">
                <div className="font-semibold">Usuários</div>
                <div
                  className={`text-xs ${
                    activeTab === "users" ? "text-indigo-500" : "text-gray-400"
                  }`}
                >
                  {users.length} cadastrados
                </div>
              </div>
              <div
                className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  activeTab === "users" ? "text-indigo-400" : "text-gray-300"
                }`}
              >
                <kbd className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded border">
                  Alt+1
                </kbd>
              </div>
              {activeTab === "users" && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => handleTabChange("teams")}
              className={`group relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === "teams"
                  ? "bg-white text-emerald-700 shadow-lg shadow-emerald-500/10 border border-emerald-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
              role="tab"
              aria-selected={activeTab === "teams"}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === "teams"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Equipes</div>
                <div
                  className={`text-xs ${
                    activeTab === "teams" ? "text-emerald-500" : "text-gray-400"
                  }`}
                >
                  {teams.teams.length} ativas
                </div>
              </div>
              <div
                className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  activeTab === "teams" ? "text-emerald-400" : "text-gray-300"
                }`}
              >
                <kbd className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded border">
                  Alt+2
                </kbd>
              </div>
              {activeTab === "teams" && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
              )}
            </button>

            <button
              onClick={() => handleTabChange("subordinates")}
              className={`group relative flex-1 flex items-center justify-center gap-3 px-6 py-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                activeTab === "subordinates"
                  ? "bg-white text-purple-700 shadow-lg shadow-purple-500/10 border border-purple-100"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
              role="tab"
              aria-selected={activeTab === "subordinates"}
            >
              <div
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === "subordinates"
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-200 text-gray-500 group-hover:bg-gray-300"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-semibold">Subordinados</div>
                <div
                  className={`text-xs ${
                    activeTab === "subordinates"
                      ? "text-purple-500"
                      : "text-gray-400"
                  }`}
                >
                  Hierarquias
                </div>
              </div>
              <div
                className={`absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                  activeTab === "subordinates"
                    ? "text-purple-400"
                    : "text-gray-300"
                }`}
              >
                <kbd className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded border">
                  Alt+3
                </kbd>
              </div>
              {activeTab === "subordinates" && (
                <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              )}
            </button>
          </nav>
        </div>
      </header>

      <div className="mt-8">
        {isTransitioning && (
          <section className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full"></div>
              <span className="text-sm">Carregando...</span>
            </div>
          </section>
        )}

        {!isTransitioning && activeTab === "users" && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UserMetricsCards users={users} loading={loading} />

            <div className="bg-white/90 backdrop-blur border border-surface-300/70 shadow-lg shadow-indigo-500/5 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10">
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
                onChangePassword={changePassword}
              />
            </div>
          </section>
        )}
        {!isTransitioning && activeTab === "teams" && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!teams.selectedTeam && (
              <>
                <TeamMetricsCards
                  metrics={teams.metrics}
                  loading={teams.loading}
                />

                <div className="bg-white/90 backdrop-blur border border-surface-300/70 shadow-lg shadow-emerald-500/5 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
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
              </>
            )}
            {teams.selectedTeam && (
              <div className="bg-white/90 backdrop-blur border border-surface-300/70 shadow-lg shadow-emerald-500/5 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10">
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
              </div>
            )}
          </section>
        )}
        {!isTransitioning && activeTab === "subordinates" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white/90 backdrop-blur border border-surface-300/70 shadow-lg shadow-purple-500/5 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
              <AdminSubordinatesManagement
                onBack={() => handleTabChange("users")}
              />
            </div>
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
