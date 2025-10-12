// MOVED from src/components/EditablePdiView.tsx
// Adjusted import paths for feature module structure
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FiEdit2,
  FiTarget,
  FiPercent,
  FiTrendingDown,
  FiCalendar,
  FiType,
  FiTrash2,
} from "react-icons/fi";
import type { PdiMilestone, PdiPlan, PdiKeyResult } from "../types/pdi";
import { MilestonesSection } from "./sections/MilestonesSection";
import { NewCompetenciesSection } from "./sections/NewCompetenciesSection";
// import { ImprovedKeyResultsEditor } from "./editors/ImprovedKeyResultsEditor"; // legado (mantido comentado caso queira voltar)
import { MinimalKrEditor } from "./editors/MinimalKrEditor";
import { Modal } from "../../../shared/ui/Modal";
import { SaveStatusBar } from "./structure/structure";
import { CollapsibleSectionCard } from "../../../shared";
import { KeyResultsView, KeyResultsPreview } from "./structure/views";
import { usePdiEditing } from "../hooks/usePdiEditing";
import { useAutoSave } from "../hooks/useAutoSave";
import { useCyclesManagement } from "../hooks/useCyclesManagement";
import { PdiTabs } from "./PdiTabs";
import { PdiGamificationIntegration } from "@/features/gamification/components/PdiGamificationIntegration";

// Função para calcular progresso (copiada do MinimalKrEditor para consistência)
const calculateProgress = (
  criteriaType: string,
  criteria: string,
  status: string
): number => {
  if (!criteria || !status) return 0;

  switch (criteriaType) {
    case "percentage":
      const target = parseFloat(criteria);
      const current = parseFloat(status);
      if (isNaN(target) || isNaN(current) || target === 0) return 0;
      return Math.min((current / target) * 100, 100);

    case "increase":
      const incParts = criteria.split("|");
      if (incParts.length !== 2) return 0;
      const [initialInc, targetInc] = incParts.map((v) => parseFloat(v));
      const currentInc = parseFloat(status);
      if (isNaN(initialInc) || isNaN(targetInc) || isNaN(currentInc)) return 0;
      const totalIncNeeded = targetInc - initialInc;
      const currentIncProgress = currentInc - initialInc;
      if (totalIncNeeded <= 0) return 0;
      return Math.min(
        Math.max((currentIncProgress / totalIncNeeded) * 100, 0),
        100
      );

    case "decrease":
      const decParts = criteria.split("|");
      if (decParts.length !== 2) return 0;
      const [initialDec, targetDec] = decParts.map((v) => parseFloat(v));
      const currentDec = parseFloat(status);
      if (isNaN(initialDec) || isNaN(targetDec) || isNaN(currentDec)) return 0;
      const totalDecNeeded = initialDec - targetDec;
      const currentDecProgress = initialDec - currentDec;
      if (totalDecNeeded <= 0) return 0;
      return Math.min(
        Math.max((currentDecProgress / totalDecNeeded) * 100, 0),
        100
      );

    default:
      return 0;
  }
};

interface SelectedCompetency {
  competencyId: string;
  targetLevel: number;
  currentLevel?: number;
}

interface Props {
  initialPlan: PdiPlan;
  saveForUserId?: number; // se fornecido, salva via PUT /pdi/:userId
}

export const EditablePdiView: React.FC<Props> = ({
  initialPlan,
  saveForUserId,
}) => {
  const hasTarget = saveForUserId != null;

  // Estado das competências selecionadas (mockado para demonstração)
  const [selectedCompetencies, setSelectedCompetencies] = useState<
    SelectedCompetency[]
  >([
    {
      competencyId: "react-frontend",
      targetLevel: 3,
      currentLevel: 2,
    },
    {
      competencyId: "backend-apis",
      targetLevel: 2,
      currentLevel: 1,
    },
    {
      competencyId: "communication",
      targetLevel: 2,
      currentLevel: 1,
    },
  ]);

  // Gestão de ciclos
  const {
    cycles,
    selectedCycleId,
    selectedCycle,
    setSelectedCycleId,
    createCycle,
    updateCycle,
    deleteCycle,
    replaceCycle,
    updateSelectedCyclePdi,
    getCurrentPdiPlan,
  } = useCyclesManagement(initialPlan, saveForUserId);

  // Use o PDI do ciclo selecionado - memoizado para evitar recriações
  const currentPlan = useMemo(() => getCurrentPdiPlan(), [getCurrentPdiPlan]);
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
      // Não atualizar se alguma seção crítica estiver sendo editada
      if (
        editingSections.krs ||
        editingSections.competencies ||
        editingSections.results ||
        editingMilestones.size > 0
      ) {
        console.log("Atualização de ciclo pausada: seções em edição");
        return;
      }

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

  // Competency functions - keeping for future integration
  // const addCompetency = (c: string) =>
  //   dispatch({ type: "ADD_COMPETENCY", value: c });
  // const removeCompetency = (c: string) =>
  //   dispatch({ type: "REMOVE_COMPETENCY", value: c });

  const updateMilestone = (id: string, patch: Partial<PdiMilestone>) =>
    dispatch({ type: "UPDATE_MILESTONE", id, patch });
  const removeMilestone = (id: string) =>
    dispatch({ type: "REMOVE_MILESTONE", id });
  const addMilestone = () => dispatch({ type: "ADD_MILESTONE" });

  // Record functions - keeping for future integration
  // const updateRecord = (area: string, patch: Partial<PdiCompetencyRecord>) =>
  //   dispatch({ type: "UPDATE_RECORD", area, patch });
  // const addRecord = (area?: string) => {
  //   const name = (area || "").trim();
  //   if (!name) return;
  //   dispatch({
  //     type: "ADD_RECORD",
  //     record: { area: name, evidence: "" } as any,
  //   });
  // };
  // const removeRecord = (area: string) =>
  //   dispatch({ type: "REMOVE_RECORD", area });

  const addKr = () => dispatch({ type: "ADD_KR" });
  const updateKr = (id: string, patch: Partial<PdiKeyResult>) =>
    dispatch({ type: "UPDATE_KR", id, patch });
  const removeKr = (id: string) => dispatch({ type: "REMOVE_KR", id });

  // --- Modal de edição minimalista ---
  const [krModalOpen, setKrModalOpen] = useState(false);
  const [editingKrId, setEditingKrId] = useState<string | null>(null);

  const openCreateKr = () => {
    addKr();
    // Esperar flush do estado síncrono: pegar último KR
    const newId =
      state.working.krs?.[state.working.krs.length - 1]?.id || undefined;
    setEditingKrId(newId || null);
    setKrModalOpen(true);
  };
  const openEditKr = (id: string) => {
    setEditingKrId(id);
    setKrModalOpen(true);
  };
  const closeKrModal = () => {
    setKrModalOpen(false);
    setEditingKrId(null);
  };

  // Sincronizar estado do modal com proteção de edição
  useEffect(() => {
    if (krModalOpen && !editingSections.krs) {
      dispatch({ type: "TOGGLE_SECTION", section: "krs" });
    } else if (!krModalOpen && editingSections.krs) {
      dispatch({ type: "TOGGLE_SECTION", section: "krs" });
    }
  }, [krModalOpen, editingSections.krs, dispatch]);

  const currentEditingKr = editingKrId
    ? (working.krs || []).find((k) => k.id === editingKrId)
    : null;

  const isHistorical = selectedCycle?.status === "completed";

  const pdiContent = (
    <div className="space-y-10">
      <CollapsibleSectionCard
        icon={() => (
          <span className="text-indigo-600 font-bold text-lg">KR</span>
        )}
        title="Key Results"
        defaultExpanded={false}
        forceExpanded={false}
        preview={<KeyResultsPreview krs={working.krs || []} />}
        action={
          !isHistorical && (
            <div className="flex gap-2">
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {(working.krs || []).length} KR
                {(working.krs || []).length !== 1 ? "s" : ""}
              </span>
            </div>
          )
        }
      >
        <KeyResultsView
          krs={working.krs || []}
          onEditKr={(krId) => openEditKr(krId)}
          onCreateKr={openCreateKr}
        />
      </CollapsibleSectionCard>

      {/* Modal principal de gerenciamento */}
      <Modal
        open={krModalOpen && !!currentEditingKr}
        onClose={closeKrModal}
        title="Editar Key Result"
        size="xl"
        footer={
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentEditingKr) removeKr(currentEditingKr.id);
                closeKrModal();
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-red-300 text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
            >
              Excluir
            </button>
            <button
              onClick={closeKrModal}
              className="px-6 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
            >
              Salvar & Concluir
            </button>
          </div>
        }
      >
        {currentEditingKr ? (
          <MinimalKrEditor
            kr={currentEditingKr}
            onChange={(patch: any) => updateKr(currentEditingKr.id, patch)}
          />
        ) : (
          <div className="space-y-6">
            {(working.krs || []).length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <FiTarget className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Nenhuma Key Result ainda
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  Comece criando sua primeira Key Result para este PDI.
                </p>
                <button
                  onClick={openCreateKr}
                  className="px-6 py-2.5 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                >
                  Criar Primera Key Result
                </button>
              </div>
            )}

            {(working.krs || []).length > 0 && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Suas Key Results
                  </h3>
                  <span className="text-sm text-slate-500">
                    {(working.krs || []).length} KR
                    {(working.krs || []).length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid gap-4">
                  {(working.krs || []).map((kr) => {
                    const criteriaType = kr.successCriteria?.includes("|")
                      ? kr.successCriteria?.split("|").length === 2 &&
                        parseFloat(kr.successCriteria.split("|")[0]) >
                          parseFloat(kr.successCriteria.split("|")[1])
                        ? "decrease"
                        : "increase"
                      : /^\d{4}-\d{2}-\d{2}$/.test(kr.successCriteria || "")
                      ? "date"
                      : /^\d+$/.test(kr.successCriteria || "")
                      ? "percentage"
                      : "text";
                    const progress = calculateProgress(
                      criteriaType,
                      kr.successCriteria || "",
                      kr.currentStatus || ""
                    );

                    return (
                      <div
                        key={kr.id}
                        className="group p-4 border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          {/* Ícone do tipo */}
                          <div
                            className={`p-2 rounded-lg ${
                              criteriaType === "percentage"
                                ? "bg-blue-100 text-blue-600"
                                : criteriaType === "increase"
                                ? "bg-green-100 text-green-600"
                                : criteriaType === "decrease"
                                ? "bg-orange-100 text-orange-600"
                                : criteriaType === "date"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {criteriaType === "percentage" && (
                              <FiPercent className="w-4 h-4" />
                            )}
                            {criteriaType === "increase" && (
                              <FiTarget className="w-4 h-4" />
                            )}
                            {criteriaType === "decrease" && (
                              <FiTrendingDown className="w-4 h-4" />
                            )}
                            {criteriaType === "date" && (
                              <FiCalendar className="w-4 h-4" />
                            )}
                            {criteriaType === "text" && (
                              <FiType className="w-4 h-4" />
                            )}
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 min-w-0">
                            <button
                              onClick={() => openEditKr(kr.id)}
                              className="text-left w-full group-hover:text-indigo-700 transition-colors"
                            >
                              <h4 className="font-semibold text-slate-900 group-hover:text-indigo-900 mb-1">
                                {kr.description || "Key Result sem título"}
                              </h4>
                              {kr.successCriteria && (
                                <p className="text-sm text-slate-600 mb-2">
                                  Meta: {kr.successCriteria}
                                </p>
                              )}

                              {/* Barra de progresso para tipos numéricos */}
                              {["percentage", "increase", "decrease"].includes(
                                criteriaType
                              ) &&
                                progress >= 0 && (
                                  <div className="mb-2">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-slate-600">
                                        Progresso
                                      </span>
                                      <span className="text-xs font-bold text-slate-800">
                                        {Math.round(progress)}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                                      <div
                                        className={`h-1.5 rounded-full transition-all duration-300 ${
                                          criteriaType === "percentage"
                                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                            : criteriaType === "increase"
                                            ? "bg-gradient-to-r from-green-500 to-green-600"
                                            : "bg-gradient-to-r from-orange-500 to-orange-600"
                                        }`}
                                        style={{
                                          width: `${Math.min(progress, 100)}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                              {kr.currentStatus && (
                                <p className="text-xs text-slate-500">
                                  Status: {kr.currentStatus}
                                </p>
                              )}
                            </button>
                          </div>

                          {/* Ações */}
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditKr(kr.id)}
                              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <FiEdit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeKr(kr.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Remover"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      <NewCompetenciesSection
        editing={
          !isHistorical &&
          (editingSections.competencies || editingSections.results)
        }
        onToggleEdit={() => {
          if (isHistorical) return;
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
        userId={saveForUserId}
        selectedCompetencies={selectedCompetencies}
        onUpdateCompetencies={(competencies) => {
          setSelectedCompetencies(competencies);
          console.log("Competências atualizadas:", competencies);
          // TODO: Integrar com salvamento do PDI
        }}
      />

      <MilestonesSection
        milestones={working.milestones}
        onAdd={addMilestone}
        onRemove={removeMilestone}
        onUpdate={updateMilestone}
        editingIds={editingMilestones}
        onToggleEdit={(id) => {
          if (!isHistorical) toggleMilestone(id);
        }}
        enableSort={
          !isHistorical &&
          !saving &&
          !pendingSave &&
          editingMilestones.size === 0
        }
        editing={!isHistorical && editingMilestones.size > 0}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Gamification Integration - Only for current user's PDI */}
      {!saveForUserId && (
        <PdiGamificationIntegration
          cycleId={selectedCycle?.id}
          competencies={working.competencies}
        />
      )}

      <SaveStatusBar
        updatedAt={working.updatedAt}
        saving={isHistorical ? false : saving}
        pending={isHistorical ? false : pendingSave}
        activeEditing={!isHistorical && isAnythingEditing}
      />

      <PdiTabs
        cycles={cycles}
        selectedCycleId={selectedCycleId}
        onCreateCycle={createCycle}
        onUpdateCycle={updateCycle}
        onDeleteCycle={deleteCycle}
        onSelectCycle={setSelectedCycleId}
        onReplaceCycle={replaceCycle}
        pdiContent={pdiContent}
      />
    </div>
  );
};
