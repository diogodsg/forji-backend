import React, { useState } from "react";
import { Trophy, ChevronRight, Plus, Search } from "lucide-react";
import { useCompetencies } from "../../hooks";
import type {
  Competency,
  UserCompetencyProgress,
  CompetencyCategory,
} from "../../types";

// Componente para exibir um nível de competência
const CompetencyLevelCard: React.FC<{
  competency: Competency;
  level: number;
  isCurrent: boolean;
  isTarget: boolean;
  isCompleted: boolean;
}> = ({ competency, level, isCurrent, isTarget, isCompleted }) => {
  const levelData = competency.levels.find((l) => l.level === level);
  if (!levelData) return null;

  const getStatusColor = () => {
    if (isCompleted) return "bg-green-100 border-green-300 text-green-800";
    if (isCurrent) return "bg-blue-100 border-blue-300 text-blue-800";
    if (isTarget) return "bg-violet-100 border-violet-300 text-violet-800";
    return "bg-gray-50 border-gray-200 text-gray-600";
  };

  const getStatusLabel = () => {
    if (isCompleted) return "✅ Concluído";
    if (isCurrent) return "🔄 Atual";
    if (isTarget) return "🎯 Meta";
    return "";
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">
          Nível {level} - {levelData.name}
        </h4>
        {(isCurrent || isTarget || isCompleted) && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50">
            {getStatusLabel()}
          </span>
        )}
      </div>

      <p className="text-sm mb-3 opacity-90">{levelData.description}</p>

      <div className="space-y-2">
        <div>
          <h5 className="text-xs font-medium mb-1">
            Comportamentos esperados:
          </h5>
          <ul className="text-xs space-y-1">
            {levelData.behaviors.slice(0, 2).map((behavior, index) => (
              <li key={index} className="flex items-start gap-1">
                <span className="opacity-70">•</span>
                <span>{behavior}</span>
              </li>
            ))}
            {levelData.behaviors.length > 2 && (
              <li className="text-xs opacity-70">
                +{levelData.behaviors.length - 2} mais...
              </li>
            )}
          </ul>
        </div>

        <div className="text-xs opacity-70">
          ⏱️ Tempo estimado: {levelData.timeEstimate}
        </div>
      </div>
    </div>
  );
};

// Componente para progress ring
const CompetencyProgressRing: React.FC<{
  progress: number;
  size?: "sm" | "md" | "lg";
  color?: string;
}> = ({ progress, size = "md", color = "violet" }) => {
  const sizes = {
    sm: { width: "w-12 h-12", text: "text-xs" },
    md: { width: "w-16 h-16", text: "text-sm" },
    lg: { width: "w-20 h-20", text: "text-base" },
  };

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`${sizes[size].width} relative`}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`text-${color}-600 transition-all duration-500`}
          strokeLinecap="round"
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center ${sizes[size].text} font-bold text-gray-700`}
      >
        {Math.round(progress)}%
      </div>
    </div>
  );
};

// Componente para card de competência ativa
const ActiveCompetencyCard: React.FC<{
  competency: Competency;
  progress: UserCompetencyProgress;
  onClick: () => void;
}> = ({ competency, progress, onClick }) => {
  const categoryIcons = {
    technical: "💻",
    leadership: "👥",
    behavioral: "🌟",
    business: "💼",
  };

  const categoryColors = {
    technical: "from-blue-500 to-blue-600",
    leadership: "from-amber-500 to-amber-600",
    behavioral: "from-green-500 to-green-600",
    business: "from-purple-500 to-purple-600",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`h-10 w-10 rounded-lg bg-gradient-to-br ${
              categoryColors[competency.category]
            } flex items-center justify-center text-white text-lg`}
          >
            {categoryIcons[competency.category]}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{competency.name}</h3>
            <p className="text-sm text-gray-600">{competency.category}</p>
          </div>
        </div>
        <CompetencyProgressRing progress={progress.progress} size="sm" />
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {competency.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <span className="text-gray-600">Nível: </span>
          <span className="font-medium text-gray-800">
            {progress.currentLevel} → {progress.targetLevel}
          </span>
        </div>

        <div className="flex items-center gap-1 text-violet-600 text-sm font-medium">
          Ver detalhes
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {progress.evidences.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {progress.evidences.length} evidência
            {progress.evidences.length !== 1 ? "s" : ""} coletada
            {progress.evidences.length !== 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente para detalhes de uma competência
const CompetencyDetailView: React.FC<{
  competency: Competency;
  progress?: UserCompetencyProgress;
  onBack: () => void;
}> = ({ competency, progress, onBack }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center text-white text-xl">
            🎯
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              {competency.name}
            </h1>
            <p className="text-gray-600">{competency.description}</p>
          </div>
        </div>
      </div>

      {/* Progresso atual */}
      {progress && (
        <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 border border-violet-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-violet-800">
              Seu Progresso
            </h2>
            <CompetencyProgressRing progress={progress.progress} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-violet-600 font-medium">Nível Atual:</span>
              <div className="text-violet-800 font-semibold">
                {progress.currentLevel} -{" "}
                {
                  competency.levels.find(
                    (l) => l.level === progress.currentLevel
                  )?.name
                }
              </div>
            </div>
            <div>
              <span className="text-violet-600 font-medium">Meta:</span>
              <div className="text-violet-800 font-semibold">
                {progress.targetLevel} -{" "}
                {
                  competency.levels.find(
                    (l) => l.level === progress.targetLevel
                  )?.name
                }
              </div>
            </div>
            <div>
              <span className="text-violet-600 font-medium">Evidências:</span>
              <div className="text-violet-800 font-semibold">
                {progress.evidences.length} coletadas
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Níveis da competência */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Níveis de Desenvolvimento
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {competency.levels.map((level) => (
            <CompetencyLevelCard
              key={level.level}
              competency={competency}
              level={level.level}
              isCurrent={progress?.currentLevel === level.level}
              isTarget={progress?.targetLevel === level.level}
              isCompleted={
                progress ? progress.currentLevel > level.level : false
              }
            />
          ))}
        </div>
      </div>

      {/* Evidências coletadas */}
      {progress && progress.evidences.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            📊 Evidências de Progresso
          </h2>

          <div className="space-y-4">
            {progress.evidences.map((evidence) => (
              <div
                key={evidence.id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {evidence.title}
                      </h4>
                      <p className="text-sm text-gray-600">{evidence.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      +{evidence.xpAwarded} XP
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(evidence.date).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{evidence.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competências relacionadas */}
      {competency.relatedCompetencies.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            🔗 Competências Relacionadas
          </h2>
          <div className="text-sm text-gray-600">
            Desenvolver essas competências pode complementar seu crescimento em{" "}
            {competency.name}.
          </div>
          {/* Aqui seria uma lista das competências relacionadas */}
        </div>
      )}
    </div>
  );
};

// Componente principal
export const CompetencyManager: React.FC = () => {
  const { competencies, userProgress, loading, getActiveCompetencies } =
    useCompetencies();
  const [selectedCompetency, setSelectedCompetency] = useState<string | null>(
    null
  );
  const [filter, setFilter] = useState<CompetencyCategory | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const activeCompetencies = getActiveCompetencies();

  const filteredCompetencies = competencies.filter((comp) => {
    const matchesFilter = filter === "all" || comp.category === filter;
    const matchesSearch =
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { value: "all" as const, label: "Todas", icon: "🎯" },
    { value: "technical" as const, label: "Técnicas", icon: "💻" },
    { value: "leadership" as const, label: "Liderança", icon: "👥" },
    { value: "behavioral" as const, label: "Comportamentais", icon: "🌟" },
    { value: "business" as const, label: "Negócio", icon: "💼" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  // Visualização de detalhes de uma competência
  if (selectedCompetency) {
    const competency = competencies.find((c) => c.id === selectedCompetency);
    const progress = userProgress.find(
      (p) => p.competencyId === selectedCompetency
    );

    if (!competency) return null;

    return (
      <CompetencyDetailView
        competency={competency}
        progress={progress}
        onBack={() => setSelectedCompetency(null)}
      />
    );
  }

  // Visualização principal
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            🧠 Suas Competências
          </h1>
          <p className="text-gray-600">
            Acompanhe seu desenvolvimento em competências específicas
          </p>
        </div>

        <button className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200">
          <Plus className="w-4 h-4" />
          Adicionar Competência
        </button>
      </div>

      {/* Competências ativas */}
      {activeCompetencies.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 Em Desenvolvimento ({activeCompetencies.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCompetencies.map((progress) => {
              const competency = competencies.find(
                (c) => c.id === progress.competencyId
              );
              if (!competency) return null;

              return (
                <ActiveCompetencyCard
                  key={competency.id}
                  competency={competency}
                  progress={progress}
                  onClick={() => setSelectedCompetency(competency.id)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => setFilter(category.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === category.value
                  ? "bg-violet-100 text-violet-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar competências..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
      </div>

      {/* Catálogo de competências */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📚 Catálogo de Competências
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetencies.map((competency) => (
            <div
              key={competency.id}
              onClick={() => setSelectedCompetency(competency.id)}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm">
                    {competency.category === "technical" && "💻"}
                    {competency.category === "leadership" && "👥"}
                    {competency.category === "behavioral" && "🌟"}
                    {competency.category === "business" && "💼"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {competency.name}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {competency.category}
                    </p>
                  </div>
                </div>
                {competency.isCore && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    Core
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {competency.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {competency.levels.length} níveis
                </span>
                <div className="flex items-center gap-1 text-violet-600 font-medium">
                  Explorar
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredCompetencies.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            Nenhuma competência encontrada
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou termo de busca
          </p>
        </div>
      )}
    </div>
  );
};
