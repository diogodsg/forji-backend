import { useState } from "react";
import { FiShield, FiGithub, FiTrash2, FiKey } from "react-icons/fi";
import type { AdminUser } from "../types";
import { UserQuickView } from "./UserQuickView";
import { ChangePasswordModal } from "./ChangePasswordModal";

interface Props {
  users: AdminUser[];
  filtered: AdminUser[];
  loading: boolean;
  error: string | null;
  onRemove: (id: number) => Promise<void> | void;
  onChangePassword: (userId: number, newPassword?: string) => Promise<{ success: boolean; generatedPassword?: string }>;
}

export function SimplifiedUsersTable({
  users,
  filtered,
  loading,
  error,
  onRemove,
  onChangePassword,
}: Props) {
  const [quickViewUser, setQuickViewUser] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [changePasswordUser, setChangePasswordUser] = useState<AdminUser | null>(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white/90 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-4"
          >
            <div className="animate-pulse">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="flex gap-1 mb-2">
                    <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-200 rounded-full w-12"></div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                    <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="bg-white/90 backdrop-blur border border-surface-300/70 shadow-sm rounded-xl p-4 hover:shadow-lg hover:border-surface-400/70 transition-all duration-200 group cursor-pointer"
              onClick={() => setQuickViewUser(user)}
            >
              <div className="flex flex-col h-full">
                {/* Header com avatar e badges */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0 shadow-md">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                      {user.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {user.isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                          <FiShield className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                      {user.githubId && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          <FiGithub className="w-3 h-3" />@{user.githubId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informações principais */}
                <div className="flex-1 space-y-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                      Email
                    </p>
                    <p
                      className="text-sm text-gray-700 truncate"
                      title={user.email}
                    >
                      {user.email}
                    </p>
                  </div>

                  {(user as any).position && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                        Cargo
                      </p>
                      <p className="text-sm text-gray-700 font-medium">
                        {(user as any).position}
                      </p>
                    </div>
                  )}

                  {(managersCount > 0 || subordinatesCount > 0) && (
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">
                        Hierarquia
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {managersCount > 0 && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            {managersCount} gerente
                            {managersCount > 1 ? "s" : ""}
                          </span>
                        )}
                        {subordinatesCount > 0 && (
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            {subordinatesCount} subordinado
                            {subordinatesCount > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer com ações */}
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {confirmDelete === user.id ? (
                      <div
                        className="flex items-center gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            onRemove(user.id);
                            setConfirmDelete(null);
                          }}
                          className="px-3 py-1.5 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-3 py-1.5 text-xs bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setChangePasswordUser(user);
                          }}
                          className="p-2 rounded-lg border border-surface-300 bg-white text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                          title="Alterar senha"
                        >
                          <FiKey className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDelete(user.id);
                          }}
                          className="p-2 rounded-lg border border-surface-300 bg-white text-rose-600 hover:bg-rose-50 hover:border-rose-300 transition-colors"
                          title="Remover usuário"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-xl p-8">
            <p className="text-gray-500 text-lg mb-2">
              Nenhum usuário encontrado
            </p>
            <p className="text-gray-400 text-sm">
              Tente ajustar os filtros de busca
            </p>
          </div>
        </div>
      )}

      <UserQuickView
        user={quickViewUser}
        isOpen={!!quickViewUser}
        onClose={() => setQuickViewUser(null)}
        allUsers={users}
      />

      <ChangePasswordModal
        user={changePasswordUser}
        isOpen={!!changePasswordUser}
        onClose={() => setChangePasswordUser(null)}
        onChangePassword={onChangePassword}
      />
    </>
  );
}
