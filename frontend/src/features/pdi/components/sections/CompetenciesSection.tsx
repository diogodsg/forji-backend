// MOVED from src/components/CompetenciesSection.tsx
import React from "react";
import { FiAward } from "react-icons/fi";
import { CompetenciesEditor } from "../editors/CompetenciesEditor";

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
        <FiAward className="w-5 h-5 text-indigo-600" />
        Competências
      </h2>
    </div>
    <CompetenciesEditor
      competencies={competencies}
      onAdd={onAdd}
      onRemove={onRemove}
    />
  </section>
);
