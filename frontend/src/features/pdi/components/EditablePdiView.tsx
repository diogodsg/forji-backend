// MOVED from src/components/EditablePdiView.tsx
// Adjusted import paths for feature module structure
import React, { useEffect, useMemo, useRef } from "react";
import {
  FiEdit2,
  FiCheckSquare,
  FiTarget,
  FiBarChart,
  FiTrendingUp,
} from "react-icons/fi";
import { HiLightBulb } from "react-icons/hi";
import type {
  PdiMilestone,
  PdiPlan,
  PdiKeyResult,
  PdiCompetencyRecord,
} from "..";
import { MilestonesSection } from "./sections/MilestonesSection";
import { CompetenciesAndResultsSection } from "./sections/CompetenciesAndResultsSection";
import { KeyResultsEditor } from "./editors/KeyResultsEditor";
import { SaveStatusBar } from "./structure/structure";
import { CollapsibleSectionCard } from "../../../shared";
import { KeyResultsView } from "./structure/views";
import { usePdiEditing } from "../hooks/usePdiEditing";
import { useAutoSave } from "../hooks/useAutoSave";
import { useCyclesManagement } from "../hooks/useCyclesManagement";
import { PdiTabs } from "./PdiTabs";

interface Props {
  initialPlan: PdiPlan;
  saveForUserId?: number; // se fornecido, salva via PUT /pdi/:userId
}

export const EditablePdiView: React.FC<Props> = ({
  initialPlan,
  saveForUserId,
}) => {
  const hasTarget = saveForUserId != null;

  // Gestão de ciclos
  const {
    cycles,
    selectedCycleId,
    selectedCycle,
    setSelectedCycleId,
    createCycle,
    updateCycle,
    deleteCycle,
    updateSelectedCyclePdi,
    getCurrentPdiPlan,
  } = useCyclesManagement(initialPlan);

  // Use o PDI do ciclo selecionado - memoizado para evitar recriações
  const currentPlan = useMemo(
    () => getCurrentPdiPlan(),
    [getCurrentPdiPlan]
  );
  const { state, dispatch, toggleSection, toggleMilestone } =
    usePdiEditing(currentPlan);
  const working = state.working;
  const editingSections = state.editing.sections;
  const editingMilestones = state.editing.milestones;
  const isAnythingEditing =
    editingSections.competencies ||
    editingSections.krs ||
    editingSections.results ||
    editingMilestones.size > 0;

  const pendingSave = state.meta.pendingSave;
  const saving = state.meta.saving;
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar mudanças do PDI com o ciclo selecionado (com debounce para evitar loops)
  useEffect(() => {
    if (selectedCycle && !saving && !pendingSave) {
      // Limpar timeout anterior
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Debounce de 100ms para evitar atualizações muito frequentes
      updateTimeoutRef.current = setTimeout(() => {
        updateSelectedCyclePdi({
          competencies: working.competencies,
          milestones: working.milestones,
          krs: working.krs,
          records: working.records,
        });
      }, 100);
    }

    // Cleanup na desmontagem
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [
    working.competencies,
    working.milestones,
    working.krs,
    working.records,
    updateSelectedCyclePdi,
    selectedCycle?.id, // Só depender do ID, não do objeto inteiro
    saving,
    pendingSave,
  ]);

  useAutoSave({
    plan: state.working, // passa plano atual
    working,
    pending: pendingSave,
    saving,
    lastSavedAt: working.updatedAt,
    saveForUserId: hasTarget ? String(saveForUserId) : undefined,
    editingMilestones,
    editingSections,
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

  const pdiContent = (
    <div className="space-y-10">
      <CollapsibleSectionCard
        icon={() => (
          <span className="text-indigo-600 font-bold text-lg">KR</span>
        )}
        title="Key Results"
        defaultExpanded={false}
        forceExpanded={editingSections.krs}
        preview={
          working.krs && working.krs.length > 0 ? (
            <div className="space-y-3">
              {/* Badge de estatística */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium border border-indigo-200">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  {working.krs.length} Objetivo
                  {working.krs.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FiBarChart className="w-3 h-3" />
                  {
                    working.krs.filter((kr) => kr.description?.trim()).length
                  }{" "}
                  com descrição
                </div>
              </div>

              {/* Preview dos primeiros KRs */}
              <div className="space-y-2">
                {working.krs.slice(0, 2).map((kr, index) => (
                  <div
                    key={kr.id}
                    className="flex items-start gap-3 p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {kr.description || "Objetivo sem descrição"}
                      </p>
                      {kr.successCriteria && (
                        <p className="text-xs text-gray-600 mt-1 truncate flex items-center gap-1">
                          <FiTarget className="w-3 h-3 shrink-0" />
                          {kr.successCriteria}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {working.krs.length > 2 && (
                  <div className="text-center py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">
                      +{working.krs.length - 2} objetivo
                      {working.krs.length - 2 !== 1 ? "s" : ""} adicional
                      {working.krs.length - 2 !== 1 ? "is" : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">KR</span>
              </div>
              <p className="text-xs text-gray-500">
                Nenhum Key Result definido ainda
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Clique em "Editar" para começar
              </p>
            </div>
          )
        }
        action={
          <button
            onClick={() => toggleSection("krs")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
              editingSections.krs
                ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            {editingSections.krs ? (
              <>
                <FiCheckSquare className="w-3.5 h-3.5" /> Concluir Edição
              </>
            ) : (
              <>
                <FiEdit2 className="w-3.5 h-3.5" /> Editar KRs
              </>
            )}
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
      </CollapsibleSectionCard>

      <CompetenciesAndResultsSection
        competencies={working.competencies}
        records={working.records}
        editing={editingSections.competencies || editingSections.results}
        preview={
          <div className="space-y-4">
            {/* Badges de estatísticas */}
            <div className="flex items-center gap-3 flex-wrap">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  working.competencies.length > 0
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    working.competencies.length > 0
                      ? "bg-emerald-500"
                      : "bg-gray-400"
                  }`}
                ></span>
                <HiLightBulb className="w-3 h-3" />{" "}
                {working.competencies.length} Competência
                {working.competencies.length !== 1 ? "s" : ""}
              </div>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  working.records.length > 0
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    working.records.length > 0 ? "bg-blue-500" : "bg-gray-400"
                  }`}
                ></span>
                <FiBarChart className="w-3 h-3" /> {working.records.length} Área
                {working.records.length !== 1 ? "s" : ""} Avaliada
                {working.records.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Preview do conteúdo */}
            {working.competencies.length > 0 || working.records.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-3">
                {/* Preview das competências */}
                {working.competencies.length > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-emerald-800 mb-2 flex items-center gap-1">
                      <HiLightBulb className="w-3 h-3" /> Competências Técnicas
                    </h4>
                    <div className="space-y-1">
                      {working.competencies.slice(0, 2).map((comp, index) => (
                        <p
                          key={index}
                          className="text-xs text-emerald-700 truncate"
                        >
                          • {comp}
                        </p>
                      ))}
                      {working.competencies.length > 2 && (
                        <p className="text-xs text-emerald-600 font-medium">
                          +{working.competencies.length - 2} mais...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview dos registros */}
                {working.records.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h4 className="text-xs font-semibold text-blue-800 mb-2 flex items-center gap-1">
                      <FiTrendingUp className="w-3 h-3" /> Progresso Avaliado
                    </h4>
                    <div className="space-y-1">
                      {working.records.slice(0, 2).map((record, index) => (
                        <p
                          key={index}
                          className="text-xs text-blue-700 truncate"
                        >
                          • {record.area}:{" "}
                          {record.levelAfter
                            ? `${record.levelAfter}/5`
                            : "Em avaliação"}
                        </p>
                      ))}
                      {working.records.length > 2 && (
                        <p className="text-xs text-blue-600 font-medium">
                          +{working.records.length - 2} mais...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <HiLightBulb className="w-3 h-3 text-gray-500" />
                  </div>
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <FiTrendingUp className="w-3 h-3 text-gray-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Nenhuma competência ou progresso definido
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Clique em "Editar" para começar
                </p>
              </div>
            )}
          </div>
        }
        onToggleEdit={() => {
          // Toggle ambas as seções juntas
          const isAnyEditing =
            editingSections.competencies || editingSections.results;
          if (isAnyEditing) {
            // Se qualquer uma está editando, feche ambas
            if (editingSections.competencies) toggleSection("competencies");
            if (editingSections.results) toggleSection("results");
          } else {
            // Se nenhuma está editando, abra ambas
            toggleSection("competencies");
            toggleSection("results");
          }
        }}
        onAddCompetency={addCompetency}
        onRemoveCompetency={removeCompetency}
        onUpdateRecord={updateRecord}
        onAddRecord={addRecord}
        onRemoveRecord={removeRecord}
      />

      <MilestonesSection
        milestones={working.milestones}
        onAdd={addMilestone}
        onRemove={removeMilestone}
        onUpdate={updateMilestone}
        editingIds={editingMilestones}
        onToggleEdit={toggleMilestone}
        enableSort={!saving && !pendingSave && editingMilestones.size === 0}
        editing={editingMilestones.size > 0}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <SaveStatusBar
        updatedAt={working.updatedAt}
        saving={saving}
        pending={pendingSave}
        activeEditing={isAnythingEditing}
      />

      <PdiTabs
        cycles={cycles}
        selectedCycleId={selectedCycleId}
        onCreateCycle={createCycle}
        onUpdateCycle={updateCycle}
        onDeleteCycle={deleteCycle}
        onSelectCycle={setSelectedCycleId}
        pdiContent={pdiContent}
      />
    </div>
  );
};
