import { AlertTriangle, X, Trash2 } from "lucide-react";
import { createPortal } from "react-dom";

interface DeleteGoalModalProps {
  isOpen: boolean;
  goalTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * DeleteGoalModal - Modal de confirmação para excluir meta
 */
export function DeleteGoalModal({
  isOpen,
  goalTitle,
  onConfirm,
  onCancel,
}: DeleteGoalModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Excluir Meta</h2>
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
          <p className="text-gray-700 mb-4">
            Tem certeza que deseja excluir a meta <strong>"{goalTitle}"</strong>
            ?
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-amber-800">
              <strong>
                Todo o XP ganho com esta meta será perdido permanentemente.
              </strong>
            </p>
          </div>

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
              Excluir Meta
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
