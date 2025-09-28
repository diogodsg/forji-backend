import { useState } from "react";
import { FiPlus, FiClock, FiTarget } from "react-icons/fi";
import type { PdiCycle } from "../../types/pdi";
import { CreateCycleModal } from "./CreateCycleModal";
import { CycleCard } from "./CycleCard";

interface CyclesManagerProps {
  cycles: PdiCycle[];
  onCreateCycle: (cycle: Omit<PdiCycle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCycle: (cycleId: string, cycle: Partial<PdiCycle>) => void;
  onDeleteCycle: (cycleId: string) => void;
  onSelectCycle: (cycleId: string) => void;
  selectedCycleId?: string;
  editing: boolean;
}

export function CyclesManager({
  cycles,
  onCreateCycle,
  onUpdateCycle,
  onDeleteCycle,
  onSelectCycle,
  selectedCycleId,
  editing,
}: CyclesManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeCycle = cycles.find(c => c.status === 'active');
  const plannedCycles = cycles.filter(c => c.status === 'planned');
  const completedCycles = cycles.filter(c => c.status === 'completed');

  const handleCreateCycle = (cycleData: Omit<PdiCycle, 'id' | 'createdAt' | 'updatedAt'>) => {
    onCreateCycle(cycleData);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiTarget className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Ciclos de PDI</h2>
        </div>
        {editing && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Novo Ciclo
          </button>
        )}
      </div>

      {/* Ciclo Ativo */}
      {activeCycle && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Ciclo Ativo
          </h3>
          <CycleCard
            cycle={activeCycle}
            isSelected={selectedCycleId === activeCycle.id}
            onSelect={() => onSelectCycle(activeCycle.id)}
            onUpdate={onUpdateCycle}
            onDelete={onDeleteCycle}
            editing={editing}
          />
        </div>
      )}

      {/* Ciclos Planejados */}
      {plannedCycles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <FiClock className="w-4 h-4 text-blue-500" />
            Ciclos Planejados ({plannedCycles.length})
          </h3>
          <div className="space-y-2">
            {plannedCycles.map((cycle) => (
              <CycleCard
                key={cycle.id}
                cycle={cycle}
                isSelected={selectedCycleId === cycle.id}
                onSelect={() => onSelectCycle(cycle.id)}
                onUpdate={onUpdateCycle}
                onDelete={onDeleteCycle}
                editing={editing}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ciclos Concluídos */}
      {completedCycles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            Ciclos Concluídos ({completedCycles.length})
          </h3>
          <div className="space-y-2">
            {completedCycles.map((cycle) => (
              <CycleCard
                key={cycle.id}
                cycle={cycle}
                isSelected={selectedCycleId === cycle.id}
                onSelect={() => onSelectCycle(cycle.id)}
                onUpdate={onUpdateCycle}
                onDelete={onDeleteCycle}
                editing={editing}
              />
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {cycles.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FiTarget className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ciclo criado</h3>
          <p className="text-gray-500 mb-6">
            Crie seu primeiro ciclo de PDI para começar a organizar seu desenvolvimento
          </p>
          {editing && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Criar Primeiro Ciclo
            </button>
          )}
        </div>
      )}

      {/* Modal de criação */}
      {showCreateModal && (
        <CreateCycleModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCycle}
        />
      )}
    </div>
  );
}