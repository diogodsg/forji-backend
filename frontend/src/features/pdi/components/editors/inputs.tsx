// MOVED from src/components/pdi/inputs.tsx
import React, { useState } from "react";
import type { PdiTask } from "../..";

export const ListEditor: React.FC<{
  label: string;
  value?: string[];
  onChange: (v: string[]) => void;
  highlight?: string;
  placeholder?: string;
}> = ({ label, value, onChange, highlight = "emerald", placeholder }) => {
  const text = value && value.length ? value.join("\n") : "";
  return (
    <div
      className={`rounded-lg border border-${highlight}-200 bg-${highlight}-50/40 p-2`}
    >
      <label
        className={`block text-[10px] font-semibold text-${highlight}-700 mb-1 uppercase tracking-wide`}
      >
        {label}
      </label>
      <textarea
        value={text}
        onChange={(e) => {
          // Anteriormente trimávamos cada linha, impedindo o usuário de inserir espaços
          // (especialmente no final da linha). Agora preservamos o texto cru e apenas
          // descartamos linhas completamente vazias.
          const lines = e.target.value
            .split(/\n/)
            .filter((l) => l.trim() !== "");
          onChange(lines);
        }}
        rows={3}
        placeholder={placeholder || "Linhas"}
        className="w-full text-[11px] resize-y rounded border border-surface-300 p-1 focus:border-indigo-400"
      />
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
