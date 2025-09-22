// MOVED from src/components/editors/KeyResultsEditor.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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

// Hook simples de debounce controlado
function useDebouncedCommit<T>(
  value: T,
  delay: number,
  commit: (v: T) => void
) {
  const latest = useRef(value);
  latest.current = value;
  useEffect(() => {
    const id = setTimeout(() => commit(latest.current), delay);
    return () => clearTimeout(id);
  }, [value, delay, commit]);
}

// Auto-resize de textarea
function useAutoResizeTextarea(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  dep: any
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // reset height para medir scrollHeight correto
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 600); // limite de segurança
    el.style.height = next + "px";
  }, [dep]);
}

const KrEditor: React.FC<{
  kr: PdiKeyResult;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiKeyResult>) => void;
}> = ({ kr, onRemove, onUpdate }) => {
  const [tab, setTab] = useState<"main" | "actions">("main");
  // Estados locais espelham o reducer global para reduzir dispatch por tecla
  const [desc, setDesc] = useState(kr.description || "");
  const [success, setSuccess] = useState(kr.successCriteria || "");
  const [status, setStatus] = useState(kr.currentStatus || "");
  const [actionsDraft, setActionsDraft] = useState(
    (kr.improvementActions || []).join("\n")
  );
  const descRef = useRef<HTMLInputElement | null>(null);
  const successRef = useRef<HTMLTextAreaElement | null>(null);
  const statusRef = useRef<HTMLTextAreaElement | null>(null);
  const actionsRef = useRef<HTMLTextAreaElement | null>(null);

  useAutoResizeTextarea(successRef, success);
  useAutoResizeTextarea(statusRef, status);
  useAutoResizeTextarea(actionsRef, actionsDraft);

  // Sync externo se idempotente (ex: server merge atualizou)
  useEffect(() => {
    if (kr.description !== desc) setDesc(kr.description || "");
    if (kr.successCriteria !== success) setSuccess(kr.successCriteria || "");
    if ((kr.currentStatus || "") !== status) setStatus(kr.currentStatus || "");
    const joined = (kr.improvementActions || []).join("\n");
    if (joined !== actionsDraft) setActionsDraft(joined);
  }, [
    kr.id,
    kr.description,
    kr.successCriteria,
    kr.currentStatus,
    kr.improvementActions,
  ]);

  // Debounced commits
  const debCommitDesc = useCallback(
    (v: string) => onUpdate(kr.id, { description: v }),
    [kr.id, onUpdate]
  );
  const debCommitSuccess = useCallback(
    (v: string) => onUpdate(kr.id, { successCriteria: v }),
    [kr.id, onUpdate]
  );
  const debCommitStatus = useCallback(
    (v: string) => onUpdate(kr.id, { currentStatus: v }),
    [kr.id, onUpdate]
  );
  const debCommitActions = useCallback(
    (v: string) =>
      onUpdate(kr.id, {
        improvementActions: v
          .split(/\n+/)
          .map((x) => x.trim())
          .filter(Boolean),
      }),
    [kr.id, onUpdate]
  );

  useDebouncedCommit(desc, 400, debCommitDesc);
  useDebouncedCommit(success, 500, debCommitSuccess);
  useDebouncedCommit(status, 500, debCommitStatus);
  useDebouncedCommit(actionsDraft, 600, debCommitActions);

  // Commit imediato ao sair do campo para evitar perder últimas teclas
  const flushAll = () => {
    debCommitDesc(desc);
    debCommitSuccess(success);
    debCommitStatus(status);
    debCommitActions(actionsDraft);
  };

  const isDraft =
    desc !== (kr.description || "") ||
    success !== (kr.successCriteria || "") ||
    status !== (kr.currentStatus || "") ||
    actionsDraft !== (kr.improvementActions || []).join("\n");

  return (
    <div className="border border-surface-300 rounded-lg p-3 bg-surface-50/60 text-xs space-y-2 relative">
      {isDraft && (
        <span className="absolute right-2 top-2 text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 font-medium">
          Draft
        </span>
      )}
      <div className="flex items-center justify-between">
        <input
          ref={descRef}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onBlur={flushAll}
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
        ref={successRef}
        value={success}
        onChange={(e) => setSuccess(e.target.value)}
        onBlur={flushAll}
        rows={1}
        className="w-full resize-none rounded border border-surface-300 p-1 leading-snug"
        placeholder="Critério de sucesso"
      />
      <textarea
        ref={statusRef}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        onBlur={flushAll}
        rows={1}
        className="w-full resize-none rounded border border-surface-300 p-1 leading-snug"
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
            ref={actionsRef}
            value={actionsDraft}
            onChange={(e) => setActionsDraft(e.target.value)}
            onBlur={flushAll}
            rows={1}
            className="w-full resize-none rounded border border-surface-300 p-1 leading-snug"
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
