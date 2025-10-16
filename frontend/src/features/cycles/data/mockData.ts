import type { Cycle, CycleGoal } from "../types";

// Dados mockados para desenvolvimento sem backend
export const mockCycleGoals: CycleGoal[] = [
  {
    id: "goal-1",
    type: "quantity",
    title: "Mentorar desenvolvedores júnior",
    description:
      "Realizar mentoria individual com membros da equipe para desenvolvimento técnico",
    targetNumber: 5,
    currentNumber: 2,
    unit: "pessoas",
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-10-15T14:30:00.000Z",
  },
  {
    id: "goal-2",
    type: "deadline",
    title: "Completar certificação AWS",
    description:
      "Obter certificação AWS Solutions Architect Associate para melhorar conhecimento em cloud",
    deadline: "2025-12-31T23:59:59.000Z",
    completed: false,
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-10-15T14:30:00.000Z",
  },
  {
    id: "goal-3",
    type: "improvement",
    title: "Melhorar satisfação da equipe",
    description:
      "Aumentar o nível de satisfação da equipe através de melhores práticas de gestão",
    initialValue: 7.2,
    targetValue: 8.5,
    currentValue: 7.8,
    metric: "satisfação (escala 1-10)",
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-10-15T14:30:00.000Z",
  },
  {
    id: "goal-4",
    type: "quantity",
    title: "Implementar features críticas",
    description:
      "Desenvolver e entregar funcionalidades de alta prioridade do roadmap",
    targetNumber: 8,
    currentNumber: 3,
    unit: "features",
    createdAt: "2025-10-01T10:00:00.000Z",
    updatedAt: "2025-10-15T14:30:00.000Z",
  },
];

export const mockCurrentCycle: Cycle = {
  id: "cycle-q4-2025",
  name: "Q4 2025 - Liderança Técnica",
  description:
    "Foco em desenvolvimento de liderança técnica e mentoria da equipe",
  duration: "3months",
  status: "active",
  startDate: "2025-10-01T00:00:00.000Z",
  endDate: "2025-12-31T23:59:59.000Z",
  goals: mockCycleGoals,
  xpEarned: 350,
  xpTarget: 1000,
  progressPercentage: 42,
  daysRemaining: 77,
  createdAt: "2025-09-25T10:00:00.000Z",
  updatedAt: "2025-10-15T16:45:00.000Z",
  userId: "user-123",
};

// Função para simular delay de API
export const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Simulação de API calls
export const mockAPI = {
  getCurrentCycle: async (): Promise<Cycle> => {
    await delay();
    console.log("🔄 Mock API: Fetching current cycle");
    return mockCurrentCycle;
  },

  getCycleGoals: async (cycleId: string): Promise<CycleGoal[]> => {
    await delay(500);
    console.log(`🔄 Mock API: Fetching goals for cycle ${cycleId}`);
    return mockCycleGoals;
  },

  updateGoalProgress: async (
    goalId: string,
    progress: Partial<CycleGoal>
  ): Promise<CycleGoal> => {
    await delay(300);
    console.log(`🔄 Mock API: Updating goal ${goalId}`, progress);

    const goal = mockCycleGoals.find((g) => g.id === goalId);
    if (!goal) throw new Error(`Goal ${goalId} not found`);

    const updatedGoal = {
      ...goal,
      ...progress,
      updatedAt: new Date().toISOString(),
    };

    // Atualizar no array mock (simular persistência)
    const index = mockCycleGoals.findIndex((g) => g.id === goalId);
    if (index >= 0) {
      mockCycleGoals[index] = updatedGoal;
    }

    return updatedGoal;
  },

  createNewGoal: async (
    goalData: Omit<CycleGoal, "id" | "createdAt" | "updatedAt">
  ): Promise<CycleGoal> => {
    await delay(400);
    console.log("🔄 Mock API: Creating new goal", goalData);

    const newGoal: CycleGoal = {
      ...goalData,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCycleGoals.push(newGoal);
    return newGoal;
  },
};
