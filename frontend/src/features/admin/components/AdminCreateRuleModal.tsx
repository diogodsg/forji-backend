import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiUser, FiUsers, FiSearch } from "react-icons/fi";
import { useAdminManagementRules } from "../../management/hooks/useAdminManagementRules";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { useAdminTeams } from "../hooks/useAdminTeams";
import type {
  CreateManagementRuleDto,
  ManagementRuleType,
} from "../../management/types";

interface AdminCreateRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetManagerId: number;
  managerName: string;
}

export function AdminCreateRuleModal({
  isOpen,
  onClose,
  targetManagerId,
  managerName,
}: AdminCreateRuleModalProps) {
  const [ruleType, setRuleType] = useState<ManagementRuleType>("TEAM");
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([]);
  const [selectedPersonIds, setSelectedPersonIds] = useState<number[]>([]);
  const [teamSearch, setTeamSearch] = useState("");
  const [personSearch, setPersonSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createRule, reload } = useAdminManagementRules({
    managerId: targetManagerId,
  });
  const { users } = useAdminUsers();
  const { teams } = useAdminTeams();

  // Reset form quando modal fecha/abre
  useEffect(() => {
    if (!isOpen) {
      setRuleType("TEAM");
      setSelectedTeamIds([]);
      setSelectedPersonIds([]);
      setTeamSearch("");
      setPersonSearch("");
      setError(null);
      setCreating(false);
    }
  }, [isOpen]);

  const filteredTeams = teams.filter((team: any) =>
    team.name.toLowerCase().includes(teamSearch.toLowerCase())
  );

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(personSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(personSearch.toLowerCase())
    )
    .filter((user) => user.id !== targetManagerId); // Excluir o próprio manager

  const handleSubmit = async () => {
    setError(null);
    setCreating(true);

    try {
      const promises: Promise<void>[] = [];

      if (ruleType === "TEAM") {
        for (const teamId of selectedTeamIds) {
          const rule: CreateManagementRuleDto = {
            ruleType: "TEAM",
            teamId,
          };
          promises.push(createRule(rule, targetManagerId));
        }
      } else {
        for (const subordinateId of selectedPersonIds) {
          const rule: CreateManagementRuleDto = {
            ruleType: "INDIVIDUAL",
            subordinateId,
          };
          promises.push(createRule(rule, targetManagerId));
        }
      }

      await Promise.all(promises);
      await reload();
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao criar regras");
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                ➕ Adicionar Subordinado
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Configurando hierarquia para:{" "}
                <strong className="text-violet-700">{managerName}</strong>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Rule Type Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🎯 Tipo de Subordinação
              </label>
              <div className="grid grid-cols-2 gap-4">
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
                        ruleType === "TEAM" ? "bg-violet-100" : "bg-gray-100"
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
              </div>
            </div>

            {/* Team Selection */}
            {ruleType === "TEAM" && (
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
                            setSelectedTeamIds([...selectedTeamIds, team.id]);
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
            )}

            {/* Person Selection */}
            {ruleType === "INDIVIDUAL" && (
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
                    onChange={(e) => setPersonSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  />
                </div>

                <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto bg-gray-50">
                  {filteredUsers.map((user) => (
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
                              selectedPersonIds.filter((id) => id !== user.id)
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
                  {filteredUsers.length === 0 && (
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
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
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
        </div>
      </div>
    </div>,
    document.body
  );
}
