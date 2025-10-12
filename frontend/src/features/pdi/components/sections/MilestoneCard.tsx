// MOVED from src/components/MilestoneCard.tsx
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FiCalendar,
  FiCheckSquare,
  FiThumbsUp,
  FiAlertTriangle,
  FiLink2,
  FiEdit2,
  FiTrash2,
  FiChevronDown,
  FiChevronRight,
  FiTarget,
  FiPlus,
  FiX,
  FiSquare,
} from "react-icons/fi";
import type { PdiMilestone } from "../..";

interface MilestoneCardProps {
  milestone: PdiMilestone;
  editing: boolean;
  onToggleEdit?: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiMilestone>) => void;
  forceExpanded?: boolean;
}

interface SectionsState {
  notes: boolean;
  tasks: boolean;
  positives: boolean;
  improvements: boolean;
  resources: boolean;
}

// Componente específico para tags de atividades
const WorkActivitiesTagEditor: React.FC<{
  value?: string[];
  onChange: (value: string[]) => void;
}> = ({ value = [], onChange }) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTag()}
          placeholder="Ex: React, API REST, Documentação..."
          className="flex-1 text-sm border border-indigo-200 rounded-lg px-3 py-2 bg-indigo-50/30 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-indigo-400"
        />
        <button
          type="button"
          onClick={addTag}
          disabled={!inputValue.trim()}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200 hover:bg-indigo-150 transition-colors group"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-indigo-600 hover:text-indigo-800 opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <FiX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para listas compactas
const CompactListEditor: React.FC<{
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
  tone: "green" | "orange" | "blue" | "indigo" | "slate";
  showCheckboxes?: boolean;
}> = ({ value = [], onChange, placeholder, tone, showCheckboxes = false }) => {
  const [inputValue, setInputValue] = useState("");

  const toneStyles = {
    green: {
      container: "bg-green-50/50 border-green-200",
      input:
        "border-green-200 focus:border-green-400 focus:ring-green-100 placeholder:text-green-500",
      item: "bg-white border-green-200 hover:bg-green-50 text-green-800",
    },
    orange: {
      container: "bg-orange-50/50 border-orange-200",
      input:
        "border-orange-200 focus:border-orange-400 focus:ring-orange-100 placeholder:text-orange-500",
      item: "bg-white border-orange-200 hover:bg-orange-50 text-orange-800",
    },
    blue: {
      container: "bg-blue-50/50 border-blue-200",
      input:
        "border-blue-200 focus:border-blue-400 focus:ring-blue-100 placeholder:text-blue-500",
      item: "bg-white border-blue-200 hover:bg-blue-50 text-blue-800",
    },
    indigo: {
      container: "bg-indigo-50/50 border-indigo-200",
      input:
        "border-indigo-200 focus:border-indigo-400 focus:ring-indigo-100 placeholder:text-indigo-500",
      item: "bg-white border-indigo-200 hover:bg-indigo-50 text-indigo-800",
    },
    slate: {
      container: "bg-slate-50/50 border-slate-200",
      input:
        "border-slate-200 focus:border-slate-400 focus:ring-slate-100 placeholder:text-slate-500",
      item: "bg-white border-slate-200 hover:bg-slate-50 text-slate-800",
    },
  };

  const addItem = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const toggleTask = (index: number) => {
    if (!showCheckboxes) return;

    const newItems = [...value];
    const item = newItems[index];
    if (item.startsWith("✓")) {
      newItems[index] = "○" + item.slice(1);
    } else if (item.startsWith("○")) {
      newItems[index] = "✓" + item.slice(1);
    }
    onChange(newItems);
  };

  const styles = toneStyles[tone];

  return (
    <div className={`rounded-lg border p-4 space-y-3 ${styles.container}`}>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
          placeholder={placeholder}
          className={`flex-1 text-sm border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 transition-all ${styles.input}`}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={!inputValue.trim()}
          className="px-4 py-2.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <FiPlus className="w-4 h-4" />
        </button>
      </div>

      {value.length > 0 && (
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {value.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all group ${styles.item}`}
            >
              {showCheckboxes && (
                <button
                  onClick={() => toggleTask(index)}
                  className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  {item.startsWith("✓") ? (
                    <FiCheckSquare className="w-4 h-4 text-green-600" />
                  ) : (
                    <FiSquare className="w-4 h-4" />
                  )}
                </button>
              )}
              <span
                className={`flex-1 text-sm leading-relaxed ${
                  showCheckboxes && item.startsWith("✓")
                    ? "line-through text-gray-500"
                    : ""
                }`}
              >
                {showCheckboxes ? item.replace(/^[✓○]\s*/, "") : item}
              </span>
              <button
                onClick={() => removeItem(index)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para seções colapsáveis
const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  forceExpanded?: boolean;
}> = ({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
  forceExpanded = false,
}) => (
  <div className="space-y-2">
    <button
      onClick={onToggle}
      disabled={forceExpanded}
      className={`w-full text-left flex items-center justify-between gap-2 text-xs font-semibold tracking-wide text-gray-600 uppercase hover:text-gray-800 transition-colors ${
        forceExpanded ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-2">
        {icon}
        {title}
      </div>
      <div
        className={`transition-transform duration-200 ${
          isExpanded ? "rotate-180" : ""
        }`}
      >
        <FiChevronDown className="w-3 h-3" />
      </div>
    </button>
    <div
      className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="pt-2">{children}</div>
    </div>
  </div>
);

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone: m,
  editing,
  onToggleEdit,
  onRemove,
  onUpdate,
  forceExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(editing || false);
  const [sectionsExpanded, setSectionsExpanded] = useState<SectionsState>({
    notes: editing || Boolean(m.summary?.trim()), // Expandida se editando ou se tem conteúdo
    tasks: editing || Boolean(m.tasks?.length),
    positives: editing || Boolean(m.positives?.length),
    improvements: editing || Boolean(m.improvements?.length),
    resources: editing || Boolean(m.resources?.length),
  });

  // Auto-expandir quando entrar em modo de edição ou quando forceExpanded muda
  useEffect(() => {
    if (editing || forceExpanded) {
      setIsExpanded(true);
      // Expandir todas as seções quando editando
      setSectionsExpanded({
        notes: true,
        tasks: true,
        positives: true,
        improvements: true,
        resources: true,
      });
    } else if (forceExpanded === false) {
      // Quando forceExpanded vai para false, permite que o usuário controle individualmente
      // mas não força o colapso se o usuário já expandiu manualmente
    }
  }, [editing, forceExpanded]);

  // Função para alternar expansão
  const toggleExpanded = () => {
    if (!editing && !forceExpanded) {
      // Só permite colapsar se não estiver editando nem forçadamente expandido
      setIsExpanded(!shouldBeExpanded);
    }
  };

  // Função para alternar seções individuais
  const toggleSection = (section: keyof SectionsState) => {
    setSectionsExpanded((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Determinar se deve estar expandido (editing, forceExpanded, ou estado local)
  const shouldBeExpanded = editing || forceExpanded || isExpanded;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6 cursor-pointer" onClick={toggleExpanded}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 flex items-start gap-3">
            {/* Ícone de expansão com melhor design */}
            <button
              className={`mt-1.5 p-1.5 rounded-lg transition-all duration-200 ${
                editing || forceExpanded
                  ? "cursor-default bg-slate-100 text-slate-400"
                  : "cursor-pointer hover:bg-slate-200 text-slate-500 hover:text-slate-700"
              }`}
              title={shouldBeExpanded ? "Colapsar" : "Expandir"}
              aria-label={
                shouldBeExpanded
                  ? "Colapsar acompanhamento"
                  : "Expandir acompanhamento"
              }
              disabled={editing || forceExpanded}
            >
              {shouldBeExpanded ? (
                <FiChevronDown className="w-4 h-4" />
              ) : (
                <FiChevronRight className="w-4 h-4" />
              )}
            </button>

            <div className="flex-1">
              {editing ? (
                <TitleInput
                  value={m.title}
                  onChange={(value) => onUpdate(m.id, { title: value })}
                  placeholder="Título do acompanhamento"
                />
              ) : (
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {m.title || "(Sem título)"}
                </h3>
              )}
              {/* Badge da data com melhor design */}
              <div className="flex items-center gap-2 mb-3">
                {editing ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-300 shadow-sm">
                    <FiCalendar className="w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="date"
                      value={m.date}
                      onChange={(e) => onUpdate(m.id, { date: e.target.value })}
                      className="text-xs font-medium text-slate-600 bg-transparent border-none outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                    <FiCalendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold tracking-wide">
                      {new Date(m.date).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Preview quando colapsado */}
              {!shouldBeExpanded && !editing && (
                <div className="mt-3 text-sm text-gray-600">
                  {/* Preview do summary */}
                  {m.summary && (
                    <div className="mb-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200/50">
                      <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                        {m.summary}
                      </p>
                    </div>
                  )}

                  {/* Preview das atividades de trabalho com tags */}
                  {m.workActivities && (
                    <div className="mb-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/60">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1 bg-indigo-100 rounded-lg">
                          <FiTarget className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-indigo-800">
                          Trabalhou em:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.workActivities
                          .split(",")
                          .slice(0, 4)
                          .map((activity, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200"
                            >
                              {activity.trim()}
                            </span>
                          ))}
                        {m.workActivities.split(",").length > 4 && (
                          <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-200 text-indigo-700 rounded-full">
                            +{m.workActivities.split(",").length - 4} mais
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Estatísticas com cards coloridos */}
                  <div className="flex flex-wrap gap-3">
                    {(m.tasks?.length || 0) > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="p-1 bg-slate-100 rounded">
                          <FiCheckSquare className="w-3 h-3 text-slate-600" />
                        </div>
                        <span className="text-xs font-medium text-slate-700">
                          {m.tasks?.filter((t) => t.done).length || 0}/
                          {m.tasks?.length || 0} tarefas
                        </span>
                      </div>
                    )}

                    {(m.positives?.length || 0) > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="p-1 bg-green-100 rounded">
                          <FiThumbsUp className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-xs font-medium text-green-700">
                          {m.positives?.length || 0} positivos
                        </span>
                      </div>
                    )}

                    {(m.improvements?.length || 0) > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="p-1 bg-orange-100 rounded">
                          <FiAlertTriangle className="w-3 h-3 text-orange-600" />
                        </div>
                        <span className="text-xs font-medium text-orange-700">
                          {m.improvements?.length || 0} melhorias
                        </span>
                      </div>
                    )}

                    {(m.resources?.length || 0) > 0 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="p-1 bg-blue-100 rounded">
                          <FiLink2 className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-blue-700">
                          {m.resources?.length || 0} recursos
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Botões de ação com melhor design */}
          <div
            className="flex gap-2 self-start"
            onClick={(e) => e.stopPropagation()} // Evita colapsar ao clicar nos botões
          >
            {onToggleEdit && (
              <button
                onClick={() => onToggleEdit(m.id)}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 bg-white transition-all duration-200 shadow-sm hover:shadow"
                title={editing ? "Concluir" : "Editar"}
              >
                {editing ? (
                  <FiCheckSquare className="w-4 h-4" />
                ) : (
                  <FiEdit2 className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => onRemove(m.id)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50 bg-white transition-all duration-200 shadow-sm hover:shadow"
              title="Remover"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo colapsável com animação suave */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          shouldBeExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-6 bg-gradient-to-b from-white to-slate-50/30">
          {editing ? (
            <EditingBody m={m} onUpdate={onUpdate} />
          ) : (
            <ViewBody
              m={m}
              sectionsExpanded={sectionsExpanded}
              toggleSection={toggleSection}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const EditingBody: React.FC<{
  m: PdiMilestone;
  onUpdate: (id: string, patch: Partial<PdiMilestone>) => void;
}> = ({ m, onUpdate }) => (
  <div className="space-y-6">
    {/* Primeira seção: Atividades de Trabalho com destaque */}
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-base font-bold tracking-wide text-indigo-800 uppercase">
        <div className="p-2 bg-indigo-100 rounded-xl">
          <FiTarget className="w-5 h-5 text-indigo-700" />
        </div>
        <span>No que esteve trabalhando</span>
        <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent"></div>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 border border-indigo-200/50 shadow-lg ring-1 ring-indigo-100">
        <WorkActivitiesTagEditor
          value={
            m.workActivities
              ? m.workActivities
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean)
              : []
          }
          onChange={(arr: string[]) =>
            onUpdate(m.id, { workActivities: arr.join(", ") })
          }
        />
      </div>
    </div>

    {/* Resumo/Notas com design aprimorado */}
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-base font-bold tracking-wide text-slate-700 uppercase">
        <div className="p-2 bg-slate-100 rounded-xl">
          <FiCalendar className="w-5 h-5 text-slate-600" />
        </div>
        <span>Notas Gerais</span>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200/50 shadow-lg ring-1 ring-slate-100">
        <textarea
          value={m.summary || ""}
          onChange={(e) => onUpdate(m.id, { summary: e.target.value })}
          placeholder="Resumo geral do período, observações importantes..."
          className="w-full text-sm border border-slate-300 rounded-xl px-5 py-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all placeholder:text-slate-500 resize-none bg-white shadow-sm"
          rows={4}
        />
      </div>
    </div>

    {/* Layout em 2 colunas com design premium */}
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Coluna 1: Tarefas & Recursos */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wide text-slate-700 uppercase">
            <div className="p-1.5 bg-slate-100 rounded-lg">
              <FiCheckSquare className="w-4 h-4 text-slate-600" />
            </div>
            <span>Tarefas & Próximos Passos</span>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          <CompactListEditor
            value={
              m.tasks?.map((t) => `${t.done ? "✓" : "○"} ${t.title}`) || []
            }
            onChange={(arr: string[]) => {
              const tasks = arr.map((item) => {
                const isDone = item.startsWith("✓");
                const title = item.replace(/^[✓○]\s*/, "");
                return {
                  id: crypto.randomUUID(),
                  title,
                  done: isDone,
                };
              });
              onUpdate(m.id, { tasks });
            }}
            placeholder="Nova tarefa..."
            tone="slate"
            showCheckboxes={true}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wide text-blue-700 uppercase">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <FiLink2 className="w-4 h-4 text-blue-600" />
            </div>
            <span>Recursos & Links Úteis</span>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          <CompactListEditor
            value={m.resources}
            onChange={(arr: string[]) => onUpdate(m.id, { resources: arr })}
            placeholder="Links úteis, documentação, ferramentas utilizadas..."
            tone="blue"
          />
        </div>
      </div>

      {/* Coluna 2: Pontos Positivos & Melhorias */}
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wide text-green-700 uppercase">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <FiThumbsUp className="w-4 h-4 text-green-600" />
            </div>
            <span>Pontos Positivos</span>
            <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-transparent"></div>
          </div>
          <CompactListEditor
            value={m.positives}
            onChange={(arr: string[]) => onUpdate(m.id, { positives: arr })}
            placeholder="O que funcionou bem..."
            tone="green"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm font-bold tracking-wide text-orange-700 uppercase">
            <div className="p-1.5 bg-orange-100 rounded-lg">
              <FiAlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <span>Pontos de Melhoria</span>
            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
          </div>
          <CompactListEditor
            value={m.improvements}
            onChange={(arr: string[]) => onUpdate(m.id, { improvements: arr })}
            placeholder="O que pode melhorar..."
            tone="orange"
          />
        </div>
      </div>
    </div>
  </div>
);

const ViewBody: React.FC<{
  m: PdiMilestone;
  sectionsExpanded: SectionsState;
  toggleSection: (section: keyof SectionsState) => void;
}> = ({ m, sectionsExpanded, toggleSection }) => (
  <div className="space-y-8">
    {/* Notas Gerais com design premium */}
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-base font-bold tracking-wide text-slate-700 uppercase">
        <div className="p-2 bg-slate-100 rounded-xl">
          <FiCalendar className="w-5 h-5 text-slate-600" />
        </div>
        <span>Notas Gerais</span>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
      </div>
      <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200/50 shadow-lg ring-1 ring-slate-100">
        <div className="prose prose-sm max-w-none text-slate-700 prose-headings:text-slate-800 prose-headings:font-bold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {m.summary || "_Sem conteúdo adicionado_"}
          </ReactMarkdown>
        </div>
      </div>
    </div>

    {/* Atividades de Trabalho com tags visuais */}
    {m.workActivities && (
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-base font-bold tracking-wide text-indigo-800 uppercase">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <FiTarget className="w-5 h-5 text-indigo-700" />
          </div>
          <span>No que esteve trabalhando</span>
          <div className="flex-1 h-px bg-gradient-to-r from-indigo-200 to-transparent"></div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 border border-indigo-200/50 shadow-lg ring-1 ring-indigo-100">
          <div className="flex flex-wrap gap-2">
            {m.workActivities.split(",").map((activity, index) => (
              <span
                key={index}
                className="inline-flex items-center px-4 py-2 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full border border-indigo-200 shadow-sm"
              >
                {activity.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* Layout em 2 colunas com design premium */}
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Primeira coluna: Tarefas e Referências */}
      <div className="space-y-6">
        <CollapsibleSection
          title="Tarefas / Próximos passos"
          icon={<FiCheckSquare className="w-4 h-4 text-slate-500" />}
          isExpanded={sectionsExpanded.tasks}
          onToggle={() => toggleSection("tasks")}
        >
          <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-gray-100 p-5 shadow-lg shadow-slate-200/50">
            {(!m.tasks || m.tasks.length === 0) && (
              <p className="text-xs text-gray-500 italic">
                Sem tarefas pendentes
              </p>
            )}
            <div className="space-y-3">
              {m.tasks?.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-white/60 border border-slate-100"
                >
                  <span
                    className={`w-3 h-3 rounded-full border-2 ${
                      t.done
                        ? "bg-green-500 border-green-500"
                        : "border-slate-300 bg-white"
                    } shadow-sm`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      t.done ? "line-through text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {t.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        {m.resources && m.resources.length > 0 && (
          <CollapsibleSection
            title="Referências"
            icon={<FiLink2 className="w-4 h-4 text-blue-500" />}
            isExpanded={sectionsExpanded.resources}
            onToggle={() => toggleSection("resources")}
          >
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-5 shadow-lg shadow-blue-200/50">
              <div className="space-y-3">
                {m.resources.map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-white/60 border border-blue-100"
                  >
                    <a
                      href={s}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-blue-700 hover:text-blue-800 hover:underline transition-colors duration-200 break-all"
                    >
                      {s}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}
      </div>

      {/* Segunda coluna: Pontos Positivos e de Melhoria */}
      <div className="space-y-6">
        {m.positives && m.positives.length > 0 && (
          <CollapsibleSection
            title="Pontos Positivos"
            icon={<FiThumbsUp className="w-4 h-4 text-green-500" />}
            isExpanded={sectionsExpanded.positives}
            onToggle={() => toggleSection("positives")}
          >
            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-5 shadow-lg shadow-green-200/50">
              <div className="space-y-3">
                {m.positives.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/60 border border-green-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}

        {m.improvements && m.improvements.length > 0 && (
          <CollapsibleSection
            title="Pontos de Melhoria"
            icon={<FiAlertTriangle className="w-4 h-4 text-orange-500" />}
            isExpanded={sectionsExpanded.improvements}
            onToggle={() => toggleSection("improvements")}
          >
            <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-100 p-5 shadow-lg shadow-orange-200/50">
              <div className="space-y-3">
                {m.improvements.map((s, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/60 border border-orange-100"
                  >
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <p className="text-sm font-medium text-gray-700 leading-relaxed">
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  </div>
);

// Componente com debounce para edição de título
interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TitleInput: React.FC<TitleInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Sincronizar valor externo com estado local (quando não estiver editando)
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
    }
  }, [value]);

  // Cleanup no unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);

    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce de 300ms para reduzir chamadas frequentes
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        onChange(newValue);
      }
    }, 300);
  };

  const handleBlur = () => {
    // Força commit imediato no blur
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      onChange(localValue);
    }
  };

  return (
    <input
      value={localValue}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={handleBlur}
      className="w-full text-lg font-semibold text-indigo-700 bg-transparent focus:outline-none focus:ring-0 placeholder:text-indigo-300"
      placeholder={placeholder}
      onClick={(e) => e.stopPropagation()} // Evita colapsar ao clicar no input
    />
  );
};
