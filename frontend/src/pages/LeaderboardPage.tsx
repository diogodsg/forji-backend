import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiAward,
  FiUsers,
  FiBarChart,
  FiTarget,
  FiStar,
  FiInfo,
  FiHeart,
  FiZap,
  FiExternalLink,
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  usePlayerProfile,
  // useLeaderboard,
  useWeeklyChallenge,
} from "@/features/gamification/hooks/useGamification";
import { api } from "@/lib/apiClient";
import type { LeaderboardEntry } from "@/features/gamification/types/gamification";

export function LeaderboardPage() {
  const [timePeriod, setTimePeriod] = useState<"week" | "month" | "all">(
    "week"
  );
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"badges" | "teams">(
    "teams"
  );
  const [showGuide, setShowGuide] = useState(false);

  const { profile, loading: profileLoading } = usePlayerProfile();
  // const { leaderboard, loading: leaderboardLoading } = useLeaderboard(timePeriod);
  const { challenge, loading: challengeLoading } = useWeeklyChallenge();

  const loadCategoryData = async (category: "badges" | "teams") => {
    try {
      const response = await api<LeaderboardEntry[]>(
        `/gamification/leaderboard/${category}`,
        { auth: true }
      );
      setSelectedCategory(category);
      setAllPlayers(response);
    } catch (error) {
      console.error("Error loading category data:", error);
    }
  };

  // Load team data when teams category is selected
  useEffect(() => {
    if (selectedCategory === "teams") {
      loadCategoryData("teams");
    }
  }, [selectedCategory]);

  const loadMorePlayers = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    // Mock loading more players
    setTimeout(() => {
      setLoadingMore(false);
    }, 1000);
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-600">
          Carregando rankings...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Erro ao carregar perfil do usuário</div>
      </div>
    );
  }

  const playerData = {
    userId: profile.userId,
    name: `Player #${profile.userId.toString().padStart(3, "0")}`,
    level: profile.level,
    totalXP: profile.totalXP,
    weeklyXP: Math.max(0, profile.totalXP - profile.currentXP), // Estimativa
    rank: profile.rank,
  };

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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FiAward className="w-6 h-6 text-yellow-600" />;
      case 2:
        return <FiAward className="w-6 h-6 text-gray-500" />;
      case 3:
        return <FiAward className="w-6 h-6 text-amber-700" />;
      default:
        return <FiStar className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPeriodTitle = () => {
    const baseTitle = (() => {
      switch (timePeriod) {
        case "week":
          return "Ranking Semanal";
        case "month":
          return "Ranking Mensal";
        case "all":
          return "Ranking Global";
        default:
          return "Ranking Global";
      }
    })();

    if (selectedCategory === "teams") {
      return `${baseTitle} - Equipes`;
    } else if (selectedCategory === "badges") {
      return `${baseTitle} - Badges`;
    }
    return baseTitle;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (rank === 2) return "text-gray-600 bg-gray-50 border-gray-200";
    if (rank === 3) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  // Mock data for team leaderboard - Team First Philosophy
  const mockLeaderboardData =
    selectedCategory === "teams"
      ? [
          {
            userId: 1,
            name: "Team Alpha",
            level: 15,
            totalXP: 12450,
            weeklyXP: 1850,
            rank: 1,
            trend: "up" as const,
          },
          {
            userId: 2,
            name: "Team Beta",
            level: 13,
            totalXP: 9870,
            weeklyXP: 1420,
            rank: 2,
            trend: "stable" as const,
          },
          {
            userId: 3,
            name: "Team Gamma",
            level: 12,
            totalXP: 8340,
            weeklyXP: 1180,
            rank: 3,
            trend: "up" as const,
          },
          {
            userId: 4,
            name: "Team Delta",
            level: 11,
            totalXP: 7250,
            weeklyXP: 980,
            rank: 4,
            trend: "down" as const,
          },
          {
            userId: 5,
            name: "Team Epsilon",
            level: 10,
            totalXP: 6890,
            weeklyXP: 850,
            rank: 5,
            trend: "stable" as const,
          },
        ]
      : allPlayers; // Para badges ou outros dados

  return (
    <div className="space-y-8">
      {/* Header com Botão de Guia */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Rankings e Competição
          </h1>
          <p className="text-gray-600">
            Veja como você se compara com outros profissionais e equipes
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/gamification/guide"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiExternalLink className="w-4 h-4" />
            Guia Completo
          </Link>
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showGuide
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <FiInfo className="w-4 h-4" />
            {showGuide ? "Ocultar Resumo" : "Resumo Rápido"}
          </button>
        </div>
      </div>

      {/* Guia Explicativo - Team First Philosophy */}
      {showGuide && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <FiUsers className="w-8 h-8 text-blue-600" />
                <h2 className="text-3xl font-bold text-blue-900">
                  Team First Philosophy - Resumo
                </h2>
                <FiHeart className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-lg text-blue-800 max-w-3xl mx-auto mb-4">
                Nossa plataforma revoluciona a gamificação corporativa com foco
                em <strong>colaboração sobre competição</strong>. Aqui, o
                sucesso individual é amplificado pelo sucesso coletivo, criando
                um ambiente mais saudável e produtivo.
              </p>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <p className="text-blue-700">
                  📘 <strong>Quer entender completamente o sistema?</strong>{" "}
                  Visite nosso{" "}
                  <Link
                    to="/gamification/guide"
                    className="underline font-semibold hover:text-blue-800 transition-colors"
                  >
                    Guia Completo do Team-First Growth System
                  </Link>{" "}
                  para uma explicação detalhada de como funciona cada aspecto do
                  XP, anti-gaming e equalização.
                </p>
              </div>
            </div>

            {/* Por que Team-First? */}
            <div className="bg-white rounded-lg p-6 border border-blue-200 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiTarget className="w-5 h-5 text-blue-600" />
                Por que Team-First?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">
                    ❌ Ranking Individual
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Competição tóxica entre colegas</li>
                    <li>• Criação de silos e isolamento</li>
                    <li>• Pressão prejudicial ao bem-estar</li>
                    <li>• Foco em métricas vazias</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">
                    ✅ Ranking de Equipes
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Colaboração e crescimento conjunto</li>
                    <li>• Mentoria incentivada generosamente</li>
                    <li>• Diversidade de contribuições valorizada</li>
                    <li>• Ambiente saudável e produtivo</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Sistema de XP Completo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Desenvolvimento Pessoal (40%) */}
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <FiZap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Desenvolvimento Pessoal
                    </h3>
                    <p className="text-xs text-gray-600">40% do XP total</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Milestone PDI Completada</span>
                    <span className="font-bold text-indigo-600">100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Key Result Alcançado</span>
                    <span className="font-bold text-indigo-600">150 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Competência Level Up</span>
                    <span className="font-bold text-indigo-600">75 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ciclo PDI Completo</span>
                    <span className="font-bold text-indigo-600">300 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-avaliação Profunda</span>
                    <span className="font-bold text-indigo-600">35 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meta de Aprendizado</span>
                    <span className="font-bold text-indigo-600">30 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reunião PDI Documentada</span>
                    <span className="font-bold text-indigo-600">45 XP</span>
                  </div>
                </div>
              </div>

              {/* Colaboração e Mentoring (35%) */}
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <FiUsers className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Colaboração & Mentoring
                    </h3>
                    <p className="text-xs text-gray-600">35% do XP total</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Suporte Performance</span>
                    <span className="font-bold text-blue-600">100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Onboarding Júnior</span>
                    <span className="font-bold text-blue-600">90 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compartilhar Conhecimento</span>
                    <span className="font-bold text-blue-600">80 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Career Coaching</span>
                    <span className="font-bold text-blue-600">80 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Colaboração Cross-Team</span>
                    <span className="font-bold text-blue-600">70 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sessão de Mentoria</span>
                    <span className="font-bold text-blue-600">60 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suporte a Pares</span>
                    <span className="font-bold text-blue-600">50 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feedback Significativo</span>
                    <span className="font-bold text-blue-600">40 XP</span>
                  </div>
                </div>
              </div>

              {/* Contribuição para Equipe (25%) */}
              <div className="bg-white rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <FiTarget className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Contribuição de Equipe
                    </h3>
                    <p className="text-xs text-gray-600">25% do XP total</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Melhoria de Processo</span>
                    <span className="font-bold text-green-600">120 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Meta da Equipe</span>
                    <span className="font-bold text-green-600">100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolução de Conflito</span>
                    <span className="font-bold text-green-600">80 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Facilitar Retrospectiva</span>
                    <span className="font-bold text-green-600">60 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cultura da Equipe</span>
                    <span className="font-bold text-green-600">50 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documentação Útil</span>
                    <span className="font-bold text-green-600">40 XP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Salvaguardas Anti-Gaming */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center gap-2">
                <FiInfo className="w-5 h-5" />
                Salvaguardas Anti-Gaming
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-800">
                <div>
                  <h4 className="font-semibold mb-2">📏 Caps Semanais</h4>
                  <p>
                    Máximo de XP por tipo de ação para evitar spam. Ex: máximo 5
                    feedbacks por semana.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⏰ Cooldowns</h4>
                  <p>
                    Tempo mínimo entre ações similares. Ex: 72h entre feedbacks
                    para a mesma pessoa.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">👥 Validação por Pares</h4>
                  <p>
                    Muitas ações precisam de confirmação de qualidade pelos
                    receptores (rating ≥4.0/5).
                  </p>
                </div>
              </div>
            </div>

            {/* Equalização IC vs Manager */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
                <FiBarChart className="w-5 h-5" />
                Sistema de Equalização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-purple-800">
                <div>
                  <h4 className="font-semibold mb-2">
                    👤 Individual Contributors (ICs)
                  </h4>
                  <ul className="space-y-1">
                    <li>
                      • <strong>+30% XP</strong> para ações de liderança por
                      influência
                    </li>
                    <li>
                      • <strong>+40% XP</strong> para colaboração cross-team
                    </li>
                    <li>
                      • Foco em crescimento técnico + mentoria peer-to-peer
                    </li>
                    <li>• Não penalizados por menos reuniões/gestão</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">👨‍💼 Managers</h4>
                  <ul className="space-y-1">
                    <li>
                      • <strong>+100% XP</strong> para melhorias com impacto
                      mensurável
                    </li>
                    <li>• Maior fonte de XP vem do sucesso da equipe</li>
                    <li>
                      • Incentivados a desenvolver pessoas, não apenas gerenciar
                    </li>
                    <li>• XP por facilitar crescimento e resolver problemas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-3">
                🎯 Objetivo Principal
              </h3>
              <p className="text-blue-100 text-lg max-w-4xl mx-auto">
                Criar um ambiente onde <strong>todos crescem juntos</strong>,
                compartilham conhecimento e celebram conquistas coletivas. O
                foco está no progresso da equipe, desenvolvimento real de
                competências e colaboração genuína que gera impacto duradouro.
              </p>
              <div className="mt-4 text-blue-100 text-sm">
                <strong>Resultado:</strong> Equipes mais produtivas, ambiente de
                trabalho mais saudável e crescimento profissional acelerado para
                todos.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Performance Overview */}
      <div className="bg-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
              <FiUsers className="w-5 h-5" />
              Sua Equipe
            </h2>
            <p className="text-blue-100">Performance coletiva em destaque</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">#2</div>
            <div className="text-sm text-blue-100">no ranking de equipes</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {(playerData.totalXP * 4.2).toLocaleString()}
            </div>
            <div className="text-sm text-blue-100">XP da Equipe</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              +{Math.floor(playerData.totalXP * 0.3)}
            </div>
            <div className="text-sm text-blue-100">XP esta semana</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{playerData.level}</div>
            <div className="text-sm text-blue-100">Nível médio</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Leaderboard */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header com foco em Team First */}
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-50 rounded-lg p-3 flex items-center gap-3">
                <FiUsers className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-bold text-blue-900">
                    Rankings de Equipes
                  </h2>
                  <p className="text-sm text-blue-700">
                    Colaboração em primeiro lugar
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {getPeriodTitle()}
              </h3>
              <div className="flex items-center space-x-2">
                <select
                  value={timePeriod}
                  onChange={(e) =>
                    setTimePeriod(e.target.value as "week" | "month" | "all")
                  }
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm bg-white"
                >
                  <option value="week">Esta semana</option>
                  <option value="month">Este mês</option>
                  <option value="all">Todo tempo</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {mockLeaderboardData.map((player) => (
                <div
                  key={player.userId}
                  className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  {/* Rank - Design System Simplificado */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <div
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-sm ${getRankColor(
                        player.rank
                      )}`}
                    >
                      {player.rank}
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-gray-900 truncate">
                        <div className="flex items-center space-x-2">
                          <FiUsers className="w-4 h-4 text-blue-600" />
                          <span>{player.name}</span>
                        </div>
                      </h4>
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                        <FiUsers className="w-3 h-3" />
                        Equipe
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Nível médio {player.level} •{" "}
                      {Math.floor(Math.random() * 8) + 3} membros
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {player.totalXP.toLocaleString()} XP
                    </div>
                    <div className="flex items-center justify-end space-x-1 text-sm text-gray-600">
                      <span>+{player.weeklyXP} esta semana</span>
                      {getTrendIcon(player.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-6">
              <button
                onClick={loadMorePlayers}
                disabled={loadingMore}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loadingMore ? "Carregando..." : "Ver mais equipes"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Top Performers - Equipes em destaque */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-blue-600" />
              Top Equipes da Semana
            </h3>
            <div className="space-y-3">
              {mockLeaderboardData.slice(0, 3).map((team, index) => (
                <div key={team.userId} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">{getRankIcon(index + 1)}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      <FiUsers className="w-3 h-3 text-blue-600" />
                      {team.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      +{team.weeklyXP} XP coletivo esta semana
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories - Team First Philosophy */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiBarChart className="w-5 h-5 text-gray-600" />
              Categorias
            </h3>
            <div className="space-y-3">
              {/* Teams First */}
              <button
                onClick={() => loadCategoryData("teams")}
                className="w-full text-left p-3 rounded-lg bg-blue-50 border border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  <FiUsers className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Equipes</p>
                    <p className="text-xs text-blue-700">
                      Foco principal da plataforma
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => loadCategoryData("badges")}
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FiAward className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Badges Colaborativos
                    </p>
                    <p className="text-xs text-gray-600">
                      Conquistas de equipe
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Weekly Challenge - Design System Atualizado */}
          <div className="bg-indigo-600 rounded-xl p-6 text-white">
            {challengeLoading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-indigo-400/30 rounded mb-2"></div>
                <div className="h-4 bg-indigo-400/30 rounded mb-4"></div>
              </div>
            ) : challenge ? (
              <>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <FiTarget className="w-5 h-5" />
                  {challenge.title}
                </h3>
                <p className="text-indigo-100 text-sm mb-4">
                  {challenge.description}
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>
                      {challenge.current}/{challenge.target}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(challenge.progress, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-xs text-indigo-100 flex items-center justify-center gap-1">
                    <FiAward className="w-4 h-4 text-yellow-400" />
                    Recompensa: {challenge.reward}
                  </span>
                </div>
                {challenge.isCompleted && (
                  <div className="mt-2 text-center">
                    <span className="bg-green-400 text-green-900 text-xs px-2 py-1 rounded-full font-medium">
                      ✓ Completado!
                    </span>
                  </div>
                )}
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <FiTarget className="w-5 h-5" />
                  Desafio Semanal
                </h3>
                <p className="text-indigo-100 text-sm mb-4">
                  Complete 5 milestones de PDI esta semana
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>3/5</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-400/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full transition-all duration-500"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-xs text-indigo-100 flex items-center justify-center gap-1">
                    <FiAward className="w-4 h-4 text-yellow-400" />
                    Recompensa: Badge "Conquistador Semanal"
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
