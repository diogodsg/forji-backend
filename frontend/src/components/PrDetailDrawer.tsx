import type { PullRequest } from "../types/pr";
import React from "react";

interface Props {
  pr: PullRequest | null;
  onClose: () => void;
}

function markdownToBlocks(md: string): string[] {
  return md
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const PrDetailDrawer: React.FC<Props> = ({ pr, onClose }) => {
  if (!pr) return null;
  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-xl h-full bg-white/90 backdrop-blur-xl border-l border-surface-300 flex flex-col shadow-2xl">
        <div className="px-6 py-5 border-b border-surface-300 flex items-start justify-between bg-gradient-to-r from-indigo-50 to-sky-50">
          <div>
            <h2 className="text-base font-semibold tracking-wide text-indigo-600">
              Pull Request
            </h2>
            <p className="text-[11px] text-gray-500">#{pr.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto scrollbar-thin space-y-8">
          <header className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {pr.repo}
            </p>
            <h3 className="text-xl font-semibold leading-snug text-gray-900">
              {pr.title}
            </h3>
            <div className="flex gap-2 flex-wrap mt-2">
              <MetaBadge label="+" value={String(pr.lines_added)} />
              <MetaBadge label="-" value={String(pr.lines_deleted)} />
              <MetaBadge label="Files" value={String(pr.files_changed)} />
              <Status state={pr.state} />
            </div>
          </header>
          <section>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded" />
              Resumo (IA)
            </h4>
            <div className="space-y-3 text-sm leading-relaxed text-gray-700">
              {markdownToBlocks(pr.ai_review_summary).map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
          </section>
          <section>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded" />
              Sugestões / Checklist
            </h4>
            <ul className="space-y-2">
              {pr.review_comments_highlight.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] group"
                >
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-surface-300 bg-white"
                  />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    {c}
                  </span>
                </li>
              ))}
            </ul>
          </section>
          <div className="flex gap-3 pt-2">
            <button className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-sm px-4 py-2 rounded-md font-medium shadow-soft text-white transition-colors">
              <span>Adicionar ao PDI</span>
            </button>
            <button className="inline-flex items-center gap-1.5 bg-surface-200 hover:bg-surface-300 text-sm px-4 py-2 rounded-md font-medium transition-colors">
              <span>Criar To-do</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetaBadge = ({ label, value }: { label: string; value: string }) => (
  <span className="text-[10px] uppercase tracking-wide bg-surface-200 border border-surface-300 rounded px-2 py-1 text-gray-600 flex items-center gap-1">
    <strong className="text-indigo-600 font-semibold">{label}</strong> {value}
  </span>
);

const Status = ({ state }: { state: string }) => {
  const map: Record<string, string> = {
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed: 'bg-rose-50 text-rose-700 border-rose-200',
    merged: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  };
  return <span className={`text-[10px] font-medium px-2 py-1 rounded-full border ${map[state]}`}>{state}</span>;
};
