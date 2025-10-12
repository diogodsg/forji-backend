import { useState } from "react";
import { FiCalendar, FiFilter, FiX } from "react-icons/fi";

interface HistoryFiltersProps {
  filters: {
    year: string;
    competency: string;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function HistoryFilters({
  filters,
  onFiltersChange,
}: HistoryFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const yearOptions = [
    { value: "all", label: "Todos os anos" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
  ];

  const competencyOptions = [
    { value: "all", label: "Todas as competências" },
    { value: "technical", label: "Técnicas" },
    { value: "leadership", label: "Liderança" },
    { value: "communication", label: "Comunicação" },
    { value: "problem-solving", label: "Resolução de Problemas" },
  ];

  const statusOptions = [
    { value: "all", label: "Todos os status" },
    { value: "completed", label: "Concluídos" },
    { value: "in-progress", label: "Em andamento" },
    { value: "not-started", label: "Não iniciados" },
  ];

  const hasActiveFilters =
    filters.year !== "all" ||
    filters.competency !== "all" ||
    filters.status !== "all";

  const clearFilters = () => {
    onFiltersChange({
      year: "all",
      competency: "all",
      status: "all",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              hasActiveFilters
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FiFilter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {
                  Object.values(filters).filter((value) => value !== "all")
                    .length
                }
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-4 h-4" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <FiCalendar className="w-4 h-4" />
          <span>
            Período de análise:{" "}
            {filters.year === "all" ? "Todos os anos" : filters.year}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Ano */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Ano
              </label>
              <select
                value={filters.year}
                onChange={(e) =>
                  onFiltersChange({ ...filters, year: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {yearOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Competência */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Competência
              </label>
              <select
                value={filters.competency}
                onChange={(e) =>
                  onFiltersChange({ ...filters, competency: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {competencyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro de Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  onFiltersChange({ ...filters, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
