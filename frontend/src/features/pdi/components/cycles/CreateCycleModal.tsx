import { useState } from "react";
import { FiX } from "react-icons/fi";
import { format, addMonths, startOfMonth, endOfMonth } from "date-fns";
import type { PdiCycle } from "../../types/pdi";

interface CreateCycleModalProps {
  onClose: () => void;
  onCreate: (cycle: Omit<PdiCycle, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function CreateCycleModal({ onClose, onCreate }: CreateCycleModalProps) {
  const today = new Date();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: format(startOfMonth(today), "yyyy-MM-dd"),
    endDate: format(endOfMonth(addMonths(today, 2)), "yyyy-MM-dd"), // 3 meses por padrão
    status: 'planned' as PdiCycle['status'],
  });

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

    const cycleData: Omit<PdiCycle, 'id' | 'createdAt' | 'updatedAt'> = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status,
      pdi: {
        competencies: [],
        milestones: [],
        krs: [],
        records: [],
      },
    };

    onCreate(cycleData);
  };

  const handleQuickPreset = (months: number) => {
    const start = startOfMonth(today);
    const end = endOfMonth(addMonths(start, months - 1));
    setFormData(prev => ({
      ...prev,
      startDate: format(start, "yyyy-MM-dd"),
      endDate: format(end, "yyyy-MM-dd"),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Criar Novo Ciclo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título do Ciclo *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Ex: Q4 2025 - Desenvolvimento Backend"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição (opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
              placeholder="Descreva os objetivos ou foco deste ciclo..."
            />
          </div>

          {/* Presets de Duração */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duração Rápida
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset(1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                1 mês
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(3)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                3 meses
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(6)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                6 meses
              </button>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Início *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Fim *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Inicial
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as PdiCycle['status'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="planned">Planejado</option>
              <option value="active">Ativo</option>
            </select>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Criar Ciclo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}