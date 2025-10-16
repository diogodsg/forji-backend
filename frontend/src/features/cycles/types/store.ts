import type { CycleStatus, GoalType, CycleDuration } from "./cycle";

// Types específicos para gerenciamento de estado
export type ModalType =
  | "oneOnOne"
  | "mentoring"
  | "certification"
  | "milestoneCreator"
  | "goalCreator"
  | "cycleCreator";

export interface ModalStates {
  oneOnOne: boolean;
  mentoring: boolean;
  certification: boolean;
  milestoneCreator: boolean;
  goalCreator: boolean;
  cycleCreator: boolean;
}

export interface UIStates {
  activeTab: string;
  expandedSections: string[];
  filters: CycleFilters;
  selectedGoalId: string | null;
  isDebugPanelOpen: boolean;
}

export interface CycleFilters {
  status?: CycleStatus[];
  goalType?: GoalType[];
  duration?: CycleDuration[];
  search?: string;
}

// Actions interface
export interface CycleStoreActions {
  // Modal Actions
  openModal: (modal: ModalType) => void;
  closeModal: (modal: ModalType) => void;
  closeAllModals: () => void;

  // UI Actions
  setActiveTab: (tab: string) => void;
  toggleSection: (section: string) => void;
  setFilters: (filters: CycleFilters) => void;
  selectGoal: (goalId: string | null) => void;
  toggleDebugPanel: () => void;

  // Reset Actions
  resetUI: () => void;
}

// Store principal interface
export interface CycleStore extends ModalStates, UIStates, CycleStoreActions {}
