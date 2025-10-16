import { useState } from "react";
import { Plus } from "lucide-react";
import { useCurrentCycle } from "../../hooks";
import { QuickActions } from "../ui-shared/QuickActions";
import { CycleMetrics } from "./CycleMetrics";
import { GoalsList } from "./GoalsList";
import { CompetenciesPreview } from "./CompetenciesPreview";
import { NextSteps } from "./NextSteps";
import { RecentActivity } from "./RecentActivity";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { CycleModals } from "./CycleModals";
import { CycleDebugPanel } from "../debug/CycleDebugPanel";

type ModalType =
  | "createCycle"
  | "oneOnOne"
  | "mentoring"
  | "certification"
  | "milestone"
  | "competencies"
  | null;

interface CurrentCycleMainProps {
  activeModal?: ModalType;
  onCloseModal?: () => void;
  onOpenModal?: (modal: ModalType) => void;
}

export function CurrentCycleMain({
  activeModal: externalActiveModal,
  onCloseModal: externalOnCloseModal,
  onOpenModal: externalOnOpenModal,
}: CurrentCycleMainProps = {}) {
  const { currentCycle, loading, hasActiveCycle } = useCurrentCycle();
  const [internalActiveModal, setInternalActiveModal] =
    useState<ModalType>(null);

  // Use external modal state if provided, otherwise use internal
  const activeModal =
    externalActiveModal !== undefined
      ? externalActiveModal
      : internalActiveModal;
  const setActiveModal = externalOnOpenModal || setInternalActiveModal;
  const closeModal =
    externalOnCloseModal || (() => setInternalActiveModal(null));

  const handleQuickAction = (
    action: "oneOnOne" | "mentoring" | "certification" | "milestone"
  ) => {
    setActiveModal(action);
  };

  const handleSaveAction = (data: any) => {
    console.log("Saving action data:", data);
    // Aqui integraria com a API
    closeModal();
    // TODO: Adicionar feedback visual de sucesso
  };

  const handleCycleCreated = () => {
    closeModal();
    // TODO: Trigger refresh dos dados
  };

  const handleGoalClick = (goalId: string) => {
    // TODO: Abrir modal de edição da meta
    console.log("Edit goal:", goalId);
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      {/* Conteúdo principal */}
      {hasActiveCycle ? (
        <div className="space-y-6">
          {/* 1. Quick Actions - Destaque máximo (primeira seção) */}
          <div className="bg-white rounded-xl border border-surface-300 shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-sm">
                <Plus className="w-4 h-4 text-white" />
              </div>
              Ações Rápidas
            </h2>
            <QuickActions onAction={handleQuickAction} />
          </div>

          {/* 2. Layout responsivo - Goals + Metrics + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna principal - Goals e métricas */}
            <div className="lg:col-span-2 space-y-6">
              <CycleMetrics cycle={currentCycle} />
              <GoalsList
                goals={currentCycle?.goals || null}
                onGoalClick={handleGoalClick}
                onCreateCycle={() => setActiveModal("createCycle")}
              />
            </div>

            {/* Sidebar - Competências e próximos passos */}
            <div className="space-y-6">
              <CompetenciesPreview
                onViewAll={() => setActiveModal("competencies")}
              />
              <NextSteps />
              <RecentActivity />
            </div>
          </div>
        </div>
      ) : (
        <EmptyState onCreateCycle={() => setActiveModal("createCycle")} />
      )}

      {/* Modals */}
      <CycleModals
        activeModal={activeModal}
        onClose={closeModal}
        onSaveAction={handleSaveAction}
        onCycleCreated={handleCycleCreated}
      />

      {/* Debug Panel - only shows in development */}
      <CycleDebugPanel />
    </div>
  );
}
