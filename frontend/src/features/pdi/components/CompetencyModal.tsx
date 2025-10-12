import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX, FiCheck, FiInfo } from "react-icons/fi";
import { COMPETENCY_AREAS } from "../data/competencies";

interface SelectedCompetency {
  competencyId: string;
  targetLevel: number;
  currentLevel?: number;
}

interface CompetencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCompetencies: SelectedCompetency[];
  onSave: (competencies: SelectedCompetency[]) => void;
}

export function CompetencyModal({
  isOpen,
  onClose,
  selectedCompetencies: initialSelected,
  onSave,
}: CompetencyModalProps) {
  const [selectedCompetencies, setSelectedCompetencies] =
    useState<SelectedCompetency[]>(initialSelected);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(
    new Set(["technical"])
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

  const getSelectedLevel = (competencyId: string) => {
    const selected = selectedCompetencies.find(
      (comp) => comp.competencyId === competencyId
    );
    return selected?.targetLevel;
  };

  const handleLevelClick = (competencyId: string, level: number) => {
    const currentSelected = getSelectedLevel(competencyId);

    if (currentSelected === level) {
      // Remove se já está selecionado
      setSelectedCompetencies((prev) =>
        prev.filter((c) => c.competencyId !== competencyId)
      );
    } else if (currentSelected) {
      // Atualiza o nível se já existe
      setSelectedCompetencies((prev) =>
        prev.map((c) =>
          c.competencyId === competencyId ? { ...c, targetLevel: level } : c
        )
      );
    } else if (selectedCompetencies.length < 10) {
      // Adiciona nova competência se não exceder o limite
      setSelectedCompetencies((prev) => [
        ...prev,
        { competencyId, targetLevel: level },
      ]);
    }
  };

  const handleSave = () => {
    onSave(selectedCompetencies);
    onClose();
  };

  const handleCancel = () => {
    setSelectedCompetencies(initialSelected);
    onClose();
  };

  const getLevelColor = (level: number, isSelected: boolean = false) => {
    if (isSelected) {
      return "bg-blue-100 border-blue-300 text-blue-800 ring-1 ring-blue-500";
    }

    const colors = {
      1: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
      2: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
      3: "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100",
    };
    return colors[level as keyof typeof colors] || colors[1];
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900"
                    >
                      Escolher Competências
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Selecione as competências e níveis para este ciclo de PDI
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {selectedCompetencies.length} de 10 selecionadas
                    </span>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <FiX className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto space-y-4 mb-6">
                  {COMPETENCY_AREAS.map((area) => (
                    <div
                      key={area.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Area Header */}
                      <button
                        onClick={() => toggleArea(area.id)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-sm font-medium text-gray-900">
                            {area.name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {area.competencies.length} competências
                          </div>
                          <div className="text-xs text-gray-400">
                            {
                              selectedCompetencies.filter((s) =>
                                area.competencies.some(
                                  (c) => c.id === s.competencyId
                                )
                              ).length
                            }{" "}
                            selecionadas
                          </div>
                        </div>
                      </button>

                      {/* Area Content */}
                      {expandedAreas.has(area.id) && (
                        <div className="bg-white divide-y divide-gray-100">
                          {area.competencies.map((competency) => {
                            const selectedLevel = getSelectedLevel(
                              competency.id
                            );

                            return (
                              <div key={competency.id} className="p-4">
                                <div className="mb-3">
                                  <h4 className="font-medium text-gray-900">
                                    {competency.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {competency.description}
                                  </p>
                                </div>

                                <div className="flex space-x-3">
                                  {competency.levels.map((level) => {
                                    const isSelected =
                                      selectedLevel === level.level;
                                    const isDisabled =
                                      selectedCompetencies.length >= 10 &&
                                      !selectedLevel;

                                    return (
                                      <button
                                        key={level.level}
                                        onClick={() =>
                                          !isDisabled &&
                                          handleLevelClick(
                                            competency.id,
                                            level.level
                                          )
                                        }
                                        disabled={isDisabled}
                                        className={`flex-1 p-3 border rounded-lg text-sm transition-all ${
                                          isSelected
                                            ? getLevelColor(level.level, true)
                                            : isDisabled
                                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                                            : getLevelColor(level.level)
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-medium">
                                            Nível {level.level}
                                          </span>
                                          {isSelected && (
                                            <FiCheck className="w-4 h-4" />
                                          )}
                                        </div>
                                        <div className="text-xs opacity-75">
                                          {level.name}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    <FiInfo className="w-4 h-4 text-blue-600" /> Escolha
                    competências estratégicas para seu desenvolvimento neste
                    ciclo
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Salvar Competências
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
