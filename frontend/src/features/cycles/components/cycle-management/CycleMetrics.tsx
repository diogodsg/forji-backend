import { Calendar, Zap, Target } from "lucide-react";

interface CycleMetricsProps {
  cycle: {
    name?: string;
    description?: string;
    progressPercentage?: number;
    daysRemaining?: number;
    xpEarned?: number;
    goals?: any[];
  } | null;
}

export function CycleMetrics({ cycle }: CycleMetricsProps) {
  const daysRemaining = cycle?.daysRemaining || 30;
  const xpEarned = cycle?.xpEarned || 850;
  const goalsCount = cycle?.goals?.length || 3;
  const completedGoals =
    cycle?.goals?.filter((goal) => goal.completed)?.length || 1;

  const metrics = [
    {
      label: "Dias Restantes",
      value: daysRemaining,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      label: "XP Ganho",
      value: xpEarned.toLocaleString(),
      icon: Zap,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      label: "Metas Ativas",
      value: `${completedGoals}/${goalsCount}`,
      icon: Target,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className={`${metric.bgColor} ${metric.borderColor} border rounded-xl p-4 text-center transition-all duration-200 hover:shadow-sm`}
          >
            <div className="flex items-center justify-center mb-3">
              <Icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div className="text-xl font-bold text-gray-800 mb-1">
              {metric.value}
            </div>
            <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
              {metric.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
