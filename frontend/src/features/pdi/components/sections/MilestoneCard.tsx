// MOVED from src/components/MilestoneCard.tsx
import React, { useState } from "react";
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
} from "react-icons/fi";
import type { PdiMilestone } from "../..";
import { ListEditor, TaskEditor } from "../editors/inputs";

interface MilestoneCardProps {
  milestone: PdiMilestone;
  editing: boolean;
  onToggleEdit?: (id: string) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PdiMilestone>) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone: m,
  editing,
  onToggleEdit,
  onRemove,
  onUpdate,
}) => {
  return (
    <div className="rounded-2xl border border-surface-300 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          {editing ? (
            <input
              value={m.title}
              onChange={(e) => onUpdate(m.id, { title: e.target.value })}
              className="w-full text-lg font-semibold text-indigo-700 bg-transparent focus:outline-none focus:ring-0 placeholder:text-indigo-300"
              placeholder="Título do encontro"
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
              />
            ) : (
              <span>{m.date}</span>
            )}
          </div>
        </div>
        <div className="flex gap-1 self-start opacity-70 hover:opacity-100 transition-opacity">
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

      {editing ? <EditingBody m={m} onUpdate={onUpdate} /> : <ViewBody m={m} />}
    </div>
  );
};

const EditingBody: React.FC<{
  m: PdiMilestone;
  onUpdate: (id: string, patch: Partial<PdiMilestone>) => void;
}> = ({ m, onUpdate }) => (
  <>
    <div className="space-y-2">
      <h4 className="text-xs font-semibold tracking-wide text-gray-600 flex items-center gap-2 uppercase">
        <FiCalendar className="w-4 h-4 text-indigo-500" /> Notas / Registro
      </h4>
      <MarkdownField
        value={m.summary || ""}
        onChange={(val: string) => onUpdate(m.id, { summary: val })}
      />
    </div>
    <div>
      <CardWrapper
        icon={<FiCalendar className="w-4 h-4 text-violet-500" />}
        title="Sugestões da IA"
        tone="violet"
      >
        <ListEditor
          label="Sugestões"
          value={m.suggestions}
          onChange={(arr: string[]) => onUpdate(m.id, { suggestions: arr })}
          highlight="violet"
        />
      </CardWrapper>
    </div>
    <div className="grid md:grid-cols-2 gap-6">
      <CardWrapper
        icon={<FiCheckSquare className="w-4 h-4 text-indigo-500" />}
        title="Tarefas / Próximos passos"
        tone="indigo"
      >
        <TaskEditor
          milestoneId={m.id}
          tasks={m.tasks}
          onChange={(tasks: any) => onUpdate(m.id, { tasks })}
        />
      </CardWrapper>
      <div className="space-y-6">
        <CardWrapper
          icon={<FiThumbsUp className="w-4 h-4 text-emerald-500" />}
          title="Pontos Positivos"
          tone="emerald"
        >
          <ListEditor
            label="Pontos positivos"
            value={m.positives}
            onChange={(arr: string[]) => onUpdate(m.id, { positives: arr })}
          />
        </CardWrapper>
        <CardWrapper
          icon={<FiAlertTriangle className="w-4 h-4 text-amber-500" />}
          title="Pontos de Melhoria"
          tone="amber"
        >
          <ListEditor
            label="Pontos de melhoria"
            value={m.improvements}
            onChange={(arr: string[]) => onUpdate(m.id, { improvements: arr })}
            highlight="amber"
          />
        </CardWrapper>
      </div>
    </div>
    <CardWrapper
      icon={<FiLink2 className="w-4 h-4 text-sky-500" />}
      title="Referências"
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
  </>
);

const ViewBody: React.FC<{ m: PdiMilestone }> = ({ m }) => (
  <div className="space-y-6">
    <div className="space-y-2">
      <h4 className="text-xs font-semibold tracking-wide text-gray-600 flex items-center gap-2 uppercase">
        <FiCalendar className="w-4 h-4 text-indigo-500" /> Notas / Registro
      </h4>
      <div className="p-3 prose prose-sm max-w-none text-[13px] prose-headings:mt-3 border rounded-lg border-surface-200 bg-surface-50/50">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {m.summary || "_Sem conteúdo_"}
        </ReactMarkdown>
      </div>
    </div>
    {m.suggestions && m.suggestions.length > 0 && (
      <CardWrapper
        icon={<FiCalendar className="w-4 h-4 text-violet-500" />}
        title="Sugestões da IA"
        tone="violet"
      >
        <ul className="list-disc ml-4 text-xs space-y-1">
          {m.suggestions.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </CardWrapper>
    )}
    <div className="grid md:grid-cols-2 gap-6">
      <CardWrapper
        icon={<FiCheckSquare className="w-4 h-4 text-indigo-500" />}
        title="Tarefas / Próximos passos"
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
      <div className="space-y-6">
        {m.positives && m.positives.length > 0 && (
          <CardWrapper
            icon={<FiThumbsUp className="w-4 h-4 text-emerald-500" />}
            title="Pontos Positivos"
            tone="emerald"
          >
            <ul className="list-disc ml-4 text-xs space-y-1">
              {m.positives.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </CardWrapper>
        )}
        {m.improvements && m.improvements.length > 0 && (
          <CardWrapper
            icon={<FiAlertTriangle className="w-4 h-4 text-amber-500" />}
            title="Pontos de Melhoria"
            tone="amber"
          >
            <ul className="list-disc ml-4 text-xs space-y-1">
              {m.improvements.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </CardWrapper>
        )}
      </div>
    </div>
    {m.resources && m.resources.length > 0 && (
      <CardWrapper
        icon={<FiLink2 className="w-4 h-4 text-sky-500" />}
        title="Referências"
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
  return (
    <div className="border rounded-lg border-surface-300">
      <div className="flex items-center justify-between border-b bg-surface-50 px-2 py-1 text-[10px] font-medium">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setMode("edit")}
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
            onClick={() => setMode("preview")}
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
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className="w-full text-xs p-2 bg-white rounded-b-lg focus:outline-none"
          placeholder="Escreva em markdown..."
        />
      ) : (
        <div className="p-3 prose prose-sm max-w-none text-[13px] prose-headings:mt-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || "_Sem conteúdo_"}
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
