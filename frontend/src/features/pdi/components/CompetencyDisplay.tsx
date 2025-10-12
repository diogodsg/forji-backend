import { useState } from "react";
import { FiPlus, FiEdit2, FiTarget } from "react-icons/fi";
import { CompetencyModal } from "./CompetencyModal";
import { getCompetencyById } from "../data/competencies";

interface SelectedCompetency {
  competencyId: string;
  targetLevel: number;
  currentLevel?: number;
}

interface CompetencyDisplayProps {
  selectedCompetencies: SelectedCompetency[];
  onUpdateCompetencies: (competencies: SelectedCompetency[]) => void;
  readonly?: boolean;
}

export function CompetencyDisplay({
  selectedCompetencies,
  onUpdateCompetencies,
  readonly = false,
}: CompetencyDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getLevelName = (level: number) => {
    const names = { 1: "Iniciante", 2: "Intermediário", 3: "Avançado" };
    return names[level as keyof typeof names] || "Nível " + level;
  };

  const getLevelColor = (level: number) => {
    const colors = {
      1: "bg-gray-100 text-gray-700 border-gray-300",
      2: "bg-gray-100 text-gray-700 border-gray-300",
      3: "bg-gray-100 text-gray-700 border-gray-300",
    };
    return colors[level as keyof typeof colors] || colors[1];
  };

  if (selectedCompetencies.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <FiTarget className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Nenhuma competência selecionada
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Defina as competências que deseja desenvolver neste ciclo
        </p>
        {!readonly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            Adicionar Competências
          </button>
        )}

        <CompetencyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedCompetencies={selectedCompetencies}
          onSave={onUpdateCompetencies}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Competências do Ciclo
          </h3>
          <p className="text-xs text-gray-500">
            {selectedCompetencies.length} competência
            {selectedCompetencies.length !== 1 ? "s" : ""} selecionada
            {selectedCompetencies.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!readonly && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FiEdit2 className="w-3 h-3 mr-1" />
            Editar
          </button>
        )}
      </div>

      {/* Competencies Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {selectedCompetencies.map((selected) => {
          const competency = getCompetencyById(selected.competencyId);
          const level = competency?.levels.find(
            (l) => l.level === selected.targetLevel
          );

          if (!competency || !level) return null;

          return (
            <div
              key={selected.competencyId}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900 leading-tight">
                  {competency.name}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(
                    selected.targetLevel
                  )}`}
                >
                  Nível {selected.targetLevel}
                </span>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Objetivo:</span>{" "}
                  {getLevelName(selected.targetLevel)}
                </div>

                {selected.currentLevel && (
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-500">
                      Atual: Nível {selected.currentLevel}
                    </span>
                    {selected.currentLevel < selected.targetLevel && (
                      <span className="text-blue-600">
                        ↗ +{selected.targetLevel - selected.currentLevel}
                      </span>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-500 line-clamp-2">
                  {level.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add More Button */}
      {!readonly && selectedCompetencies.length < 10 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiPlus className="w-4 h-4 mx-auto mb-1" />
          Adicionar mais competências
        </button>
      )}

      <CompetencyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCompetencies={selectedCompetencies}
        onSave={onUpdateCompetencies}
      />
    </div>
  );
}
