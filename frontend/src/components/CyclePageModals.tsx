import {
  OneOnOneRecorder,
  MentoringRecorderOptimized,
  CompetenceRecorder,
  GoalCreatorWizard,
  GoalUpdateRecorder,
  ActivityDetailsModal,
} from "../features/cycles";
import { CompetenceUpdateRecorder } from "../features/cycles/components/tracking-recorders/competence-update-recorder";
import { DeleteGoalModal } from "../features/cycles/components/cycle-management/DeleteGoalModal";
import type { ModalType } from "../hooks/useModalManager";

interface CyclePageModalsProps {
  // Modal states
  isOpen: (modalType: ModalType) => boolean;
  modalState: any;
  deleteModalState: any;
  editModalState: any;

  // Data
  goalsData: any[];
  competenciesData: any[];
  activitiesData: any[];

  // Handlers
  handleClose: () => void;

  // Goal handlers
  handleGoalCreate: (data: any) => Promise<void>;
  handleGoalEditSave: (data: any) => Promise<void>;
  handleCancelEdit: () => void;
  handleGoalProgressUpdate: (goalId: string, data: any) => Promise<void>;
  handleConfirmDelete: () => Promise<void>;
  handleCancelDelete: () => void;

  // Activity handlers
  handleOneOnOneCreate: (data: any) => Promise<void>;
  handleMentoringCreate: (data: any) => Promise<void>;
  handleCompetencyCreate: (data: any) => Promise<void>;

  // Competency handlers
  handleCompetencyProgressUpdate: (
    competencyId: string,
    data: any
  ) => Promise<void>;
}

export function CyclePageModals({
  isOpen,
  modalState,
  deleteModalState,
  editModalState,
  goalsData,
  competenciesData,
  activitiesData,
  handleClose,
  handleGoalCreate,
  handleGoalEditSave,
  handleCancelEdit,
  handleGoalProgressUpdate,
  handleConfirmDelete,
  handleCancelDelete,
  handleOneOnOneCreate,
  handleMentoringCreate,
  handleCompetencyCreate,
  handleCompetencyProgressUpdate,
}: CyclePageModalsProps) {
  return (
    <>
      {/* OneOnOne Recorder Modal */}
      <OneOnOneRecorder
        isOpen={isOpen("oneOnOne")}
        onClose={handleClose}
        onSave={handleOneOnOneCreate}
      />

      {/* Mentoring Recorder Modal */}
      <MentoringRecorderOptimized
        isOpen={isOpen("mentoring")}
        onClose={handleClose}
        onSave={handleMentoringCreate}
      />

      {/* Competence Recorder Modal */}
      <CompetenceRecorder
        isOpen={isOpen("competence")}
        onClose={handleClose}
        onSave={handleCompetencyCreate}
      />

      {/* Goal Creator Modal */}
      <GoalCreatorWizard
        isOpen={isOpen("goalCreator")}
        onClose={handleClose}
        onSave={handleGoalCreate}
      />

      {/* Goal Edit Modal */}
      <GoalCreatorWizard
        isOpen={editModalState.isOpen}
        onClose={handleCancelEdit}
        onSave={handleGoalEditSave}
        prefillData={editModalState.goalData}
        isEditing={true}
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
              onSave={(data) => handleGoalProgressUpdate(selectedGoal.id, data)}
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
              onSave={(data) =>
                handleCompetencyProgressUpdate(selectedComp.id, data)
              }
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

      {/* Modal de Exclusão de Meta */}
      {deleteModalState.isOpen && (
        <DeleteGoalModal
          isOpen={deleteModalState.isOpen}
          goalTitle={deleteModalState.goalTitle}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
}
