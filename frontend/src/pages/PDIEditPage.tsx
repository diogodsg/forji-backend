import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { useModalManager, createModalHelpers } from "@/hooks/useModalManager";
import { useActivitiesTimeline } from "@/features/cycles";
import {
  PDIEditHeader,
  PDIContentSections,
  PermissionDeniedPage,
  UserNotFoundPage,
  LoadingPage,
  usePDIEditData,
  usePDIEditActions,
} from "./PDIEditPage/index";

/**
 * PDIEditPage - Página dedicada para gestores editarem PDI de subordinados
 *
 * Rota: /users/:userId/pdi/edit
 *
 * Funcionalidades:
 * - Verificação de permissão (manager → subordinado)
 * - Header com contexto gerencial claro
 * - Reutilização dos componentes de /development
 * - Navegação de volta ao perfil
 */
export function PDIEditPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // Hook para gerenciar dados do PDI
  const data = usePDIEditData(userId!);

  // Estados para modais de atividade
  const [deleteActivityModalState, setDeleteActivityModalState] = useState({
    isOpen: false,
    activityId: null as string | null,
    activityTitle: "",
    activityType: "",
    xpLoss: 0,
  });

  const [editActivityModalState, setEditActivityModalState] = useState({
    isOpen: false,
    activity: null as any | null,
  });

  // Modal Management
  const { modalState, openModal, closeModal } = useModalManager();

  // Modal Helpers
  const { handleClose } = createModalHelpers(openModal, closeModal);

  // Hook para gerenciar ações
  const actions = usePDIEditActions(
    data,
    (type: string, selectedId?: string) => openModal(type as any, selectedId),
    handleClose,
    deleteActivityModalState,
    setDeleteActivityModalState,
    setEditActivityModalState,
    modalState
  );

  // Mapear activities do backend para formato da Timeline
  const safeActivities = Array.isArray(data.activities) ? data.activities : [];
  const timelineActivities = useActivitiesTimeline(safeActivities);

  // Handlers para cancelar ações
  const handleCancelActivityEdit = () => {
    setEditActivityModalState({
      isOpen: false,
      activity: null,
    });
  };

  const handleCancelDeleteActivity = () => {
    setDeleteActivityModalState({
      isOpen: false,
      activityId: null,
      activityTitle: "",
      activityType: "",
      xpLoss: 0,
    });
  };

  // Navigation handlers
  const handleNavigateHome = () => navigate("/");
  const handleNavigateProfile = () => navigate(`/users/${userId}/profile`);
  const handleBack = () => navigate(`/users/${userId}/profile`);

  // Loading state
  if (data.loading) {
    return <LoadingPage />;
  }

  // Permission denied
  if (data.permissionChecked && !data.hasPermission) {
    return (
      <PermissionDeniedPage
        onNavigateHome={handleNavigateHome}
        onNavigateProfile={handleNavigateProfile}
        userId={userId}
      />
    );
  }

  // Error state - subordinate not found
  if (data.permissionChecked && data.hasPermission && !data.subordinate) {
    return <UserNotFoundPage onNavigateHome={handleNavigateHome} />;
  }

  // Error state - data loading error
  if (data.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Erro ao Carregar PDI
            </h2>
            <p className="text-gray-600 mb-6">
              Não foi possível carregar os dados do PDI de{" "}
              {data.subordinate?.name || "subordinado"}.
            </p>
            <button
              onClick={handleNavigateHome}
              className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No active cycle state
  if (!data.cycle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <PDIEditHeader subordinate={data.subordinate} onBack={handleBack} />

          <div className="bg-white rounded-xl shadow-sm border border-amber-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum Ciclo Ativo
              </h3>
              <p className="text-gray-600">
                {data.subordinate.name} não possui um ciclo de desenvolvimento
                ativo no momento.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render edit interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Gerencial */}
        <PDIEditHeader subordinate={data.subordinate} onBack={handleBack} />

        {/* PDI Content */}
        <PDIContentSections
          subordinate={data.subordinate}
          cycle={data.cycle}
          goals={data.goals}
          competencies={data.competencies}
          timelineActivities={timelineActivities}
          modalState={modalState}
          deleteActivityModalState={deleteActivityModalState}
          editActivityModalState={editActivityModalState}
          onGoalCreate={actions.handleGoalCreate}
          onGoalEdit={actions.handleGoalEdit}
          onGoalDelete={actions.handleGoalDelete}
          onGoalUpdateClick={actions.handleGoalUpdateClick}
          onGoalProgressUpdate={actions.handleGoalProgressUpdate}
          onGoalSave={actions.handleGoalSave}
          onCompetencyCreate={actions.handleCompetencyCreate}
          onCompetencyView={actions.handleCompetencyView}
          onCompetencyProgressUpdate={actions.handleCompetencyProgressUpdate}
          onCompetencyProgressSave={actions.handleCompetencyProgressSave}
          onCompetencyDelete={actions.handleCompetencyDelete}
          onCompetencySave={actions.handleCompetencySave}
          onActivityCreate={actions.handleActivityCreate}
          onActivityViewDetails={actions.handleActivityViewDetails}
          onActivityEdit={actions.handleActivityEdit}
          onActivityDeleteClick={actions.handleActivityDeleteClick}
          onOneOnOneSave={actions.handleOneOnOneSave}
          onMentoringSave={actions.handleMentoringSave}
          onOneOnOneEditSave={actions.handleOneOnOneEditSave}
          onCancelActivityEdit={handleCancelActivityEdit}
          onConfirmDeleteActivity={actions.handleConfirmDeleteActivity}
          onCancelDeleteActivity={handleCancelDeleteActivity}
          onClose={handleClose}
        />
      </div>
    </div>
  );
}
