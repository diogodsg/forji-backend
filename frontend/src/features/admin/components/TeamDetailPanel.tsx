import type { TeamDetail } from "../types";
import { useMemo, useState } from "react";

interface Props {
  team: TeamDetail | null;
  busy: boolean;
  onAddMember: (userId: number, role?: "MEMBER" | "MANAGER") => Promise<void>;
  onUpdateRole: (userId: number, role: "MEMBER" | "MANAGER") => Promise<void>;
  onRemove: (userId: number) => Promise<void>;
  availableUsers?: Array<{ id: number; name: string; email: string }>; // lista completa de usuários para adicionar
}

export function TeamDetailPanel({
  team,
  busy,
  onAddMember,
  onUpdateRole,
  onRemove,
  availableUsers = [],
}: Props) {
  const [memberQuery, setMemberQuery] = useState("");

  // Hooks sempre executados para manter ordem consistente.
  const orderedMemberships = useMemo(() => {
    if (!team) return [];
    return [...team.memberships].sort((a, b) => {
      if (a.role !== b.role) return a.role === "MANAGER" ? -1 : 1;
      return a.user.name.localeCompare(b.user.name, "pt-BR");
    });
  }, [team]);

  const filteredMemberships = useMemo(() => {
    if (!memberQuery.trim()) return orderedMemberships;
    const q = memberQuery.toLowerCase();
    return orderedMemberships.filter(
      (m) =>
        m.user.name.toLowerCase().includes(q) ||
        m.user.email.toLowerCase().includes(q)
    );
  }, [orderedMemberships, memberQuery]);

  const managersCount = useMemo(
    () =>
      team ? team.memberships.filter((m) => m.role === "MANAGER").length : 0,
    [team]
  );

  // usuarios que ainda não fazem parte do time - calculado sempre para manter ordem dos hooks
  const memberUserIds = team
    ? new Set(team.memberships.map((m) => m.user.id))
    : new Set();
  const nonMembers = useMemo(() => {
    const base = availableUsers.filter((u) => !memberUserIds.has(u.id));
    if (!memberQuery.trim()) return base;
    const q = memberQuery.toLowerCase();
    return base.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [availableUsers, memberQuery, memberUserIds]);

  if (!team) {
    return (
      <div className="text-sm text-gray-500">
        Selecione uma equipe para ver detalhes.
      </div>
    );
  }

  const managers = filteredMemberships.filter((m) => m.role === "MANAGER");
  const nonManagerMembers = filteredMemberships.filter(
    (m) => m.role === "MEMBER"
  );

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          {team.name}
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 text-brand-600 border border-brand-100 px-2 py-0.5 text-[10px] font-medium">
            {managersCount} manager{managersCount === 1 ? "" : "s"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 text-[10px] font-medium">
            {team.memberships.length} membro
            {team.memberships.length === 1 ? "" : "s"}
          </span>
        </h3>
        {team.description && (
          <p className="text-xs text-gray-500 max-w-prose leading-relaxed">
            {team.description}
          </p>
        )}
      </header>

      <div className="space-y-3">
        <input
          value={memberQuery}
          onChange={(e) => setMemberQuery(e.target.value)}
          placeholder="Buscar nome ou email..."
          className="w-full rounded-xl border border-surface-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/60 bg-white/80"
        />
        <div className="space-y-5">
          <section className="space-y-2">
            <h4 className="text-[11px] font-semibold tracking-wide text-gray-500">
              GERENTES
            </h4>
            <div className="border border-surface-300/70 rounded-md overflow-hidden divide-y divide-surface-200/70 bg-white/70">
              {managers.length === 0 && (
                <div className="px-3 py-4 text-[11px] text-gray-500">
                  Nenhum manager.
                </div>
              )}
              {managers.map((m) => (
                <div
                  key={m.user.id}
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-surface-50/70"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={m.user.name} />
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-xs font-medium text-gray-800 truncate max-w-[160px]"
                        title={m.user.name}
                      >
                        {m.user.name}
                      </span>
                      <span
                        className="text-[10px] text-gray-500 truncate max-w-[160px]"
                        title={m.user.email}
                      >
                        {m.user.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={m.role} />
                    <select
                      disabled={busy}
                      value={m.role}
                      onChange={(e) =>
                        onUpdateRole(m.user.id, e.target.value as any)
                      }
                      className="text-[10px] rounded border border-surface-300 px-1.5 py-0.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    >
                      <option value="MANAGER">Manager</option>
                      <option value="MEMBER">Membro</option>
                    </select>
                    <button
                      disabled={busy}
                      onClick={() => onRemove(m.user.id)}
                      className="text-[10px] font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="text-[11px] font-semibold tracking-wide text-gray-500">
              MEMBROS
            </h4>
            <div className="border border-surface-300/70 rounded-md overflow-hidden divide-y divide-surface-200/70 bg-white/70">
              {nonManagerMembers.length === 0 && (
                <div className="px-3 py-4 text-[11px] text-gray-500">
                  Nenhum membro.
                </div>
              )}
              {nonManagerMembers.map((m) => (
                <div
                  key={m.user.id}
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-surface-50/70"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={m.user.name} />
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-xs font-medium text-gray-800 truncate max-w-[160px]"
                        title={m.user.name}
                      >
                        {m.user.name}
                      </span>
                      <span
                        className="text-[10px] text-gray-500 truncate max-w-[160px]"
                        title={m.user.email}
                      >
                        {m.user.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <RoleBadge role={m.role} />
                    <select
                      disabled={busy}
                      value={m.role}
                      onChange={(e) =>
                        onUpdateRole(m.user.id, e.target.value as any)
                      }
                      className="text-[10px] rounded border border-surface-300 px-1.5 py-0.5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/40"
                    >
                      <option value="MEMBER">Membro</option>
                      <option value="MANAGER">Manager</option>
                    </select>
                    <button
                      disabled={busy}
                      onClick={() => onRemove(m.user.id)}
                      className="text-[10px] font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h4 className="text-[11px] font-semibold tracking-wide text-gray-500">
              PESSOAS
            </h4>
            <div className="border border-surface-300/70 rounded-md overflow-hidden divide-y divide-surface-200/70 bg-white/70 max-h-72 overflow-y-auto">
              {nonMembers.length === 0 && (
                <div className="px-3 py-4 text-[11px] text-gray-500">
                  Nenhum usuário disponível.
                </div>
              )}
              {nonMembers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between px-3 py-2 text-sm hover:bg-surface-50/70"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={u.name} />
                    <div className="flex flex-col min-w-0">
                      <span
                        className="text-xs font-medium text-gray-800 truncate max-w-[160px]"
                        title={u.name}
                      >
                        {u.name}
                      </span>
                      <span
                        className="text-[10px] text-gray-500 truncate max-w-[160px]"
                        title={u.email}
                      >
                        {u.email}
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={busy}
                    onClick={() => onAddMember(u.id)}
                    className="text-[10px] font-medium text-brand-600 hover:text-brand-700 disabled:opacity-50"
                  >
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// AddMemberInline removido em favor do seletor unificado

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center text-[10px] font-semibold shadow-sm">
      {initials || "?"}
    </div>
  );
}

function RoleBadge({ role }: { role: "MEMBER" | "MANAGER" }) {
  const isManager = role === "MANAGER";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium tracking-wide ${
        isManager
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {isManager ? "Manager" : "Membro"}
    </span>
  );
}
