import { useState } from "react";
import { useAdminUsers } from "@/features/admin";
import { OnboardingModal } from "@/features/admin/components/onboarding";
import { EnhancedUsersToolbar } from "./EnhancedUsersToolbar";
import { HierarchyModal } from "@/features/admin/components/hierarchy";
import { ModernPersonCard } from "@/features/admin/components/cards";
import {
  EditUserModal,
  ChangePasswordModal,
} from "@/features/admin/components/modals";
import type { AdminUser } from "@/features/admin/types";

export function WorkflowPeopleTab() {
  const {
    users,
    loading,
    error,
    removeUser: deleteUser,
    changePassword,
    updateUser,
    toggleAdmin,
    refresh,
  } = useAdminUsers();

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingUsers, setOnboardingUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [selectedUserForHierarchy, setSelectedUserForHierarchy] =
    useState<AdminUser | null>(null);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] =
    useState<AdminUser | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] =
    useState<AdminUser | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Quando clicar em "Adicionar Pessoa", abre o modal de onboarding
  // com uma lista vazia (para criar nova pessoa)
  const handleAddPerson = () => {
    setOnboardingUsers([]); // Lista vazia indica criação de nova pessoa
    setShowOnboardingModal(true);
  };

  // Função para abrir o modal de hierarquias
  const handleOpenHierarchyModal = (user: AdminUser) => {
    setSelectedUserForHierarchy(user);
    setShowHierarchyModal(true);
  };

  // Função simples para fechar o modal
  const handleCloseHierarchyModal = async () => {
    setSelectedUserForHierarchy(null);
    setShowHierarchyModal(false);
    // Atualiza a lista de usuários para refletir as mudanças na hierarquia
    await refresh();
  };

  // Função para abrir o modal de edição
  const handleOpenEditModal = (user: AdminUser) => {
    setSelectedUserForEdit(user);
    setShowEditModal(true);
  };

  // Função para fechar o modal de edição
  const handleCloseEditModal = () => {
    setSelectedUserForEdit(null);
    setShowEditModal(false);
  };

  // Função para abrir o modal de senha
  const handleOpenPasswordModal = (user: AdminUser) => {
    setSelectedUserForPassword(user);
    setShowPasswordModal(true);
  };

  // Função para fechar o modal de senha
  const handleClosePasswordModal = () => {
    setSelectedUserForPassword(null);
    setShowPasswordModal(false);
  };

  // Filtrar usuários baseado na pesquisa e filtros
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      query.trim() === "" ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && user.isAdmin === true) ||
      (roleFilter === "user" && user.isAdmin !== true);

    return matchesQuery && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Seção Unificada: Gestão de Pessoas + Hierarquias */}
      <section className="rounded-2xl border border-surface-300 bg-white shadow-sm p-5">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium text-gray-800 flex items-center gap-2">
            <span className="h-9 w-9 inline-flex items-center justify-center rounded-lg bg-violet-50 text-violet-600 border border-surface-300/60">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </span>
            Gestão de Pessoas
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddPerson}
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 text-white font-medium text-sm h-10 px-4 transition hover:opacity-90 focus:ring-2 focus:ring-violet-400 disabled:opacity-60"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Adicionar Pessoa
            </button>
          </div>
        </header>

        <p className="text-sm text-gray-600 mb-4">
          Gerencie colaboradores e configure relações de hierarquia. Clique em
          "Hierarquias" para definir subordinados de cada pessoa.
        </p>

        {/* Filtros e Busca */}
        <div className="mb-4">
          <EnhancedUsersToolbar
            query={query}
            setQuery={setQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            totalUsers={users.length}
            filteredCount={filteredUsers.length}
          />
        </div>

        {/* Cards de Pessoas - Grid de 3 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            // Skeleton Loading State
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-surface-200/60 bg-gradient-to-r from-white to-surface-50/50 p-5 shadow-sm"
                >
                  {/* Header skeleton */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Avatar skeleton */}
                      <div className="w-12 h-12 bg-surface-200 rounded-xl"></div>
                      <div className="space-y-2">
                        {/* Name skeleton */}
                        <div className="h-4 bg-surface-200 rounded w-32"></div>
                        {/* Position skeleton */}
                        <div className="h-3 bg-surface-200 rounded w-24"></div>
                      </div>
                    </div>
                    {/* Menu skeleton */}
                    <div className="w-8 h-8 bg-surface-200 rounded-lg"></div>
                  </div>

                  {/* Email skeleton */}
                  <div className="mb-4">
                    <div className="h-3 bg-surface-200 rounded w-48"></div>
                  </div>

                  {/* Stats skeleton */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="h-12 bg-surface-200 rounded-lg"></div>
                    <div className="h-12 bg-surface-200 rounded-lg"></div>
                  </div>

                  {/* Footer skeleton */}
                  <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                    <div className="h-3 bg-surface-200 rounded w-20"></div>
                    <div className="h-6 bg-surface-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>Erro ao carregar pessoas: {error}</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhuma pessoa encontrada</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <ModernPersonCard
                key={user.id}
                user={user}
                allUsers={users}
                onEdit={() => handleOpenEditModal(user)}
                onHierarchy={() => handleOpenHierarchyModal(user)}
                onChangePassword={() => handleOpenPasswordModal(user)}
                onRemove={() => deleteUser(user.id)}
                onToggleAdmin={(isAdmin) => toggleAdmin(user.id, isAdmin)}
              />
            ))
          )}
        </div>
      </section>

      {/* Modals */}
      <OnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        users={onboardingUsers}
        allUsers={users}
        onUserCreated={() => {
          // Recarregar lista de usuários
          refresh();
        }}
      />

      {/* Modal de Edição */}
      {selectedUserForEdit && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          user={selectedUserForEdit}
          onUpdate={updateUser}
        />
      )}

      {/* Modal de Senha */}
      {selectedUserForPassword && (
        <ChangePasswordModal
          user={selectedUserForPassword}
          isOpen={showPasswordModal}
          onClose={handleClosePasswordModal}
          onChangePassword={changePassword}
        />
      )}

      {/* Modal de Hierarquias - Novo Modal Limpo */}
      {selectedUserForHierarchy && (
        <HierarchyModal
          isOpen={showHierarchyModal}
          onClose={handleCloseHierarchyModal}
          userId={selectedUserForHierarchy.id}
          userName={selectedUserForHierarchy.name}
          userPosition="Colaborador"
          allUsers={users}
        />
      )}
    </div>
  );
}
