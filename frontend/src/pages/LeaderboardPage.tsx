import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiAward,
  FiUsers,
  FiStar,
  FiInfo,
  FiZap,
  FiHeart,
} from "react-icons/fi";
import { Link } from "react-router-dom";

// Mock data para demonstração - será substituído por dados reais do backend
const mockOrganizationMetrics = {
  totalTeams: 8,
  activeCollaborators: 42,
  weeklyXPGrowth: "+18%",
  averageTeamScore: 8.3,
  topPerformingTeam: "Engineering Alpha",
  cultureHealthScore: 9.1,
};

const mockTeamData = [
  {
    id: 1,
    name: "Engineering Alpha",
    manager: "Carlos Santos",
    position: 1,
    totalXP: 3240,
    weeklyXP: 485,
    averageXP: 463,
    memberCount: 7,
    trend: "up" as const,
    streak: 4,
    badges: ["Mentorship Masters", "Innovation Hub", "Knowledge Sharers"],
    topContributors: [
      { name: "Maria Silva", xp: 145, area: "Cross-team Mentoring" },
      { name: "João Santos", xp: 120, area: "Technical Leadership" },
      { name: "Ana Costa", xp: 95, area: "Team Development" },
    ],
    collaborationScore: 9.2,
    mentoringIndex: 9.4,
    cultureImpact:
      "Implementou programa de mentoria que aumentou satisfação da equipe em 40%",
  },
  {
    id: 2,
    name: "Product Discovery",
    manager: "Fernanda Lima",
    position: 2,
    totalXP: 2980,
    weeklyXP: 420,
    averageXP: 497,
    memberCount: 6,
    trend: "up" as const,
    streak: 3,
    badges: ["Culture Builders", "Innovation Catalysts", "Growth Mindset"],
    topContributors: [
      { name: "Pedro Oliveira", xp: 130, area: "Process Innovation" },
      { name: "Lucas Tech", xp: 110, area: "Team Facilitation" },
      { name: "Sofia Dev", xp: 90, area: "Knowledge Transfer" },
    ],
    collaborationScore: 8.8,
    mentoringIndex: 9.0,
    cultureImpact: "Criou rituais de celebração que reduziram turnover em 30%",
  },
  {
    id: 3,
    name: "Backend Infrastructure",
    manager: "Roberto Kim",
    position: 3,
    totalXP: 2750,
    weeklyXP: 380,
    averageXP: 393,
    memberCount: 7,
    trend: "stable" as const,
    streak: 2,
    badges: [
      "Technical Excellence",
      "Knowledge Amplifiers",
      "Reliability Champions",
    ],
    topContributors: [
      { name: "Diego Code", xp: 115, area: "Technical Sharing" },
      { name: "Carla Arch", xp: 100, area: "Architecture Mentoring" },
      { name: "Bruno Dev", xp: 85, area: "Code Review Excellence" },
    ],
    collaborationScore: 8.5,
    mentoringIndex: 8.7,
    cultureImpact:
      "Estabeleceu padrões de code review que melhoraram qualidade em 45%",
  },
  {
    id: 4,
    name: "Frontend Experience",
    manager: "Amanda React",
    position: 4,
    totalXP: 2420,
    weeklyXP: 340,
    averageXP: 403,
    memberCount: 6,
    trend: "up" as const,
    streak: 1,
    badges: ["UI/UX Champions", "User Advocacy"],
    topContributors: [
      { name: "Felipe JS", xp: 105, area: "Component Library" },
      { name: "Marina CSS", xp: 90, area: "Design Systems" },
      { name: "Gabriel React", xp: 80, area: "Developer Experience" },
    ],
    collaborationScore: 8.2,
    mentoringIndex: 8.1,
    cultureImpact:
      "Desenvolveu biblioteca de componentes adotada por todas as equipes",
  },
  {
    id: 5,
    name: "DevOps & Cloud",
    manager: "Ricardo Infrastructure",
    position: 5,
    totalXP: 2180,
    weeklyXP: 295,
    averageXP: 363,
    memberCount: 6,
    trend: "up" as const,
    streak: 1,
    badges: ["Infrastructure Masters", "Automation Champions"],
    topContributors: [
      { name: "Thiago K8s", xp: 95, area: "Platform Engineering" },
      { name: "Juliana AWS", xp: 85, area: "Cloud Architecture" },
      { name: "Marcos Docker", xp: 75, area: "DevOps Culture" },
    ],
    collaborationScore: 7.9,
    mentoringIndex: 8.3,
    cultureImpact:
      "Automatizou deploys reduzindo stress da equipe e aumentando confiança",
  },
];

export function LeaderboardPage() {
  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <FiTrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <FiTrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <FiMinus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <FiAward className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <FiAward className="w-6 h-6 text-gray-400" />;
      case 3:
        return <FiAward className="w-6 h-6 text-amber-600" />;
      default:
        return <FiStar className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankColor = (position: number) => {
    if (position === 1) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (position === 2) return "text-gray-600 bg-gray-50 border-gray-200";
    if (position === 3) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {/* Hero Section - Team-First Philosophy - Compacto */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg">
              <FiUsers className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
                Team Rankings
              </h1>
              <p className="text-brand-600 font-medium text-sm">
                Sistema Team-First
              </p>
            </div>
          </div>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Celebramos equipes que crescem juntas e constroem cultura
            colaborativa baseada em impacto coletivo.
          </p>
        </div>

        {/* Organization Metrics Bar - Compacto */}
        <div className="bg-white rounded-xl shadow-sm border border-surface-300 p-4 mb-6">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-brand-600">
                {mockOrganizationMetrics.totalTeams}
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                Equipes
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-600">
                {mockOrganizationMetrics.activeCollaborators}
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                Pessoas
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-indigo-600">
                {mockOrganizationMetrics.weeklyXPGrowth}
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                Crescimento
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">
                {mockOrganizationMetrics.averageTeamScore}/10
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                Score Médio
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-amber-600">
                {mockOrganizationMetrics.cultureHealthScore}/10
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                Cultura
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-gray-800">
                {mockOrganizationMetrics.topPerformingTeam}
              </div>
              <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                Destaque
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content - Team Rankings */}
          <div className="xl:col-span-3 space-y-6">
            {/* Team Leaderboard */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-300">
              <div className="p-5 border-b border-surface-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <FiAward className="w-5 h-5 text-brand-600" />
                  Rankings por Equipe
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Baseado em colaboração, mentoria e impacto cultural •
                  Atualizado semanalmente
                </p>
              </div>
              <div className="p-5">
                <div className="space-y-5">
                  {mockTeamData.map((team) => (
                    <div
                      key={team.id}
                      className="group bg-gradient-to-br from-white to-surface-50 rounded-xl p-5 border border-surface-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300"
                    >
                      {/* Header with Rank and Team Info */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-bold text-lg ${getRankColor(
                              team.position
                            )}`}
                          >
                            {team.position <= 3
                              ? getRankIcon(team.position)
                              : `#${team.position}`}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-brand-600 transition-colors mb-1">
                              {team.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              Liderado por{" "}
                              <span className="font-medium">
                                {team.manager}
                              </span>{" "}
                              • {team.memberCount} membros
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                {getTrendIcon(team.trend)}
                                <span className="font-medium text-gray-700">
                                  {team.weeklyXP} XP
                                </span>
                                <span className="text-gray-500">
                                  esta semana
                                </span>
                              </div>
                              {team.streak > 0 && (
                                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                                  <FiZap className="w-3 h-3" />
                                  <span className="text-xs font-medium">
                                    {team.streak} semanas crescendo!
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-800 mb-1">
                            {team.totalXP.toLocaleString()}
                          </div>
                          <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                            XP Total
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <div className="bg-white/80 rounded-lg p-3 text-center">
                          <div className="text-base font-bold text-gray-800">
                            {team.averageXP}
                          </div>
                          <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                            Média/Membro
                          </div>
                        </div>
                        <div className="bg-white/80 rounded-lg p-3 text-center">
                          <div className="text-base font-bold text-emerald-600">
                            {team.collaborationScore}/10
                          </div>
                          <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                            Colaboração
                          </div>
                        </div>
                        <div className="bg-white/80 rounded-lg p-3 text-center">
                          <div className="text-base font-bold text-purple-600">
                            {team.mentoringIndex}/10
                          </div>
                          <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                            Mentoria
                          </div>
                        </div>
                        <div className="bg-white/80 rounded-lg p-3 text-center">
                          <div className="text-base font-bold text-brand-600">
                            {team.badges.length}
                          </div>
                          <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                            Badges
                          </div>
                        </div>
                      </div>

                      {/* Team Badges */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Conquistas da Equipe
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {team.badges.map((badge, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-gradient-to-r from-brand-500 to-brand-600 px-2.5 py-1 rounded-lg text-xs font-medium text-white shadow-sm"
                            >
                              <FiAward className="w-3 h-3" />
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Top Contributors */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Principais Contribuidores
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {team.topContributors.map((contributor, idx) => (
                            <div
                              key={idx}
                              className="bg-white/80 rounded-lg p-2.5"
                            >
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-bold">
                                  {contributor.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-800 text-sm truncate">
                                    {contributor.name}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {contributor.area}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-brand-600">
                                    {contributor.xp}
                                  </p>
                                  <p className="text-xs text-gray-500">XP</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Culture Impact */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                        <div className="flex items-start gap-2">
                          <FiHeart className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-indigo-900 mb-1 text-sm">
                              Impacto Cultural
                            </h4>
                            <p className="text-sm text-indigo-700 leading-relaxed">
                              {team.cultureImpact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Growth System Guide */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <FiInfo className="w-4 h-4" />
                <h3 className="font-semibold">Como Funciona?</h3>
              </div>
              <p className="text-brand-100 text-sm mb-4 leading-relaxed">
                Entenda a metodologia por trás do sistema Team-First e como
                incentivamos colaboração ao invés de competição.
              </p>
              <Link
                to="/gamification/guide"
                className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <FiZap className="w-4 h-4" />
                Ver Guia Completo
              </Link>
            </div>

            {/* Team-First Philosophy */}
            <div className="bg-white rounded-xl shadow-sm border border-surface-300 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-brand-600" />
                Filosofia Team-First
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Reduz competição tóxica e burnout</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Incentiva mentoria e knowledge sharing</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Promove crescimento coletivo sustentável</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Valoriza diferentes tipos de contribuição</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Fortalece cultura organizacional</span>
                </div>
              </div>
            </div>

            {/* Impact Stories Preview */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <FiHeart className="w-4 h-4 text-purple-600" />
                Histórias de Impacto
              </h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white/80 rounded-lg p-3">
                  <p className="text-purple-700 font-medium mb-1">
                    Engineering Alpha
                  </p>
                  <p className="text-gray-700">
                    Programa de mentoria aumentou satisfação em 40%
                  </p>
                </div>
                <div className="bg-white/80 rounded-lg p-3">
                  <p className="text-indigo-700 font-medium mb-1">
                    Product Discovery
                  </p>
                  <p className="text-gray-700">
                    Rituais de celebração reduziram turnover em 30%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
