import {
  CycleHeroSection,
  QuickActionsBar,
  GoalsDashboard,
  CompetenciesSection,
  ActivitiesTimeline,
  ActivityDetailsModal,
  OneOnOneRecorder,
  MentoringRecorderOptimized,
  CompetenceRecorder,
  GoalCreatorWizard,
  GoalUpdateRecorder,
} from "../features/cycles";
import { CompetenceUpdateRecorder } from "../features/cycles/components/tracking-recorders/competence-update-recorder";
import {
  mockUserData,
  mockCycleData,
  mockGoalsData,
  mockCompetenciesData,
  mockActivitiesData,
} from "./mockData";
import { useModalManager, createModalHelpers } from "../hooks/useModalManager";

/**
 * CurrentCyclePage - Versão Otimizada (Proposta Desenvolvimento Ciclo)
 *
 * **Arquitetura Desktop-First (>1200px):**
 *
 * ```
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 🎯 HERO SECTION (Gamificação Central)                      │
 * │ Avatar + Progress Ring + XP System + Streak                │
 * └─────────────────────────────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ⚡ QUICK ACTIONS BAR (Sempre Visível)                      │
 * │ [1:1] [Mentoria] [Certificação] [Nova Meta]               │
 * └─────────────────────────────────────────────────────────────┘
 * ┌─────────────────────┬───────────────────────────────────────┐
 * │ 🎯 GOALS (50%)      │ 🧠 COMPETÊNCIAS (50%)                │
 * │                     │                                       │
 * └─────────────────────┴───────────────────────────────────────┘
 * ┌─────────────────────────────────────────────────────────────┐
 * │ ⏰ ACTIVITIES TIMELINE (Full Width)                        │
 * └─────────────────────────────────────────────────────────────┘
 * ```
 *
 * **Princípios de Design:**
 * 1. Hero Section First - Gamificação central
 * 2. Quick Actions Always - Acesso imediato (2-3 cliques)
 * 3. Goals & Competencies Balance - 50/50 split
 * 4. Full-Width Activities - Timeline rica
 * 5. Desktop-First Only - Sem mobile
 * 6. Instant Gratification - XP preview
 * 7. Quality Data - Forms inteligentes
 * 8. Design System Violet - 100% compliance
 */
export function CurrentCyclePageOptimized() {
  // Modal Management (centralizado)
  const { modalState, openModal, closeModal, isOpen } = useModalManager();

  // Modal Helpers (handlers semânticos)
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

  // Mock Data (TODO: substituir por hooks de API)
  const userData = mockUserData;
  const cycleData = mockCycleData;
  const goalsData = mockGoalsData;
  const competenciesData = mockCompetenciesData;
  const activitiesData = mockActivitiesData;

  // Handlers
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

  const handleRepeatActivity = (activityId: string) => {
    const activity = activitiesData.find((a) => a.id === activityId);
    if (activity?.type === "oneOnOne") {
      handleOneOnOne();
      // TODO: Pré-preencher dados do modal com activity
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Hero Section - Gamificação Central */}
        <div className="mb-8">
          <CycleHeroSection user={userData} cycle={cycleData} />
        </div>

        {/* Quick Actions Bar - Sempre Visível */}
        <div className="mb-8">
          <QuickActionsBar onActionClick={handleActionClick} />
        </div>

        {/* Goals & Competencies - 50/50 Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Goals Dashboard (50%) */}
          <GoalsDashboard goals={goalsData} onUpdateGoal={handleGoalUpdate} />

          {/* Competencies Section (50%) */}
          <CompetenciesSection
            competencies={competenciesData}
            onViewCompetency={handleViewCompetency}
            onUpdateProgress={handleCompetenceUpdate}
          />
        </div>

        {/* Activities Timeline - Full Width */}
        <ActivitiesTimeline
          activities={activitiesData}
          onViewDetails={handleActivityDetails}
          onRepeatActivity={handleRepeatActivity}
        />
      </div>

      {/* Modals */}

      {/* OneOnOne Recorder Modal */}
      <OneOnOneRecorder
        isOpen={isOpen("oneOnOne")}
        onClose={handleClose}
        onSave={(data) => {
          console.log("1:1 saved:", data);
          // TODO: Enviar para API e atualizar timeline
          handleClose();
        }}
      />

      {/* Mentoring Recorder Modal */}
      <MentoringRecorderOptimized
        isOpen={isOpen("mentoring")}
        onClose={handleClose}
        onSave={(data) => {
          console.log("Mentoria saved:", data);
          // TODO: Enviar para API e atualizar timeline
          handleClose();
        }}
      />

      {/* Competence Recorder Modal */}
      <CompetenceRecorder
        isOpen={isOpen("competence")}
        onClose={handleClose}
        onSave={async (data) => {
          console.log("Competência saved:", data);
          // TODO: Enviar para API e atualizar timeline
          handleClose();
        }}
      />

      {/* Goal Creator Modal */}
      <GoalCreatorWizard
        isOpen={isOpen("goalCreator")}
        onClose={handleClose}
        onSave={(data) => {
          console.log("Meta created:", data);
          // TODO: Enviar para API e atualizar goals
          handleClose();
        }}
      />

      {/* Goal Update Modal */}
      {modalState.type === "goalUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedGoal = goalsData.find(
            (g) => g.id === modalState.selectedId
          );
          if (!selectedGoal) return null;

          return (
            <GoalUpdateRecorder
              isOpen={true}
              onClose={handleClose}
              onSave={(data) => {
                console.log("Goal updated:", data);
                // TODO: Enviar para API e atualizar goals
                handleClose();
              }}
              goal={{
                id: selectedGoal.id,
                title: selectedGoal.title,
                description: selectedGoal.description,
                type: selectedGoal.type,
                currentProgress: selectedGoal.progress,
                currentValue: selectedGoal.currentValue,
                targetValue: selectedGoal.targetValue,
                startValue: selectedGoal.startValue,
                unit: selectedGoal.unit,
              }}
            />
          );
        })()}

      {/* Competence Update Recorder Modal */}
      {modalState.type === "competenceUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedComp = competenciesData.find(
            (c) => c.id === modalState.selectedId
          );
          if (!selectedComp) return null;

          return (
            <CompetenceUpdateRecorder
              isOpen={true}
              onClose={handleClose}
              onSave={(data) => {
                console.log("Competence update saved:", data);
                // TODO: Enviar para API e atualizar competenciesData
                handleClose();
              }}
              competence={{
                id: selectedComp.id,
                name: selectedComp.name,
                category: selectedComp.category,
                currentLevel: selectedComp.currentLevel,
                targetLevel: selectedComp.targetLevel,
                currentProgress: selectedComp.currentProgress,
                nextMilestone: selectedComp.nextMilestone,
              }}
            />
          );
        })()}

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        isOpen={isOpen("activityDetails")}
        onClose={handleClose}
        activity={
          modalState.selectedId
            ? activitiesData.find((a) => a.id === modalState.selectedId) || null
            : null
        }
      />
    </div>
  );
}
