// MOVED from src/components/editors/KeyResultsEditor.tsx
import React, { useState } from "react";
import type { PdiKeyResult } from "../..";

interface Props {
  krs: PdiKeyResult[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiKeyResult>) => void;
}

export const KeyResultsEditor: React.FC<Props> = ({
  krs,
  onAdd,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={onAdd}
          className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Adicionar KR
        </button>
      </div>
      {krs.length === 0 && (
        <div className="text-xs text-gray-500">Nenhuma KR.</div>
      )}
      {krs.map((kr) => (
        <KrEditor key={kr.id} kr={kr} onRemove={onRemove} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

const KrEditor: React.FC<{
  kr: PdiKeyResult;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiKeyResult>) => void;
}> = ({ kr, onRemove, onUpdate }) => {
  const [tab, setTab] = useState<"main" | "actions">("main");
  return (
    <div className="border border-surface-300 rounded-lg p-3 bg-surface-50/60 text-xs space-y-2">
      <div className="flex items-center justify-between">
        <input
          value={kr.description}
          onChange={(e) => onUpdate(kr.id, { description: e.target.value })}
          className="flex-1 bg-transparent font-medium text-indigo-700"
          placeholder="Descrição da KR"
        />
        <button
          type="button"
          onClick={() => onRemove(kr.id)}
          className="ml-2 text-[10px] px-2 py-1 rounded bg-red-50 text-red-600 border border-red-300"
        >
          Remover
        </button>
      </div>
      <textarea
        value={kr.successCriteria}
        onChange={(e) => onUpdate(kr.id, { successCriteria: e.target.value })}
        rows={2}
        className="w-full resize-y rounded border border-surface-300 p-1"
        placeholder="Critério de sucesso"
      />
      <textarea
        value={kr.currentStatus || ""}
        onChange={(e) => onUpdate(kr.id, { currentStatus: e.target.value })}
        rows={2}
        className="w-full resize-y rounded border border-surface-300 p-1"
        placeholder="Status atual"
      />
      <div>
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => setTab("main")}
            className={`px-2 py-0.5 rounded ${
              tab === "main"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-indigo-200 text-indigo-600"
            }`}
          >
            Ações
          </button>
          <button
            type="button"
            onClick={() => setTab("actions")}
            className={`px-2 py-0.5 rounded ${
              tab === "actions"
                ? "bg-indigo-600 text-white"
                : "bg-white border border-indigo-200 text-indigo-600"
            }`}
          >
            Lista
          </button>
        </div>
        {tab === "main" ? (
          <textarea
            value={(kr.improvementActions || []).join("\n")}
            onChange={(e) =>
              onUpdate(kr.id, {
                improvementActions: e.target.value
                  .split(/\n+/)
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
            rows={3}
            className="w-full resize-y rounded border border-surface-300 p-1"
            placeholder="Ações de melhoria (uma por linha)"
          />
        ) : (
          <ul className="list-disc ml-4 space-y-1">
            {(kr.improvementActions || []).map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
