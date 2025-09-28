import { FiAlertTriangle, FiX } from "react-icons/fi";
import type { PdiCycle } from "../../types/pdi";

interface DeleteCycleModalProps {
  cycle: PdiCycle;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCycleModal({
  cycle,
  onClose,
  onConfirm,
}: DeleteCycleModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const hasPdiData =
    cycle.pdi.competencies.length > 0 ||
    cycle.pdi.milestones.length > 0 ||
    (cycle.pdi.krs && cycle.pdi.krs.length > 0) ||
    cycle.pdi.records.length > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Excluir Ciclo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-gray-900 font-medium">
              Tem certeza que deseja excluir o ciclo "{cycle.title}"?
            </p>
            <p className="text-sm text-gray-600">
              Esta ação não pode ser desfeita.
            </p>
          </div>

          {/* Warning about PDI data */}
          {hasPdiData && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex gap-3">
                <FiAlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-amber-800">
                    Este ciclo contém dados de PDI
                  </h4>
                  <div className="text-sm text-amber-700 space-y-1">
                    <p>Os seguintes dados serão permanentemente perdidos:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      {cycle.pdi.competencies.length > 0 && (
                        <li>
                          {cycle.pdi.competencies.length} competência
                          {cycle.pdi.competencies.length !== 1 ? "s" : ""}
                        </li>
                      )}
                      {cycle.pdi.milestones.length > 0 && (
                        <li>
                          {cycle.pdi.milestones.length} marco
                          {cycle.pdi.milestones.length !== 1 ? "s" : ""}
                        </li>
                      )}
                      {cycle.pdi.krs && cycle.pdi.krs.length > 0 && (
                        <li>
                          {cycle.pdi.krs.length} Key Result
                          {cycle.pdi.krs.length !== 1 ? "s" : ""}
                        </li>
                      )}
                      {cycle.pdi.records.length > 0 && (
                        <li>
                          {cycle.pdi.records.length} evidência
                          {cycle.pdi.records.length !== 1 ? "s" : ""}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Cycle info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Período:</span>
              <span className="ml-2 text-gray-600">
                {new Date(cycle.startDate).toLocaleDateString("pt-BR")} -{" "}
                {new Date(cycle.endDate).toLocaleDateString("pt-BR")}
              </span>
            </div>
            {cycle.description && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Descrição:</span>
                <span className="ml-2 text-gray-600">{cycle.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Excluir Ciclo
          </button>
        </div>
      </div>
    </div>
  );
}
