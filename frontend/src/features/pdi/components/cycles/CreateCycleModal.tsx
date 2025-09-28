import { useState, useEffect } from "react";
import { FiX, FiZap } from "react-icons/fi";
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

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSubmit(e as any);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
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

  const cycleTemplates = [
    {
      name: "Trimestre Atual",
      description: "Ciclo de 3 meses focado em objetivos de curto prazo",
      duration: 3,
      titleSuggestion: `Q${Math.ceil((today.getMonth() + 1) / 3)} ${today.getFullYear()}`,
    },
    {
      name: "Semestre",
      description: "Ciclo de 6 meses para projetos de médio prazo",
      duration: 6,
      titleSuggestion: `${today.getMonth() < 6 ? '1º' : '2º'} Semestre ${today.getFullYear()}`,
    },
    {
      name: "Sprint Mensal",
      description: "Ciclo de 1 mês para foco intensivo",
      duration: 1,
      titleSuggestion: `${today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}`,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Criar Novo Ciclo</h2>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FiZap className="w-3 h-3" />
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> para fechar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Ctrl+Enter</kbd> para criar
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

          {/* Templates de Ciclo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Templates Rápidos
            </label>
            <div className="space-y-2">
              {cycleTemplates.map((template) => (
                <button
                  key={template.name}
                  type="button"
                  onClick={() => {
                    handleQuickPreset(template.duration);
                    setFormData(prev => ({
                      ...prev,
                      title: template.titleSuggestion,
                      description: template.description,
                    }));
                  }}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                    </div>
                    <div className="text-xs text-gray-400 group-hover:text-indigo-600">
                      {template.duration} {template.duration === 1 ? 'mês' : 'meses'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Separador */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou configure manualmente</span>
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