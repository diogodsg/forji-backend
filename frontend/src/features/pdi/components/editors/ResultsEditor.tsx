// MOVED from src/components/editors/ResultsEditor.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { PdiCompetencyRecord } from "../..";

// Helper subcomponents (in-file for now; can be extracted later if reused)
interface LevelSelectorProps {
  value?: number | null;
  onChange: (v: number | undefined) => void;
  label: string;
}

const MAX_LEVEL = 5;

const LevelSelector: React.FC<LevelSelectorProps> = ({
  value,
  onChange,
  label,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const levels = Array.from({ length: MAX_LEVEL + 1 }).map((_, i) => i);
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        ![
          "ArrowRight",
          "ArrowLeft",
          "Home",
          "End",
          "Delete",
          "Backspace",
          " ",
        ].includes(e.key)
      )
        return;
      e.preventDefault();
      let currentIndex = value != null ? value : -1;
      if (e.key === "ArrowRight")
        currentIndex = Math.min(MAX_LEVEL, currentIndex + 1);
      else if (e.key === "ArrowLeft")
        currentIndex = Math.max(0, currentIndex - 1);
      else if (e.key === "Home") currentIndex = 0;
      else if (e.key === "End") currentIndex = MAX_LEVEL;
      else if (e.key === "Delete" || e.key === "Backspace" || e.key === " ") {
        // clear selection
        onChange(undefined);
        return;
      }
      onChange(currentIndex);
    },
    [value, onChange]
  );

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
        {label}
      </span>
      <div
        ref={containerRef}
        role="radiogroup"
        aria-label={label}
        tabIndex={0}
        onKeyDown={handleKey}
        className="flex items-center gap-1 outline-none focus:ring-2 focus:ring-indigo-300 rounded-sm"
      >
        {levels.map((i) => {
          const active = value === i;
          return (
            <button
              key={i}
              role="radio"
              aria-checked={active}
              type="button"
              aria-label={`${label} nível ${i}`}
              onClick={() => !active && onChange(i)}
              className={
                "w-6 h-6 relative rounded-full text-[10px] flex items-center justify-center border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300 " +
                (active
                  ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                  : "bg-white border-slate-300 text-slate-500 hover:border-indigo-400 hover:text-indigo-600")
              }
            >
              {i}
            </button>
          );
        })}
        {value != null && (
          <button
            type="button"
            aria-label="Limpar nível"
            onClick={() => onChange(undefined)}
            className="ml-2 px-2 h-6 text-[10px] rounded-md border border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            Limpar
          </button>
        )}
      </div>
      <span className="sr-only">
        Use setas para alterar. Botão Limpar para remover seleção.
      </span>
    </div>
  );
};

interface ProgressBarProps {
  before?: number | null;
  after?: number | null;
}

const ProgressComparison: React.FC<ProgressBarProps> = ({ before, after }) => {
  const hasBefore = typeof before === "number";
  const hasAfter = typeof after === "number";
  const safeBefore = hasBefore ? (before as number) : 0;
  const safeAfter = hasAfter ? (after as number) : 0;
  const pctBefore = hasBefore ? (safeBefore / MAX_LEVEL) * 100 : 0;
  const pctAfter = hasAfter ? (safeAfter / MAX_LEVEL) * 100 : 0;
  const showComparison = hasBefore || hasAfter;
  const delta = hasBefore && hasAfter ? safeAfter - safeBefore : null;
  // Gradient: base segment for before (if exists), overlay progress difference if after > before
  const improved = delta != null && delta > 0;
  return (
    <div className="mt-2">
      <div className="flex justify-between text-[10px] text-slate-500 mb-1">
        <span>Evolução</span>
        {showComparison ? (
          <span>
            {hasBefore ? safeBefore : "—"} → {hasAfter ? safeAfter : "—"}
          </span>
        ) : (
          <span className="text-slate-400">Sem dados</span>
        )}
      </div>
      <div
        className="relative h-2 rounded-full bg-slate-200 overflow-hidden group"
        title={
          showComparison
            ? `Antes: ${hasBefore ? safeBefore : "—"} | Depois: ${
                hasAfter ? safeAfter : "—"
              }${
                delta != null ? ` (Δ ${delta > 0 ? "+" + delta : delta})` : ""
              }`
            : "Sem dados"
        }
      >
        {hasBefore && (
          <div
            className="absolute inset-y-0 left-0 bg-indigo-300/70 transition-all"
            style={{ width: `${pctBefore}%` }}
          />
        )}
        {hasAfter && (
          <>
            {/* If improved, show difference segment with gradient */}
            {improved && (
              <div
                className="absolute inset-y-0 left-0 transition-all"
                style={{
                  width: `${pctAfter}%`,
                  background: `linear-gradient(90deg, rgba(99,102,241,0.45) ${pctBefore}%, rgba(79,70,229,0.9) ${pctBefore}%)`,
                }}
              />
            )}
            {!improved && (
              <div
                className="absolute inset-y-0 left-0 bg-indigo-600 transition-all"
                style={{ width: `${pctAfter}%` }}
              />
            )}
          </>
        )}
      </div>
      {delta != null && (
        <div className="mt-1 text-[10px] font-medium">
          {delta > 0 && (
            <span className="text-emerald-600">+{delta} progresso</span>
          )}
          {delta === 0 && <span className="text-slate-400">Sem mudança</span>}
          {delta < 0 && (
            <span className="text-amber-600">{delta} regressão</span>
          )}
        </div>
      )}
    </div>
  );
};

interface EvidenceAreaProps {
  value: string;
  onChange: (v: string) => void;
}

const EvidenceArea: React.FC<EvidenceAreaProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-1 mt-3">
      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
        Evidências / Observações
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-md border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/60 p-2 text-xs bg-white/70"
        rows={3}
        placeholder="Ex: Apresentou solução X no projeto Y, Mentorou colega em Z..."
      />
    </div>
  );
};

interface Props {
  records: PdiCompetencyRecord[];
  competencies: string[];
  onUpdate: (area: string, patch: Partial<PdiCompetencyRecord>) => void;
  onAdd: (area?: string) => void;
  onRemove: (area: string) => void;
}

interface AddResultBarProps {
  existingAreas: string[];
  competencies: string[];
  onAdd: (area: string) => void;
}

// Enhanced AddResultBar with suggestion chips, duplicate validation & feedback
const AddResultBar: React.FC<AddResultBarProps> = ({
  existingAreas,
  competencies,
  onAdd,
}) => {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const existingLower = useRef(
    new Set(existingAreas.map((a) => a.toLowerCase()))
  );
  // Keep in sync if records change
  useEffect(() => {
    existingLower.current = new Set(existingAreas.map((a) => a.toLowerCase()));
  }, [existingAreas]);

  const trimmed = value.trim();
  const isDuplicate =
    trimmed.length > 0 && existingLower.current.has(trimmed.toLowerCase());

  const available = competencies.filter(
    (c) => !existingLower.current.has(c.toLowerCase())
  );
  const filtered = trimmed
    ? available.filter((c) => c.toLowerCase().includes(trimmed.toLowerCase()))
    : available;
  const suggestions = filtered.slice(0, 6);

  const commitAdd = (area: string) => {
    const t = area.trim();
    if (!t) return;
    if (existingLower.current.has(t.toLowerCase())) {
      setMessage(`Já existe "${t}"`);
      return;
    }
    onAdd(t);
    setMessage(`Competência "${t}" adicionada`);
    setValue("");
    // restore focus for quick successive adds
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <div className="flex flex-col gap-2" aria-labelledby="add-competency-label">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <label id="add-competency-label" className="sr-only">
            Adicionar competência
          </label>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setMessage(null);
            }}
            placeholder="Adicionar competência / área"
            className={
              "text-xs border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white/80 transition-colors " +
              (isDuplicate
                ? "border-red-400 focus:ring-red-200"
                : "border-slate-300 focus:border-indigo-500")
            }
            aria-invalid={isDuplicate || undefined}
            aria-describedby={message ? "add-competency-feedback" : undefined}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitAdd(value);
              }
            }}
          />
          {value && suggestions.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 overflow-auto rounded-md border border-slate-200 bg-white shadow-sm w-full text-xs divide-y divide-slate-100">
              {suggestions.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => commitAdd(s)}
                    className="w-full text-left px-3 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          type="button"
          onClick={() => commitAdd(value)}
          disabled={!trimmed || isDuplicate}
          className="group/button relative text-xs px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="inline-flex items-center gap-1">
            <span className="text-base leading-none -mt-[1px]">＋</span>{" "}
            Adicionar
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-md opacity-0 group-hover/button:opacity-100 transition-opacity bg-indigo-400/10" />
        </button>
      </div>
      {/* Inline suggestion chips (alternative quick add) */}
      {available.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {available.slice(0, 10).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => commitAdd(s)}
              className="text-[10px] px-2 py-1 rounded-full border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-200 text-slate-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="sr-only" aria-live="polite" id="add-competency-feedback">
        {message}
      </div>
      {isDuplicate && (
        <p className="text-[10px] text-red-600" id="add-competency-feedback">
          Já existe um resultado com esse nome.
        </p>
      )}
    </div>
  );
};

export const ResultsEditor: React.FC<Props> = ({
  records,
  onUpdate,
  onAdd,
  onRemove,
  competencies,
}) => {
  const [newlyAdded, setNewlyAdded] = useState<Set<string>>(new Set());

  const handleAdd = (area: string) => {
    if (!area.trim()) return;
    // Optimistic highlight
    setNewlyAdded((prev) => {
      const next = new Set(prev);
      next.add(area);
      return next;
    });
    onAdd(area);
    // Remove highlight after a delay
    setTimeout(() => {
      setNewlyAdded((prev) => {
        const next = new Set(prev);
        next.delete(area);
        return next;
      });
    }, 2600);
  };

  return (
    <div className="space-y-6">
      <AddResultBar
        existingAreas={records.map((r) => r.area)}
        competencies={competencies}
        onAdd={handleAdd}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {records.map((r) => {
          return (
            <div
              key={r.area}
              className={
                "group relative rounded-xl border bg-gradient-to-br from-white to-slate-50/70 p-4 shadow-sm hover:shadow-md transition-all " +
                (newlyAdded.has(r.area)
                  ? "border-emerald-400 ring-2 ring-emerald-300 animate-pulse"
                  : "border-slate-200")
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-800 leading-tight">
                    {r.area}
                  </h4>
                  <p className="text-[10px] uppercase tracking-wide font-medium text-indigo-600">
                    Resultado de Competência
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(r.area)}
                  className="opacity-70 hover:opacity-100 text-slate-400 hover:text-red-600 transition-colors text-xs border border-transparent hover:border-red-200 rounded-md px-2 py-1"
                >
                  Remover
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-3">
                <div className="flex flex-col gap-4">
                  <LevelSelector
                    label="Antes"
                    value={r.levelBefore ?? null}
                    onChange={(v) =>
                      onUpdate(r.area, { levelBefore: v as any })
                    }
                  />
                  <LevelSelector
                    label="Depois"
                    value={r.levelAfter ?? null}
                    onChange={(v) => onUpdate(r.area, { levelAfter: v as any })}
                  />
                </div>
                <ProgressComparison
                  before={r.levelBefore ?? null}
                  after={r.levelAfter ?? null}
                />
                <EvidenceArea
                  value={r.evidence || ""}
                  onChange={(v) => onUpdate(r.area, { evidence: v })}
                />
              </div>
            </div>
          );
        })}
      </div>
      {records.length === 0 && (
        <div className="text-xs text-slate-500 border border-dashed rounded-lg p-6 text-center">
          Nenhuma competência avaliada ainda. Adicione uma acima para começar.
        </div>
      )}
    </div>
  );
};
