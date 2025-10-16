import { useCycleStore } from "../stores/useCycleStore";
import {
  useCycleData,
  useCycleGoals,
  useUpdateGoalProgress,
} from "./useCycleQueries";

/**
 * Hook principal para gerenciar estado e dados dos ciclos
 * Unifica: Server State (mock queries) + Client State (Zustand) + Actions
 */
export const useCycleManager = () => {
  // Server State (dados mockados)
  const {
    data: cycle,
    isLoading: cycleLoading,
    error: cycleError,
    refetch: refetchCycle,
  } = useCycleData();

  const {
    data: goals,
    isLoading: goalsLoading,
    error: goalsError,
  } = useCycleGoals(cycle?.id);

  const { mutate: updateGoalProgress, isLoading: updateLoading } =
    useUpdateGoalProgress();

  // Client State (Zustand)
  const {
    // Modal states
    oneOnOne,
    mentoring,
    certification,
    milestoneCreator,
    goalCreator,
    cycleCreator,

    // UI states
    activeTab,
    expandedSections,
    filters,
    selectedGoalId,
    isDebugPanelOpen,

    // Actions
    openModal,
    closeModal,
    closeAllModals,
    setActiveTab,
    toggleSection,
    setFilters,
    selectGoal,
    toggleDebugPanel,
    resetUI,
  } = useCycleStore();

  // Computed/Derived State
  const isLoading = cycleLoading || goalsLoading;
  const hasError = !!cycleError || !!goalsError;
  const hasActiveCycle = !!cycle;

  const completedGoals =
    goals?.filter((goal) => {
      if (goal.type === "deadline") return goal.completed;
      if (goal.type === "quantity")
        return (goal.currentNumber || 0) >= (goal.targetNumber || 0);
      if (goal.type === "improvement")
        return (goal.currentValue || 0) >= (goal.targetValue || 0);
      return false;
    }) || [];

  const totalProgress =
    goals?.length > 0
      ? Math.round((completedGoals.length / goals.length) * 100)
      : 0;

  const selectedGoal = selectedGoalId
    ? goals?.find((goal) => goal.id === selectedGoalId)
    : null;

  // Unified Actions
  const actions = {
    // Modal actions com nomes semânticos
    openOneOnOne: () => openModal("oneOnOne"),
    openMentoring: () => openModal("mentoring"),
    openCertification: () => openModal("certification"),
    openMilestoneCreator: () => openModal("milestoneCreator"),
    openGoalCreator: () => openModal("goalCreator"),
    openCycleCreator: () => openModal("cycleCreator"),

    closeModal,
    closeAllModals,

    // UI actions
    setActiveTab,
    toggleSection,
    setFilters,
    selectGoal,
    toggleDebugPanel,
    resetUI,

    // Data actions
    updateGoalProgress,
    refetchCycle,
  };

  // Modal states agrupados
  const modals = {
    oneOnOne,
    mentoring,
    certification,
    milestoneCreator,
    goalCreator,
    cycleCreator,
  };

  // UI states agrupados
  const ui = {
    activeTab,
    expandedSections,
    filters,
    selectedGoalId,
    isDebugPanelOpen,
  };

  return {
    // Data
    cycle,
    goals,
    selectedGoal,

    // Loading states
    isLoading,
    cycleLoading,
    goalsLoading,
    updateLoading,

    // Error states
    hasError,
    cycleError,
    goalsError,

    // Computed
    hasActiveCycle,
    completedGoals,
    totalProgress,

    // States
    modals,
    ui,

    // Actions
    actions,
  };
};

// Hook específico apenas para debug (usado no debug panel)
export const useCycleDebugState = () => {
  const fullState = useCycleManager();
  const storeState = useCycleStore();

  return {
    // Estado completo do manager
    managerState: fullState,

    // Estado raw da store
    storeState,

    // Métricas úteis para debug
    metrics: {
      totalGoals: fullState.goals?.length || 0,
      completedGoals: fullState.completedGoals.length,
      progressPercentage: fullState.totalProgress,
      hasActiveCycle: fullState.hasActiveCycle,
      isLoading: fullState.isLoading,
      hasError: fullState.hasError,
    },

    // Estados dos modals para debug
    openModals: Object.entries(fullState.modals)
      .filter(([_, isOpen]) => isOpen)
      .map(([modal, _]) => modal),
  };
};
