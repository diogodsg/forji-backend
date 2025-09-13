import type { PullRequest, WeeklyMetricPoint } from "../features/prs/types/pr";

export const mockPrs: PullRequest[] = [
  {
    id: "2800105180",
    author: "malustedile",
    repo: "management-service",
    title: "Fix/sign up flow",
    created_at: "2025-09-04T16:32:40.000Z",
    merged_at: "2025-09-04T16:44:28.000Z",
    state: "closed",
    lines_added: 106,
    lines_deleted: 7,
    files_changed: 113,
    ai_review_summary: `Resumo Geral\n\nPontos fortes:\nMelhoria de internacionalização...\nPontos fracos/risco:\nErros de digitação...`,
    review_comments_highlight: [
      "Corrigir allwaysPass para alwaysPass",
      "Implementar fallback eventStatus.unknown",
      "Adicionar testes para i18n",
    ],
  },
];

// Generate 12 weeks metrics mock
function weeksBack(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n * 7);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

export const weeklyMetrics: WeeklyMetricPoint[] = Array.from({
  length: 12,
}).map((_, i) => {
  const weekIndexFromPast = 11 - i; // oldest first
  return {
    weekStart: weeksBack(weekIndexFromPast),
    prs: Math.floor(Math.random() * 6) + 1,
    avgTimeToMergeHours: Math.round(Math.random() * 48 + 2),
    reworkRatePct: Math.round(Math.random() * 40),
  };
});
