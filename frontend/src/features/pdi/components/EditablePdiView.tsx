// MOVED from src/components/EditablePdiView.tsx
// Adjusted import paths for feature module structure
import React, { useEffect } from "react";
import type {
  PdiMilestone,
  PdiPlan,
  PdiKeyResult,
  PdiCompetencyRecord,
} from "..";
import { MilestonesSection } from "./sections/MilestonesSection";
import { CompetenciesEditor } from "./editors/CompetenciesEditor";
import { KeyResultsEditor } from "./editors/KeyResultsEditor";
import { ResultsEditor } from "./editors/ResultsEditor";
import { SaveStatusBar } from "./structure/structure";
import { SectionCard } from "../../../shared/ui/SectionCard";
import {
  CompetenciesView,
  KeyResultsView,
  ResultsCardsView,
} from "./structure/views";
import { usePdiEditing } from "../hooks/usePdiEditing";
import { useAutoSave } from "../hooks/useAutoSave";

interface Props {
  initialPlan: PdiPlan;
  saveForUserId?: number; // se fornecido, salva via PUT /pdi/:userId
}

export const EditablePdiView: React.FC<Props> = ({
  initialPlan,
  saveForUserId,
}) => {
  const hasTarget = saveForUserId != null;
  const { state, dispatch, toggleSection, toggleMilestone } =
    usePdiEditing(initialPlan);
  const working = state.working;
  const editingSections = state.editing.sections;
  const editingMilestones = state.editing.milestones;
  const isAnythingEditing =
    editingSections.competencies ||
    editingSections.krs ||
    editingSections.results ||
    editingMilestones.size > 0;

  useEffect(() => {
    if (working.userId !== String(initialPlan.userId)) {
      dispatch({ type: "INIT", plan: initialPlan });
    }
  }, [initialPlan.userId]);
  const pendingSave = state.meta.pendingSave;
  const saving = state.meta.saving;

  useAutoSave({
    plan: state.working, // passa plano atual
    working,
    pending: pendingSave,
    saving,
    lastSavedAt: working.updatedAt,
    saveForUserId: hasTarget ? String(saveForUserId) : undefined,
    dispatch,
  });

  const addCompetency = (c: string) =>
    dispatch({ type: "ADD_COMPETENCY", value: c });
  const removeCompetency = (c: string) =>
    dispatch({ type: "REMOVE_COMPETENCY", value: c });
  const updateMilestone = (id: string, patch: Partial<PdiMilestone>) =>
    dispatch({ type: "UPDATE_MILESTONE", id, patch });
  const removeMilestone = (id: string) =>
    dispatch({ type: "REMOVE_MILESTONE", id });
  const addMilestone = () => dispatch({ type: "ADD_MILESTONE" });
  const updateRecord = (area: string, patch: Partial<PdiCompetencyRecord>) =>
    dispatch({ type: "UPDATE_RECORD", area, patch });
  const addRecord = (area?: string) => {
    const name = (area || "").trim();
    if (!name) return;
    dispatch({
      type: "ADD_RECORD",
      record: { area: name, evidence: "" } as any,
    });
  };
  const removeRecord = (area: string) =>
    dispatch({ type: "REMOVE_RECORD", area });
  const addKr = () => dispatch({ type: "ADD_KR" });
  const updateKr = (id: string, patch: Partial<PdiKeyResult>) =>
    dispatch({ type: "UPDATE_KR", id, patch });
  const removeKr = (id: string) => dispatch({ type: "REMOVE_KR", id });

  return (
    <div className="space-y-4">
      <SaveStatusBar
        updatedAt={working.updatedAt}
        saving={saving}
        pending={pendingSave}
        activeEditing={isAnythingEditing}
      />
      <div className="space-y-10">
        <SectionCard
          icon={() => (
            <span className="text-indigo-600 font-bold text-lg">C</span>
          )}
          title="Competências técnicas a desenvolver"
          action={
            <button
              onClick={() => toggleSection("competencies")}
              className="px-3 py-1.5 text-xs rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {editingSections.competencies ? "Concluir" : "Editar"}
            </button>
          }
        >
          {editingSections.competencies ? (
            <CompetenciesEditor
              competencies={working.competencies}
              onAdd={addCompetency}
              onRemove={removeCompetency}
            />
          ) : (
            <CompetenciesView items={working.competencies} />
          )}
        </SectionCard>

        <MilestonesSection
          milestones={working.milestones}
          onAdd={addMilestone}
          onRemove={removeMilestone}
          onUpdate={updateMilestone}
          editingIds={editingMilestones}
          onToggleEdit={toggleMilestone}
          enableSort={!saving && !pendingSave && editingMilestones.size === 0}
        />

        <SectionCard
          icon={() => (
            <span className="text-indigo-600 font-bold text-lg">KR</span>
          )}
          title="Key Results"
          action={
            <button
              onClick={() => toggleSection("krs")}
              className="px-3 py-1.5 text-xs rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {editingSections.krs ? "Concluir" : "Editar"}
            </button>
          }
        >
          {editingSections.krs ? (
            <KeyResultsEditor
              krs={working.krs || []}
              onAdd={addKr}
              onRemove={removeKr}
              onUpdate={updateKr}
            />
          ) : (
            <KeyResultsView krs={working.krs || []} />
          )}
        </SectionCard>

        <SectionCard
          icon={() => (
            <span className="text-indigo-600 font-bold text-lg">R</span>
          )}
          title="Resultado"
          action={
            <button
              onClick={() => toggleSection("results")}
              className="px-3 py-1.5 text-xs rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {editingSections.results ? "Concluir" : "Editar"}
            </button>
          }
        >
          {editingSections.results ? (
            <ResultsEditor
              records={working.records}
              onUpdate={updateRecord}
              onAdd={addRecord}
              onRemove={removeRecord}
              competencies={working.competencies}
            />
          ) : (
            <ResultsCardsView records={working.records} />
          )}
        </SectionCard>
      </div>
    </div>
  );
};
