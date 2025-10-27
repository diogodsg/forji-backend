import { useState } from "react";
import { FiPlus, FiUsers, FiUser, FiTrash2 } from "react-icons/fi";
import { useManagementRules } from "../hooks/useManagementRules";
import { CreateRuleModal } from "./CreateRuleModal";
import type { ManagementRule, SubordinateInfo } from "../types";

export function ManagementDashboard() {
  const { rules, subordinates, loading, error, removeRule } =
    useManagementRules();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleRemoveRule = async (ruleId: string) => {
    try {
      await removeRule(ruleId);
      setConfirmDelete(null);
    } catch (err) {
      // Error already handled by hook
    }
  };

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
  const teamSubordinates = subordinates.filter((s) => s.source === "team");
  const individualSubordinates = subordinates.filter(
    (s) => s.source === "individual"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Gerenciamento de Subordinados
          </h2>
          <p className="text-gray-600 mt-1">
            Configure quem são seus subordinados por equipe ou individualmente
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Nova Regra
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Subordinados</p>
              <p className="text-2xl font-bold text-gray-900">
                {subordinates.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUsers className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Por Equipe</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamSubordinates.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiUser className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Individuais</p>
              <p className="text-2xl font-bold text-gray-900">
                {individualSubordinates.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Rules */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-green-600" />
              Gerenciamento por Equipe ({teamRules.length})
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie automaticamente todos os membros de equipes específicas
            </p>
          </div>
          <div className="p-4">
            {teamRules.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Nenhuma regra de equipe configurada
              </p>
            ) : (
              <div className="space-y-3">
                {teamRules.map((rule) => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onRemove={handleRemoveRule}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Individual Rules */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiUser className="w-5 h-5 text-purple-600" />
              Gerenciamento Individual ({individualRules.length})
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie pessoas específicas diretamente
            </p>
          </div>
          <div className="p-4">
            {individualRules.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">
                Nenhuma regra individual configurada
              </p>
            ) : (
              <div className="space-y-3">
                {individualRules.map((rule) => (
                  <RuleCard
                    key={rule.id}
                    rule={rule}
                    onRemove={handleRemoveRule}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subordinates List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Subordinados Efetivos ({subordinates.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Lista consolidada de todos os seus subordinados
          </p>
        </div>
        <div className="p-4">
          {subordinates.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              Nenhum subordinado configurado
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {subordinates.map((subordinate) => (
                <SubordinateCard
                  key={subordinate.id}
                  subordinate={subordinate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateRuleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

interface RuleCardProps {
  rule: ManagementRule;
  onRemove: (ruleId: string) => void;
  confirmDelete: string | null;
  setConfirmDelete: (id: string | null) => void;
}

function RuleCard({
  rule,
  onRemove,
  confirmDelete,
  setConfirmDelete,
}: RuleCardProps) {
  const isTeamRule = rule.ruleType === "TEAM";

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${
            isTeamRule ? "bg-green-100" : "bg-purple-100"
          }`}
        >
          {isTeamRule ? (
            <FiUsers
              className={`w-4 h-4 ${
                isTeamRule ? "text-green-600" : "text-purple-600"
              }`}
            />
          ) : (
            <FiUser
              className={`w-4 h-4 ${
                isTeamRule ? "text-green-600" : "text-purple-600"
              }`}
            />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {isTeamRule ? rule.team?.name : rule.subordinate?.name}
          </p>
          <p className="text-sm text-gray-600">
            {isTeamRule ? "Equipe completa" : rule.subordinate?.email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {confirmDelete === rule.id ? (
          <div className="flex gap-1">
            <button
              onClick={() => onRemove(rule.id)}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Confirmar
            </button>
            <button
              onClick={() => setConfirmDelete(null)}
              className="px-2 py-1 text-xs bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(rule.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Remover regra"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

interface SubordinateCardProps {
  subordinate: SubordinateInfo;
}

function SubordinateCard({ subordinate }: SubordinateCardProps) {
  const isTeamSource = subordinate.source === "team";

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-sky-500 text-white text-xs font-semibold flex items-center justify-center">
        {subordinate.name[0]?.toUpperCase() || "U"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{subordinate.name}</p>
        <p className="text-xs text-gray-600 truncate">{subordinate.email}</p>
        <div className="flex items-center gap-1 mt-1">
          {isTeamSource ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
              <FiUsers className="w-3 h-3" />
              {subordinate.teamName}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              <FiUser className="w-3 h-3" />
              Individual
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
