import { useState, useEffect } from "react";
import { FiInfo } from "react-icons/fi";
import { CompetencySelector } from "./CompetencySelector";
import { useUserCompetencies } from "../hooks/useUserCompetencies";

interface SelectedCompetency {
  competencyId: string;
  targetLevel: number;
  currentLevel?: number;
}

interface CompetencyManagerProps {
  userId?: number;
  onSave?: (competencies: SelectedCompetency[]) => void;
}

export function CompetencyManager({ userId, onSave }: CompetencyManagerProps) {
  const {
    competencies: initialCompetencies,
    isLoading,
    saveCompetencies,
  } = useUserCompetencies(userId);
  const [selectedCompetencies, setSelectedCompetencies] = useState<
    SelectedCompetency[]
  >([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Sincroniza com dados carregados
  useEffect(() => {
    if (!isLoading && initialCompetencies.length > 0) {
      setSelectedCompetencies(initialCompetencies);
    }
  }, [isLoading, initialCompetencies]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleToggleCompetency = (
    competencyId: string,
    targetLevel: number
  ) => {
    setSelectedCompetencies((prev) => {
      const existing = prev.find((c) => c.competencyId === competencyId);

      if (existing) {
        // Atualiza o nível se já existe
        const updated = prev.map((c) =>
          c.competencyId === competencyId ? { ...c, targetLevel } : c
        );
        setHasChanges(true);
        return updated;
      } else {
        // Adiciona nova competência
        const updated = [...prev, { competencyId, targetLevel }];
        setHasChanges(true);
        return updated;
      }
    });
  };

  const handleRemoveCompetency = (competencyId: string) => {
    setSelectedCompetencies((prev) => {
      const updated = prev.filter((c) => c.competencyId !== competencyId);
      setHasChanges(true);
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      await saveCompetencies(selectedCompetencies);
      onSave?.(selectedCompetencies);
      setHasChanges(false);
    } catch (error) {
      console.error("Erro ao salvar competências:", error);
    }
  };

  const handleReset = () => {
    setSelectedCompetencies(initialCompetencies);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header com ações */}
      {hasChanges && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Alterações não salvas
              </h4>
              <p className="text-sm text-blue-700">
                Você fez alterações nas competências. Salve para manter as
                mudanças.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReset}
                className="px-3 py-2 text-sm text-blue-700 hover:text-blue-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Seletor de competências */}
      <CompetencySelector
        selectedCompetencies={selectedCompetencies}
        onToggleCompetency={handleToggleCompetency}
        onRemoveCompetency={handleRemoveCompetency}
        maxSelections={10}
      />

      {/* Informações adicionais */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          <FiInfo className="w-4 h-4 text-blue-600" /> Dica sobre Competências
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>
            • Escolha até 10 competências para focar no seu desenvolvimento
          </li>
          <li>• Defina níveis realistas baseados em onde você quer chegar</li>
          <li>• Use os indicadores como guia para avaliar seu progresso</li>
          <li>• Revise e ajuste suas competências a cada ciclo de PDI</li>
        </ul>
      </div>
    </div>
  );
}
