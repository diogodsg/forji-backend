import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiUsers, FiUser, FiCheck, FiAlertCircle } from "react-icons/fi";
import { useManagementRules } from "../hooks/useManagementRules";
import { api } from "@/lib/apiClient";
import { useAuth } from "@/features/auth";
import type { CreateManagementRuleDto, ManagementRuleType } from "../types";

interface Team {
  id: number;
  name: string;
  description?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRuleModal({ isOpen, onClose }: Props) {
  const { user } = useAuth();
  const { rules: existingRules, createRule, reload } = useManagementRules();
  const [ruleType, setRuleType] = useState<ManagementRuleType>("TEAM");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Carregar teams e users quando modal abre
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teamsData, usersData] = await Promise.all([
        api<Team[]>("/teams", { auth: true }),
        api<User[]>("/users", { auth: true }),
      ]);
      setTeams(teamsData);
      setUsers(usersData);
    } catch (err: any) {
      setError("Erro ao carregar dados: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedIds = ruleType === "TEAM" ? selectedTeamIds : selectedUserIds;

    if (selectedIds.length === 0) {
      setError(
        ruleType === "TEAM"
          ? "Selecione pelo menos uma equipe"
          : "Selecione pelo menos um usuário"
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Criar múltiplas regras em paralelo
      const createPromises = selectedIds.map((id) => {
        const rule: CreateManagementRuleDto = {
          ruleType,
          managerId: user?.id || "",
          teamId: ruleType === "TEAM" ? String(id) : undefined,
          subordinateId: ruleType === "INDIVIDUAL" ? String(id) : undefined,
        };
        return createRule(rule);
      });

      await Promise.all(createPromises);
      await reload(); // Recarregar regras para atualizar indicadores
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Erro ao criar regras");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRuleType("TEAM");
    setSelectedTeamIds([]);
    setSelectedUserIds([]);
    setSearchTerm("");
    setError(null);
  };

  // Funções para gerenciar seleção múltipla
  const toggleTeamSelection = (teamId: number) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllTeams = () => {
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !isTeamInRule(team.id) // Excluir equipes já em regras
    );
    setSelectedTeamIds(filtered.map((team) => team.id));
  };

  const clearAllTeams = () => {
    setSelectedTeamIds([]);
  };

  const selectAllUsers = () => {
    const filtered = users.filter(
      (user) =>
        (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !isUserInRule(user.id) // Excluir usuários já em regras
    );
    setSelectedUserIds(filtered.map((user) => user.id));
  };

  const clearAllUsers = () => {
    setSelectedUserIds([]);
  };

  // Contar quantos itens estão disponíveis vs já em regras
  const getAvailableCounts = () => {
    if (ruleType === "TEAM") {
      const total = filteredTeams.length;
      const inRules = filteredTeams.filter((team) =>
        isTeamInRule(team.id)
      ).length;
      return { total, inRules, available: total - inRules };
    } else {
      const total = filteredUsers.length;
      const inRules = filteredUsers.filter((user) =>
        isUserInRule(user.id)
      ).length;
      return { total, inRules, available: total - inRules };
    }
  };

  // Verificar se equipe/usuário já está em regra existente
  const isTeamInRule = (teamId: number) => {
    return existingRules.some(
      (rule) => rule.ruleType === "TEAM" && rule.teamId === String(teamId)
    );
  };

  const isUserInRule = (userId: number) => {
    return existingRules.some(
      (rule) =>
        rule.ruleType === "INDIVIDUAL" && rule.subordinateId === String(userId)
    );
  };

  // Filtrar dados baseado na busca
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClose = () => {
    setRuleType("TEAM");
    setSelectedTeamIds([]);
    setSelectedUserIds([]);
    setSearchTerm("");
    setError(null);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Nova Regra de Gerenciamento
                    </Dialog.Title>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>

                  {existingRules.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <FiAlertCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Regras Existentes: {existingRules.length}
                        </span>
                      </div>
                      <div className="text-xs text-blue-700">
                        •{" "}
                        {
                          existingRules.filter((r) => r.ruleType === "TEAM")
                            .length
                        }{" "}
                        equipe(s) já gerenciada(s) •{" "}
                        {
                          existingRules.filter(
                            (r) => r.ruleType === "INDIVIDUAL"
                          ).length
                        }{" "}
                        pessoa(s) já gerenciada(s)
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rule Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Regra
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRuleType("TEAM")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          ruleType === "TEAM"
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <FiUsers className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">Por Equipe</div>
                        <div className="text-xs">Gerenciar equipe inteira</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRuleType("INDIVIDUAL")}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          ruleType === "INDIVIDUAL"
                            ? "border-purple-500 bg-purple-50 text-purple-700"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        <FiUser className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm font-medium">Individual</div>
                        <div className="text-xs">
                          Gerenciar pessoa específica
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Search and Selection */}
                  {(ruleType === "TEAM" || ruleType === "INDIVIDUAL") && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          {ruleType === "TEAM"
                            ? "Selecionar Equipes"
                            : "Selecionar Usuários"}
                        </label>
                        <div className="text-xs text-gray-500">
                          {ruleType === "TEAM"
                            ? `${selectedTeamIds.length} selecionada(s)`
                            : `${selectedUserIds.length} selecionado(s)`}
                        </div>
                      </div>

                      {/* Search Input */}
                      <input
                        type="text"
                        placeholder={`Buscar ${
                          ruleType === "TEAM" ? "equipes" : "usuários"
                        }...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />

                      {/* Bulk Actions */}
                      <div className="flex gap-2 items-center">
                        <button
                          type="button"
                          onClick={
                            ruleType === "TEAM"
                              ? selectAllTeams
                              : selectAllUsers
                          }
                          disabled={getAvailableCounts().available === 0}
                          className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Selecionar Disponíveis (
                          {getAvailableCounts().available})
                        </button>
                        <button
                          type="button"
                          onClick={
                            ruleType === "TEAM" ? clearAllTeams : clearAllUsers
                          }
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                        >
                          Limpar Seleção
                        </button>
                        {getAvailableCounts().inRules > 0 && (
                          <span className="text-xs text-green-600 ml-2">
                            {getAvailableCounts().inRules} já em regras
                          </span>
                        )}
                      </div>

                      {/* Selection List */}
                      {loading ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="animate-pulse h-10 bg-gray-200 rounded-lg"
                            ></div>
                          ))}
                        </div>
                      ) : (
                        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg">
                          {ruleType === "TEAM" ? (
                            filteredTeams.length === 0 ? (
                              <div className="p-3 text-sm text-gray-500 text-center">
                                {searchTerm
                                  ? "Nenhuma equipe encontrada"
                                  : "Nenhuma equipe disponível"}
                              </div>
                            ) : (
                              filteredTeams.map((team) => {
                                const inExistingRule = isTeamInRule(team.id);
                                return (
                                  <label
                                    key={team.id}
                                    className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                      inExistingRule
                                        ? "bg-green-50 hover:bg-green-100"
                                        : "hover:bg-gray-50"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedTeamIds.includes(
                                        team.id
                                      )}
                                      onChange={() =>
                                        toggleTeamSelection(team.id)
                                      }
                                      disabled={inExistingRule}
                                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3 disabled:opacity-50"
                                    />
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <div className="text-sm font-medium text-gray-900">
                                          {team.name}
                                        </div>
                                        {inExistingRule && (
                                          <div className="flex items-center gap-1 text-green-600">
                                            <FiCheck className="w-3 h-3" />
                                            <span className="text-xs font-medium">
                                              Já gerenciada
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      {team.description && (
                                        <div className="text-xs text-gray-500">
                                          {team.description}
                                        </div>
                                      )}
                                    </div>
                                  </label>
                                );
                              })
                            )
                          ) : filteredUsers.length === 0 ? (
                            <div className="p-3 text-sm text-gray-500 text-center">
                              {searchTerm
                                ? "Nenhum usuário encontrado"
                                : "Nenhum usuário disponível"}
                            </div>
                          ) : (
                            filteredUsers.map((user) => {
                              const inExistingRule = isUserInRule(user.id);
                              return (
                                <label
                                  key={user.id}
                                  className={`flex items-center p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                    inExistingRule
                                      ? "bg-green-50 hover:bg-green-100"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedUserIds.includes(user.id)}
                                    onChange={() =>
                                      toggleUserSelection(user.id)
                                    }
                                    disabled={inExistingRule}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3 disabled:opacity-50"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <div className="text-sm font-medium text-gray-900">
                                        {user.name}
                                      </div>
                                      {inExistingRule && (
                                        <div className="flex items-center gap-1 text-green-600">
                                          <FiCheck className="w-3 h-3" />
                                          <span className="text-xs font-medium">
                                            Já gerenciado
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {user.email}
                                    </div>
                                  </div>
                                </label>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        (ruleType === "TEAM"
                          ? selectedTeamIds.length === 0
                          : selectedUserIds.length === 0)
                      }
                      className="flex-1 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading
                        ? "Criando..."
                        : (() => {
                            const count =
                              ruleType === "TEAM"
                                ? selectedTeamIds.length
                                : selectedUserIds.length;
                            return count === 0
                              ? "Criar Regras"
                              : count === 1
                              ? "Criar 1 Regra"
                              : `Criar ${count} Regras`;
                          })()}
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
