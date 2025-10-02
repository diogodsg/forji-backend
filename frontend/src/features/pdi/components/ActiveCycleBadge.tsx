import type { PdiCycle } from "../types/pdi";
import { FiPlay, FiPause, FiCheckCircle } from "react-icons/fi";

function fmt(dateStr: string | undefined) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function temporalProgress(startDate: string, endDate: string): number {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const now = Date.now();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;
  if (now <= start) return 0;
  if (now >= end) return 1;
  return (now - start) / (end - start);
}

interface ActiveCycleBadgeProps {
  cycle: PdiCycle | undefined;
}

const statusColor: Record<string, string> = {
  active: "bg-green-100 text-green-800 border-green-300",
  planned: "bg-gray-100 text-gray-700 border-gray-300",
  paused: "bg-yellow-100 text-yellow-800 border-yellow-300",
  completed: "bg-indigo-100 text-indigo-800 border-indigo-300",
  archived: "bg-slate-100 text-slate-700 border-slate-300",
};

const statusLabel: Record<string, string> = {
  active: "Ativo",
  planned: "Planejado",
  paused: "Pausado",
  completed: "Concluído",
  archived: "Arquivado",
};

export function ActiveCycleBadge({ cycle }: ActiveCycleBadgeProps) {
  if (!cycle)
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium border bg-gray-50 text-gray-600 border-gray-300">
        <span>Sem ciclo selecionado</span>
      </div>
    );

  const icon =
    cycle.status === "active" ? (
      <FiPlay className="w-3.5 h-3.5" />
    ) : cycle.status === "paused" ? (
      <FiPause className="w-3.5 h-3.5" />
    ) : (
      <FiCheckCircle className="w-3.5 h-3.5" />
    );

  const frac = temporalProgress(cycle.startDate, cycle.endDate);
  const pct = Math.round(frac * 100);

  return (
    <div
      className={`inline-flex items-center gap-3 pl-3 pr-4 py-1 rounded-md text-xs font-medium border ${
        statusColor[cycle.status] || "bg-gray-100 text-gray-700 border-gray-300"
      }`}
    >
      {icon}
      <span
        className="truncate max-w-[140px] font-semibold"
        title={cycle.title}
      >
        {cycle.title}
      </span>
      <span className="opacity-70">
        {statusLabel[cycle.status] || cycle.status}
      </span>
      <span className="opacity-60 whitespace-nowrap">
        {fmt(cycle.startDate)} → {fmt(cycle.endDate)}
      </span>
      <span className="flex items-center gap-1 ml-2">
        <span className="w-24 h-1.5 bg-white/40 rounded overflow-hidden">
          <span
            className="block h-full bg-current transition-all"
            style={{ width: `${pct}%` }}
          />
        </span>
        <span className="tabular-nums opacity-80">{pct}%</span>
      </span>
    </div>
  );
}
