import React, { useState } from "react";
import {
  Code2,
  Users,
  Crown,
  ArrowRight,
  ArrowLeft,
  Check,
  Target,
} from "lucide-react";
import { useCycleTemplates, useCycleCreation } from "../../hooks";
import type {
  UserProfile,
  CycleDuration,
  CycleTemplate,
  CycleGoal,
} from "../../types";

// Componente para seleção de perfil (Passo 1)
const ProfileSelection: React.FC<{
  selectedProfile?: UserProfile;
  onSelect: (profile: UserProfile) => void;
}> = ({ selectedProfile, onSelect }) => {
  const profiles = [
    {
      id: "developer" as UserProfile,
      name: "Evolução Técnica",
      description: "Foco em crescimento técnico e qualidade",
      icon: Code2,
      color: "violet",
      estimatedTime: "2 min",
    },
    {
      id: "tech-lead" as UserProfile,
      name: "Liderança Técnica",
      description: "Desenvolvimento de pessoas e processos",
      icon: Users,
      color: "blue",
      estimatedTime: "3 min",
    },
    {
      id: "manager" as UserProfile,
      name: "Gestão de Times",
      description: "Resultados e desenvolvimento de equipes",
      icon: Crown,
      color: "amber",
      estimatedTime: "2 min",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Qual seu principal foco?
        </h2>
        <p className="text-gray-600">
          Escolha o template que melhor se alinha com seus objetivos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => {
          const Icon = profile.icon;
          const isSelected = selectedProfile === profile.id;

          return (
            <button
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className={`p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 ${
                isSelected
                  ? `border-${profile.color}-500 bg-${profile.color}-50 shadow-md`
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`h-10 w-10 rounded-lg bg-${profile.color}-100 flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 text-${profile.color}-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">
                      {profile.name}
                    </h3>
                    {isSelected && <Check className="w-4 h-4 text-green-600" />}
                  </div>
                  <p className="text-xs text-gray-500">
                    {profile.estimatedTime}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{profile.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Componente para personalização do template (Passo 2)
const TemplateCustomization: React.FC<{
  template: CycleTemplate;
  duration: CycleDuration;
  onDurationChange: (duration: CycleDuration) => void;
  customGoals: Partial<CycleGoal>[];
  onGoalsChange: (goals: Partial<CycleGoal>[]) => void;
}> = ({ template, duration, onDurationChange, customGoals, onGoalsChange }) => {
  const durations = [
    {
      value: "1month" as CycleDuration,
      label: "1 mês",
      description: "Foco intensivo",
    },
    {
      value: "3months" as CycleDuration,
      label: "3 meses",
      description: "Equilíbrio ideal",
    },
    {
      value: "6months" as CycleDuration,
      label: "6 meses",
      description: "Transformação profunda",
    },
  ];

  const updateGoal = (index: number, field: string, value: any) => {
    const updated = [...customGoals];
    updated[index] = { ...updated[index], [field]: value };
    onGoalsChange(updated);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Template "{template.name}"
        </h2>
        <p className="text-gray-600">
          Personalize suas metas - você pode ajustar tudo depois
        </p>
      </div>

      {/* Seleção de duração */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Duração do Ciclo
        </label>
        <div className="grid grid-cols-3 gap-3">
          {durations.map((d) => (
            <button
              key={d.value}
              onClick={() => onDurationChange(d.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                duration === d.value
                  ? "border-violet-500 bg-violet-50 text-violet-700"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="font-semibold">{d.label}</div>
              <div className="text-xs text-gray-500 mt-1">{d.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Personalização das metas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Suas Metas Principais
        </label>
        <div className="space-y-4">
          {template.defaultGoals.map((defaultGoal, index) => {
            const customGoal = customGoals[index] || {};

            return (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-violet-600 mt-1 flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={customGoal.title || defaultGoal.title}
                      onChange={(e) =>
                        updateGoal(index, "title", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-medium"
                      placeholder="Título da meta..."
                    />

                    {defaultGoal.type === "quantity" && (
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={
                            customGoal.targetNumber ||
                            defaultGoal.targetNumber ||
                            ""
                          }
                          onChange={(e) =>
                            updateGoal(
                              index,
                              "targetNumber",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-center"
                          min="1"
                        />
                        <input
                          type="text"
                          value={customGoal.unit || defaultGoal.unit || ""}
                          onChange={(e) =>
                            updateGoal(index, "unit", e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                          placeholder="unidade (projetos, pessoas, etc.)"
                        />
                      </div>
                    )}

                    {defaultGoal.type === "improvement" && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">De:</span>
                        <input
                          type="number"
                          value={
                            customGoal.initialValue ||
                            defaultGoal.initialValue ||
                            ""
                          }
                          onChange={(e) =>
                            updateGoal(
                              index,
                              "initialValue",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-center"
                          step="0.1"
                        />
                        <span className="text-sm text-gray-600">Para:</span>
                        <input
                          type="number"
                          value={
                            customGoal.targetValue ||
                            defaultGoal.targetValue ||
                            ""
                          }
                          onChange={(e) =>
                            updateGoal(
                              index,
                              "targetValue",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-center"
                          step="0.1"
                        />
                        <input
                          type="text"
                          value={customGoal.metric || defaultGoal.metric || ""}
                          onChange={(e) =>
                            updateGoal(index, "metric", e.target.value)
                          }
                          className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                          placeholder="métrica (satisfação, bugs, etc.)"
                        />
                      </div>
                    )}

                    <textarea
                      value={customGoal.description || defaultGoal.description}
                      onChange={(e) =>
                        updateGoal(index, "description", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-sm"
                      rows={2}
                      placeholder="Como você vai medir o sucesso?"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Componente de confirmação (Passo 3)
const CycleConfirmation: React.FC<{
  template: CycleTemplate;
  duration: CycleDuration;
  customGoals: Partial<CycleGoal>[];
  onCreateCycle: () => void;
  isCreating: boolean;
}> = ({ template, duration, customGoals, onCreateCycle, isCreating }) => {
  const getDurationLabel = (d: CycleDuration) => {
    switch (d) {
      case "1month":
        return "1 mês";
      case "3months":
        return "3 meses";
      case "6months":
        return "6 meses";
    }
  };

  const getEndDate = () => {
    const now = new Date();
    const months = duration === "1month" ? 1 : duration === "3months" ? 3 : 6;
    const endDate = new Date(
      now.getFullYear(),
      now.getMonth() + months,
      now.getDate()
    );
    return endDate.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Pronto para começar!
        </h2>
        <p className="text-gray-600">
          Revise as informações e crie seu ciclo de desenvolvimento
        </p>
      </div>

      {/* Resumo do ciclo */}
      <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-6 border border-violet-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-lg bg-violet-600 flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-violet-800">
              Ciclo {template.name}
            </h3>
            <p className="text-sm text-violet-600">
              {getDurationLabel(duration)} • {getEndDate()}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-violet-800">Suas metas:</h4>
          {customGoals.map((goal, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-violet-700 bg-white/50 rounded-lg p-3"
            >
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="font-medium">{goal.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expectativas */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">
          O que acontece agora:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Seu ciclo será ativado imediatamente</li>
          <li>✅ Você ganhará 150 XP por criar o ciclo</li>
          <li>✅ Receberá notificações de progresso semanais</li>
          <li>✅ Poderá ajustar metas a qualquer momento</li>
        </ul>
      </div>

      {/* Botão de criação */}
      <button
        onClick={onCreateCycle}
        disabled={isCreating}
        className="w-full bg-gradient-to-r from-violet-600 to-violet-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isCreating ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Criando ciclo...
          </div>
        ) : (
          "🎯 Criar e Ativar Ciclo"
        )}
      </button>
    </div>
  );
};

// Componente principal do wizard
export const QuickCycleCreator: React.FC<{
  onCycleCreated?: () => void;
}> = ({ onCycleCreated }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile>();
  const [selectedTemplate, setSelectedTemplate] = useState<CycleTemplate>();
  const [duration, setDuration] = useState<CycleDuration>("3months");
  const [customGoals, setCustomGoals] = useState<Partial<CycleGoal>[]>([]);

  const { getTemplatesByProfile } = useCycleTemplates();
  const { createCycle, isCreating } = useCycleCreation();

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return !!selectedProfile;
      case 2:
        return !!selectedTemplate && customGoals.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedProfile) {
      const templates = getTemplatesByProfile(selectedProfile);
      if (templates.length > 0) {
        setSelectedTemplate(templates[0]);
        setCustomGoals(templates[0].defaultGoals.map((goal) => ({ ...goal })));
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleCreateCycle = async () => {
    if (!selectedTemplate) return;

    try {
      const now = new Date();
      const months = duration === "1month" ? 1 : duration === "3months" ? 3 : 6;
      const endDate = new Date(
        now.getFullYear(),
        now.getMonth() + months,
        now.getDate()
      );

      const cycleData = {
        name: `Q4 2025 - ${selectedTemplate.name}`,
        description: selectedTemplate.description,
        duration,
        status: "active" as const,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        goals: customGoals.map((goal, index) => ({
          ...goal,
          id: `goal-${Date.now()}-${index}`,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        })) as CycleGoal[],
        xpEarned: 0,
        xpTarget: 800,
        progressPercentage: 0,
        daysRemaining: Math.ceil(
          (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ),
      };

      await createCycle(cycleData);
      onCycleCreated?.();
    } catch (error) {
      console.error("Erro ao criar ciclo:", error);
    }
  };

  return (
    <div className="min-h-full w-full bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Passo {currentStep} de 3
            </span>
            <span className="text-sm text-gray-500">
              {currentStep === 1 && "30 segundos"}
              {currentStep === 2 && "2-3 minutos"}
              {currentStep === 3 && "30 segundos"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-violet-600 to-violet-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Conteúdo do passo atual */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          {currentStep === 1 && (
            <ProfileSelection
              selectedProfile={selectedProfile}
              onSelect={setSelectedProfile}
            />
          )}

          {currentStep === 2 && selectedTemplate && (
            <TemplateCustomization
              template={selectedTemplate}
              duration={duration}
              onDurationChange={setDuration}
              customGoals={customGoals}
              onGoalsChange={setCustomGoals}
            />
          )}

          {currentStep === 3 && selectedTemplate && (
            <CycleConfirmation
              template={selectedTemplate}
              duration={duration}
              customGoals={customGoals}
              onCreateCycle={handleCreateCycle}
              isCreating={isCreating}
            />
          )}
        </div>

        {/* Navegação */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          {currentStep < 3 && (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="flex items-center gap-2 bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próximo
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
