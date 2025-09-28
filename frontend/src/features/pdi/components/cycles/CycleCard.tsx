import { useState } from "react";
import { FiCalendar, FiEdit3, FiTrash2, FiClock, FiTarget, FiUsers } from "react-icons/fi";
import { format, differenceInDays, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { PdiCycle } from "../../types/pdi";

interface CycleCardProps {
  cycle: PdiCycle;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cycleId: string, cycle: Partial<PdiCycle>) => void;
  onDelete: (cycleId: string) => void;
  editing: boolean;
}

export function CycleCard({
  cycle,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  editing,
}: CycleCardProps) {
  const [showActions, setShowActions] = useState(false);

  const startDate = new Date(cycle.startDate);
  const endDate = new Date(cycle.endDate);
  const today = new Date();
  const totalDays = differenceInDays(endDate, startDate);
  const daysElapsed = Math.max(0, differenceInDays(today, startDate));
  const daysRemaining = Math.max(0, differenceInDays(endDate, today));
  const progress = totalDays > 0 ? Math.min(100, (daysElapsed / totalDays) * 100) : 0;

  const isActive = cycle.status === 'active';
  const isCompleted = cycle.status === 'completed';
  const isOverdue = isAfter(today, endDate) && !isCompleted;

  const getStatusColor = () => {
    if (isCompleted) return "bg-green-100 text-green-800 border-green-200";
    if (isActive) return "bg-blue-100 text-blue-800 border-blue-200";
    if (isOverdue) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusText = () => {
    if (isCompleted) return "Concluído";
    if (isActive && isOverdue) return "Atrasado";
    if (isActive) return "Em Andamento";
    if (isBefore(today, startDate)) return "Agendado";
    return "Planejado";
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir o ciclo "${cycle.title}"?`)) {
      onDelete(cycle.id);
    }
  };

  const handleStatusChange = (newStatus: PdiCycle['status']) => {
    onUpdate(cycle.id, { status: newStatus });
  };

  const pdiStats = {
    competencies: cycle.pdi.competencies.length,
    krs: cycle.pdi.krs?.length || 0,
    milestones: cycle.pdi.milestones.length,
    records: cycle.pdi.records.length,
  };

  return (
    <div
      className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
        isSelected 
          ? "bg-indigo-50 border-indigo-300 shadow-sm" 
          : "bg-white border-gray-200 hover:border-gray-300"
      }`}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{cycle.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          {cycle.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{cycle.description}</p>
          )}
        </div>
        
        {editing && showActions && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implementar edição
              }}
              className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
              title="Editar ciclo"
            >
              <FiEdit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Excluir ciclo"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Datas e Progresso */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <FiCalendar className="w-4 h-4" />
            <span>
              {format(startDate, "dd/MM/yyyy", { locale: ptBR })} - {format(endDate, "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FiClock className="w-4 h-4" />
            <span>
              {isCompleted ? "Concluído" : `${daysRemaining}d restantes`}
            </span>
          </div>
        </div>

        {/* Barra de Progresso Temporal */}
        {!isCompleted && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progresso temporal</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isOverdue ? "bg-red-500" : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Estatísticas do PDI */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <FiUsers className="w-3 h-3" />
            <span>{pdiStats.competencies} competências</span>
          </div>
          <div className="flex items-center gap-1">
            <FiTarget className="w-3 h-3" />
            <span>{pdiStats.krs} KRs</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="w-3 h-3" />
            <span>{pdiStats.milestones} marcos</span>
          </div>
        </div>

        {/* Ações de Status (apenas para edição) */}
        {editing && isActive && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('completed');
              }}
              className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
            >
              Marcar como Concluído
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStatusChange('paused');
              }}
              className="px-3 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 rounded-md transition-colors"
            >
              Pausar
            </button>
          </div>
        )}

        {editing && cycle.status === 'planned' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusChange('active');
            }}
            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
          >
            Iniciar Ciclo
          </button>
        )}
      </div>
    </div>
  );
}