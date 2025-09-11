import { weeklyMetrics } from "../mocks/prs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function ProgressCharts() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ChartCard title="PRs por semana">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={weeklyMetrics}
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="weekStart" hide />
            <YAxis width={30} stroke="#555" />
            <Tooltip
              contentStyle={{ background: "#111", border: "1px solid #333" }}
            />
            <Line
              type="monotone"
              dataKey="prs"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Tempo médio até merge (h)">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={weeklyMetrics}
            margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="weekStart" hide />
            <YAxis width={30} stroke="#555" />
            <Tooltip
              contentStyle={{ background: "#111", border: "1px solid #333" }}
            />
            <Line
              type="monotone"
              dataKey="avgTimeToMergeHours"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

const ChartCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-900 border border-gray-800 rounded p-4">
    <h3 className="font-medium mb-2 text-sm">{title}</h3>
    {children}
  </div>
);
