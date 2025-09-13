// MOVED from src/components/EditablePdiView.tsx
// Adjusted import paths for feature module structure
import React, { useEffect } from "react";
import type { PdiMilestone, PdiPlan, PdiKeyResult } from "..";
import { useLocalPdi } from "../hooks/useLocalPdi";
import { MilestonesSection } from "./sections/MilestonesSection";
import { CompetenciesEditor } from "./editors/CompetenciesEditor";
import { KeyResultsEditor } from "./editors/KeyResultsEditor";
import { ResultsEditor } from "./editors/ResultsEditor";
import { SaveStatusBar, SectionHeader } from "./structure/structure";
import {
  CompetenciesView,
  KeyResultsView,
  ResultsTable,
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
  const { plan } = useLocalPdi(initialPlan, {
    enableStorage: false,
  });
  const { state, dispatch, toggleSection, toggleMilestone } =
    usePdiEditing(plan);
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
    plan,
    working,
    pending: pendingSave,
    saving,
    lastSavedAt: plan.updatedAt,
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
  const updateRecord = (area: string, patch: any) =>
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
        updatedAt={plan.updatedAt}
        saving={saving}
        pending={pendingSave}
        activeEditing={isAnythingEditing}
      />
      <div className="space-y-10">
        <div className="relative rounded-xl border border-surface-300 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Competências técnicas a desenvolver"
            editing={editingSections.competencies}
            onToggle={() => toggleSection("competencies")}
          />
          {editingSections.competencies ? (
            <CompetenciesEditor
              competencies={working.competencies}
              onAdd={addCompetency}
              onRemove={removeCompetency}
            />
          ) : (
            <CompetenciesView items={working.competencies} />
          )}
        </div>

        <MilestonesSection
          milestones={working.milestones}
          onAdd={addMilestone}
          onRemove={removeMilestone}
          onUpdate={updateMilestone}
          editingIds={editingMilestones}
          onToggleEdit={toggleMilestone}
          enableSort={!saving && !pendingSave && editingMilestones.size === 0}
        />

        <div className="relative rounded-xl border border-surface-300 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Key Results"
            editing={editingSections.krs}
            onToggle={() => toggleSection("krs")}
          />
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
        </div>

        <div className="relative rounded-xl border border-surface-300 bg-white p-5 shadow-sm">
          <SectionHeader
            title="Resultado"
            editing={editingSections.results}
            onToggle={() => toggleSection("results")}
          />
          {editingSections.results ? (
            <ResultsEditor
              records={working.records}
              onUpdate={updateRecord}
              onAdd={addRecord}
              onRemove={removeRecord}
              competencies={working.competencies}
            />
          ) : (
            <ResultsTable records={working.records} />
          )}
        </div>
      </div>
    </div>
  );
};
