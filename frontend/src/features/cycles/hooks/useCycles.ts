import { useState, useEffect } from "react";
import type { Cycle, CycleTemplate, UserProfile } from "../types";

// Mock data para templates rápidos por perfil
const CYCLE_TEMPLATES: CycleTemplate[] = [
  {
    id: "dev-evolution",
    name: "Evolução Técnica",
    description: "Foco em crescimento técnico e qualidade de código",
    profile: "developer",
    icon: "Code2",
    estimatedTime: "2 min",
    defaultGoals: [
      {
        type: "quantity",
        title: "Completar projetos com alta qualidade",
        description: "Entregar features com code review 90%+",
        targetNumber: 3,
        currentNumber: 0,
        unit: "projetos",
      },
      {
        type: "deadline",
        title: "Aprender nova tecnologia",
        description: "Dominar tecnologia específica com certificação",
        deadline: "", // Será preenchido pelo usuário
        completed: false,
      },
      {
        type: "quantity",
        title: "Mentorar desenvolvedores",
        description: "Orientar colegas em sessões 1:1",
        targetNumber: 1,
        currentNumber: 0,
        unit: "pessoas",
      },
    ],
    suggestions: {
      technologies: ["React Native", "TypeScript", "Node.js", "Python"],
      skills: ["Clean Code", "Testing", "Git Flow", "Code Review"],
    },
  },
  {
    id: "tech-leadership",
    name: "Liderança Técnica",
    description: "Desenvolvimento de pessoas e processos técnicos",
    profile: "tech-lead",
    icon: "Users",
    estimatedTime: "3 min",
    defaultGoals: [
      {
        type: "quantity",
        title: "Desenvolver pessoas da equipe",
        description: "Crescimento documentado e mensurável",
        targetNumber: 3,
        currentNumber: 0,
        unit: "pessoas",
      },
      {
        type: "quantity",
        title: "Entregar projetos no prazo",
        description: "Projetos entregues dentro do cronograma",
        targetNumber: 100,
        currentNumber: 0,
        unit: "% dos projetos",
      },
      {
        type: "quantity",
        title: "Implementar melhorias de processo",
        description: "Otimizações que impactam toda a equipe",
        targetNumber: 2,
        currentNumber: 0,
        unit: "processos",
      },
    ],
    suggestions: {
      skills: ["Mentoria", "Code Review", "Arquitetura", "Agilidade"],
      teamSize: 5,
    },
  },
  {
    id: "team-management",
    name: "Gestão de Times",
    description: "Foco em resultados e desenvolvimento de pessoas",
    profile: "manager",
    icon: "Crown",
    estimatedTime: "2 min",
    defaultGoals: [
      {
        type: "improvement",
        title: "Aumentar satisfação da equipe",
        description: "Melhoria na pesquisa interna de clima",
        initialValue: 7.0,
        targetValue: 8.5,
        currentValue: 7.0,
        metric: "satisfação (1-10)",
      },
      {
        type: "quantity",
        title: "Entregar OKRs do trimestre",
        description: "Objetivos organizacionais completados",
        targetNumber: 100,
        currentNumber: 0,
        unit: "% dos OKRs",
      },
      {
        type: "quantity",
        title: "Desenvolver sucessores",
        description: "Preparar pessoas para próximo nível",
        targetNumber: 2,
        currentNumber: 0,
        unit: "pessoas",
      },
    ],
    suggestions: {
      skills: ["1:1s", "Feedback", "OKRs", "Performance Review"],
    },
  },
];

// Mock para ciclo ativo (será substituído por API real)
const MOCK_CURRENT_CYCLE: Cycle = {
  id: "cycle-q4-2025",
  name: "Q4 2025 - Liderança Técnica",
  description: "Foco em desenvolvimento de pessoas e arquitetura de software",
  duration: "3months",
  status: "active",
  startDate: "2025-10-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  goals: [
    {
      id: "goal-1",
      type: "quantity",
      title: "Mentorar desenvolvedores júnior",
      description: "Orientar pessoas em sessões 1:1 quinzenais",
      targetNumber: 2,
      currentNumber: 1,
      unit: "pessoas",
      createdAt: "2025-10-01T10:00:00Z",
      updatedAt: "2025-10-15T14:30:00Z",
    },
    {
      id: "goal-2",
      type: "deadline",
      title: "Concluir certificação AWS",
      description: "Certificação Solutions Architect Associate",
      deadline: "2025-11-30T23:59:59Z",
      completed: false,
      createdAt: "2025-10-01T10:00:00Z",
      updatedAt: "2025-10-10T09:15:00Z",
    },
    {
      id: "goal-3",
      type: "improvement",
      title: "Reduzir bugs em produção",
      description: "Diminuir incidentes através de melhor code review",
      initialValue: 12,
      targetValue: 5,
      currentValue: 8,
      metric: "bugs por sprint",
      createdAt: "2025-10-01T10:00:00Z",
      updatedAt: "2025-10-15T16:45:00Z",
    },
  ],
  xpEarned: 350,
  xpTarget: 800,
  progressPercentage: 62,
  daysRemaining: 77,
  createdAt: "2025-10-01T09:00:00Z",
  updatedAt: "2025-10-15T16:45:00Z",
  userId: "user-123",
};

/**
 * Hook para gerenciar o ciclo atual do usuário
 */
export function useCurrentCycle() {
  const [currentCycle, setCurrentCycle] = useState<Cycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Simula loading da API
    const timer = setTimeout(() => {
      setCurrentCycle(MOCK_CURRENT_CYCLE);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const updateCycleGoal = async (
    goalId: string,
    updates: Partial<(typeof MOCK_CURRENT_CYCLE.goals)[0]>
  ) => {
    if (!currentCycle) return;

    setCurrentCycle((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        goals: prev.goals.map((goal) =>
          goal.id === goalId
            ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
            : goal
        ),
        updatedAt: new Date().toISOString(),
      };
    });

    // Aqui seria a chamada real para API
    console.log("Updating goal:", goalId, updates);
  };

  const calculateProgress = () => {
    if (!currentCycle) return 0;

    const totalGoals = currentCycle.goals.length;
    if (totalGoals === 0) return 0;

    const completedGoals = currentCycle.goals.filter((goal) => {
      switch (goal.type) {
        case "quantity":
          return (goal.currentNumber || 0) >= (goal.targetNumber || 0);
        case "deadline":
          return goal.completed === true;
        case "improvement":
          return (goal.currentValue || 0) >= (goal.targetValue || 0);
        default:
          return false;
      }
    }).length;

    return Math.round((completedGoals / totalGoals) * 100);
  };

  return {
    currentCycle,
    loading,
    error,
    updateCycleGoal,
    progressPercentage: calculateProgress(),
    hasActiveCycle: !!currentCycle && currentCycle.status === "active",
  };
}

/**
 * Hook para templates de ciclos por perfil
 */
export function useCycleTemplates() {
  const [templates] = useState<CycleTemplate[]>(CYCLE_TEMPLATES);

  const getTemplatesByProfile = (profile: UserProfile) => {
    return templates.filter((template) => template.profile === profile);
  };

  const getTemplateById = (templateId: string) => {
    return templates.find((template) => template.id === templateId);
  };

  return {
    templates,
    getTemplatesByProfile,
    getTemplateById,
  };
}

/**
 * Hook para criação rápida de ciclos
 */
export function useCycleCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCycle = async (
    cycleData: Omit<Cycle, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    setIsCreating(true);
    setError(null);

    try {
      // Simula criação na API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newCycle: Cycle = {
        ...cycleData,
        id: `cycle-${Date.now()}`,
        userId: "user-123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("Created new cycle:", newCycle);
      return newCycle;
    } catch (err) {
      setError("Erro ao criar ciclo. Tente novamente.");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createCycle,
    isCreating,
    error,
  };
}
