import { useMemo, useState } from "react";
import type { AdminUser } from "../types";
import { getMockManagementRulesByManagerId } from "../data/mockData";

interface ModernPersonCardProps {
  user: AdminUser;
  allUsers?: AdminUser[];
  onEdit: () => void;
  onHierarchy: () => void;
  onChangePassword: () => void;
  onRemove: () => void;
}

export function ModernPersonCard({
  user,
  allUsers,
  onEdit,
  onHierarchy,
  onChangePassword,
  onRemove,
}: ModernPersonCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Calcular informações hierárquicas (removido código antigo)

  // Resolver managers para exibir badges (limite 3 + overflow)
  const usersById = useMemo(() => {
    if (!allUsers) return new Map<number, AdminUser>();
    return new Map(allUsers.map((u) => [u.id, u] as const));
  }, [allUsers]);

  const managerUsers: AdminUser[] = useMemo(() => {
    return (user.managers || [])
      .map((m) => usersById.get(m.id))
      .filter((u): u is AdminUser => Boolean(u));
  }, [user.managers, usersById]);

  const shownManagers = managerUsers.slice(0, 3);
  const extraManagers = Math.max(managerUsers.length - shownManagers.length, 0);

  // Mock: obter regras de gestão (TEAM e INDIVIDUAL) para exibir badges (limite 3 + overflow)
  const managementRules = useMemo(() => {
    return getMockManagementRulesByManagerId(user.id);
  }, [user.id]);

  const ruleBadges = useMemo(() => {
    return managementRules.map((r) => ({
      type: r.ruleType,
      label:
        r.ruleType === "TEAM"
          ? r.team?.name || "Equipe"
          : r.subordinate?.name || "Colaborador",
    }));
  }, [managementRules]);

  const shownRules = ruleBadges.slice(0, 3);
  const extraRules = Math.max(ruleBadges.length - shownRules.length, 0);

  // Gerar iniciais para avatar
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl border border-surface-300 shadow-sm hover:shadow-md transition-all duration-200 hover:border-violet-300 p-4 flex flex-col h-full min-h-[280px]">
      {/* Header: Avatar + Nome + Badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Avatar com gradient violet */}
          <div className="h-11 w-11 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm flex-shrink-0">
            <span className="text-white font-semibold text-sm">{initials}</span>
          </div>

          {/* Info principal */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-base truncate">
                {user.name}
              </h3>
              {user.isAdmin && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded border border-red-200 flex-shrink-0">
                  Admin
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-600 truncate">
              {user.position || "Sem cargo definido"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Menu dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              <button
                onClick={() => {
                  onEdit();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-2">
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editar
                </div>
              </button>
              <button
                onClick={() => {
                  onChangePassword();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
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
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2l-4-4L7.257 8.743A6 6 0 0119 9z"
                    />
                  </svg>
                  Alterar Senha
                </div>
              </button>
              <button
                onClick={() => {
                  onRemove();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-b-xl"
              >
                <div className="flex items-center gap-2">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Remover Usuário
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content flexível - sempre presente para manter altura consistente */}
      <div className="flex-1 min-h-[120px]">
        {/* Managers (badges) - Quem gerencia esta pessoa */}
        <div className="mb-2 min-h-[40px]">
          {managerUsers.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 mb-1">
                <svg
                  className="w-3.5 h-3.5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-600">
                  Gerentes:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {shownManagers.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full text-xs border border-amber-200"
                    title={`Gerente: ${m.name}`}
                  >
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-600 text-white text-[10px]">
                      {m.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                    <span className="max-w-[8rem] truncate">{m.name}</span>
                  </span>
                ))}
                {extraManagers > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-xs border border-amber-200">
                    +{extraManagers}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              <span>Sem gerentes</span>
            </div>
          )}
        </div>

        {/* Regras de subordinados (badges) - Quem esta pessoa gerencia */}
        <div className="mb-3 min-h-[40px]">
          {ruleBadges.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 mb-1">
                <svg
                  className="w-3.5 h-3.5 text-blue-600"
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
                <span className="text-xs font-medium text-gray-600">
                  Subordinados:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {shownRules.map((r, idx) => (
                  <span
                    key={`${r.type}-${idx}`}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border ${
                      r.type === "TEAM"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                    title={
                      r.type === "TEAM"
                        ? `Equipe: ${r.label}`
                        : `Colaborador: ${r.label}`
                    }
                  >
                    {r.type === "TEAM" ? (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    )}
                    <span className="max-w-[9rem] truncate">{r.label}</span>
                  </span>
                ))}
                {extraRules > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full text-xs border border-gray-200">
                    +{extraRules}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg
                className="w-3.5 h-3.5"
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
              <span>Sem subordinados</span>
            </div>
          )}
        </div>
      </div>

      {/* Action: Hierarquias integrado */}
      <div className="pt-2 border-t border-gray-100">
        <button
          onClick={onHierarchy}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-violet-50 text-violet-700 text-sm font-medium hover:bg-violet-100 hover:text-violet-800 transition-all duration-200 border border-violet-200"
          title="Gerenciar hierarquias e subordinados"
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
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span>Hierarquias</span>
        </button>
      </div>

      {/* Click outside handler */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}
