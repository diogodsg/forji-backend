import { SummaryCards } from "../components/SummaryCards";
import { ProgressCharts } from "../components/ProgressCharts";

export function MyProgressPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Meu Progresso</h1>
      <SummaryCards />
      <ProgressCharts />
    </div>
  );
}
