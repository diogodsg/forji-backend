// MOVED from src/components/MilestoneCard.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "react-icons/fi";
import type { PdiMilestone } from "../..";
import { ListEditor, TaskEditor } from "../editors/inputs";

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
  suggestions: boolean;
  tasks: boolean;
  positives: boolean;
  improvements: boolean;
  resources: boolean;
}

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
    suggestions: editing || Boolean(m.suggestions?.length),
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
        suggestions: true,
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
    <div className="rounded-2xl border border-surface-300 bg-white shadow-sm">
      <div className="p-6 cursor-pointer" onClick={toggleExpanded}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 flex items-start gap-3">
            {/* Ícone de expansão */}
            <button
              className={`mt-1 text-gray-400 hover:text-gray-600 transition-colors ${
                editing || forceExpanded ? "cursor-default" : "cursor-pointer"
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
                <input
                  value={m.title}
                  onChange={(e) => onUpdate(m.id, { title: e.target.value })}
                  className="w-full text-lg font-semibold text-indigo-700 bg-transparent focus:outline-none focus:ring-0 placeholder:text-indigo-300"
                  placeholder="Título do acompanhamento"
                  onClick={(e) => e.stopPropagation()} // Evita colapsar ao clicar no input
                />
              ) : (
                <h3 className="text-lg font-semibold text-indigo-700">
                  {m.title || "(Sem título)"}
                </h3>
              )}
              <div className="mt-1 flex items-center gap-1 text-[11px] uppercase tracking-wide text-gray-500">
                <FiCalendar className="w-3.5 h-3.5" />
                {editing ? (
                  <input
                    type="date"
                    value={m.date}
                    onChange={(e) => onUpdate(m.id, { date: e.target.value })}
                    className="bg-white border border-surface-300 rounded px-2 py-0.5 text-[10px] focus:border-indigo-400"
                    onClick={(e) => e.stopPropagation()} // Evita colapsar ao clicar no input
                  />
                ) : (
                  <span>{m.date}</span>
                )}
              </div>

              {/* Preview quando colapsado */}
              {!shouldBeExpanded && !editing && (
                <div className="mt-3 text-sm text-gray-600">
                  {/* Mostrar preview do summary */}
                  {m.summary && (
                    <p
                      className="mb-2 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical" as const,
                        lineHeight: "1.4em",
                        maxHeight: "2.8em",
                      }}
                    >
                      {m.summary.length > 100
                        ? `${m.summary.substring(0, 100)}...`
                        : m.summary}
                    </p>
                  )}

                  {/* Mostrar estatísticas rápidas */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {(m.tasks?.length || 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <FiCheckSquare className="w-3 h-3" />
                        {m.tasks?.filter((t) => t.done).length || 0}/
                        {m.tasks?.length || 0} tarefas
                      </span>
                    )}
                    {(m.positives?.length || 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <FiThumbsUp className="w-3 h-3 text-emerald-500" />
                        {m.positives?.length || 0} positivos
                      </span>
                    )}
                    {(m.improvements?.length || 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <FiAlertTriangle className="w-3 h-3 text-amber-500" />
                        {m.improvements?.length || 0} melhorias
                      </span>
                    )}
                    {(m.resources?.length || 0) > 0 && (
                      <span className="flex items-center gap-1">
                        <FiLink2 className="w-3 h-3 text-sky-500" />
                        {m.resources?.length || 0} recursos
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className="flex gap-1 self-start opacity-70 hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()} // Evita colapsar ao clicar nos botões
          >
            {onToggleEdit && (
              <button
                onClick={() => onToggleEdit(m.id)}
                className="p-1 rounded border border-surface-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 bg-white text-[10px]"
                title={editing ? "Concluir" : "Editar"}
              >
                {editing ? (
                  <FiCheckSquare className="w-3.5 h-3.5" />
                ) : (
                  <FiEdit2 className="w-3.5 h-3.5" />
                )}
              </button>
            )}
            <button
              onClick={() => onRemove(m.id)}
              className="p-1 rounded border border-surface-200 text-gray-500 hover:text-red-600 hover:border-red-300 bg-white text-[10px]"
              title="Remover"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Conteúdo colapsável com animação */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          shouldBeExpanded ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 space-y-6">
          {editing ? (
            <EditingBody
              m={m}
              onUpdate={onUpdate}
              sectionsExpanded={sectionsExpanded}
              toggleSection={toggleSection}
            />
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
  sectionsExpanded: SectionsState;
  toggleSection: (section: keyof SectionsState) => void;
}> = ({ m, onUpdate, sectionsExpanded, toggleSection }) => (
  <>
    <CollapsibleSection
      title="Notas / Registro"
      icon={<FiCalendar className="w-4 h-4 text-indigo-500" />}
      isExpanded={sectionsExpanded.notes}
      onToggle={() => toggleSection("notes")}
      forceExpanded={true} // Sempre expandida quando editando
    >
      <MarkdownField
        value={m.summary || ""}
        onChange={(val: string) => onUpdate(m.id, { summary: val })}
      />
    </CollapsibleSection>
    <CollapsibleSection
      title="Sugestões da IA"
      icon={<FiCalendar className="w-4 h-4 text-violet-500" />}
      isExpanded={sectionsExpanded.suggestions}
      onToggle={() => toggleSection("suggestions")}
      forceExpanded={true} // Sempre expandida quando editando
    >
      <CardWrapper
        icon={<FiCalendar className="w-4 h-4 text-violet-500" />}
        title=""
        tone="violet"
      >
        <ListEditor
          label="Sugestões"
          value={m.suggestions}
          onChange={(arr: string[]) => onUpdate(m.id, { suggestions: arr })}
          highlight="violet"
        />
      </CardWrapper>
    </CollapsibleSection>

    <div className="grid md:grid-cols-2 gap-6">
      <CollapsibleSection
        title="Tarefas / Próximos passos"
        icon={<FiCheckSquare className="w-4 h-4 text-indigo-500" />}
        isExpanded={sectionsExpanded.tasks}
        onToggle={() => toggleSection("tasks")}
        forceExpanded={true} // Sempre expandida quando editando
      >
        <CardWrapper
          icon={<FiCheckSquare className="w-4 h-4 text-indigo-500" />}
          title=""
          tone="indigo"
        >
          <TaskEditor
            milestoneId={m.id}
            tasks={m.tasks}
            onChange={(tasks: any) => onUpdate(m.id, { tasks })}
          />
        </CardWrapper>
      </CollapsibleSection>

      <div className="space-y-6">
        <CollapsibleSection
          title="Pontos Positivos"
          icon={<FiThumbsUp className="w-4 h-4 text-emerald-500" />}
          isExpanded={sectionsExpanded.positives}
          onToggle={() => toggleSection("positives")}
          forceExpanded={true} // Sempre expandida quando editando
        >
          <CardWrapper
            icon={<FiThumbsUp className="w-4 h-4 text-emerald-500" />}
            title=""
            tone="emerald"
          >
            <ListEditor
              label="Pontos positivos"
              value={m.positives}
              onChange={(arr: string[]) => onUpdate(m.id, { positives: arr })}
            />
          </CardWrapper>
        </CollapsibleSection>

        <CollapsibleSection
          title="Pontos de Melhoria"
          icon={<FiAlertTriangle className="w-4 h-4 text-amber-500" />}
          isExpanded={sectionsExpanded.improvements}
          onToggle={() => toggleSection("improvements")}
          forceExpanded={true} // Sempre expandida quando editando
        >
          <CardWrapper
            icon={<FiAlertTriangle className="w-4 h-4 text-amber-500" />}
            title=""
            tone="amber"
          >
            <ListEditor
              label="Pontos de melhoria"
              value={m.improvements}
              onChange={(arr: string[]) =>
                onUpdate(m.id, { improvements: arr })
              }
              highlight="amber"
            />
          </CardWrapper>
        </CollapsibleSection>
      </div>
    </div>

    <CollapsibleSection
      title="Referências"
      icon={<FiLink2 className="w-4 h-4 text-sky-500" />}
      isExpanded={sectionsExpanded.resources}
      onToggle={() => toggleSection("resources")}
      forceExpanded={true} // Sempre expandida quando editando
    >
      <CardWrapper
        icon={<FiLink2 className="w-4 h-4 text-sky-500" />}
        title=""
        tone="sky"
      >
        <ListEditor
          label="Links / Recursos"
          value={m.resources}
          onChange={(arr: string[]) => onUpdate(m.id, { resources: arr })}
          highlight="sky"
          placeholder="https://..."
        />
      </CardWrapper>
    </CollapsibleSection>
  </>
);

const ViewBody: React.FC<{
  m: PdiMilestone;
  sectionsExpanded: SectionsState;
  toggleSection: (section: keyof SectionsState) => void;
}> = ({ m, sectionsExpanded, toggleSection }) => (
  <div className="space-y-6">
    <CollapsibleSection
      title="Notas / Registro"
      icon={<FiCalendar className="w-4 h-4 text-indigo-500" />}
      isExpanded={sectionsExpanded.notes}
      onToggle={() => toggleSection("notes")}
    >
      <div className="p-3 prose prose-sm max-w-none text-[13px] prose-headings:mt-3 border rounded-lg border-surface-200 bg-surface-50/50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {m.summary || "_Sem conteúdo_"}
        </ReactMarkdown>
      </div>
    </CollapsibleSection>
    {m.suggestions && m.suggestions.length > 0 && (
      <CollapsibleSection
        title="Sugestões da IA"
        icon={<FiCalendar className="w-4 h-4 text-violet-500" />}
        isExpanded={sectionsExpanded.suggestions}
        onToggle={() => toggleSection("suggestions")}
      >
        <CardWrapper
          icon={<FiCalendar className="w-4 h-4 text-violet-500" />}
          title=""
          tone="violet"
        >
          <ul className="list-disc ml-4 text-xs space-y-1">
            {m.suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </CardWrapper>
      </CollapsibleSection>
    )}

    <div className="grid md:grid-cols-2 gap-6">
      <CollapsibleSection
        title="Tarefas / Próximos passos"
        icon={<FiCheckSquare className="w-4 h-4 text-indigo-500" />}
        isExpanded={sectionsExpanded.tasks}
        onToggle={() => toggleSection("tasks")}
      >
        <CardWrapper
          icon={<FiCheckSquare className="w-4 h-4 text-indigo-500" />}
          title=""
          tone="indigo"
        >
          {(!m.tasks || m.tasks.length === 0) && (
            <p className="text-[11px] text-gray-500">Sem tarefas.</p>
          )}
          <ul className="text-xs space-y-1">
            {m.tasks?.map((t) => (
              <li key={t.id} className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    t.done ? "bg-emerald-500" : "bg-surface-300"
                  }`}
                />
                <span className={t.done ? "line-through text-gray-500" : ""}>
                  {t.title}
                </span>
              </li>
            ))}
          </ul>
        </CardWrapper>
      </CollapsibleSection>

      <div className="space-y-6">
        {m.positives && m.positives.length > 0 && (
          <CollapsibleSection
            title="Pontos Positivos"
            icon={<FiThumbsUp className="w-4 h-4 text-emerald-500" />}
            isExpanded={sectionsExpanded.positives}
            onToggle={() => toggleSection("positives")}
          >
            <CardWrapper
              icon={<FiThumbsUp className="w-4 h-4 text-emerald-500" />}
              title=""
              tone="emerald"
            >
              <ul className="list-disc ml-4 text-xs space-y-1">
                {m.positives.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </CardWrapper>
          </CollapsibleSection>
        )}

        {m.improvements && m.improvements.length > 0 && (
          <CollapsibleSection
            title="Pontos de Melhoria"
            icon={<FiAlertTriangle className="w-4 h-4 text-amber-500" />}
            isExpanded={sectionsExpanded.improvements}
            onToggle={() => toggleSection("improvements")}
          >
            <CardWrapper
              icon={<FiAlertTriangle className="w-4 h-4 text-amber-500" />}
              title=""
              tone="amber"
            >
              <ul className="list-disc ml-4 text-xs space-y-1">
                {m.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </CardWrapper>
          </CollapsibleSection>
        )}
      </div>
    </div>

    {m.resources && m.resources.length > 0 && (
      <CollapsibleSection
        title="Referências"
        icon={<FiLink2 className="w-4 h-4 text-sky-500" />}
        isExpanded={sectionsExpanded.resources}
        onToggle={() => toggleSection("resources")}
      >
        <CardWrapper
          icon={<FiLink2 className="w-4 h-4 text-sky-500" />}
          title=""
          tone="sky"
        >
          <ul className="list-disc ml-4 text-xs space-y-1">
            {m.resources.map((s, i) => (
              <li key={i}>
                <a
                  href={s}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 hover:underline"
                >
                  {s}
                </a>
              </li>
            ))}
          </ul>
        </CardWrapper>
      </CollapsibleSection>
    )}
  </div>
);

const MarkdownField: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const [mode, setMode] = useState<"edit" | "preview">(
    value ? "preview" : "edit"
  );
  const [draft, setDraft] = useState(value);
  const lastExternal = useRef(value);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [dirty, setDirty] = useState(false);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, 640);
    el.style.height = next + "px";
  }, []);

  const flush = useCallback(() => {
    if (draft !== lastExternal.current) {
      onChange(draft);
      lastExternal.current = draft;
      setDirty(false);
    }
  }, [draft, onChange]);

  useEffect(() => {
    const id = setTimeout(() => flush(), 450); // debounce reduzido
    return () => clearTimeout(id);
  }, [draft, flush]);

  useEffect(() => {
    if (value !== lastExternal.current) {
      setDraft(value);
      lastExternal.current = value;
      setDirty(false);
    }
  }, [value]);

  useEffect(() => {
    autoResize();
  }, [draft, autoResize, mode]);

  const switchMode = (next: "edit" | "preview") => {
    if (next === "preview") flush();
    setMode(next);
  };

  return (
    <div className="border rounded-lg border-surface-300 relative">
      {dirty && mode === "edit" && (
        <span className="absolute right-2 top-1.5 text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 font-medium">
          Draft
        </span>
      )}
      <div className="flex items-center justify-between border-b bg-surface-50 px-2 py-1 text-[10px] font-medium">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => switchMode("edit")}
            className={`px-2 py-0.5 rounded ${
              mode === "edit"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border border-indigo-200"
            }`}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => switchMode("preview")}
            className={`px-2 py-0.5 rounded ${
              mode === "preview"
                ? "bg-indigo-600 text-white"
                : "bg-white text-indigo-600 border border-indigo-200"
            }`}
          >
            Preview
          </button>
        </div>
      </div>
      {mode === "edit" ? (
        <textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setDirty(true);
          }}
          onBlur={flush}
          rows={6}
          className="w-full text-xs p-2 bg-white rounded-b-lg focus:outline-none resize-none leading-snug"
          placeholder="Escreva em markdown..."
        />
      ) : (
        <div className="p-3 prose prose-sm max-w-none text-[13px] prose-headings:mt-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {draft || "_Sem conteúdo_"}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const CardWrapper: React.FC<{
  icon: React.ReactNode;
  title: string;
  tone: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="rounded-lg border border-surface-300 bg-white/70 p-4 space-y-3 shadow-sm">
    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-gray-600 uppercase">
      {icon}
      <span>{title}</span>
    </div>
    {children}
  </div>
);
