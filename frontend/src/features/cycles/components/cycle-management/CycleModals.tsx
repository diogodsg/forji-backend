import { X } from "lucide-react";
import { QuickCycleCreator } from "./QuickCycleCreator";
import { OneOnOneRecorder } from "../tracking-recorders/OneOnOneRecorder";
import {
  MentoringRecorderOptimized,
  CertificationRecorderOptimized,
} from "../tracking-recorders";
import { MilestoneCreator } from "./MilestoneCreator";
import { CompetencyManager } from "../competency-management/CompetencyManager";

type ModalType =
  | "createCycle"
  | "oneOnOne"
  | "mentoring"
  | "certification"
  | "milestone"
  | "competencies"
  | null;

interface CycleModalsProps {
  activeModal: ModalType;
  onClose: () => void;
  onSaveAction: (data: any) => void;
  onCycleCreated: () => void;
}

export function CycleModals({
  activeModal,
  onClose,
  onSaveAction,
  onCycleCreated,
}: CycleModalsProps) {
  return (
    <>
      {/* Modal de Criação de Ciclo */}
      {activeModal === "createCycle" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-xl border border-surface-300">
            <div className="flex items-center justify-between p-5 border-b border-surface-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Criar Novo Ciclo
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5">
              <QuickCycleCreator onCycleCreated={onCycleCreated} />
            </div>
          </div>
        </div>
      )}

      {/* Modais de Tracking */}
      <OneOnOneRecorder
        isOpen={activeModal === "oneOnOne"}
        onClose={onClose}
        onSave={onSaveAction}
      />

      <MentoringRecorderOptimized
        isOpen={activeModal === "mentoring"}
        onClose={onClose}
        onSave={onSaveAction}
      />

      <CertificationRecorderOptimized
        isOpen={activeModal === "certification"}
        onClose={onClose}
        onSave={onSaveAction}
      />

      <MilestoneCreator
        isOpen={activeModal === "milestone"}
        onClose={onClose}
        onSave={onSaveAction}
      />

      {/* Modal de Competências */}
      {activeModal === "competencies" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Competências
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <CompetencyManager />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
