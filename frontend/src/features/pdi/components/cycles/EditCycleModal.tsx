import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import type { PdiCycle } from "../../types/pdi";

interface EditCycleModalProps {
  cycle: PdiCycle;
  onClose: () => void;
  onUpdate: (cycleId: string, updates: Partial<PdiCycle>) => void;
}

export function EditCycleModal({
  cycle,
  onClose,
  onUpdate,
}: EditCycleModalProps) {
  const [formData, setFormData] = useState({
    title: cycle.title,
    description: cycle.description || "",
    startDate: cycle.startDate,
    endDate: cycle.endDate,
    status: cycle.status,
  });

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Por favor, insira um título para o ciclo.");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      alert("A data de início deve ser anterior à data de fim.");
      return;
    }

    const updates: Partial<PdiCycle> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
    };

    onUpdate(cycle.id, updates);
    onClose();
  };

  const getStatusOptions = () => {
    const options = [
      { value: "planned", label: "Planejado" },
      { value: "active", label: "Ativo" },
      { value: "paused", label: "Pausado" },
      { value: "completed", label: "Concluído" },
    ];

    // Permitir transições lógicas baseadas no status atual
    switch (cycle.status) {
      case "planned":
        return options.filter((opt) =>
          ["planned", "active"].includes(opt.value)
        );
      case "active":
        return options.filter((opt) =>
          ["active", "paused", "completed"].includes(opt.value)
        );
      case "paused":
        return options.filter((opt) =>
          ["paused", "active", "completed"].includes(opt.value)
        );
      case "completed":
        return options.filter((opt) =>
          ["completed", "active"].includes(opt.value)
        );
      default:
        return options;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Editar Ciclo
            </h2>
            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
              <span>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                  Esc
                </kbd>{" "}
                fechar
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                  Ctrl+Enter
                </kbd>{" "}
                salvar
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Título */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Título do Ciclo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: Q4 2025 - Desenvolvimento Backend"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
              placeholder="Descreva os objetivos ou foco deste ciclo..."
            />
          </div>

          {/* Datas e Status em uma linha */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Data de Início *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Data de Fim *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as PdiCycle["status"],
                  }))
                }
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {getStatusOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Informações do Ciclo - mais compacto */}
          <div className="bg-gray-50 p-2 rounded">
            <h4 className="text-xs font-medium text-gray-700 mb-1">
              Dados do PDI neste ciclo
            </h4>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>{cycle.pdi.competencies.length} competências</span>
              <span>{cycle.pdi.krs?.length || 0} KRs</span>
              <span>{cycle.pdi.milestones.length} marcos</span>
              <span>{cycle.pdi.records.length} registros</span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
