// MOVED from src/components/pdi/inputs.tsx
import React, { useState } from "react";
import type { PdiTask } from "../..";

export const ListEditor: React.FC<{
  label: string;
  value?: string[];
  onChange: (v: string[]) => void;
  highlight?: string;
  placeholder?: string;
}> = ({ label, value = [], onChange, highlight = "emerald", placeholder }) => {
  const [drafts, setDrafts] = useState<string[]>(value.length ? value : [""]);
  // Sync external changes (e.g. load / merge) when not actively editing empty trailing row differences
  React.useEffect(() => {
    const normalized = value.length ? value : [""];
    // Avoid overwriting while user is typing if arrays are effectively equal (ignoring a single trailing empty)
    if (
      JSON.stringify(value) ===
      JSON.stringify(drafts.filter((d) => d.trim() !== ""))
    )
      return;
    setDrafts(
      normalized.concat(normalized[normalized.length - 1] === "" ? [] : [])
    );
  }, [value]);

  const commit = (next: string[]) => {
    const cleaned = next.filter((l) => l.trim() !== "");
    onChange(cleaned);
    setDrafts(cleaned.length ? [...cleaned, ""] : [""]); // keep one blank row for easy add
  };

  const updateAt = (idx: number, text: string) => {
    const next = drafts.slice();
    next[idx] = text;
    setDrafts(next);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    idx: number
  ) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return; // allow newline inside same item (rare use-case)
      e.preventDefault();
      const current = drafts[idx];
      // If current is empty and not the only row, treat Enter as remove
      if (current.trim() === "" && drafts.length > 1) {
        const next = drafts.filter((_, i) => i !== idx);
        commit(next);
        return;
      }
      // Insert a new item below
      const next = drafts.slice();
      if (idx === drafts.length - 1) {
        next.push("");
      } else {
        next.splice(idx + 1, 0, "");
      }
      commit(next);
    } else if (e.key === "Backspace") {
      const current = drafts[idx];
      if (current === "" && drafts.length > 1) {
        // Merge deletion (remove this empty row)
        e.preventDefault();
        const next = drafts.filter((_, i) => i !== idx);
        commit(next);
      }
    }
  };

  const removeAt = (idx: number) => {
    const next = drafts.filter((_, i) => i !== idx);
    commit(next);
  };

  return (
    <div
      className={`rounded-lg border border-${highlight}-200 bg-${highlight}-50/40 p-2 space-y-1`}
    >
      <label
        className={`block text-[10px] font-semibold text-${highlight}-700 mb-1 uppercase tracking-wide`}
      >
        {label}
      </label>
      <div className="flex flex-col gap-1">
        {drafts.map((line, idx) => {
          const isLastBlank = idx === drafts.length - 1 && line.trim() === "";
          return (
            <div key={idx} className="group flex items-start gap-1">
              <span
                className={`mt-1 text-[10px] w-4 text-${highlight}-600 select-none`}
              >
                •
              </span>
              <textarea
                value={line}
                placeholder={placeholder && isLastBlank ? placeholder : ""}
                rows={1}
                onChange={(e) => updateAt(idx, e.target.value)}
                onBlur={() => commit(drafts)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="flex-1 resize-none overflow-hidden text-[11px] rounded border border-surface-300 px-2 py-1 leading-snug focus:border-indigo-400 focus:outline-none min-h-[32px]"
                style={{ height: "auto" }}
              />
              {drafts.length > 1 && !isLastBlank && (
                <button
                  type="button"
                  onClick={() => removeAt(idx)}
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
          onClick={() => commit([...drafts, ""])}
          className={`text-[10px] px-2 py-1 rounded border border-${highlight}-300 text-${highlight}-700 hover:bg-${highlight}-100/40 font-medium`}
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
