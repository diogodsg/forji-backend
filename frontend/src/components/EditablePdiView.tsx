import React, { useState } from "react";
import type {
  PdiMilestone,
  PdiPlan,
  PdiTask,
  PdiKeyResult,
} from "../types/pdi";
import { PdiView } from "./PdiView";
import { useLocalPdi } from "../hooks/useLocalPdi";

interface Props {
  initialPlan: PdiPlan;
}

export const EditablePdiView: React.FC<Props> = ({ initialPlan }) => {
  const { plan, setPlan, dirty, reset } = useLocalPdi(initialPlan);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [working, setWorking] = useState<PdiPlan>(plan);

  const startEdit = () => {
    setWorking(plan);
    setMode("edit");
  };

  const cancel = () => {
    setWorking(plan);
    setMode("view");
  };

  const save = () => {
    setPlan({ ...working, updatedAt: new Date().toISOString() });
    setMode("view");
  };

  const updateWorking = (patch: Partial<PdiPlan>) => {
    setWorking((w) => ({ ...w, ...patch }));
  };

  const addCompetency = (c: string) => {
    if (!c || working.competencies.includes(c)) return;
    updateWorking({ competencies: [...working.competencies, c] });
  };

  const removeCompetency = (c: string) => {
    updateWorking({
      competencies: working.competencies.filter((x) => x !== c),
    });
  };

  const updateMilestone = (id: string, patch: Partial<PdiMilestone>) => {
    updateWorking({
      milestones: working.milestones.map((m) =>
        m.id === id ? { ...m, ...patch } : m
      ),
    });
  };

  const removeMilestone = (id: string) => {
    updateWorking({
      milestones: working.milestones.filter((m) => m.id !== id),
    });
  };

  const addMilestone = () => {
    const id = crypto.randomUUID();
    const today = new Date().toISOString().slice(0, 10);
    const m: PdiMilestone = {
      id,
      date: today,
      title: `Encontro (${today})`,
      summary: "",
    };
    updateWorking({ milestones: [...working.milestones, m] });
  };

  const updateRecord = (area: string, patch: any) => {
    updateWorking({
      records: working.records.map((r) =>
        r.area === area ? { ...r, ...patch } : r
      ),
    });
  };

  // KRs
  const addKr = () => {
    const kr: PdiKeyResult = {
      id: crypto.randomUUID(),
      description: "Nova KR",
      successCriteria: "Definir critério de sucesso",
      currentStatus: "",
      improvementActions: [],
    };
    updateWorking({ krs: [...(working.krs || []), kr] });
  };
  const updateKr = (id: string, patch: Partial<PdiKeyResult>) => {
    updateWorking({
      krs: (working.krs || []).map((k) =>
        k.id === id ? { ...k, ...patch } : k
      ),
    });
  };
  const removeKr = (id: string) => {
    updateWorking({ krs: (working.krs || []).filter((k) => k.id !== id) });
  };

  const sections = (
    <div className="space-y-10">
      {/* Competencies */}
      <section className="rounded-xl border border-surface-300 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded" />
            Competências
          </h2>
          <AddCompetencyForm onAdd={addCompetency} />
        </div>
        <div className="flex flex-wrap gap-2">
          {working.competencies.map((c) => (
            <span
              key={c}
              className="group inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-indigo-50 border border-indigo-200 text-indigo-700"
            >
              {c}
              <button
                onClick={() => removeCompetency(c)}
                className="opacity-60 group-hover:opacity-100 text-[10px]"
                aria-label="remover"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Milestones */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded" />
            Acompanhamento
          </h2>
          <button
            onClick={addMilestone}
            className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Adicionar encontro
          </button>
        </div>
        <div className="space-y-5">
          {working.milestones.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-surface-300 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:justify-between">
                <div className="flex-1 space-y-2">
                  <input
                    value={m.title}
                    onChange={(e) =>
                      updateMilestone(m.id, { title: e.target.value })
                    }
                    className="w-full text-sm font-medium text-indigo-700 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="date"
                    value={m.date}
                    onChange={(e) =>
                      updateMilestone(m.id, { date: e.target.value })
                    }
                    className="text-[11px] uppercase tracking-wide text-gray-600 bg-white border border-surface-300 rounded px-2 py-1"
                  />
                </div>
                <div className="flex gap-2 self-start">
                  <button
                    onClick={() => removeMilestone(m.id)}
                    className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Remover
                  </button>
                </div>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600">
                    Resumo / Notas
                  </label>
                  <textarea
                    value={m.summary}
                    onChange={(e) =>
                      updateMilestone(m.id, { summary: e.target.value })
                    }
                    rows={4}
                    className="w-full text-xs rounded border border-surface-300 p-2 focus:border-indigo-400"
                  />
                  <ListEditor
                    label="Sugestões (IA)"
                    value={m.suggestions}
                    onChange={(arr) =>
                      updateMilestone(m.id, { suggestions: arr })
                    }
                    highlight="violet"
                  />
                  <TaskEditor
                    milestoneId={m.id}
                    tasks={m.tasks}
                    onChange={(tasks) => updateMilestone(m.id, { tasks })}
                  />
                </div>
                <div className="space-y-4">
                  <ListEditor
                    label="Pontos positivos"
                    value={m.positives}
                    onChange={(arr) =>
                      updateMilestone(m.id, { positives: arr })
                    }
                  />
                  <ListEditor
                    label="Pontos de melhoria"
                    value={m.improvements}
                    onChange={(arr) =>
                      updateMilestone(m.id, { improvements: arr })
                    }
                    highlight="amber"
                  />
                  <ListEditor
                    label="Referências"
                    value={m.resources}
                    onChange={(arr) =>
                      updateMilestone(m.id, { resources: arr })
                    }
                    highlight="sky"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Results */}
      <section className="rounded-xl border border-surface-300 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-600 rounded" />
            Key Results
          </h2>
          <button
            onClick={addKr}
            className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
          >
            Adicionar KR
          </button>
        </div>
        {(!working.krs || working.krs.length === 0) && (
          <p className="text-xs text-gray-500">Nenhuma KR definida.</p>
        )}
        <div className="space-y-4">
          {(working.krs || []).map((kr) => (
            <div
              key={kr.id}
              className="border border-surface-200 rounded-lg p-4 bg-surface-50/50 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <input
                  value={kr.description}
                  onChange={(e) =>
                    updateKr(kr.id, { description: e.target.value })
                  }
                  className="flex-1 text-sm font-medium text-indigo-700 bg-transparent border-b border-indigo-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => removeKr(kr.id)}
                  className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Remover
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Noção de sucesso
                  </label>
                  <textarea
                    rows={3}
                    value={kr.successCriteria}
                    onChange={(e) =>
                      updateKr(kr.id, { successCriteria: e.target.value })
                    }
                    className="w-full text-xs rounded border border-surface-300 p-2 focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                    Status atual
                  </label>
                  <textarea
                    rows={3}
                    value={kr.currentStatus || ""}
                    onChange={(e) =>
                      updateKr(kr.id, { currentStatus: e.target.value })
                    }
                    className="w-full text-xs rounded border border-surface-300 p-2 focus:border-indigo-400"
                  />
                </div>
                <div className="space-y-2">
                  <ListEditor
                    label="Ações melhoria"
                    value={kr.improvementActions}
                    onChange={(arr) =>
                      updateKr(kr.id, { improvementActions: arr })
                    }
                    highlight="violet"
                    placeholder="Uma ação por linha"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="rounded-xl border border-surface-300 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-1.5 h-5 bg-indigo-600 rounded" />
          Resultado
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-xs uppercase tracking-wide">
              <tr className="border-b border-surface-300">
                <th className="text-left py-2 pr-4 font-medium">
                  Área Técnica
                </th>
                <th className="text-left py-2 pr-4 font-medium">Nível antes</th>
                <th className="text-left py-2 pr-4 font-medium">
                  Nível depois
                </th>
                <th className="text-left py-2 font-medium">Evidências</th>
              </tr>
            </thead>
            <tbody>
              {working.records.map((r) => (
                <tr
                  key={r.area}
                  className="border-b last:border-0 border-surface-300/70 align-top"
                >
                  <td className="py-2 pr-4 text-gray-700 text-xs md:text-sm">
                    {r.area}
                  </td>
                  <td className="py-2 pr-4 text-gray-700 text-xs">
                    {r.levelBefore ?? "-"}
                  </td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={r.levelAfter ?? ""}
                      onChange={(e) =>
                        updateRecord(r.area, {
                          levelAfter: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="w-16 text-xs border rounded px-1 py-1 border-surface-300"
                    />
                  </td>
                  <td className="py-2">
                    <textarea
                      value={r.evidence ?? ""}
                      onChange={(e) =>
                        updateRecord(r.area, { evidence: e.target.value })
                      }
                      rows={2}
                      className="w-full text-xs border rounded p-1 border-surface-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            Atualizado: {new Date(plan.updatedAt).toLocaleDateString()}
          </span>
          {dirty && (
            <span className="text-amber-600">Alterações salvas localmente</span>
          )}
        </div>
        {mode === "view" ? (
          <div className="flex gap-2">
            <button
              onClick={startEdit}
              className="px-3 py-1.5 rounded bg-indigo-600 text-white text-xs hover:bg-indigo-500"
            >
              Editar PDI
            </button>
            <button
              onClick={reset}
              className="px-3 py-1.5 rounded border text-xs border-surface-300 hover:bg-surface-100"
            >
              Reset
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancel}
              className="px-3 py-1.5 rounded border text-xs border-surface-300 hover:bg-surface-100"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-500"
            >
              Salvar
            </button>
          </div>
        )}
      </div>
      {mode === "view" ? <PdiView plan={plan} /> : sections}
    </div>
  );
};

const AddCompetencyForm: React.FC<{ onAdd: (c: string) => void }> = ({
  onAdd,
}) => {
  const [value, setValue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onAdd(value.trim());
        setValue("");
      }}
      className="flex items-center gap-2"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Nova competência"
        className="text-xs border rounded px-2 py-1 border-surface-300"
      />
      <button
        type="submit"
        className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500"
      >
        Add
      </button>
    </form>
  );
};

const ListEditor: React.FC<{
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
        onChange={(e) =>
          onChange(
            e.target.value
              .split(/\n+/)
              .map((x) => x.trim())
              .filter(Boolean)
          )
        }
        rows={3}
        placeholder={placeholder || "Linhas"}
        className="w-full text-[11px] resize-y rounded border border-surface-300 p-1 focus:border-indigo-400"
      />
    </div>
  );
};

const TaskEditor: React.FC<{
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
  const toggle = (id: string) => {
    onChange(list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };
  const remove = (id: string) => {
    onChange(list.filter((t) => t.id !== id));
  };
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
