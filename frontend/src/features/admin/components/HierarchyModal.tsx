import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiArrowLeft,
  FiUser,
  FiUsers,
  FiTrash2,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { useAdminManagementRules } from "../../management/hooks/useAdminManagementRules";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAdminTeams } from "../hooks/useAdminTeams";
import type {
  CreateManagementRuleDto,
  ManagementRuleType,
} from "../../management/types";

interface HierarchyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  userPosition?: string;
  allUsers?: Array<{
    id: number;
    name: string;
    email: string;
    isAdmin?: boolean;
  }>;
}

export function HierarchyModal({
  isOpen,
  onClose,
  userId,
  userName,
  allUsers,
}: HierarchyModalProps) {
  // Estados do modal
  const [step, setStep] = useState<"list" | "add">("list");
  const [ruleType, setRuleType] = useState<ManagementRuleType>("INDIVIDUAL");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Hooks para dados
  const { users: apiUsers } = useAdminUsers();
  const users = allUsers || apiUsers;
  const { teams } = useAdminTeams();
  const { rules, loading, removeRule, createRule, reload } =
    useAdminManagementRules({
      managerId: userId,
    });

  // Reset states when modal closes/opens
  useEffect(() => {
    if (isOpen) {
      setStep("list");
      setRuleType("INDIVIDUAL");
      setSelectedTeamIds([]);
      setSelectedPersonIds([]);
      setTeamSearch("");
      setPersonSearch("");
      setError(null);
      setConfirmDelete(null);
      setCreating(false);
    }
  }, [isOpen]);

  // Handlers
  const handleClose = () => {
    onClose();
  };

  const handleGoToAdd = () => {
    setStep("add");
    setError(null);
  };

  const handleBackToList = () => {
    setStep("list");
    setRuleType("INDIVIDUAL");
    setSelectedTeamIds([]);
    setSelectedPersonIds([]);
    setTeamSearch("");
    setPersonSearch("");
    setError(null);
  };

  const handleRemoveRule = async (ruleId: number) => {
    try {
      await removeRule(ruleId);
      setConfirmDelete(null);
    } catch (err: any) {
      setError(err.message || "Erro ao remover subordinado");
    }
  };

  const handleSubmitRules = async () => {
    setCreating(true);
    setError(null);

    try {
      const promises: Promise<any>[] = [];

      if (ruleType === "TEAM") {
        for (const teamId of selectedTeamIds) {
          const rule: CreateManagementRuleDto = {
            ruleType: "TEAM",
            teamId,
          };
          promises.push(createRule(rule, userId));
        }
      } else {
        for (const subordinateId of selectedPersonIds) {
          const rule: CreateManagementRuleDto = {
            ruleType: "INDIVIDUAL",
            subordinateId,
          };
          promises.push(createRule(rule, subordinateId));
        }
      }

      await Promise.all(promises);
      await reload();
      handleBackToList();
    } catch (err: any) {
      setError(err.message || "Erro ao criar regras");
    } finally {
      setCreating(false);
    }
  };

  // Filtros
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredUsersForAdd = users.filter(
    (user) =>
      user.id !== userId && // Não pode se gerenciar
      (user.name.toLowerCase().includes(personSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(personSearch.toLowerCase()))
  );

  // Separar regras
  const teamRules = rules.filter((r) => r.ruleType === "TEAM");
  const individualRules = rules.filter((r) => r.ruleType === "INDIVIDUAL");

  // Gerar iniciais do usuário
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
          {/* Header Fixo */}
          <div className="flex items-center justify-between p-6 border-b border-surface-300 bg-gradient-to-r from-indigo-50 to-surface-50">
            <div className="flex items-center gap-4">
              {step === "add" && (
                <button
                  onClick={handleBackToList}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-semibold shadow-md border border-surface-300/60">
                {userInitials}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {step === "list"
                    ? "Gerenciar Hierarquias"
                    : "Adicionar Subordinado"}
                </h2>
                <p className="text-sm text-gray-600">
                  {step === "list"
                    ? `Configure subordinados de ${userName}`
                    : `Adicionando para: ${userName}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-surface-100 rounded-lg transition-colors focus:ring-2 focus:ring-indigo-400"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {error && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-600">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : step === "list" ? (
              /* STEP 1: Lista de Subordinados */
              <div className="space-y-4">
                {rules.length === 0 ? (
                  <div className="text-center py-12 bg-surface-50 rounded-2xl border-2 border-dashed border-surface-200">
                    <div className="w-16 h-16 bg-surface-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiUsers className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
                      Nenhum subordinado configurado
                    </h4>
                    <p className="text-gray-600 mb-6 text-sm">
                      {userName} ainda não gerencia ninguém diretamente
                    </p>
                    <button
                      onClick={handleGoToAdd}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-indigo-400"
                    >
                      <FiPlus className="w-4 h-4" />
                      Adicionar Primeiro Subordinado
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Lista de subordinados */}
                    <div className="space-y-3">
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
                            className="bg-white rounded-xl border border-surface-300 p-4 hover:shadow-md hover:border-surface-200 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                  {initials}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-900">
                                      {subordinate?.name ||
                                        "Nome não encontrado"}
                                    </h4>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-brand-50 text-brand-700 rounded-full text-xs font-medium">
                                      <FiUser className="w-3 h-3" />
                                      Individual
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {subordinate?.email ||
                                      "Email não encontrado"}
                                  </p>
                                </div>
                              </div>
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
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              )}
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
                            className="bg-white rounded-xl border border-surface-300 p-4 hover:shadow-md hover:border-surface-200 transition-all duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-success-500 to-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm">
                                  <FiUsers className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-900">
                                      Equipe{" "}
                                      {team?.name || "Nome não encontrado"}
                                    </h4>
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 text-success-700 rounded-full text-xs font-medium">
                                      <FiUsers className="w-3 h-3" />
                                      Equipe
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Gerencia toda a equipe
                                  </p>
                                </div>
                              </div>
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
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Botão Adicionar */}
                    <div className="pt-4">
                      <button
                        onClick={handleGoToAdd}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl px-6 py-3 text-sm font-medium hover:opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl focus:ring-2 focus:ring-indigo-400"
                      >
                        <FiPlus className="w-4 h-4" />
                        Adicionar Subordinado
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* STEP 2: Adicionar Subordinado */
              <div className="space-y-6">
                {/* Tipo de Subordinação */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tipo de Subordinação
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
                          <div className="font-semibold">Individual</div>
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
                          <div className="font-semibold">Por Equipe</div>
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
                      Selecionar Equipes
                    </label>
                    <div className="relative mb-4">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Buscar equipes..."
                        value={teamSearch}
                        onChange={(e) => setTeamSearch(e.target.value)}
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
                            checked={selectedTeamIds.includes(team.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedTeamIds([
                                  ...selectedTeamIds,
                                  team.id,
                                ]);
                              } else {
                                setSelectedTeamIds(
                                  selectedTeamIds.filter((id) => id !== team.id)
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
                                {team.description || "Equipe organizacional"}
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
                        placeholder="Buscar pessoas..."
                        value={personSearch}
                        onChange={(e) => setPersonSearch(e.target.value)}
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
                            checked={selectedPersonIds.includes(user.id)}
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
                              {user.email}
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
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-violet-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm font-medium text-gray-700">
              {step === "list" ? (
                `${rules.length} subordinado(s) configurado(s)`
              ) : ruleType === "TEAM" ? (
                <span className="inline-flex items-center gap-1">
                  <FiUsers className="w-4 h-4 text-green-600" />
                  {selectedTeamIds.length} equipe(s) selecionada(s)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <FiUser className="w-4 h-4 text-blue-600" />
                  {selectedPersonIds.length} pessoa(s) selecionada(s)
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {step === "list" ? (
                <button
                  onClick={handleClose}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                >
                  Fechar
                </button>
              ) : (
                <>
                  <button
                    onClick={handleBackToList}
                    className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmitRules}
                    disabled={
                      creating ||
                      (ruleType === "TEAM"
                        ? selectedTeamIds.length === 0
                        : selectedPersonIds.length === 0)
                    }
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-400 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:ring-2 focus:ring-indigo-400"
                  >
                    {creating ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Criando...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">Confirmar</span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
