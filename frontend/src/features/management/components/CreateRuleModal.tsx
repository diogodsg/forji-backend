import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiUsers, FiUser } from "react-icons/fi";
import { useManagementRules } from "../hooks/useManagementRules";
import { api } from "@/lib/apiClient";
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
  const { createRule } = useManagementRules();
  const [ruleType, setRuleType] = useState<ManagementRuleType>("TEAM");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        api<User[]>("/auth/admin/users", { auth: true }),
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

    if (ruleType === "TEAM" && !selectedTeamId) {
      setError("Selecione uma equipe");
      return;
    }

    if (ruleType === "INDIVIDUAL" && !selectedUserId) {
      setError("Selecione um usuário");
      return;
    }

    try {
      setError(null);
      const rule: CreateManagementRuleDto = {
        ruleType,
        ...(ruleType === "TEAM"
          ? { teamId: selectedTeamId! }
          : { subordinateId: selectedUserId! }),
      };

      await createRule(rule);
      onClose();
      resetForm();
    } catch (err: any) {
      setError(err.message || "Erro ao criar regra");
    }
  };

  const resetForm = () => {
    setRuleType("TEAM");
    setSelectedTeamId(null);
    setSelectedUserId(null);
    setError(null);
  };

  const handleClose = () => {
    onClose();
    resetForm();
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
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

                  {/* Team Selection */}
                  {ruleType === "TEAM" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecionar Equipe
                      </label>
                      {loading ? (
                        <div className="animate-pulse h-10 bg-gray-200 rounded-lg"></div>
                      ) : (
                        <select
                          value={selectedTeamId || ""}
                          onChange={(e) =>
                            setSelectedTeamId(Number(e.target.value) || null)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Selecione uma equipe...</option>
                          {teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {/* User Selection */}
                  {ruleType === "INDIVIDUAL" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selecionar Usuário
                      </label>
                      {loading ? (
                        <div className="animate-pulse h-10 bg-gray-200 rounded-lg"></div>
                      ) : (
                        <select
                          value={selectedUserId || ""}
                          onChange={(e) =>
                            setSelectedUserId(Number(e.target.value) || null)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          required
                        >
                          <option value="">Selecione um usuário...</option>
                          {users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </option>
                          ))}
                        </select>
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
                      disabled={loading}
                      className="flex-1 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Criando..." : "Criar Regra"}
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
