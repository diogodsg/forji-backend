import { useState } from "react";
import { useAdminUsers } from "@/features/admin";
import { OnboardingModal } from "@/features/admin/components/onboarding";
import { EnhancedUsersToolbar } from "./EnhancedUsersToolbar";
import { HierarchyModal } from "@/features/admin/components/hierarchy";
import { ModernPersonCard } from "@/features/admin/components/cards";
import type { AdminUser } from "@/features/admin/types";
import { getMockUsers } from "@/features/admin/data/mockData";

export function WorkflowPeopleTab() {
  // Temporariamente usando dados mock
  const mockUsers = getMockUsers();
  const { error, removeUser: deleteUser, changePassword } = useAdminUsers();

  // FORÇANDO uso dos dados mock para desenvolvimento
  const users = mockUsers;

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [onboardingUsers, setOnboardingUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");
  const [selectedUserForHierarchy, setSelectedUserForHierarchy] =
    useState<AdminUser | null>(null);
  const [showHierarchyModal, setShowHierarchyModal] = useState(false);

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
  const handleCloseHierarchyModal = () => {
    setSelectedUserForHierarchy(null);
    setShowHierarchyModal(false);
  };

  // Filtrar usuários baseado na pesquisa e filtros
  const filteredUsers = users.filter((user) => {
    const matchesQuery =
      query.trim() === "" ||
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "admin" && user.isAdmin) ||
      (roleFilter === "user" && !user.isAdmin);

    return matchesQuery && matchesRole;
  });

  // Debug: verificar dados
  console.log("Mock users count:", mockUsers.length);
  console.log("Filtered users count:", filteredUsers.length);
  console.log("First mock user:", mockUsers[0]);

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
          {false ? ( // Temporariamente forçado como false para mostrar mock
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
              <p className="mt-2 text-gray-500">Carregando pessoas...</p>
            </div>
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
                onEdit={() => {
                  /* TODO: Implementar edição */
                }}
                onHierarchy={() => handleOpenHierarchyModal(user)}
                onChangePassword={() => changePassword(user.id)}
                onRemove={() => deleteUser(user.id)}
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
      />

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
