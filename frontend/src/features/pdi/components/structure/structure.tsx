// MOVED from src/components/pdi/structure.tsx
import React from "react";

export const SaveStatusBar: React.FC<{
  updatedAt: string;
  saving: boolean;
  pending: boolean;
  activeEditing: boolean;
}> = ({ updatedAt, saving, pending, activeEditing }) => (
  <div className="flex items-center justify-between text-xs text-gray-500">
    <span>Atualizado: {new Date(updatedAt).toLocaleDateString()}</span>
    <div className="flex items-center gap-3">
      {saving && <span className="text-indigo-600">Salvando...</span>}
      {!saving && pending && (
        <span className="text-amber-600">Alterações pendentes...</span>
      )}
      {!saving && !pending && activeEditing && (
        <span className="text-emerald-600">Tudo salvo</span>
      )}
    </div>
  </div>
);

export const SectionHeader: React.FC<{
  title: string;
  editing: boolean;
  onToggle: () => void;
}> = ({ title, editing, onToggle }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-semibold text-indigo-700">{title}</h2>
    <button
      onClick={onToggle}
      className="p-1 rounded border border-surface-200 text-gray-500 hover:text-indigo-600 hover:border-indigo-300 bg-white text-[10px]"
      title={editing ? "Concluir" : "Editar"}
    >
      {editing ? (
        <span className="inline-block">✔</span>
      ) : (
        <span className="inline-block">✎</span>
      )}
    </button>
  </div>
);
