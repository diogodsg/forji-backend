import { useState } from "react";
import { createPortal } from "react-dom";
import {
  FiPlus,
  FiUsers,
  FiUser,
  FiTrash2,
  FiArrowLeft,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { useAdminManagementRules } from "@/features/management/hooks/useAdminManagementRules";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { useTeamManagement } from "@/features/admin/hooks/useTeamManagement";
import type {
  CreateManagementRuleDto,
  ManagementRuleType,
} from "@/features/management/types";

interface AdminSubordinatesManagementProps {
  onBack: () => void;
  preselectedUserId?: number;
  hideHeader?: boolean;
  allUsers?: Array<{
    id: number;
    name: string;
    email: string;
    isAdmin?: boolean;
  }>;
}

export function AdminSubordinatesManagement({
  onBack,
  preselectedUserId,
  hideHeader = false,
  allUsers,
}: AdminSubordinatesManagementProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    preselectedUserId || null
  );
  const [userSearch, setUserSearch] = useState("");

  // Admin users hook para listar usuários (fallback se allUsers não for fornecido)
  const { users: apiUsers } = useAdminUsers();
  const users = allUsers || apiUsers;

  // Admin hook - carrega regras do usuário selecionado ou todas
  const { rules, loading, error, removeRule } = useAdminManagementRules({
    managerId: selectedUserId || undefined,
  });

  // Estados para o modal integrado
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalStep, setModalStep] = useState<"main" | "add-subordinate">(
    hideHeader ? "add-subordinate" : "main"
  );
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Estados para adicionar subordinado
  const [ruleType, setRuleType] = useState<ManagementRuleType>("INDIVIDUAL");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Hooks para dados do modal
  const { teams } = useTeamManagement();
  const { createRule, reload } = useAdminManagementRules({
    managerId: selectedUserId || undefined,
  });

  // Filtrar usuários pela busca
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const selectedUser = users.find((u) => u.id === selectedUserId);

  const handleRemoveRule = async (ruleId: number) => {
    try {
      await removeRule(ruleId);
      setConfirmDelete(null);
    } catch (err) {
      // Error already handled by hook
    }
  };

  // Funções para o modal integrado
  const handleCloseModal = () => {
    setShowCreateModal(false);
    setModalStep(hideHeader ? "add-subordinate" : "main");
    setRuleType("INDIVIDUAL");
    setSelectedTeamIds([]);
    setSelectedPersonIds([]);
    setTeamSearch("");
    setPersonSearch("");
    setAddError(null);
    setCreating(false);
  };

  const handleSubmitRules = async () => {
    if (!selectedUser) return;

    setCreating(true);
    setAddError(null);

    try {
      const promises: Promise<any>[] = [];

      if (ruleType === "TEAM") {
        for (const teamId of selectedTeamIds) {
          const rule: CreateManagementRuleDto = {
            ruleType: "TEAM",
            teamId,
          };
          promises.push(createRule(rule, selectedUser.id));
        }
      } else {
        for (const subordinateId of selectedPersonIds) {
          const rule: CreateManagementRuleDto = {
            ruleType: "INDIVIDUAL",
            subordinateId,
          };
          promises.push(createRule(rule, selectedUser.id));
        }
      }

      await Promise.all(promises);
      await reload();
      handleCloseModal();
    } catch (err: any) {
      setAddError(err.message || "Erro ao criar regras");
    } finally {
      setCreating(false);
    }
  };

  // Filtros para busca
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredUsersForAdd = users.filter(
    (user) =>
      user.id !== selectedUserId && // Não pode se gerenciar
      (user.name.toLowerCase().includes(personSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(personSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-40 bg-gray-200 rounded-lg"></div>
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const teamRules = rules.filter((r) => r.ruleType === "TEAM");
  const individualRules = rules.filter((r) => r.ruleType === "INDIVIDUAL");

  return (
    <div className={hideHeader ? "space-y-4" : "space-y-6"}>
      {/* Header - condicional */}
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Gerenciamento de Subordinados
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedUser
                  ? `Configurando subordinados para: ${selectedUser.name}`
                  : "Selecione um usuário para configurar seus subordinados"}
              </p>
            </div>
          </div>
          {selectedUser && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:from-brand-700 hover:to-brand-800 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Nova Regra
            </button>
          )}
        </div>
      )}

      {/* User Selector - só mostra se não tem usuário selecionado E não foi pré-selecionado */}
      {!selectedUser && !preselectedUserId && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Selecionar Usuário
            </h3>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className="p-4 text-left border border-gray-200 rounded-xl hover:border-brand-300 hover:bg-brand-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-brand-700">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    {user.isAdmin && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected User Header - Só mostra se não estiver ocultando header */}
      {selectedUser && !hideHeader && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
              {selectedUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {selectedUser.name}
              </h3>
              <p className="text-gray-600 text-sm">{selectedUser.email}</p>
              {selectedUser.isAdmin && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Subordinates Management - Cards Interface */}
      {selectedUser && (
        <div className="space-y-6">
          {/* Header com botão de adicionar - Só mostra se não for modal */}
          {!hideHeader && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  👥 Subordinados de {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Configure quem {selectedUser.name} gerencia diretamente
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setModalStep("add-subordinate");
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl px-6 py-3 text-sm font-medium hover:from-violet-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-4 h-4" />
                Adicionar Subordinado
              </button>
            </div>
          )}

          {/* Header com botão - Aparece mesmo com hideHeader quando tem usuário selecionado */}
          {selectedUser && hideHeader && (
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  👥 Subordinados de {selectedUser.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Configure quem {selectedUser.name} gerencia diretamente
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setModalStep("add-subordinate");
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl px-6 py-3 text-sm font-medium hover:from-violet-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiPlus className="w-4 h-4" />
                Adicionar Subordinado
              </button>
            </div>
          )}

          {/* Lista de subordinados atuais - Espaçamento design system */}
          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum subordinado configurado
                </h4>
                <p className="text-gray-600 mb-6">
                  {selectedUser.name} ainda não gerencia ninguém diretamente
                </p>
                <button
                  onClick={() => {
                    setShowCreateModal(true);
                    setModalStep("add-subordinate");
                  }}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl px-6 py-3 text-sm font-medium hover:from-violet-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FiPlus className="w-4 h-4" />
                  Adicionar Primeiro Subordinado
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {/* Subordinados individuais */}
                {individualRules.map((rule) => {
                  const subordinate = rule.subordinate;
                  const initials =
                    subordinate?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "??";

                  return (
                    <div
                      key={rule.id}
                      className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            {initials}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                {subordinate?.name || "Nome não encontrado"}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                <FiUser className="w-3 h-3" />
                                Individual
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              📧 {subordinate?.email || "Email não encontrado"}
                            </p>
                            <p className="text-xs text-gray-500">
                              📅 Gerenciado desde{" "}
                              {new Date(rule.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2">
                          {confirmDelete === rule.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemoveRule(rule.id)}
                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(rule.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remover subordinado"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Subordinados por equipe */}
                {teamRules.map((rule) => {
                  const team = rule.team;
                  return (
                    <div
                      key={rule.id}
                      className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          {/* Avatar de equipe */}
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
                            <FiUsers className="w-6 h-6" />
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900">
                                Equipe {team?.name || "Nome não encontrado"}
                              </h4>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <FiUsers className="w-3 h-3" />
                                Equipe
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              👥 Gerencia toda a equipe {team?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              📅 Regra criada em{" "}
                              {new Date(rule.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2">
                          {confirmDelete === rule.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemoveRule(rule.id)}
                                className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirmar
                              </button>
                              <button
                                onClick={() => setConfirmDelete(null)}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDelete(rule.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remover regra de equipe"
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
            )}
          </div>

          {/* Modal Integrado de Hierarquias */}
          {showCreateModal &&
            selectedUser &&
            createPortal(
              <div className="fixed inset-0 z-[99999] overflow-y-auto">
                <div className="flex min-h-screen items-center justify-center p-4">
                  <div
                    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
                    onClick={handleCloseModal}
                  ></div>

                  <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
                    {modalStep === "main" && !hideHeader ? (
                      // Visualização Principal de Hierarquias
                      <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-semibold shadow-md">
                              {selectedUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900">
                                👥 Hierarquias - {selectedUser.name}
                              </h2>
                              <p className="text-sm text-gray-600">
                                Gerencie subordinados diretos
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleCloseModal}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                          <div className="space-y-4">
                            {/* Lista de subordinados atuais */}
                            {rules.length === 0 ? (
                              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <FiUsers className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">
                                  Nenhum subordinado configurado
                                </h4>
                                <p className="text-gray-600 mb-6">
                                  {selectedUser.name} ainda não gerencia ninguém
                                  diretamente
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                {/* Subordinados individuais */}
                                {rules
                                  .filter((r) => r.ruleType === "INDIVIDUAL")
                                  .map((rule) => {
                                    const subordinate = rule.subordinate;
                                    const initials =
                                      subordinate?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2) || "??";

                                    return (
                                      <div
                                        key={rule.id}
                                        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                                              {initials}
                                            </div>
                                            <div>
                                              <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-gray-900">
                                                  {subordinate?.name ||
                                                    "Nome não encontrado"}
                                                </h4>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                  <FiUser className="w-3 h-3" />
                                                  Individual
                                                </span>
                                              </div>
                                              <p className="text-sm text-gray-600">
                                                📧{" "}
                                                {subordinate?.email ||
                                                  "Email não encontrado"}
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() =>
                                              setConfirmDelete(
                                                confirmDelete === rule.id
                                                  ? null
                                                  : rule.id
                                              )
                                            }
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          >
                                            <FiTrash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}

                                {/* Subordinados por equipe */}
                                {rules
                                  .filter((r) => r.ruleType === "TEAM")
                                  .map((rule) => {
                                    const team = rule.team;
                                    return (
                                      <div
                                        key={rule.id}
                                        className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                                              <FiUsers className="w-5 h-5" />
                                            </div>
                                            <div>
                                              <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold text-gray-900">
                                                  Equipe{" "}
                                                  {team?.name ||
                                                    "Nome não encontrado"}
                                                </h4>
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                  <FiUsers className="w-3 h-3" />
                                                  Equipe
                                                </span>
                                              </div>
                                              <p className="text-sm text-gray-600">
                                                👥 Gerencia toda a equipe{" "}
                                                {team?.name}
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() =>
                                              setConfirmDelete(
                                                confirmDelete === rule.id
                                                  ? null
                                                  : rule.id
                                              )
                                            }
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                          >
                                            <FiTrash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-violet-50 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-700">
                            {rules.length} subordinado(s) configurado(s)
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={handleCloseModal}
                              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                            >
                              Fechar
                            </button>
                            <button
                              onClick={() => setModalStep("add-subordinate")}
                              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl hover:from-violet-700 hover:to-purple-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <span className="flex items-center gap-2">
                                <FiPlus className="w-4 h-4" />
                                Adicionar Subordinado
                              </span>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Tela de Adicionar Subordinado
                      <>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                hideHeader
                                  ? handleCloseModal()
                                  : setModalStep("main")
                              }
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
                            >
                              <FiArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                              <h2 className="text-xl font-semibold text-gray-900">
                                ➕ Adicionar Subordinado
                              </h2>
                              <p className="text-sm text-gray-600">
                                Para:{" "}
                                <strong className="text-violet-700">
                                  {selectedUser.name}
                                </strong>
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={handleCloseModal}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                          {addError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-700">{addError}</p>
                            </div>
                          )}

                          {/* Tipo de Subordinação */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              🎯 Tipo de Subordinação
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                type="button"
                                onClick={() => setRuleType("INDIVIDUAL")}
                                className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                                  ruleType === "INDIVIDUAL"
                                    ? "border-violet-500 bg-violet-50 text-violet-700 shadow-lg transform scale-105"
                                    : "border-gray-200 hover:border-violet-300 hover:bg-violet-25"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      ruleType === "INDIVIDUAL"
                                        ? "bg-violet-100"
                                        : "bg-gray-100"
                                    }`}
                                  >
                                    <FiUser className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      Individual
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Gerenciar pessoas específicas
                                    </div>
                                  </div>
                                </div>
                              </button>

                              <button
                                type="button"
                                onClick={() => setRuleType("TEAM")}
                                className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                                  ruleType === "TEAM"
                                    ? "border-violet-500 bg-violet-50 text-violet-700 shadow-lg transform scale-105"
                                    : "border-gray-200 hover:border-violet-300 hover:bg-violet-25"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`p-2 rounded-lg ${
                                      ruleType === "TEAM"
                                        ? "bg-violet-100"
                                        : "bg-gray-100"
                                    }`}
                                  >
                                    <FiUsers className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      Por Equipe
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Gerenciar todos os membros de uma equipe
                                    </div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Seleção baseada no tipo */}
                          {ruleType === "TEAM" ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                👥 Selecionar Equipes
                              </label>
                              <div className="relative mb-4">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="text"
                                  placeholder="🔍 Buscar equipes..."
                                  value={teamSearch}
                                  onChange={(e) =>
                                    setTeamSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                />
                              </div>
                              <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-gray-50">
                                {filteredTeams.map((team) => (
                                  <label
                                    key={team.id}
                                    className="flex items-center gap-3 p-4 hover:bg-violet-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedTeamIds.includes(
                                        team.id
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedTeamIds([
                                            ...selectedTeamIds,
                                            team.id,
                                          ]);
                                        } else {
                                          setSelectedTeamIds(
                                            selectedTeamIds.filter(
                                              (id) => id !== team.id
                                            )
                                          );
                                        }
                                      }}
                                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
                                    />
                                    <div className="flex items-center gap-3 flex-1">
                                      <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                                        <FiUsers className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <div className="font-semibold text-gray-900">
                                          {team.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {team.description ||
                                            "Equipe organizacional"}
                                        </div>
                                      </div>
                                    </div>
                                  </label>
                                ))}
                                {filteredTeams.length === 0 && (
                                  <div className="p-4 text-center text-gray-500">
                                    Nenhuma equipe encontrada
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                👤 Selecionar Pessoas
                              </label>
                              <div className="relative mb-4">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                  type="text"
                                  placeholder="🔍 Buscar pessoas..."
                                  value={personSearch}
                                  onChange={(e) =>
                                    setPersonSearch(e.target.value)
                                  }
                                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                                />
                              </div>
                              <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-gray-50">
                                {filteredUsersForAdd.map((user) => (
                                  <label
                                    key={user.id}
                                    className="flex items-center gap-3 p-4 hover:bg-violet-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedPersonIds.includes(
                                        user.id
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedPersonIds([
                                            ...selectedPersonIds,
                                            user.id,
                                          ]);
                                        } else {
                                          setSelectedPersonIds(
                                            selectedPersonIds.filter(
                                              (id) => id !== user.id
                                            )
                                          );
                                        }
                                      }}
                                      className="rounded border-gray-300 text-violet-600 focus:ring-violet-500 w-4 h-4"
                                    />
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                                      {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900">
                                        {user.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        📧 {user.email}
                                      </div>
                                    </div>
                                  </label>
                                ))}
                                {filteredUsersForAdd.length === 0 && (
                                  <div className="p-4 text-center text-gray-500">
                                    Nenhuma pessoa encontrada
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-violet-50 border-t border-gray-200 flex items-center justify-between">
                          <div className="text-sm font-medium text-gray-700">
                            {ruleType === "TEAM" ? (
                              <span className="inline-flex items-center gap-1">
                                <FiUsers className="w-4 h-4 text-green-600" />
                                {selectedTeamIds.length} equipe(s)
                                selecionada(s)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <FiUser className="w-4 h-4 text-blue-600" />
                                {selectedPersonIds.length} pessoa(s)
                                selecionada(s)
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                hideHeader
                                  ? handleCloseModal()
                                  : setModalStep("main")
                              }
                              className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                            >
                              {hideHeader ? "Cancelar" : "Voltar"}
                            </button>
                            <button
                              onClick={handleSubmitRules}
                              disabled={
                                creating ||
                                (ruleType === "TEAM"
                                  ? selectedTeamIds.length === 0
                                  : selectedPersonIds.length === 0)
                              }
                              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white rounded-xl hover:from-violet-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              {creating ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  Criando...
                                </span>
                              ) : (
                                <span className="flex items-center gap-2">
                                  ✨ Criar Subordinação
                                </span>
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>
      )}
    </div>
  );
}
