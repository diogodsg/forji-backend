import { Plus, Edit3, Activity, AlertCircle } from "lucide-react";
import {
  GoalsDashboard,
  CompetenciesSection,
  ActivitiesTimeline,
  GoalUpdateRecorder,
  GoalCreatorWizard,
  OneOnOneRecorder,
  MentoringRecorderOptimized,
  CompetenceRecorder,
  CompetenceUpdateRecorder,
  ActivityDetailsModal,
  DeleteActivityModal,
} from "@/features/cycles";
import { PDIHeroSection } from "./PDIHeroSection";

// Limites por ciclo
const MAX_GOALS_PER_CYCLE = 5;
const MAX_COMPETENCIES_PER_CYCLE = 5;

interface PDIContentSectionsProps {
  subordinate: any;
  cycle: any;
  goals: any[];
  competencies: any[];
  timelineActivities: any[];
  modalState: any;
  deleteActivityModalState: any;
  editActivityModalState: any;
  // Goal handlers
  onGoalCreate: () => void;
  onGoalEdit: (goalId: string) => void;
  onGoalDelete: (goalId: string) => void;
  onGoalUpdateClick: (goalId: string) => void;
  onGoalProgressUpdate: (goalId: string, data: any) => void;
  onGoalSave: (goalData: any) => Promise<void>;
  // Competency handlers
  onCompetencyCreate: () => void;
  onCompetencyView: (competencyId: string) => void;
  onCompetencyProgressUpdate: (competencyId: string) => void;
  onCompetencyProgressSave: (data: any) => void;
  onCompetencyDelete: (competencyId: string) => Promise<void>;
  onCompetencySave: (data: any) => Promise<void>;
  // Activity handlers
  onActivityCreate: (type?: string) => void;
  onActivityViewDetails: (activityId: string) => void;
  onActivityEdit: (activityId: string) => void;
  onActivityDeleteClick: (activityId: string) => void;
  onOneOnOneSave: (data: any) => void;
  onMentoringSave: (data: any) => void;
  onOneOnOneEditSave: (activityId: string, data: any) => void;
  onCancelActivityEdit: () => void;
  onConfirmDeleteActivity: () => void;
  onCancelDeleteActivity: () => void;
  // Modal handlers
  onClose: () => void;
}

/**
 * Seções de conteúdo principal do PDI
 */
export function PDIContentSections({
  subordinate,
  cycle,
  goals,
  competencies,
  timelineActivities,
  modalState,
  deleteActivityModalState,
  editActivityModalState,
  onGoalCreate,
  onGoalEdit,
  onGoalDelete,
  onGoalUpdateClick,
  onGoalProgressUpdate,
  onGoalSave,
  onCompetencyCreate,
  onCompetencyView,
  onCompetencyProgressUpdate,
  onCompetencyProgressSave,
  onCompetencyDelete,
  onCompetencySave,
  onActivityCreate,
  onActivityViewDetails,
  onActivityEdit,
  onActivityDeleteClick,
  onOneOnOneSave,
  onMentoringSave,
  onOneOnOneEditSave,
  onCancelActivityEdit,
  onConfirmDeleteActivity,
  onCancelDeleteActivity,
  onClose,
}: PDIContentSectionsProps) {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <PDIHeroSection subordinate={subordinate} cycle={cycle} goals={goals} />

      {/* Goals Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-emerald-600" />
            </div>
            Objetivos de Desenvolvimento
          </h3>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={onGoalCreate}
              disabled={goals.length >= MAX_GOALS_PER_CYCLE}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm font-medium ${
                goals.length >= MAX_GOALS_PER_CYCLE
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:opacity-90"
              }`}
            >
              <Plus className="w-4 h-4" />
              Nova Meta
            </button>
            {goals.length >= MAX_GOALS_PER_CYCLE && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Limite de {MAX_GOALS_PER_CYCLE} metas atingido
              </span>
            )}
          </div>
        </div>
        <GoalsDashboard
          goals={goals}
          onUpdateGoal={onGoalUpdateClick}
          onEditGoal={onGoalEdit}
          onDeleteGoal={onGoalDelete}
          onCreateGoal={onGoalCreate}
        />
      </section>

      {/* Competencies Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-purple-600" />
            </div>
            Competências Desenvolvidas
          </h3>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={onCompetencyCreate}
              disabled={competencies.length >= MAX_COMPETENCIES_PER_CYCLE}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-sm font-medium ${
                competencies.length >= MAX_COMPETENCIES_PER_CYCLE
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:opacity-90"
              }`}
            >
              <Plus className="w-4 h-4" />
              Nova Competência
            </button>
            {competencies.length >= MAX_COMPETENCIES_PER_CYCLE && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Limite de {MAX_COMPETENCIES_PER_CYCLE} competências atingido
              </span>
            )}
          </div>
        </div>
        <CompetenciesSection
          competencies={competencies}
          onViewCompetency={onCompetencyView}
          onUpdateProgress={onCompetencyProgressUpdate}
          onDeleteCompetency={onCompetencyDelete}
          onCreateCompetency={onCompetencyCreate}
        />
      </section>

      {/* Activities Timeline */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Edit3 className="w-4 h-4 text-blue-600" />
            </div>
            Histórico de Atividades
          </h3>
          <button
            onClick={() => onActivityCreate("oneOnOne")}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm font-medium"
          >
            <Activity className="w-4 h-4" />
            Registrar 1:1
          </button>
        </div>
        <ActivitiesTimeline
          activities={timelineActivities}
          onViewDetails={onActivityViewDetails}
          onEditActivity={onActivityEdit}
          onDeleteActivity={onActivityDeleteClick}
        />
      </section>

      {/* Goal Update Modal */}
      {modalState.type === "goalUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedGoal = goals.find(
            (g) => g.id === modalState.selectedId
          );

          if (!selectedGoal) {
            console.warn(
              "⚠️ Meta não encontrada para ID:",
              modalState.selectedId
            );
            return null;
          }

          // Calcular currentProgress se não estiver disponível
          const currentProgress =
            selectedGoal.progress ??
            (selectedGoal.currentValue !== undefined &&
            selectedGoal.targetValue !== undefined &&
            selectedGoal.startValue !== undefined
              ? Math.round(
                  ((selectedGoal.currentValue - selectedGoal.startValue) /
                    (selectedGoal.targetValue - selectedGoal.startValue)) *
                    100
                )
              : 0);

          return (
            <GoalUpdateRecorder
              isOpen={true}
              onClose={onClose}
              onSave={(data) => onGoalProgressUpdate(selectedGoal.id, data)}
              goal={{
                id: selectedGoal.id,
                title: selectedGoal.title,
                description: selectedGoal.description,
                type: selectedGoal.type,
                currentProgress: currentProgress,
                currentValue: selectedGoal.currentValue,
                targetValue: selectedGoal.targetValue,
                startValue: selectedGoal.startValue,
                unit: selectedGoal.unit,
              }}
            />
          );
        })()}

      {/* Goal Creator/Editor Modal */}
      {modalState.type === "goalCreator" &&
        (() => {
          // Se tem selectedId, é modo de edição
          const isEditing = !!modalState.selectedId;
          const selectedGoal = isEditing
            ? goals.find((g) => g.id === modalState.selectedId)
            : null;

          // Preparar dados pré-preenchidos para edição
          const prefillData = selectedGoal
            ? {
                title: selectedGoal.title,
                description: selectedGoal.description || "",
                type: selectedGoal.type?.toLowerCase() as any,
                successCriterion: {
                  type: selectedGoal.type?.toLowerCase() as any,
                  startValue:
                    selectedGoal.initialValue || selectedGoal.startValue,
                  currentValue: selectedGoal.currentValue,
                  targetValue: selectedGoal.targetValue,
                  unit: selectedGoal.unit,
                },
              }
            : undefined;

          return (
            <GoalCreatorWizard
              isOpen={true}
              onClose={onClose}
              onSave={onGoalSave}
              prefillData={prefillData}
              isEditing={isEditing}
            />
          );
        })()}

      {/* One-on-One Modal */}
      {modalState.type === "oneOnOne" && (
        <OneOnOneRecorder
          isOpen={true}
          onClose={onClose}
          onSave={onOneOnOneSave}
          prefillData={{
            participant: subordinate.name,
          }}
          cycleId={cycle?.id}
        />
      )}

      {/* Mentoring Modal */}
      {modalState.type === "mentoring" && (
        <MentoringRecorderOptimized
          isOpen={true}
          onClose={onClose}
          onSave={onMentoringSave}
        />
      )}

      {/* Competence Modal */}
      {modalState.type === "competence" && (
        <CompetenceRecorder
          isOpen={true}
          onClose={onClose}
          onSave={onCompetencySave}
        />
      )}

      {/* Competence Update Modal */}
      {modalState.type === "competenceUpdate" &&
        modalState.selectedId &&
        (() => {
          const selectedCompetency = competencies.find(
            (c) => c.id === modalState.selectedId
          );

          if (!selectedCompetency) {
            console.warn(
              "⚠️ Competência não encontrada para ID:",
              modalState.selectedId
            );
            return null;
          }

          // Normalizar categoria para lowercase
          const normalizedCategory =
            selectedCompetency.category.toLowerCase() as
              | "leadership"
              | "technical"
              | "behavioral";

          return (
            <CompetenceUpdateRecorder
              isOpen={true}
              onClose={onClose}
              onSave={onCompetencyProgressSave}
              competence={{
                id: selectedCompetency.id,
                name: selectedCompetency.name,
                category: normalizedCategory,
                currentLevel: selectedCompetency.currentLevel,
                targetLevel: selectedCompetency.targetLevel,
                currentProgress: selectedCompetency.currentProgress,
                nextMilestone: `Nível ${selectedCompetency.targetLevel}`,
              }}
            />
          );
        })()}

      {/* Activity Details Modal */}
      {modalState.type === "activityDetails" && modalState.selectedId && (
        <ActivityDetailsModal
          isOpen={true}
          onClose={onClose}
          activity={
            timelineActivities.find((a) => a.id === modalState.selectedId) ||
            null
          }
          onDelete={onActivityDeleteClick}
        />
      )}

      {/* Delete Activity Confirmation Modal */}
      <DeleteActivityModal
        isOpen={deleteActivityModalState.isOpen}
        activityTitle={deleteActivityModalState.activityTitle}
        activityType={deleteActivityModalState.activityType}
        xpLoss={deleteActivityModalState.xpLoss}
        onConfirm={onConfirmDeleteActivity}
        onCancel={onCancelDeleteActivity}
      />

      {/* Edit Activity Modal - Usa OneOnOneRecorder para edição */}
      {editActivityModalState.isOpen &&
        editActivityModalState.activity &&
        editActivityModalState.activity.type === "ONE_ON_ONE" && (
          <OneOnOneRecorder
            isOpen={true}
            onClose={onCancelActivityEdit}
            onSave={(data) =>
              onOneOnOneEditSave(editActivityModalState.activity.id, data)
            }
            prefillData={editActivityModalState.activity.prefillData}
          />
        )}
    </div>
  );
}
