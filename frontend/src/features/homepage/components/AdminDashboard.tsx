import { CompanyHealthOverview } from "./CompanyHealthOverview";
import { TeamsHealthGrid } from "./TeamsHealthGrid";
import { ExecutiveAlertsCard } from "./ExecutiveAlertsCard";
import { CompanyAnalytics } from "./CompanyAnalytics";
import { StrategicInsights } from "./StrategicInsights";

// Mock data para desenvolvimento - em produção virá da API
const mockCompanyHealthData = {
  companyHealth: {
    score: 87,
    totalTeams: 12,
    totalEmployees: 94,
  },
  growthMetrics: {
    quarterlyGrowth: 23,
    previousQuarter: 18,
    xpGrowth: 15,
  },
  roiIndicators: {
    employeeRetention: 94,
    promotionRate: 78,
    savingsFromPromotions: 485000,
  },
};

const mockTeamsData = [
  {
    id: "1",
    name: "Frontend Core",
    managerName: "Ana Silva",
    health: 92,
    memberCount: 8,
    weeklyXp: 12500,
    weeklyXpChange: 15,
    pdiCompletionRate: 87,
    lastActivity: "2h",
    achievements: 23,
    isStarTeam: true,
  },
  {
    id: "2",
    name: "Backend Services",
    managerName: "Carlos Santos",
    health: 88,
    memberCount: 10,
    weeklyXp: 14200,
    weeklyXpChange: 8,
    pdiCompletionRate: 91,
    lastActivity: "1h",
    achievements: 19,
  },
  {
    id: "3",
    name: "Mobile Team",
    managerName: "Maria Costa",
    health: 76,
    memberCount: 6,
    weeklyXp: 8900,
    weeklyXpChange: -5,
    pdiCompletionRate: 72,
    lastActivity: "4h",
    achievements: 15,
    needsAttention: true,
  },
  {
    id: "4",
    name: "Data Engineering",
    managerName: "João Oliveira",
    health: 95,
    memberCount: 7,
    weeklyXp: 15800,
    weeklyXpChange: 22,
    pdiCompletionRate: 94,
    lastActivity: "30min",
    achievements: 28,
    isStarTeam: true,
  },
  {
    id: "5",
    name: "DevOps & Infrastructure",
    managerName: "Pedro Ferreira",
    health: 82,
    memberCount: 5,
    weeklyXp: 11200,
    weeklyXpChange: 12,
    pdiCompletionRate: 85,
    lastActivity: "1h",
    achievements: 17,
  },
  {
    id: "6",
    name: "QA & Testing",
    managerName: "Laura Mendes",
    health: 78,
    memberCount: 4,
    weeklyXp: 7300,
    weeklyXpChange: 3,
    pdiCompletionRate: 78,
    lastActivity: "2h",
    achievements: 12,
  },
];

const mockAlertsData = [
  {
    id: "1",
    type: "critical" as const,
    category: "retention" as const,
    title: "Taxa de rotatividade aumentou 15% no Mobile Team",
    description:
      "Perda de 2 desenvolvedores seniores nas últimas 3 semanas. Risco de impacto nos projetos críticos Q4.",
    impact: "high" as const,
    teamAffected: "Mobile Team",
    managerAffected: "Maria Costa",
    actionRequired: "Reunião de retenção urgente + revisão de compensação",
    urgency: "immediate" as const,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    type: "warning" as const,
    category: "performance" as const,
    title: "QA Team com baixa taxa de conclusão de PDIs",
    description:
      "78% de conclusão vs meta de 85%. Pode impactar promotions e desenvolvimento da equipe.",
    impact: "medium" as const,
    teamAffected: "QA & Testing",
    managerAffected: "Laura Mendes",
    actionRequired: "Sessão de mentoria e revisão de objetivos individuais",
    urgency: "this_week" as const,
    createdAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    type: "opportunity" as const,
    category: "growth" as const,
    title: "Data Engineering team pronto para expansão",
    description:
      "Performance excepcional (95% health) e alta demanda de outros times por suas skills.",
    impact: "high" as const,
    teamAffected: "Data Engineering",
    managerAffected: "João Oliveira",
    actionRequired: "Planejar hiring de 2-3 desenvolvedores seniores",
    urgency: "this_month" as const,
    createdAt: "2024-01-13T09:15:00Z",
  },
];

const mockAnalyticsData = {
  engagementMetrics: {
    weeklyActiveUsers: {
      label: "Usuários Ativos Semanais",
      value: 89,
      change: 12,
      format: "percentage" as const,
      trend: "up" as const,
      target: 85,
    },
    averageSessionTime: {
      label: "Tempo Médio de Sessão",
      value: 45,
      change: 8,
      format: "time" as const,
      trend: "up" as const,
      target: 40,
    },
    xpPerEmployee: {
      label: "XP por Colaborador",
      value: 1250,
      change: 15,
      format: "number" as const,
      trend: "up" as const,
      target: 1200,
    },
    completionRate: {
      label: "Taxa de Conclusão",
      value: 84,
      change: 5,
      format: "percentage" as const,
      trend: "up" as const,
      target: 80,
    },
  },
  retentionMetrics: {
    employeeRetention: {
      label: "Retenção de Funcionários",
      value: 94,
      change: 3,
      format: "percentage" as const,
      trend: "up" as const,
      target: 90,
    },
    managerRetention: {
      label: "Retenção de Gestores",
      value: 98,
      change: 2,
      format: "percentage" as const,
      trend: "up" as const,
      target: 95,
    },
    satisfactionScore: {
      label: "Score de Satisfação",
      value: 4.6,
      change: 7,
      format: "number" as const,
      trend: "up" as const,
      target: 4.5,
    },
    promotionRate: {
      label: "Taxa de Promoção Interna",
      value: 78,
      change: 12,
      format: "percentage" as const,
      trend: "up" as const,
      target: 70,
    },
  },
  roiMetrics: {
    savingsFromRetention: {
      label: "Economia com Retenção",
      value: 485000,
      change: 18,
      format: "currency" as const,
      trend: "up" as const,
      target: 400000,
    },
    recruitmentCostReduction: {
      label: "Redução Custo Recrutamento",
      value: 240000,
      change: 25,
      format: "currency" as const,
      trend: "up" as const,
      target: 200000,
    },
    productivityGain: {
      label: "Ganho de Produtividade",
      value: 23,
      change: 8,
      format: "percentage" as const,
      trend: "up" as const,
      target: 20,
    },
    timeToPromotionReduction: {
      label: "Redução Tempo Promoção",
      value: 4.2,
      change: 15,
      format: "time" as const,
      trend: "down" as const,
      target: 5.0,
    },
  },
  trendData: [
    { period: "Q1", value: 78, target: 80 },
    { period: "Q2", value: 82, target: 82 },
    { period: "Q3", value: 85, target: 84 },
    { period: "Q4", value: 87, target: 85 },
  ],
};

const mockStrategicInsights = [
  {
    id: "1",
    type: "opportunity" as const,
    priority: "high" as const,
    category: "growth" as const,
    title: "Expand Data Engineering team para suportar IA initiatives",
    description:
      "Com 95% de health e alta demanda, este time está pronto para crescer e liderar projetos de IA.",
    dataSource: "Performance metrics + Demand analysis",
    potentialImpact: "30% de aumento na capacidade de projetos de IA",
    suggestedAction: "Abrir 3 posições seniores até março",
    timeline: "short_term" as const,
    confidence: 92,
    relatedMetrics: {
      current: 7,
      potential: 10,
      unit: " pessoas",
    },
  },
  {
    id: "2",
    type: "risk" as const,
    priority: "high" as const,
    category: "people" as const,
    title: "Mobile team em risco de perder mais talentos",
    description:
      "Com 76% de health e 2 saídas recentes, há indicadores de problemas estruturais.",
    dataSource: "Exit interviews + Health metrics",
    potentialImpact: "Risco de atraso em 2 projetos críticos",
    suggestedAction:
      "Intervenção imediata com revisão de processos e compensação",
    timeline: "immediate" as const,
    confidence: 87,
    relatedMetrics: {
      current: 76,
      potential: 85,
      unit: "% health",
    },
  },
];

/**
 * Dashboard administrativo para CEOs e donos da empresa
 * Visão executiva focada em métricas críticas:
 * - Saúde geral da empresa
 * - Overview de todos os times
 * - Alertas executivos prioritários
 * - Business intelligence e analytics
 * - Insights estratégicos para tomada de decisão
 */
export function AdminDashboard() {
  const handleTeamClick = (teamId: string) => {
    console.log("Navigating to team detail:", teamId);
    // Implementar navegação para detalhe do time
  };

  const handleAlertClick = (alertId: string) => {
    console.log("Opening alert detail:", alertId);
    // Implementar modal ou navegação para detalhe do alerta
  };

  const handleInsightClick = (insightId: string) => {
    console.log("Opening insight detail:", insightId);
    // Implementar modal ou navegação para detalhe do insight
  };

  const handleViewAllAlerts = () => {
    console.log("Navigating to all alerts page");
    // Implementar navegação para página completa de alertas
  };

  const handleViewAllInsights = () => {
    console.log("Navigating to all insights page");
    // Implementar navegação para página completa de insights
  };

  return (
    <div className="space-y-10">
      {/* Company Health Overview - Hero Section */}
      <CompanyHealthOverview {...mockCompanyHealthData} />

      {/* Teams Health Grid - Full Width */}
      <TeamsHealthGrid teams={mockTeamsData} onTeamClick={handleTeamClick} />

      {/* Two Column Layout - Alerts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column - Executive Alerts */}
        <ExecutiveAlertsCard
          alerts={mockAlertsData}
          onAlertClick={handleAlertClick}
          onViewAll={handleViewAllAlerts}
        />

        {/* Right Column - Strategic Insights */}
        <StrategicInsights
          insights={mockStrategicInsights}
          onInsightClick={handleInsightClick}
          onViewAll={handleViewAllInsights}
        />
      </div>

      {/* Bottom Row - Analytics */}
      <div className="grid grid-cols-1 gap-10">
        {/* Company Analytics */}
        <CompanyAnalytics {...mockAnalyticsData} />
      </div>
    </div>
  );
}
