import { AlertTriangle, X, Trash2, Zap } from "lucide-react";
import { createPortal } from "react-dom";

interface DeleteActivityModalProps {
  isOpen: boolean;
  activityTitle: string;
  activityType: string;
  xpLoss: number; // XP que será perdido
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * DeleteActivityModal - Modal de confirmação para excluir atividade
 *
 * Avisa sobre:
 * - Perda irreversível da atividade
 * - Perda de XP associado à atividade
 * - Confirmação dupla para evitar exclusão acidental
 */
export function DeleteActivityModal({
  isOpen,
  activityTitle,
  activityType,
  xpLoss,
  onConfirm,
  onCancel,
}: DeleteActivityModalProps) {
  if (!isOpen) return null;

  const typeLabels: Record<string, string> = {
    ONE_ON_ONE: "1:1",
    MENTORING: "Mentoria",
    CERTIFICATION: "Certificação",
    GOAL_UPDATE: "Atualização de Meta",
    COMPETENCY_UPDATE: "Atualização de Competência",
  };

  const typeLabel = typeLabels[activityType] || activityType;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Warning */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Excluir Atividade</h2>
                <p className="text-red-100 text-sm">Ação irreversível</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="hover:bg-white/10 rounded-lg p-1.5 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tem certeza que deseja excluir esta atividade?
            </h3>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="text-xs font-medium text-gray-500 mb-1">
                {typeLabel}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">"{activityTitle}"</span>
              </div>
            </div>

            <div className="space-y-3 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">⚠️</span>
                <span>
                  <strong>Esta ação é irreversível.</strong> A atividade será
                  permanentemente excluída do seu ciclo.
                </span>
              </p>

              {xpLoss > 0 && (
                <p className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">💨</span>
                  <span>
                    <strong>Você perderá {xpLoss} XP</strong> obtido com esta
                    atividade.
                  </span>
                </p>
              )}

              <p className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">📋</span>
                <span>
                  Todos os dados desta atividade (anotações, tópicos, próximos
                  passos) serão perdidos.
                </span>
              </p>
            </div>
          </div>

          {/* XP Loss Warning */}
          {xpLoss > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-red-800 font-semibold">
                    -{xpLoss} XP será removido
                  </div>
                  <div className="text-red-600 text-sm">
                    Seu nível pode diminuir após a exclusão
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Excluir Atividade
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
