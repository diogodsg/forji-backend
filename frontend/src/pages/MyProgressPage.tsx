// Updated to use feature PR components via barrel
import { SummaryCards, ProgressCharts } from "../features/prs";

export function MyProgressPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Meu Progresso</h1>
      <SummaryCards />
      <ProgressCharts />
    </div>
  );
}
