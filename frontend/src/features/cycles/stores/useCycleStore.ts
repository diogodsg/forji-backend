import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { CycleStore, ModalType, CycleFilters } from "../types";

// Estado inicial padrão
const initialModalStates = {
  oneOnOne: false,
  mentoring: false,
  certification: false,
  milestoneCreator: false,
  goalCreator: false,
  cycleCreator: false,
};

const initialUIStates = {
  activeTab: "overview",
  expandedSections: ["goals"], // Seção de metas expandida por padrão
  filters: {} as CycleFilters,
  selectedGoalId: null,
  isDebugPanelOpen: false,
};

export const useCycleStore = create<CycleStore>()(
  devtools(
    (set, get) => ({
      // Estados iniciais
      ...initialModalStates,
      ...initialUIStates,

      // Modal Actions
      openModal: (modal: ModalType) => {
        console.log(`🔧 Debug: Opening modal ${modal}`);
        set(
          (state) => ({
            ...state,
            [modal]: true,
          }),
          false,
          `openModal:${modal}`
        );
      },

      closeModal: (modal: ModalType) => {
        console.log(`🔧 Debug: Closing modal ${modal}`);
        set(
          (state) => ({
            ...state,
            [modal]: false,
          }),
          false,
          `closeModal:${modal}`
        );
      },

      closeAllModals: () => {
        console.log("🔧 Debug: Closing all modals");
        set(() => initialModalStates, false, "closeAllModals");
      },

      // UI Actions
      setActiveTab: (tab: string) => {
        console.log(`🔧 Debug: Setting active tab to ${tab}`);
        set(
          () => ({
            activeTab: tab,
          }),
          false,
          `setActiveTab:${tab}`
        );
      },

      toggleSection: (section: string) => {
        const currentExpanded = get().expandedSections;
        const isExpanded = currentExpanded.includes(section);

        console.log(
          `🔧 Debug: ${
            isExpanded ? "Collapsing" : "Expanding"
          } section ${section}`
        );

        set(
          () => ({
            expandedSections: isExpanded
              ? currentExpanded.filter((s) => s !== section)
              : [...currentExpanded, section],
          }),
          false,
          `toggleSection:${section}`
        );
      },

      setFilters: (filters: CycleFilters) => {
        console.log("🔧 Debug: Setting filters", filters);
        set(
          () => ({
            filters,
          }),
          false,
          "setFilters"
        );
      },

      selectGoal: (goalId: string | null) => {
        console.log(`🔧 Debug: Selecting goal ${goalId}`);
        set(
          () => ({
            selectedGoalId: goalId,
          }),
          false,
          `selectGoal:${goalId}`
        );
      },

      toggleDebugPanel: () => {
        const isOpen = get().isDebugPanelOpen;
        console.log(`🔧 Debug: ${isOpen ? "Hiding" : "Showing"} debug panel`);
        set(
          () => ({
            isDebugPanelOpen: !isOpen,
          }),
          false,
          "toggleDebugPanel"
        );
      },

      // Reset Actions
      resetUI: () => {
        console.log("🔧 Debug: Resetting UI state");
        set(
          () => ({
            ...initialUIStates,
          }),
          false,
          "resetUI"
        );
      },
    }),
    {
      name: "cycle-store", // Nome para DevTools
      enabled: process.env.NODE_ENV === "development", // Apenas em dev
    }
  )
);
