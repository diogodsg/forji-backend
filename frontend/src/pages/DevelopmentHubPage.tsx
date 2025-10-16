import {
  FiTarget,
  FiCalendar,
  FiTrendingUp,
  FiBookOpen,
  FiAward,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { usePlayerProfile } from "@/features/gamification/hooks/useGamification";

export function DevelopmentHubPage() {
  const navigate = useNavigate();
  const { profile, loading } = usePlayerProfile();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const playerData = profile || {
    level: 1,
    currentXP: 0,
    totalXP: 0,
    nextLevelXP: 100,
    streak: 0,
    badges: [],
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hub de Desenvolvimento
        </h1>
        <p className="text-gray-600">
          Centralize seu crescimento profissional e conquiste novos níveis
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
              <FiTarget className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Nível Atual</p>
              <p className="text-2xl font-bold text-gray-900">
                {playerData.level}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white">
              <FiTrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">XP Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {playerData.totalXP.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
              <FiAward className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Conquistas</p>
              <p className="text-2xl font-bold text-gray-900">
                {playerData.badges?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* PDI Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white">
              <FiTarget className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Ciclo Atual
              </h3>
              <p className="text-gray-600">
                Gerencie seu desenvolvimento com ciclos focados e gamificados
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/development/cycles")}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              🎯 Acessar Ciclo Atual
            </button>

            <button
              onClick={() => navigate("/development/pdi")}
              className="w-full bg-violet-50 text-violet-700 py-3 px-4 rounded-lg font-medium hover:bg-violet-100 transition-colors"
            >
              📋 PDI Tradicional
            </button>
          </div>
        </div>

        {/* Cycles Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
              <FiCalendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ciclos de Desenvolvimento
            </h3>
            <p className="text-gray-600">
              Sistema gamificado de metas com foco em velocidade
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/development/cycles")}
              className="w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              🎯 Acessar Ciclo Atual
            </button>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-violet-50 rounded-lg">
                <p className="text-2xl font-bold text-violet-600">2-3</p>
                <p className="text-xs text-violet-600">Metas Foco</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">5min</p>
                <p className="text-xs text-green-600">Criação Rápida</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Recursos de Aprendizado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors cursor-pointer">
            <FiBookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">
              Biblioteca de Conhecimento
            </h4>
            <p className="text-sm text-gray-600">
              Artigos, cursos e materiais curados
            </p>
          </div>

          <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
            <FiTarget className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">
              Templates de Meta
            </h4>
            <p className="text-sm text-gray-600">
              Modelos para objetivos eficazes
            </p>
          </div>

          <div className="text-center p-6 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
            <FiAward className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">
              Sistema de Badges
            </h4>
            <p className="text-sm text-gray-600">
              Conquiste reconhecimento por seu progresso
            </p>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Resumo do Progresso
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progresso para o Próximo Nível</span>
              <span>
                {Math.round(
                  (playerData.currentXP / playerData.nextLevelXP) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-1000 rounded-full"
                style={{
                  width: `${
                    (playerData.currentXP / playerData.nextLevelXP) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">24</p>
              <p className="text-sm text-gray-600">Ações esta semana</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">7</p>
              <p className="text-sm text-gray-600">Dias de streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">3</p>
              <p className="text-sm text-gray-600">Novas conquistas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">89%</p>
              <p className="text-sm text-gray-600">Meta mensal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
