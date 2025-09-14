import type { PullRequest } from "../types/pr";
import React from "react";
import { SidePanel } from "@/shared";
import { PrStatusBadge } from "./PrStatusBadge";

/**
 * Props for `PrDetailDrawer` side panel component.
 */
interface Props {
  pr: PullRequest | null;
  onClose: () => void;
}

/**
 * Very small markdown-ish splitter turning blank line separated paragraphs into blocks.
 */
function markdownToBlocks(md: string): string[] {
  return md
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Slide-over panel showing detailed PR info including AI summary and checklist.
 */
export const PrDetailDrawer: React.FC<Props> = ({ pr, onClose }) => {
  if (!pr) return null;
  return (
    <SidePanel
      open={!!pr}
      onClose={onClose}
      title="Pull Request"
      subtitle={`#${pr.id}`}
    >
      <div className="space-y-8">
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
            <PrStatusBadge state={pr.state} withDot={false} />
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
              <li key={i} className="flex items-start gap-2 text-[13px] group">
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
    </SidePanel>
  );
};

const MetaBadge = ({ label, value }: { label: string; value: string }) => (
  <span className="text-[10px] uppercase tracking-wide bg-surface-200 border border-surface-300 rounded px-2 py-1 text-gray-600 flex items-center gap-1">
    <strong className="text-indigo-600 font-semibold">{label}</strong> {value}
  </span>
);

// Status removido em favor de util prStatusBadgeClasses
