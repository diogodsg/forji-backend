import type { PdiCycle } from '../types/pdi';
import { FiPlay, FiPause, FiCheckCircle } from 'react-icons/fi';

interface ActiveCycleBadgeProps {
  cycle: PdiCycle | undefined;
}

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-800 border-green-300',
  planned: 'bg-gray-100 text-gray-700 border-gray-300',
  paused: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  completed: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  archived: 'bg-slate-100 text-slate-700 border-slate-300'
};

const statusLabel: Record<string, string> = {
  active: 'Ativo',
  planned: 'Planejado',
  paused: 'Pausado',
  completed: 'Concluído',
  archived: 'Arquivado'
};

export function ActiveCycleBadge({ cycle }: ActiveCycleBadgeProps) {
  if (!cycle) return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium border bg-gray-50 text-gray-600 border-gray-300">
      <span>Sem ciclo selecionado</span>
    </div>
  );

  const icon = cycle.status === 'active'
    ? <FiPlay className="w-3.5 h-3.5" />
    : cycle.status === 'paused'
      ? <FiPause className="w-3.5 h-3.5" />
      : <FiCheckCircle className="w-3.5 h-3.5" />;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium border ${statusColor[cycle.status] || 'bg-gray-100 text-gray-700 border-gray-300'}`}> 
      {icon}
      <span className="truncate max-w-[160px]" title={cycle.title}>{cycle.title}</span>
      <span className="opacity-70">• {statusLabel[cycle.status] || cycle.status}</span>
      <span className="opacity-60">{cycle.startDate} → {cycle.endDate}</span>
    </div>
  );
}
