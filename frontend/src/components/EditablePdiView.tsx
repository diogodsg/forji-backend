import React, { useState } from "react";
import type {
  PdiMilestone,
  PdiPlan,
  PdiTask,
  PdiKeyResult,
} from "../types/pdi";
import { PdiView } from "./PdiView";
import { useLocalPdi } from "../hooks/useLocalPdi";
import { api } from "../lib/apiClient";
import { CompetenciesSection } from "./CompetenciesSection";
import { MilestonesSection } from "./MilestonesSection";
import { KeyResultsSection } from "./KeyResultsSection";
import { ResultsSection } from "./ResultsSection";

interface Props {
  initialPlan: PdiPlan;
  // If provided, saves changes to this user's PDI via PUT /pdi/:userId (manager editing)
  saveForUserId?: number;
  // Optional callback when a save completes successfully (e.g., to refresh parent)
  onSaved?: (plan: PdiPlan) => void;
}

export const EditablePdiView: React.FC<Props> = ({
  initialPlan,
  saveForUserId,
  onSaved,
}) => {
  // Desabilitar storage local quando integrado ao backend
  const { plan, setPlan, dirty, reset } = useLocalPdi(initialPlan, {
    enableStorage: false,
  });
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

  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        competencies: working.competencies,
        milestones: working.milestones,
        krs: working.krs || [],
        records: working.records,
      };
      let saved;
      if (typeof saveForUserId === "number") {
        // Manager editing a report's PDI: full upsert by userId
        saved = await api<any>(`/pdi/${saveForUserId}`, {
          method: "PUT",
          auth: true,
          body: JSON.stringify(payload),
        });
      } else {
        // Self editing: try patch, fallback to create
        try {
          saved = await api<any>("/pdi/me", {
            method: "PATCH",
            auth: true,
            body: JSON.stringify(payload),
          });
        } catch (e: any) {
          // Se plano não existir ainda, fazer POST /pdi
          if (e.message.includes("404")) {
            saved = await api<any>("/pdi", {
              method: "POST",
              auth: true,
              body: JSON.stringify(payload),
            });
          } else {
            throw e;
          }
        }
      }
      setPlan({
        userId: String(saved.userId),
        competencies: saved.competencies,
        milestones: saved.milestones,
        krs: saved.krs || [],
        records: saved.records,
        createdAt: saved.createdAt || working.createdAt,
        updatedAt: saved.updatedAt || new Date().toISOString(),
      });
      onSaved?.({
        userId: String(saved.userId),
        competencies: saved.competencies,
        milestones: saved.milestones,
        krs: saved.krs || [],
        records: saved.records,
        createdAt: saved.createdAt || working.createdAt,
        updatedAt: saved.updatedAt || new Date().toISOString(),
      });
      setMode("view");
    } finally {
      setSaving(false);
    }
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
      <CompetenciesSection
        competencies={working.competencies}
        onAdd={addCompetency}
        onRemove={removeCompetency}
      />

      <MilestonesSection
        milestones={working.milestones}
        onAdd={addMilestone}
        onRemove={removeMilestone}
        onUpdate={updateMilestone}
      />

      <KeyResultsSection
        krs={working.krs || []}
        onAdd={addKr}
        onRemove={removeKr}
        onUpdate={updateKr}
      />

      <ResultsSection records={working.records} onUpdate={updateRecord} />
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
              disabled={saving}
              className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs disabled:opacity-50 hover:bg-emerald-500"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        )}
      </div>
      {mode === "view" ? <PdiView plan={plan} /> : sections}
    </div>
  );
};

export const AddCompetencyForm: React.FC<{ onAdd: (c: string) => void }> = ({
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
