import { useState, useEffect } from "react";
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        ></div>

        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Nova Regra de Gerenciamento
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Configurando subordinados para: <strong>{managerName}</strong>
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
                Tipo de Regra
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRuleType("TEAM")}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    ruleType === "TEAM"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiUsers className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Por Equipe</div>
                      <div className="text-sm text-gray-500">
                        Gerenciar todos os membros de uma equipe
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRuleType("INDIVIDUAL")}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    ruleType === "INDIVIDUAL"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FiUser className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Individual</div>
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
                  Selecionar Equipes
                </label>

                <div className="relative mb-4">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar equipes..."
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredTeams.map((team) => (
                    <label
                      key={team.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {team.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {team.description}
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
                  Selecionar Pessoas
                </label>

                <div className="relative mb-4">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar pessoas..."
                    value={personSearch}
                    onChange={(e) => setPersonSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
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
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
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
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {ruleType === "TEAM"
                ? `${selectedTeamIds.length} equipe(s) selecionada(s)`
                : `${selectedPersonIds.length} pessoa(s) selecionada(s)`}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {creating ? "Criando..." : "Criar Regras"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
