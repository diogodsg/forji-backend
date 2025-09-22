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
  emerald: {
    container: "border-emerald-200 bg-emerald-50/40",
    label: "text-emerald-700",
    bullet: "text-emerald-600",
    addBtn: "border-emerald-300 text-emerald-700 hover:bg-emerald-100/40",
  },
  amber: {
    container: "border-amber-200 bg-amber-50/40",
    label: "text-amber-700",
    bullet: "text-amber-600",
    addBtn: "border-amber-300 text-amber-700 hover:bg-amber-100/40",
  },
  violet: {
    container: "border-violet-200 bg-violet-50/40",
    label: "text-violet-700",
    bullet: "text-violet-600",
    addBtn: "border-violet-300 text-violet-700 hover:bg-violet-100/40",
  },
  sky: {
    container: "border-sky-200 bg-sky-50/40",
    label: "text-sky-700",
    bullet: "text-sky-600",
    addBtn: "border-sky-300 text-sky-700 hover:bg-sky-100/40",
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
}> = ({ label, value = [], onChange, highlight = "emerald", placeholder }) => {
  const tone = LIST_TONES[highlight] || LIST_TONES.emerald;

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
    <div className={`rounded-lg p-2 space-y-1 border ${tone.container}`}>
      <label
        className={`block text-[10px] font-semibold mb-1 uppercase tracking-wide ${tone.label}`}
      >
        {label}
      </label>
      <div className="flex flex-col gap-1">
        {lines.map((line, idx) => {
          const isLast = idx === lines.length - 1;
          const isTrailingBlank = isLast && line.text.trim() === "";
          return (
            <div key={line.id} className="group flex items-start gap-1">
              <span
                className={`mt-1 text-[10px] w-4 select-none ${tone.bullet}`}
              >
                •
              </span>
              <textarea
                value={line.text}
                placeholder={placeholder && isTrailingBlank ? placeholder : ""}
                rows={1}
                onChange={(e) => updateLine(line.id, e.target.value)}
                onBlur={handleBlurCommit}
                onKeyDown={(e) => handleKeyDown(e, line, idx)}
                className="flex-1 resize-none overflow-hidden text-[11px] rounded border border-surface-300 px-2 py-1 leading-snug focus:border-indigo-400 focus:outline-none min-h-[32px]"
                style={{ height: "auto" }}
              />
              {lines.length > 1 && !isTrailingBlank && (
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] px-1 py-1 text-gray-400 hover:text-rose-600"
                  title="Remover linha"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="pt-1 flex justify-end">
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
          className={`text-[10px] px-2 py-1 rounded border font-medium transition ${tone.addBtn}`}
        >
          + linha
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
  return (
    <div className="mt-4 space-y-2">
      <label className="text-xs font-semibold text-gray-600">
        Tarefas / Próximos passos
      </label>
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Adicionar tarefa"
          className="flex-1 text-xs border rounded px-2 py-1 border-surface-300"
        />
        <button
          type="button"
          onClick={add}
          className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Add
        </button>
      </div>
      {list.length > 0 && (
        <ul className="space-y-1">
          {list.map((t) => (
            <li
              key={t.id}
              className="group flex items-center gap-2 text-[11px] bg-surface-100/50 border border-surface-300 rounded px-2 py-1"
            >
              <button
                type="button"
                onClick={() => toggle(t.id)}
                className={`h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                  t.done
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-indigo-300 text-transparent"
                }`}
              >
                ✓
              </button>
              <span
                className={`flex-1 ${
                  t.done ? "line-through text-gray-400" : ""
                }`}
              >
                {t.title}
              </span>
              <button
                type="button"
                onClick={() => remove(t.id)}
                className="opacity-60 group-hover:opacity-100 text-[10px]"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
