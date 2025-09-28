import { useState } from "react";
import {
  FiPlus,
  FiUsers,
  FiUser,
  FiTrash2,
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";
import { useAdminManagementRules } from "../../management/hooks/useAdminManagementRules";
import { AdminCreateRuleModal } from "./AdminCreateRuleModal";
import { useAdminUsers } from "../hooks/useAdminUsers";
import type { ManagementRule } from "../../management/types";

interface AdminSubordinatesManagementProps {
  onBack: () => void;
}

export function AdminSubordinatesManagement({
  onBack,
}: AdminSubordinatesManagementProps) {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [userSearch, setUserSearch] = useState("");

  // Admin users hook para listar usuários
  const { users } = useAdminUsers();

  // Admin hook - carrega regras do usuário selecionado ou todas
  const { rules, loading, error, removeRule } = useAdminManagementRules({
    managerId: selectedUserId || undefined,
  });

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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
    <div className="space-y-6">
      {/* Header */}
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
            className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Nova Regra
          </button>
        )}
      </div>

      {/* User Selector */}
      {!selectedUser && (
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
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 group-hover:text-indigo-700">
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

      {/* Selected User Header */}
      {selectedUser && (
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50/50 to-blue-50/30 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
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
                <p className="text-gray-600">{selectedUser.email}</p>
                {selectedUser.isAdmin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                    Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedUserId(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-colors"
            >
              Alterar Usuário
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Management Content - Only show when user is selected */}
      {selectedUser && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total de Regras</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {rules.length}
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
                  <p className="text-sm text-gray-600">Regras por Equipe</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teamRules.length}
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
                  <p className="text-sm text-gray-600">Regras Individuais</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {individualRules.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rules Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team Rules */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiUsers className="w-5 h-5 text-green-600" />
                  Regras por Equipe ({teamRules.length})
                </h3>
              </div>

              {teamRules.length === 0 ? (
                <div className="text-center py-8">
                  <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Nenhuma regra por equipe configurada
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {teamRules.map((rule) => (
                    <RuleCard
                      key={rule.id}
                      rule={rule}
                      onDelete={() => setConfirmDelete(rule.id)}
                      confirmDelete={confirmDelete === rule.id}
                      onConfirmDelete={() => handleRemoveRule(rule.id)}
                      onCancelDelete={() => setConfirmDelete(null)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Individual Rules */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiUser className="w-5 h-5 text-purple-600" />
                  Regras Individuais ({individualRules.length})
                </h3>
              </div>

              {individualRules.length === 0 ? (
                <div className="text-center py-8">
                  <FiUser className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    Nenhuma regra individual configurada
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {individualRules.map((rule) => (
                    <RuleCard
                      key={rule.id}
                      rule={rule}
                      onDelete={() => setConfirmDelete(rule.id)}
                      confirmDelete={confirmDelete === rule.id}
                      onConfirmDelete={() => handleRemoveRule(rule.id)}
                      onCancelDelete={() => setConfirmDelete(null)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Create Rule Modal */}
          {showCreateModal && selectedUser && (
            <AdminCreateRuleModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              targetManagerId={selectedUser.id}
              managerName={selectedUser.name}
            />
          )}
        </>
      )}
    </div>
  );
}

// Rule Card Component
function RuleCard({
  rule,
  onDelete,
  confirmDelete,
  onConfirmDelete,
  onCancelDelete,
}: {
  rule: ManagementRule;
  onDelete: () => void;
  confirmDelete: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3">
        <div
          className={`p-1.5 rounded ${
            rule.ruleType === "TEAM"
              ? "bg-green-100 text-green-600"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {rule.ruleType === "TEAM" ? (
            <FiUsers className="w-4 h-4" />
          ) : (
            <FiUser className="w-4 h-4" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {rule.ruleType === "TEAM"
              ? rule.team?.name
              : rule.subordinate?.name}
          </p>
          <p className="text-sm text-gray-500">
            Manager: {(rule as any).manager?.name || "N/A"}
          </p>
          <p className="text-xs text-gray-400">
            {rule.ruleType === "TEAM"
              ? `Equipe - ${rule.team?.name}`
              : `Individual - ${rule.subordinate?.email}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {confirmDelete ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onConfirmDelete}
              className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Confirmar
            </button>
            <button
              onClick={onCancelDelete}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
