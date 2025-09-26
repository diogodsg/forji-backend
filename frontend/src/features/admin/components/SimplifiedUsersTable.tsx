import { useState } from "react";
import { FiShield, FiGithub, FiTrash2 } from "react-icons/fi";
import type { AdminUser } from "../types";
import { UserQuickView } from "./UserQuickView";

interface Props {
  users: AdminUser[];
  filtered: AdminUser[];
  loading: boolean;
  error: string | null;
  onRemove: (id: number) => Promise<void> | void;
}

export function SimplifiedUsersTable({
  users,
  filtered,
  loading,
  error,
  onRemove,
}: Props) {
  const [quickViewUser, setQuickViewUser] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-4"
          >
            <div className="animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-48"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
        <p className="text-rose-700 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {filtered.map((user) => {
          const managersCount = user.managers.filter(
            (m) => m.id !== user.id
          ).length;
          const subordinatesCount = users.filter(
            (u) => u.managers.some((m) => m.id === user.id) && u.id !== user.id
          ).length;

          return (
            <div
              key={user.id}
              className="bg-white/80 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-4 hover:shadow-md transition-all duration-200 group cursor-pointer"
              onClick={() => setQuickViewUser(user)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      {user.isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 flex-shrink-0">
                          <FiShield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {user.githubId && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                          <FiGithub className="w-3 h-3" />@{user.githubId}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {user.email}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span>ID: {user.id}</span>
                      {managersCount > 0 && (
                        <span>
                          {managersCount} gerente{managersCount > 1 ? "s" : ""}
                        </span>
                      )}
                      {subordinatesCount > 0 && (
                        <span>
                          {subordinatesCount} subordinado
                          {subordinatesCount > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {confirmDelete === user.id ? (
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          onRemove(user.id);
                          setConfirmDelete(null);
                        }}
                        className="px-2 py-1 text-xs bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(user.id);
                      }}
                      className="p-2 rounded-lg border border-surface-300 bg-white text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remover usuário"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum usuário encontrado</p>
        </div>
      )}

      <UserQuickView
        user={quickViewUser}
        isOpen={!!quickViewUser}
        onClose={() => setQuickViewUser(null)}
        allUsers={users}
      />
    </>
  );
}
