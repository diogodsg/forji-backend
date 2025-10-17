import { createPortal } from "react-dom";
import { useAdminManagementRules } from "@/features/management/hooks/useAdminManagementRules";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { useTeamManagement } from "@/features/admin/hooks/useTeamManagement";
import type { CreateManagementRuleDto } from "@/features/management/types";
import { useHierarchyState } from "./useHierarchyState";
import { HierarchyHeader } from "./HierarchyHeader";
import { HierarchyFooter } from "./HierarchyFooter";
import { SubordinatesList } from "./SubordinatesList";
import { AddSubordinateForm } from "./AddSubordinateForm";
import type { HierarchyModalProps } from "./types";

export function HierarchyModal({
  isOpen,
  onClose,
  userId,
  userName,
  allUsers,
}: HierarchyModalProps) {
  // Custom hook para gerenciar estado do modal
  const state = useHierarchyState({ isOpen, userId });

  // Hooks para dados
  const { users: apiUsers } = useAdminUsers();
  const users = allUsers || apiUsers;
  const { teams } = useTeamManagement();
  const { rules, loading, removeRule, createRule, reload } =
    useAdminManagementRules({
      managerId: userId,
    });

  // Handlers
  const handleBackToList = () => {
    state.setStep("list");
    state.setRuleType("INDIVIDUAL");
    state.setSelectedTeamIds([]);
    state.setSelectedPersonIds([]);
    state.setTeamSearch("");
    state.setPersonSearch("");
    state.setError(null);
  };

  const handleRemoveRule = async (ruleId: number) => {
    try {
      await removeRule(ruleId);
      state.setConfirmDelete(null);
    } catch (err: any) {
      state.setError(err.message || "Erro ao remover subordinado");
    }
  };

  const handleSubmitRules = async () => {
    state.setCreating(true);
    state.setError(null);

    try {
      const promises: Promise<any>[] = [];

      if (state.ruleType === "TEAM") {
        for (const teamId of state.selectedTeamIds) {
          const rule: CreateManagementRuleDto = {
            ruleType: "TEAM",
            teamId,
          };
          promises.push(createRule(rule, userId));
        }
      } else {
        for (const subordinateId of state.selectedPersonIds) {
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
      state.setError(err.message || "Erro ao criar regras");
    } finally {
      state.setCreating(false);
    }
  };

  const handleToggleTeam = (teamId: number) => {
    if (state.selectedTeamIds.includes(teamId)) {
      state.setSelectedTeamIds(
        state.selectedTeamIds.filter((id) => id !== teamId)
      );
    } else {
      state.setSelectedTeamIds([...state.selectedTeamIds, teamId]);
    }
  };

  const handleTogglePerson = (userId: number) => {
    if (state.selectedPersonIds.includes(userId)) {
      state.setSelectedPersonIds(
        state.selectedPersonIds.filter((id) => id !== userId)
      );
    } else {
      state.setSelectedPersonIds([...state.selectedPersonIds, userId]);
    }
  };

  // Filtros
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(state.teamSearch.toLowerCase())
  );

  const filteredUsersForAdd = users.filter(
    (user) =>
      user.id !== userId &&
      (user.name.toLowerCase().includes(state.personSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(state.personSearch.toLowerCase()))
  );

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-gray-100">
          <HierarchyHeader
            step={state.step}
            userName={userName}
            onBack={handleBackToList}
            onClose={onClose}
          />

          {/* Content Area */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {state.error && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-sm text-error-600">{state.error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : state.step === "list" ? (
              <SubordinatesList
                rules={rules}
                confirmDelete={state.confirmDelete}
                onDelete={handleRemoveRule}
                onCancelDelete={() => state.setConfirmDelete(null)}
                onRequestDelete={(ruleId) => state.setConfirmDelete(ruleId)}
                onAdd={() => state.setStep("add")}
                userName={userName}
              />
            ) : (
              <AddSubordinateForm
                ruleType={state.ruleType}
                onRuleTypeChange={state.setRuleType}
                teams={filteredTeams}
                users={filteredUsersForAdd}
                selectedTeamIds={state.selectedTeamIds}
                selectedPersonIds={state.selectedPersonIds}
                teamSearch={state.teamSearch}
                personSearch={state.personSearch}
                onTeamSearchChange={state.setTeamSearch}
                onPersonSearchChange={state.setPersonSearch}
                onToggleTeam={handleToggleTeam}
                onTogglePerson={handleTogglePerson}
              />
            )}
          </div>

          <HierarchyFooter
            step={state.step}
            rulesCount={rules.length}
            ruleType={state.ruleType}
            selectedTeamIds={state.selectedTeamIds}
            selectedPersonIds={state.selectedPersonIds}
            creating={state.creating}
            onBack={handleBackToList}
            onSubmit={handleSubmitRules}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
