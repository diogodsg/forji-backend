import React from "react";

interface CompetenciesSectionProps {
  competencies: string[];
  onAdd: (c: string) => void;
  onRemove: (c: string) => void;
}

export const CompetenciesSection: React.FC<CompetenciesSectionProps> = ({
  competencies,
  onAdd,
  onRemove,
}) => (
  <section className="rounded-xl border border-surface-300 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span className="w-1.5 h-5 bg-indigo-600 rounded" />
        Competências
      </h2>
      <AddCompetencyForm onAdd={onAdd} />
    </div>
    <div className="flex flex-wrap gap-2">
      {competencies.map((c) => (
        <span
          key={c}
          className="group inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-indigo-50 border border-indigo-200 text-indigo-700"
        >
          {c}
          <button
            onClick={() => onRemove(c)}
            className="opacity-60 group-hover:opacity-100 text-[10px]"
            aria-label="remover"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  </section>
);

// Import AddCompetencyForm from the original file
import { AddCompetencyForm } from "./EditablePdiView";
