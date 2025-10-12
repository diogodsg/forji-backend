import React from "react";
import { FiAward } from "react-icons/fi";
import { CompetencyDisplay } from "../CompetencyDisplay";
import { CollapsibleSectionCard } from "../../../../shared";

interface SelectedCompetency {
  competencyId: string;
  targetLevel: number;
  currentLevel?: number;
}

interface NewCompetenciesSectionProps {
  editing: boolean;
  onToggleEdit: () => void;
  userId?: number;
  selectedCompetencies?: SelectedCompetency[];
  onUpdateCompetencies?: (competencies: SelectedCompetency[]) => void;
}

export const NewCompetenciesSection: React.FC<NewCompetenciesSectionProps> = ({
  editing,
  onToggleEdit,
  userId: _userId,
  selectedCompetencies = [],
  onUpdateCompetencies = () => {},
}) => {
  return (
    <CollapsibleSectionCard
      icon={FiAward}
      title="Competências e Resultados"
      defaultExpanded={true}
      forceExpanded={editing}
      preview={null}
      action={
        <button
          onClick={onToggleEdit}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border transition-all ${
            editing
              ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
              : "border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          {editing ? (
            <>
              <FiAward className="w-3 h-3" />
              Concluir Edição
            </>
          ) : (
            <>
              <FiAward className="w-3 h-3" />
              Editar Competências
            </>
          )}
        </button>
      }
    >
      <CompetencyDisplay
        selectedCompetencies={selectedCompetencies}
        onUpdateCompetencies={onUpdateCompetencies}
        readonly={!editing}
      />
    </CollapsibleSectionCard>
  );
};
