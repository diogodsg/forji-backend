import { useModalManager, createModalHelpers } from "../hooks/useModalManager";
import { useAuth } from "../features/auth";

// NEW: API Integration Hooks
import {
  useIntegratedCycleData,
  useActivitiesTimeline,
} from "../features/cycles/hooks";
import { useGamificationContext } from "../features/gamification/context/GamificationContext";

// NEW: Custom Hooks for Handlers
import { useGoalHandlers } from "../hooks/useGoalHandlers";
import { useCompetencyHandlers } from "../hooks/useCompetencyHandlers";
import { useActivityHandlers } from "../hooks/useActivityHandlers";

// NEW: Components
import { CyclePageStates } from "../components/CyclePageStates";
import { CyclePageContent } from "../components/CyclePageContent";
import { CyclePageModals } from "../components/CyclePageModals";

/**
 * CurrentCyclePage - Vers??o Otimizada (Proposta Desenvolvimento Ciclo)
 *
 * **Refatora????o:**
 * - Hooks extra??dos: useGoalHandlers, useCompetencyHandlers, useActivityHandlers
 * - Componentes extra??dos: CyclePageStates, CyclePageContent, CyclePageModals
 * - P??gina principal agora ?? apenas um orquestrador
 */
export function CurrentCyclePageOptimized() {
  // Auth context
  const { user } = useAuth();

  // Modal Management (centralizado)
  const { modalState, openModal, closeModal, isOpen } = useModalManager();

  // Modal Helpers (handlers sem??nticos)
  const {
    handleOneOnOne,
    handleMentoring,
    handleCompetence,
    handleGoalCreator,
    handleGoalUpdate,
    handleCompetenceUpdate,
    handleActivityDetails,
    handleClose,
  } = createModalHelpers(openModal, closeModal);

  // API Integration (NEW!)
  const {
    cycle,
    goals,
    competencies,
    activities,
    loading,
    error,
    refresh,
    refreshGoals,
    refreshCompetencies,
    refreshActivities,
  } = useIntegratedCycleData();

  // Gamification Profile
  const {
    profile: gamificationProfile,
    loading: gamificationLoading,
    refreshProfile: refreshGamificationProfile,
  } = useGamificationContext();

  // Custom Handlers
  const goalHandlers = useGoalHandlers(
    cycle,
    user,
    refreshGoals,
    refreshGamificationProfile,
    handleClose
  );

  const competencyHandlers = useCompetencyHandlers(
    cycle,
    refreshCompetencies,
    handleClose
  );

  const activityHandlers = useActivityHandlers(
    cycle,
    user,
    refreshActivities,
    handleClose
  );

  // Data Processing (usar dados reais do backend)
  const cycleData = cycle
    ? {
        ...cycle,
        // Usar dados reais de gamifica????o quando dispon??veis
        xpCurrent: gamificationProfile?.currentXP ?? 0,
        xpNextLevel: gamificationProfile?.nextLevelXP ?? 1000,
        currentLevel: gamificationProfile?.level ?? 1,
        streak: gamificationProfile?.streak ?? 0,
        totalXP: gamificationProfile?.totalXP ?? 0,
      }
    : null;

  // Dados reais do usu??rio autenticado (sem fallback para mock)
  const userData = user
    ? {
        name: user.name.split(" ")[0], // Primeiro nome
        avatarId: user.avatarId,
      }
    : null;

  // Mapear goals do backend para formato do GoalsDashboard (apenas dados reais)
  const goalsData = goals.map((goal: any) => ({
    ...goal, // Manter todos os campos originais
    progress: goal.progress || 0, // Usar o progresso calculado pelo backend
    lastUpdate: goal.updatedAt, // Backend retorna updatedAt como string ISO
    status:
      goal.status === "COMPLETED"
        ? ("completed" as const)
        : (goal.progress || 0) >= 80 // Usar progress ao inv??s de currentValue
        ? ("on-track" as const)
        : ("needs-attention" as const),
  }));

  // Mapear competencies do backend para formato do CompetenciesSection (apenas dados reais)
  const competenciesData = competencies.map((comp: any) => ({
    ...comp, // Manter todos os campos originais
    currentProgress: comp.currentProgress || 0,
    totalXP: comp.totalXP || 0,
    nextMilestone: comp.nextMilestone || "A definir",
  }));

  // Mapear activities do backend para formato da Timeline
  const safeActivities = Array.isArray(activities) ? activities : [];
  const timelineActivities = useActivitiesTimeline(safeActivities);
  const activitiesData = timelineActivities;

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "oneOnOne":
        handleOneOnOne();
        break;
      case "mentoring":
        handleMentoring();
        break;
      case "certification":
        handleCompetence();
        break;
      case "newGoal":
        handleGoalCreator();
        break;
    }
  };

  const handleViewCompetency = () => {
    // TODO: Implementar visualização detalhada de competência
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* States: Loading, Error, Empty */}
      <CyclePageStates
        loading={loading}
        error={error}
        refresh={refresh}
        userData={userData}
        cycleData={cycleData}
      />

      {/* Main Content */}
      {!loading.cycle && !error.cycle && userData && cycleData && (
        <CyclePageContent
          userData={userData}
          cycleData={cycleData}
          goalsData={goalsData}
          competenciesData={competenciesData}
          activitiesData={activitiesData}
          handleActionClick={handleActionClick}
          handleGoalUpdate={handleGoalUpdate}
          handleGoalEdit={(goalId: string) =>
            goalHandlers.handleGoalEdit(goalId, goalsData)
          }
          handleGoalDelete={(goalId: string) =>
            goalHandlers.handleGoalDelete(goalId, goalsData)
          }
          handleViewCompetency={handleViewCompetency}
          handleCompetenceUpdate={handleCompetenceUpdate}
          handleDeleteCompetency={competencyHandlers.handleCompetencyDelete}
          handleActivityDetails={handleActivityDetails}
          loading={{
            goals: loading.goals,
            competencies: loading.competencies,
            activities: loading.activities,
            gamification: gamificationLoading,
          }}
        />
      )}

      {/* All Modals */}
      <CyclePageModals
        isOpen={isOpen}
        modalState={modalState}
        deleteModalState={goalHandlers.deleteModalState}
        editModalState={goalHandlers.editModalState}
        goalsData={goalsData}
        competenciesData={competenciesData}
        activitiesData={activitiesData}
        handleClose={handleClose}
        handleGoalCreate={goalHandlers.handleGoalCreate}
        handleGoalEditSave={goalHandlers.handleGoalEditSave}
        handleCancelEdit={goalHandlers.handleCancelEdit}
        handleGoalProgressUpdate={goalHandlers.handleGoalProgressUpdate}
        handleConfirmDelete={goalHandlers.handleConfirmDelete}
        handleCancelDelete={goalHandlers.handleCancelDelete}
        handleOneOnOneCreate={activityHandlers.handleOneOnOneCreate}
        handleMentoringCreate={activityHandlers.handleMentoringCreate}
        handleCompetencyCreate={competencyHandlers.handleCompetencyCreate}
        handleCompetencyProgressUpdate={
          competencyHandlers.handleCompetencyProgressUpdate
        }
      />
    </div>
  );
}
