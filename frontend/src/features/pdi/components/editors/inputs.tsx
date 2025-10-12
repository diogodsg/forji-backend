// MOVED from src/components/pdi/inputs.tsx
import React, { useState, useCallback } from "react";
import type { PdiTask } from "../..";

// Tonalidade estática para Tailwind (evita classes dinâmicas não coletadas pelo JIT)
const LIST_TONES: Record<
  string,
  {
    container: string;
    label: string;
    bullet: string;
    addBtn: string;
  }
> = {
  green: {
    container: "border-green-200 bg-green-50/50",
    label: "text-green-700",
    bullet: "text-green-500",
    addBtn: "border-green-300 text-green-600 hover:bg-green-100",
  },
  orange: {
    container: "border-orange-200 bg-orange-50/50",
    label: "text-orange-700",
    bullet: "text-orange-500",
    addBtn: "border-orange-300 text-orange-600 hover:bg-orange-100",
  },
  blue: {
    container: "border-blue-200 bg-blue-50/50",
    label: "text-blue-700",
    bullet: "text-blue-500",
    addBtn: "border-blue-300 text-blue-600 hover:bg-blue-100",
  },
  slate: {
    container: "border-slate-200 bg-slate-50/50",
    label: "text-slate-700",
    bullet: "text-slate-500",
    addBtn: "border-slate-300 text-slate-600 hover:bg-slate-100",
  },
};

interface LineItem {
  id: string;
  text: string;
}

export const ListEditor: React.FC<{
  label: string;
  value?: string[];
  onChange: (v: string[]) => void;
  highlight?: keyof typeof LIST_TONES;
  placeholder?: string;
}> = ({ label, value = [], onChange, highlight = "slate", placeholder }) => {
  const tone = LIST_TONES[highlight] || LIST_TONES.slate;

  const initialLines: LineItem[] = (value.length ? value : [""]).map((v) => ({
    id: crypto.randomUUID(),
    text: v,
  }));
  const [lines, setLines] = useState<LineItem[]>(() => {
    // garante uma linha em branco final
    if (initialLines[initialLines.length - 1].text.trim() !== "") {
      return [...initialLines, { id: crypto.randomUUID(), text: "" }];
    }
    return initialLines;
  });

  // Sincroniza quando o valor externo muda de fato (ignora alterações locais já refletidas)
  React.useEffect(() => {
    const external = value;
    const current = lines
      .filter((l) => l.text.trim() !== "")
      .map((l) => l.text);
    const equal =
      external.length === current.length &&
      external.every((v, i) => v === current[i]);
    if (equal) return;
    const rebuilt: LineItem[] = (external.length ? external : [""]).map(
      (v) => ({ id: crypto.randomUUID(), text: v })
    );
    if (rebuilt[rebuilt.length - 1].text.trim() !== "") {
      rebuilt.push({ id: crypto.randomUUID(), text: "" });
    }
    setLines(rebuilt);
  }, [value]);

  const emit = useCallback(
    (list: LineItem[]) => {
      const cleaned = list
        .filter((l) => l.text.trim() !== "")
        .map((l) => l.text.trim());
      onChange(cleaned);
    },
    [onChange]
  );

  const ensureTrailingBlank = (list: LineItem[]) => {
    if (list.length === 0 || list[list.length - 1].text.trim() !== "") {
      return [...list, { id: crypto.randomUUID(), text: "" }];
    }
    return list;
  };

  const updateLine = (id: string, text: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, text } : l)));
  };

  const removeLine = (id: string) => {
    setLines((prev) => ensureTrailingBlank(prev.filter((l) => l.id !== id)));
    // emite após microtask para garantir estado atualizado
    queueMicrotask(() => {
      emit(
        lines.filter((l) => l.id !== id) // lines ainda antigo aqui, mas suficientemente próximo; alternativa: usar callback param
      );
    });
  };

  const insertBelow = (id: string) => {
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const next = [...prev];
      next.splice(idx + 1, 0, { id: crypto.randomUUID(), text: "" });
      return ensureTrailingBlank(next);
    });
  };

  const handleBlurCommit = () => {
    emit(lines);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    line: LineItem,
    idx: number
  ) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;
      e.preventDefault();
      if (line.text.trim() === "") {
        // linha vazia -> remove se não for a única
        const nonEmpty = lines.filter((l) => l.text.trim() !== "");
        if (nonEmpty.length > 0) {
          removeLine(line.id);
        }
        return;
      }
      insertBelow(line.id);
      return;
    }
    if (e.key === "Backspace" && line.text === "") {
      // se apagar em linha vazia (não sendo a primeira), remover
      if (idx > 0) {
        e.preventDefault();
        removeLine(line.id);
      }
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-slate-600 mb-2">{label}</div>
      <div className="space-y-2">
        {lines.map((line, idx) => {
          const isLast = idx === lines.length - 1;
          const isTrailingBlank = isLast && line.text.trim() === "";
          return (
            <div key={line.id} className="group flex items-start gap-2">
              <span
                className={`mt-2 w-1.5 h-1.5 rounded-full ${tone.bullet.replace(
                  "text-",
                  "bg-"
                )} flex-shrink-0`}
              />
              <div className="flex-1">
                <textarea
                  value={line.text}
                  placeholder={
                    placeholder && isTrailingBlank ? placeholder : ""
                  }
                  rows={1}
                  onChange={(e) => updateLine(line.id, e.target.value)}
                  onBlur={handleBlurCommit}
                  onKeyDown={(e) => handleKeyDown(e, line, idx)}
                  className="w-full resize-none overflow-hidden text-sm rounded-md border border-slate-200 px-3 py-2 leading-snug focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors min-h-[36px]"
                  style={{ height: "auto" }}
                />
              </div>
              {lines.length > 1 && !isTrailingBlank && (
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded"
                  title="Remover item"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setLines((prev) =>
              ensureTrailingBlank([
                ...prev,
                { id: crypto.randomUUID(), text: "" },
              ])
            );
          }}
          className={`text-xs px-3 py-2 rounded-md border transition-colors font-medium ${tone.addBtn}`}
        >
          + Adicionar item
        </button>
      </div>
    </div>
  );
};

export const TaskEditor: React.FC<{
  milestoneId: string;
  tasks?: PdiTask[];
  onChange: (t: PdiTask[]) => void;
}> = ({ tasks, onChange }) => {
  const [title, setTitle] = useState("");
  const list = tasks ?? [];

  const add = () => {
    const v = title.trim();
    if (!v) return;
    onChange([...list, { id: crypto.randomUUID(), title: v }]);
    setTitle("");
  };

  const toggle = (id: string) =>
    onChange(list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => onChange(list.filter((t) => t.id !== id));

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header com contador */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">
          Tarefas / Próximos passos
        </div>
        {list.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="px-2 py-1 bg-slate-100 rounded-full">
              {list.filter((t) => t.done).length}/{list.length} concluídas
            </span>
          </div>
        )}
      </div>

      {/* Input para adicionar nova tarefa */}
      <div className="relative">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite uma nova tarefa..."
              className="w-full text-sm border border-slate-200 rounded-lg px-4 py-3 pr-12 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
            {title.trim() && (
              <button
                type="button"
                onClick={() => setTitle("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                ×
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={add}
            disabled={!title.trim()}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:hover:scale-100 shadow-sm hover:shadow-md"
          >
            + Adicionar
          </button>
        </div>
      </div>

      {/* Lista de tarefas */}
      {list.length > 0 && (
        <div className="space-y-3">
          {list.map((t, index) => (
            <div
              key={t.id}
              className="group relative flex items-center gap-4 p-4 bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all duration-200"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.3s ease-out forwards",
              }}
            >
              {/* Checkbox personalizado */}
              <button
                type="button"
                onClick={() => toggle(t.id)}
                className="flex-shrink-0 relative"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    t.done
                      ? "bg-gradient-to-r from-green-400 to-green-500 border-green-500 scale-110"
                      : "border-slate-300 hover:border-blue-400 hover:bg-blue-50"
                  }`}
                >
                  {t.done && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                {t.done && (
                  <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
                )}
              </button>

              {/* Conteúdo da tarefa */}
              <div className="flex-1 min-w-0">
                <span
                  className={`block text-sm font-medium transition-all duration-200 ${
                    t.done
                      ? "text-slate-500 line-through"
                      : "text-slate-800 group-hover:text-slate-900"
                  }`}
                >
                  {t.title}
                </span>
                {t.done && (
                  <span className="text-xs text-green-600 font-medium">
                    ✨ Concluída
                  </span>
                )}
              </div>

              {/* Botão de remoção */}
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transform hover:scale-110"
                title="Remover tarefa"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>

              {/* Linha de progresso sutil */}
              <div
                className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500 ${
                  t.done ? "w-full" : "w-0"
                }`}
              ></div>
            </div>
          ))}
        </div>
      )}

      {/* Estado vazio com ilustração */}
      {list.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <p className="text-sm text-slate-600 font-medium mb-1">
            Nenhuma tarefa adicionada
          </p>
          <p className="text-xs text-slate-500">
            Comece adicionando uma tarefa acima
          </p>
        </div>
      )}
    </div>
  );
};
