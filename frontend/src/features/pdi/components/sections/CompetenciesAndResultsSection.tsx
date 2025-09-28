import React from "react";
import { FiEdit2, FiCheckSquare, FiAward } from "react-icons/fi";
import { HiLightBulb } from "react-icons/hi";
import type { PdiCompetencyRecord } from "../..";
import { CompetenciesEditor } from "../editors/CompetenciesEditor";
import { ResultsEditor } from "../editors/ResultsEditor";
import { CompetenciesView, ResultsCardsView } from "../structure/views";
import { CollapsibleSectionCard } from "../../../../shared";

interface CompetenciesAndResultsSectionProps {
  competencies: string[];
  records: PdiCompetencyRecord[];
  editing: boolean;
  onToggleEdit: () => void;
  onAddCompetency: (c: string) => void;
  onRemoveCompetency: (c: string) => void;
  onUpdateRecord: (area: string, patch: Partial<PdiCompetencyRecord>) => void;
  onAddRecord: (area?: string) => void;
  onRemoveRecord: (area: string) => void;
  preview?: React.ReactNode;
}

export const CompetenciesAndResultsSection: React.FC<
  CompetenciesAndResultsSectionProps
> = ({
  competencies,
  records,
  editing,
  onToggleEdit,
  onAddCompetency,
  onRemoveCompetency,
  onUpdateRecord,
  onAddRecord,
  onRemoveRecord,
  preview,
}) => {
  return (
    <CollapsibleSectionCard
      icon={FiAward}
      title="Competências e Resultados"
      defaultExpanded={false}
      forceExpanded={editing}
      preview={preview}
      action={
        <button
          onClick={onToggleEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
        >
          {editing ? (
            <>
              <FiCheckSquare className="w-3.5 h-3.5" /> Concluir
            </>
          ) : (
            <>
              <FiEdit2 className="w-3.5 h-3.5" /> Editar
            </>
          )}
        </button>
      }
    >
      <div className="space-y-8">
        {/* Seção de Competências */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Competências Técnicas a Desenvolver
          </h3>
          {editing ? (
            <CompetenciesEditor
              competencies={competencies}
              onAdd={onAddCompetency}
              onRemove={onRemoveCompetency}
            />
          ) : (
            <CompetenciesView items={competencies} />
          )}
        </div>

        {/* Divisor visual */}
        <div className="border-t border-gray-100"></div>

        {/* Seção de Resultados */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Progresso e Evidências
          </h3>
          {editing ? (
            <ResultsEditor
              records={records}
              onUpdate={onUpdateRecord}
              onAdd={onAddRecord}
              onRemove={onRemoveRecord}
              competencies={competencies}
            />
          ) : (
            <ResultsCardsView records={records} />
          )}
        </div>

        {/* Dica quando em edição */}
        {editing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-xs text-blue-700">
              <p className="font-medium mb-1 flex items-center gap-2">
                <HiLightBulb className="w-4 h-4" /> Dica:
              </p>
              <p>
                Primeiro adicione suas competências técnicas acima, depois crie
                registros de progresso para acompanhar sua evolução em cada
                área. Use as evidências para documentar conquistas específicas.
              </p>
            </div>
          </div>
        )}
      </div>
    </CollapsibleSectionCard>
  );
};
