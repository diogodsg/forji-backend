// MOVED from src/components/editors/KeyResultsEditor.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiTarget, FiEdit3, FiList, FiTrash2, FiPlus } from "react-icons/fi";
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
    <div className="space-y-6 pt-4">
      {/* Header com botão de adicionar */}
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-200">
        <div>
          <h3 className="text-sm font-semibold text-indigo-900 mb-1">
            Objetivos Chave & Resultados Mensuráveis
          </h3>
          <p className="text-xs text-indigo-700">
            Defina metas SMART com critérios claros de sucesso
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
          Novo KR
        </button>
      </div>

      {krs.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-3">
            <span className="text-lg font-bold text-gray-500">KR</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">
            Comece criando seu primeiro Key Result
          </p>
          <p className="text-xs text-gray-500">
            Use o botão "Novo KR" acima para adicionar
          </p>
        </div>
      )}

      {krs.map((kr, index) => (
        <KrEditor
          key={kr.id}
          kr={kr}
          index={index + 1}
          onRemove={onRemove}
          onUpdate={onUpdate}
        />
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
  index?: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiKeyResult>) => void;
}> = ({ kr, index, onRemove, onUpdate }) => {
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
    <div className="relative bg-gradient-to-br from-white to-indigo-50/30 border border-indigo-200/60 rounded-xl p-6 shadow-sm">
      {/* Badge numerado */}
      {index && (
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
          {index}
        </div>
      )}

      {/* Indicador de draft */}
      {isDraft && (
        <div className="absolute -top-2 -right-2 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full border border-amber-200 shadow-sm">
          <FiEdit3 className="w-3 h-3" /> Editando
        </div>
      )}

      <div className="space-y-5">
        {/* Header com título e botão remover */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FiTarget className="w-4 h-4" /> Descrição do Objetivo
            </label>
            <input
              ref={descRef}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onBlur={flushAll}
              className="w-full text-lg font-semibold text-indigo-900 bg-transparent border-0 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none pb-2 transition-colors"
              placeholder="Ex: Aumentar conversão de leads em 25%"
            />
          </div>
          <button
            type="button"
            onClick={() => onRemove(kr.id)}
            className="shrink-0 px-3 py-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <FiTrash2 className="w-4 h-4" /> Remover
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Critério de Sucesso */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              Critério de Sucesso
            </label>
            <textarea
              ref={successRef}
              value={success}
              onChange={(e) => setSuccess(e.target.value)}
              onBlur={flushAll}
              rows={3}
              className="w-full resize-none border border-emerald-300 rounded-lg p-3 text-sm text-emerald-900 bg-white/80 focus:bg-white focus:border-emerald-500 outline-none transition-colors"
              placeholder="Como você saberá que atingiu este objetivo? Seja específico e mensurável..."
            />
          </div>

          {/* Status Atual */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Status Atual
            </label>
            <textarea
              ref={statusRef}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              onBlur={flushAll}
              rows={3}
              className="w-full resize-none border border-blue-300 rounded-lg p-3 text-sm text-blue-900 bg-white/80 focus:bg-white focus:border-blue-500 outline-none transition-colors"
              placeholder="Qual é a situação atual? O que já foi feito até agora?"
            />
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-amber-800 flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Próximos Passos
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTab("main")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  tab === "main"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-amber-700 border border-amber-300 hover:bg-amber-100"
                }`}
              >
                <FiEdit3 className="w-3 h-3" /> Editar
              </button>
              <button
                type="button"
                onClick={() => setTab("actions")}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  tab === "actions"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white text-amber-700 border border-amber-300 hover:bg-amber-100"
                }`}
              >
                <FiList className="w-3 h-3" /> Lista
              </button>
            </div>
          </div>

          {tab === "main" ? (
            <textarea
              ref={actionsRef}
              value={actionsDraft}
              onChange={(e) => setActionsDraft(e.target.value)}
              onBlur={flushAll}
              rows={4}
              className="w-full resize-none border border-amber-300 rounded-lg p-3 text-sm text-amber-900 bg-white/80 focus:bg-white focus:border-amber-500 outline-none transition-colors"
              placeholder="Liste as ações específicas que precisa tomar (uma por linha)&#10;&#10;Ex:&#10;• Implementar sistema de analytics&#10;• Otimizar landing page&#10;• Criar campanha de email marketing"
            />
          ) : (
            <div className="bg-white/80 rounded-lg p-3 border border-amber-300">
              {(kr.improvementActions || []).length === 0 ? (
                <p className="text-sm text-amber-700 italic">
                  Nenhuma ação definida ainda. Use a aba "Editar" para
                  adicionar.
                </p>
              ) : (
                <ul className="space-y-2">
                  {(kr.improvementActions || []).map((action, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-amber-900"
                    >
                      <span className="inline-block w-6 h-6 bg-amber-200 text-amber-800 rounded-full text-xs font-bold flex items-center justify-center mt-0.5 shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{action}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
