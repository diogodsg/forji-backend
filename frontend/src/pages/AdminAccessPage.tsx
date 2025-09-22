import { useMemo, useState } from "react";
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
  CreateUserModal,
  AdminUsersToolbar,
  AdminUsersTable,
  AccessDeniedPanel,
} from "@/features/admin";

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
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
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

      <CreateUserModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreateUser}
        creating={busy.creating}
        error={createError}
      />
      {/* ManagerDrawer removed */}
    </div>
  );
}
