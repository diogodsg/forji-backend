import React, { useState } from 'react';
import { X, Calendar, Target, Trophy, CheckCircle } from 'lucide-react';

interface MilestoneCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestone: Milestone) => void;
}

interface Milestone {
  title: string;
  description: string;
  type: 'goal_progress' | 'skill_developed' | 'project_completed' | 'recognition' | 'other';
  relatedGoalId?: string;
  achievedAt: string;
  xpAwarded: number;
  evidence?: string;
  impactLevel: 'low' | 'medium' | 'high';
}

export function MilestoneCreator({ isOpen, onClose, onSave }: MilestoneCreatorProps) {
  const [formData, setFormData] = useState<Partial<Milestone>>({
    achievedAt: new Date().toISOString().split('T')[0],
    type: 'goal_progress',
    impactLevel: 'medium',
    xpAwarded: 50,
  });

  const milestoneTypes = [
    { 
      value: 'goal_progress', 
      label: 'Progresso em Meta', 
      emoji: '🎯',
      description: 'Avanço significativo em um objetivo',
      baseXp: 50
    },
    { 
      value: 'skill_developed', 
      label: 'Habilidade Desenvolvida', 
      emoji: '🧠',
      description: 'Nova competência adquirida',
      baseXp: 75
    },
    { 
      value: 'project_completed', 
      label: 'Projeto Concluído', 
      emoji: '🚀',
      description: 'Entrega importante finalizada',
      baseXp: 100
    },
    { 
      value: 'recognition', 
      label: 'Reconhecimento', 
      emoji: '🏆',
      description: 'Feedback positivo ou premiação',
      baseXp: 60
    },
    { 
      value: 'other', 
      label: 'Outro', 
      emoji: '✨',
      description: 'Conquista personalizada',
      baseXp: 40
    }
  ];

  const impactLevels = [
    { value: 'low', label: 'Baixo', multiplier: 0.8, color: 'text-gray-600' },
    { value: 'medium', label: 'Médio', multiplier: 1.0, color: 'text-blue-600' },
    { value: 'high', label: 'Alto', multiplier: 1.5, color: 'text-purple-600' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.description && formData.achievedAt) {
      onSave(formData as Milestone);
      onClose();
    }
  };

  const handleTypeChange = (type: string) => {
    const typeData = milestoneTypes.find(t => t.value === type);
    const impactMultiplier = impactLevels.find(i => i.value === formData.impactLevel)?.multiplier || 1;
    
    setFormData(prev => ({
      ...prev,
      type: type as Milestone['type'],
      xpAwarded: Math.round((typeData?.baseXp || 50) * impactMultiplier)
    }));
  };

  const handleImpactChange = (impact: string) => {
    const typeData = milestoneTypes.find(t => t.value === formData.type);
    const impactMultiplier = impactLevels.find(i => i.value === impact)?.multiplier || 1;
    
    setFormData(prev => ({
      ...prev,
      impactLevel: impact as Milestone['impactLevel'],
      xpAwarded: Math.round((typeData?.baseXp || 50) * impactMultiplier)
    }));
  };

  if (!isOpen) return null;

  const selectedType = milestoneTypes.find(t => t.value === formData.type);
  const selectedImpact = impactLevels.find(i => i.value === formData.impactLevel);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl border border-surface-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Registrar Marco</h2>
              <p className="text-sm text-gray-600">Celebre uma conquista importante</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tipo de Marco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de Marco
            </label>
            <div className="grid grid-cols-1 gap-3">
              {milestoneTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleTypeChange(type.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                    formData.type === type.value
                      ? 'border-purple-300 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{type.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm opacity-70">{type.description}</div>
                  </div>
                  <div className="text-xs font-medium px-2 py-1 bg-white/50 rounded">
                    +{type.baseXp} XP
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Conquista *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder={`ex: ${selectedType?.label || 'Descreva sua conquista'}`}
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Descreva o que foi conquistado e seu impacto..."
              required
            />
          </div>

          {/* Data e Impacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Data da Conquista *
              </label>
              <input
                type="date"
                value={formData.achievedAt || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, achievedAt: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Impacto
              </label>
              <select
                value={formData.impactLevel || 'medium'}
                onChange={(e) => handleImpactChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {impactLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label} (x{level.multiplier})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Evidência */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidência / Link (opcional)
            </label>
            <input
              type="text"
              value={formData.evidence || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, evidence: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="URL, documento, PR, etc..."
            />
          </div>

          {/* Preview XP */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-purple-600" />
                <div>
                  <h4 className="font-medium text-purple-800">
                    {selectedType?.emoji} {selectedType?.label}
                  </h4>
                  <p className="text-sm text-purple-600">
                    Impacto {selectedImpact?.label} {selectedImpact && `(${selectedImpact.multiplier}x)`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  +{formData.xpAwarded} XP
                </div>
                <div className="text-xs text-purple-500">
                  XP a ser ganho
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Registrar Marco
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}