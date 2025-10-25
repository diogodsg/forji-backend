/**
 * useModalManager Hook
 *
 * Hook customizado para gerenciar estado de múltiplos modals de forma centralizada.
 * Garante que apenas um modal esteja aberto por vez e gerencia IDs selecionados.
 *
 * @example
 * const { modalState, openModal, closeModal } = useModalManager();
 *
 * openModal('goalUpdate', 'goal-123');
 * closeModal();
 */

import { useReducer, useCallback } from "react";

// Tipos de modals disponíveis
export type ModalType =
  | "oneOnOne"
  | "mentoring"
  | "competence"
  | "goalCreator"
  | "goalUpdate"
  | "competenceUpdate"
  | "activityDetails"
  | "editOneOnOne"
  | "editMentoring"
  | "editCertification"
  | null;

// Estado do modal
export interface ModalState {
  type: ModalType;
  selectedId: string | null;
}

// Ações disponíveis
type ModalAction =
  | { type: "OPEN_MODAL"; payload: { modalType: ModalType; id?: string } }
  | { type: "CLOSE_MODAL" };

// Estado inicial
const initialState: ModalState = {
  type: null,
  selectedId: null,
};

// Reducer para gerenciar estado
function modalReducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        type: action.payload.modalType,
        selectedId: action.payload.id || null,
      };
    case "CLOSE_MODAL":
      return initialState;
    default:
      return state;
  }
}

/**
 * Hook para gerenciar modals
 */
export function useModalManager() {
  const [modalState, dispatch] = useReducer(modalReducer, initialState);

  // Abrir modal (com ou sem ID)
  const openModal = useCallback((modalType: ModalType, id?: string) => {
    dispatch({ type: "OPEN_MODAL", payload: { modalType, id } });
  }, []);

  // Fechar modal
  const closeModal = useCallback(() => {
    dispatch({ type: "CLOSE_MODAL" });
  }, []);

  // Helpers para verificar se modal específico está aberto
  const isOpen = useCallback(
    (modalType: ModalType) => modalState.type === modalType,
    [modalState.type]
  );

  return {
    modalState,
    openModal,
    closeModal,
    isOpen,
  };
}

/**
 * Helpers para criar handlers mais semânticos
 */
export function createModalHelpers(
  openModal: (modalType: ModalType, id?: string) => void,
  closeModal: () => void
) {
  return {
    // Quick Actions
    handleOneOnOne: () => openModal("oneOnOne"),
    handleMentoring: () => openModal("mentoring"),
    handleCompetence: () => openModal("competence"),
    handleGoalCreator: () => openModal("goalCreator"),

    // Goal Actions
    handleGoalUpdate: (goalId: string) => openModal("goalUpdate", goalId),

    // Competence Actions
    handleCompetenceUpdate: (compId: string) =>
      openModal("competenceUpdate", compId),

    // Activity Actions
    handleActivityDetails: (activityId: string) =>
      openModal("activityDetails", activityId),

    // Close
    handleClose: closeModal,
  };
}
