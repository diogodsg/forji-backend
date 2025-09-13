// MOVED from src/components/editors/CompetenciesEditor.tsx
import React, { useState } from "react";

interface Props {
  competencies: string[];
  onAdd: (c: string) => void;
  onRemove: (c: string) => void;
}

export const CompetenciesEditor: React.FC<Props> = ({
  competencies,
  onAdd,
  onRemove,
}) => {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = value.trim();
          if (v) onAdd(v);
          setValue("");
        }}
        className="flex items-center gap-2"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nova competência"
          className="text-xs border rounded px-2 py-1 border-surface-300 flex-1"
        />
        <button
          type="submit"
          className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
        >
          Add
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {competencies.map((c) => (
          <span
            key={c}
            className="group inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-surface-100 border border-surface-300 text-indigo-700"
          >
            {c}
            <button
              type="button"
              onClick={() => onRemove(c)}
              className="opacity-0 group-hover:opacity-100 text-[10px] -mr-1"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
