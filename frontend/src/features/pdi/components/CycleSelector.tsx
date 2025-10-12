import { FiCalendar, FiClock, FiCheck, FiPlay, FiPause } from "react-icons/fi";
import type { PdiCycle } from "../types/pdi";

interface CycleSelectorProps {
  cycles: PdiCycle[];
  selectedCycleId: string;
  onSelectCycle: (id: string) => void;
  showStatus?: boolean;
}

export function CycleSelector({
  cycles,
  selectedCycleId,
  onSelectCycle,
  showStatus = true,
}: CycleSelectorProps) {
  const getStatusIcon = (status: PdiCycle["status"]) => {
    switch (status) {
      case "active":
        return FiPlay;
      case "completed":
        return FiCheck;
      case "paused":
        return FiPause;
      case "planned":
        return FiClock;
      default:
        return FiCalendar;
    }
  };

  const getStatusColor = (status: PdiCycle["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "completed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "paused":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "planned":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusLabel = (status: PdiCycle["status"]) => {
    switch (status) {
      case "active":
        return "Ativo";
      case "completed":
        return "Concluído";
      case "paused":
        return "Pausado";
      case "planned":
        return "Planejado";
      default:
        return "Desconhecido";
    }
  };

  if (cycles.length === 0) {
    return (
      <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-center">
        <FiCalendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Nenhum ciclo encontrado</p>
        <p className="text-xs text-gray-400">Crie um novo ciclo para começar</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          Selecionar Ciclo:
        </span>
        <span className="text-xs text-gray-500">
          {cycles.length} ciclo{cycles.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-2">
        {cycles.map((cycle) => {
          const StatusIcon = getStatusIcon(cycle.status);
          const statusColor = getStatusColor(cycle.status);
          const statusLabel = getStatusLabel(cycle.status);
          const isSelected = cycle.id === selectedCycleId;

          return (
            <button
              key={cycle.id}
              onClick={() => onSelectCycle(cycle.id)}
              className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                  : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-25"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium truncate ${
                      isSelected ? "text-indigo-900" : "text-gray-900"
                    }`}
                  >
                    {cycle.title}
                  </h4>
                  {cycle.description && (
                    <p
                      className={`text-sm mt-1 line-clamp-2 ${
                        isSelected ? "text-indigo-700" : "text-gray-600"
                      }`}
                    >
                      {cycle.description}
                    </p>
                  )}
                </div>

                {showStatus && (
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ml-3 ${statusColor}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{statusLabel}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {new Date(cycle.startDate).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(cycle.endDate).toLocaleDateString("pt-BR")}
                </span>

                <div className="flex items-center space-x-3">
                  <span>{cycle.pdi.competencies.length} competências</span>
                  <span>{cycle.pdi.milestones.length} marcos</span>
                  {cycle.pdi.krs && cycle.pdi.krs.length > 0 && (
                    <span>{cycle.pdi.krs.length} KRs</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
