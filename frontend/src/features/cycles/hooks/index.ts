export {
  useCurrentCycle,
  useCycleTemplates,
  useCycleCreation,
} from "./useCycles";
export { useCompetencies, useOneOnOnes } from "./useCompetenciesAndOneOnOnes";

// Novos hooks para gerenciamento de estado
export { useCycleManager, useCycleDebugState } from "./useCycleManager";
export {
  useCycleData,
  useCycleGoals,
  useUpdateGoalProgress,
} from "./useCycleQueries";
export { useCycleStore } from "../stores/useCycleStore";

// API Integration Hooks (NEW)
export { useCycleData as useIntegratedCycleData } from "./useCycleData";
export {
  useGoalMutations,
  useCompetencyMutations,
  useActivityMutations,
} from "./useCycleMutations";
export type {
  UseGoalMutationsReturn,
  UseCompetencyMutationsReturn,
  UseActivityMutationsReturn,
} from "./useCycleMutations";
export {
  useActivitiesTimeline,
  type TimelineActivity,
} from "./useActivitiesTimeline";
