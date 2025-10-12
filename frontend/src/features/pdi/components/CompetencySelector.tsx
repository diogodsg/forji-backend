import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiCheck,
  FiCode,
  FiUsers,
  FiTrendingUp,
  FiTarget,
  FiInfo,
} from "react-icons/fi";
import { COMPETENCY_AREAS } from "../data/competencies";

interface SelectedCompetency {
  competencyId: string;
  targetLevel: number;
  currentLevel?: number;
}

interface CompetencySelectorProps {
  selectedCompetencies: SelectedCompetency[];
  onToggleCompetency: (competencyId: string, targetLevel: number) => void;
  onRemoveCompetency: (competencyId: string) => void;
  maxSelections?: number;
}

export function CompetencySelector({
  selectedCompetencies,
  onToggleCompetency,
  onRemoveCompetency,
  maxSelections = 10,
}: CompetencySelectorProps) {
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(
    new Set(["technical"])
  );
  const [expandedCompetencies, setExpandedCompetencies] = useState<Set<string>>(
    new Set()
  );

  const toggleArea = (areaId: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(areaId)) {
      newExpanded.delete(areaId);
    } else {
      newExpanded.add(areaId);
    }
    setExpandedAreas(newExpanded);
  };

  const toggleCompetency = (competencyId: string) => {
    const newExpanded = new Set(expandedCompetencies);
    if (newExpanded.has(competencyId)) {
      newExpanded.delete(competencyId);
    } else {
      newExpanded.add(competencyId);
    }
    setExpandedCompetencies(newExpanded);
  };

  const getSelectedLevel = (competencyId: string) => {
    const selected = selectedCompetencies.find(
      (comp) => comp.competencyId === competencyId
    );
    return selected?.targetLevel;
  };

  const canSelectMore = selectedCompetencies.length < maxSelections;

  const getAreaIcon = (iconName: string) => {
    const icons = {
      FiCode: FiCode,
      FiUsers: FiUsers,
      FiTrendingUp: FiTrendingUp,
      FiBulb: FiTarget, // Substituindo por FiTarget já que FiBulb não existe
    };
    const IconComponent = icons[iconName as keyof typeof icons] || FiTarget;
    return <IconComponent className="w-5 h-5" />;
  };

  const getAreaColor = (color: string) => {
    const colors = {
      blue: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
      green: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
      purple: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
      orange: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getLevelColor = (level: number, isSelected: boolean = false) => {
    if (isSelected) {
      return "bg-blue-50 border-blue-300 text-blue-800 ring-1 ring-blue-500";
    }

    const colors = {
      1: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
      2: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
      3: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
    };
    return colors[level as keyof typeof colors] || colors[1];
  };

  const handleLevelClick = (competencyId: string, level: number) => {
    const currentSelected = getSelectedLevel(competencyId);

    if (currentSelected === level) {
      // Se já está selecionado, remove
      onRemoveCompetency(competencyId);
    } else if (currentSelected) {
      // Se tem outro nível selecionado, atualiza
      onToggleCompetency(competencyId, level);
    } else if (canSelectMore) {
      // Se não tem nada selecionado e pode adicionar mais
      onToggleCompetency(competencyId, level);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Competências e Resultados
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Escolha as competências que deseja desenvolver e o nível objetivo
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900">
            {selectedCompetencies.length} de {maxSelections} competências
          </div>
          <div className="text-xs text-gray-500">selecionadas</div>
        </div>
      </div>

      {/* Competências selecionadas - resumo */}
      {selectedCompetencies.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Competências Selecionadas
          </h4>
          <div className="space-y-2">
            {selectedCompetencies.map((selected) => {
              const competency = COMPETENCY_AREAS.flatMap(
                (area) => area.competencies
              ).find((c) => c.id === selected.competencyId);

              if (!competency) return null;

              const level = competency.levels.find(
                (l) => l.level === selected.targetLevel
              );

              return (
                <div
                  key={selected.competencyId}
                  className="flex items-center justify-between bg-white rounded border border-gray-200 px-3 py-2"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      {competency.name}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(
                        selected.targetLevel,
                        true
                      )}`}
                    >
                      Nível {selected.targetLevel} - {level?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveCompetency(selected.competencyId)}
                    className="text-gray-500 hover:text-red-600 text-sm"
                  >
                    Remover
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Limite atingido */}
      {!canSelectMore && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FiInfo className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              Limite de {maxSelections} competências atingido. Remova alguma
              competência para adicionar outras.
            </span>
          </div>
        </div>
      )}

      {/* Lista de áreas */}
      <div className="space-y-4">
        {COMPETENCY_AREAS.map((area) => (
          <div
            key={area.id}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Header da área */}
            <button
              onClick={() => toggleArea(area.id)}
              className={`w-full px-4 py-4 flex items-center justify-between border ${getAreaColor(
                area.color
              )} transition-colors`}
            >
              <div className="flex items-center space-x-3">
                {getAreaIcon(area.icon)}
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    {expandedAreas.has(area.id) ? (
                      <FiChevronDown className="w-4 h-4" />
                    ) : (
                      <FiChevronRight className="w-4 h-4" />
                    )}
                    <span className="font-semibold">{area.name}</span>
                  </div>
                  <div className="text-sm opacity-75">{area.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {area.competencies.length} competências
                </div>
                <div className="text-xs opacity-75">
                  {
                    selectedCompetencies.filter((s) =>
                      area.competencies.some((c) => c.id === s.competencyId)
                    ).length
                  }{" "}
                  selecionadas
                </div>
              </div>
            </button>

            {/* Conteúdo da área */}
            {expandedAreas.has(area.id) && (
              <div className="bg-white border-t border-gray-100">
                <div className="divide-y divide-gray-100">
                  {area.competencies.map((competency) => {
                    const selectedLevel = getSelectedLevel(competency.id);

                    return (
                      <div key={competency.id} className="px-4 py-4">
                        {/* Header da competência */}
                        <div className="flex items-center justify-between mb-3">
                          <button
                            onClick={() => toggleCompetency(competency.id)}
                            className="flex items-center space-x-2 text-left hover:bg-gray-50 -mx-2 px-2 py-1 rounded flex-1"
                          >
                            {expandedCompetencies.has(competency.id) ? (
                              <FiChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <FiChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {competency.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                {competency.description}
                              </div>
                            </div>
                          </button>

                          {selectedLevel && (
                            <div className="flex items-center space-x-2">
                              <FiCheck className="w-4 h-4 text-blue-600" />
                              <span className="text-sm text-blue-600 font-medium">
                                Nível {selectedLevel} selecionado
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Níveis da competência */}
                        {expandedCompetencies.has(competency.id) && (
                          <div className="ml-6 space-y-3">
                            {competency.levels.map((level) => {
                              const isLevelSelected =
                                selectedLevel === level.level;
                              const isDisabled =
                                !canSelectMore &&
                                !selectedLevel &&
                                !isLevelSelected;

                              return (
                                <div
                                  key={level.level}
                                  className={`border rounded-lg p-4 transition-all cursor-pointer ${
                                    isLevelSelected
                                      ? getLevelColor(level.level, true)
                                      : isDisabled
                                      ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                      : `border-gray-200 ${getLevelColor(
                                          level.level
                                        )} hover:shadow-sm`
                                  }`}
                                  onClick={() =>
                                    !isDisabled &&
                                    handleLevelClick(competency.id, level.level)
                                  }
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                          isLevelSelected
                                            ? "bg-blue-50 border-blue-300 text-blue-800"
                                            : getLevelColor(level.level)
                                        }`}
                                      >
                                        Nível {level.level}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {level.name}
                                      </span>
                                      {isLevelSelected && (
                                        <FiCheck className="w-4 h-4 text-blue-600" />
                                      )}
                                    </div>
                                  </div>

                                  <p className="text-sm text-gray-700 mb-3">
                                    {level.description}
                                  </p>

                                  <div className="space-y-1">
                                    <div className="text-xs font-medium text-gray-600 mb-2">
                                      Indicadores de competência:
                                    </div>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                      {level.indicators.map(
                                        (indicator, index) => (
                                          <li
                                            key={index}
                                            className="flex items-start space-x-2"
                                          >
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                            <span>{indicator}</span>
                                          </li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
