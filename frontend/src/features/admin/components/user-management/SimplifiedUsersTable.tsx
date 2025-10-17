import { useState } from "react";
import { FiTrash2, FiUsers, FiMail } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { AdminUser } from "@/features/admin/types";
import { ChangePasswordModal } from "@/features/admin/components/modals";

interface Props {
  users: AdminUser[];
  filtered: AdminUser[];
  loading: boolean;
  error: string | null;
  onRemove: (id: number) => Promise<void> | void;
  onChangePassword: (
    userId: number,
    newPassword?: string
  ) => Promise<{ success: boolean; generatedPassword?: string }>;
}

export function SimplifiedUsersTable({
  users,
  filtered,
  loading,
  error,
  onRemove,
  onChangePassword,
}: Props) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [changePasswordUser, setChangePasswordUser] =
    useState<AdminUser | null>(null);

  const handleCardClick = (userId: number) => {
    navigate(`/admin/users/${userId}`);
  };

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
          const managersCount =
            user.managers?.filter((m) => m.id !== user.id).length || 0;
          const subordinatesCount = users.filter(
            (u) => u.managers?.some((m) => m.id === user.id) && u.id !== user.id
          ).length;
          // Exemplo de dados expandidos

          return (
            <div
              key={user.id}
              className="group relative bg-surface-50 rounded-2xl border border-surface-300 shadow-sm p-5 hover:scale-[1.02] hover:shadow-lg hover:border-violet-400 transition-all duration-150 cursor-pointer"
              onClick={() => handleCardClick(user.id)}
            >
              {/* Botão deletar no top right */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDelete(user.id);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                title="Remover usuário"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>

              {/* Avatar, nome, papel e status */}
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-violet-100 text-violet-700 text-lg font-bold flex items-center justify-center shadow-sm border border-violet-200">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-base truncate mb-0.5">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                    <FiMail className="w-3 h-3" />
                    {user.email}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-surface-200 text-gray-600">
                      {status}
                    </span>
                    {/* <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {equipe}
                    </span> */}
                  </div>
                </div>
              </div>

              {/* Informações secundárias */}
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mb-2">
                <div>
                  <span className="text-gray-500">Cargo:</span>
                  <span className="ml-1 font-medium">
                    {user.position || "-"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Entrada:</span>
                  {/* <span className="ml-1 font-medium">{entrada}</span> */}
                </div>
              </div>
              {(managersCount > 0 || subordinatesCount > 0) && (
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <FiUsers className="w-3 h-3" />
                  <span>
                    {managersCount > 0 &&
                      `${managersCount} gerente${managersCount > 1 ? "s" : ""}`}
                    {managersCount > 0 && subordinatesCount > 0 && ", "}
                    {subordinatesCount > 0 &&
                      `${subordinatesCount} subordinado${
                        subordinatesCount > 1 ? "s" : ""
                      }`}
                  </span>
                </div>
              )}

              {/* Indicador visual no hover */}
              <div className="absolute inset-0 rounded-2xl bg-violet-50 opacity-0 group-hover:opacity-40 transition-opacity pointer-events-none" />
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

      {/* Modal de confirmação de delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirmar exclusão
            </h3>
            <p className="text-gray-600 mb-4">
              Tem certeza que deseja remover este usuário? Esta ação não pode
              ser desfeita.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await onRemove(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <ChangePasswordModal
        user={changePasswordUser}
        isOpen={!!changePasswordUser}
        onClose={() => setChangePasswordUser(null)}
        onChangePassword={onChangePassword}
      />
    </>
  );
}
