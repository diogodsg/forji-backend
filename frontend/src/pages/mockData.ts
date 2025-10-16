/**
 * Mock Data for CurrentCyclePageOptimized
 *
 * Dados de exemplo para desenvolvimento e testes da página de ciclo atual.
 * TODO: Substituir por dados reais da API em produção.
 */

export const mockUserData = {
  name: "João Silva",
  initials: "JS",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao",
  level: 12,
  currentXP: 2840,
  nextLevelXP: 3200,
  rank: "Senior Developer",
  totalPoints: 15420,
};

export const mockCycleData = {
  name: "Q4 2024 - Excelência Técnica",
  progress: 68,
  xpCurrent: 2840,
  xpNextLevel: 3200,
  currentLevel: 12,
  daysLeft: 45,
  daysRemaining: 45,
  achievements: 12,
  streak: 7,
};

export const mockGoalsData = [
  {
    id: "goal-1",
    title: "Aumentar produtividade",
    description: "Entregar 15 pull requests de qualidade",
    progress: 60, // 9 de 15 PRs = 60%
    lastUpdate: new Date(), // hoje
    status: "on-track" as const,
    type: "increase" as const,
    currentValue: 9,
    targetValue: 15,
    startValue: 0,
    unit: "PRs",
  },
  {
    id: "goal-2",
    title: "Reduzir bugs em produção",
    description: "Diminuir de 20 para 10 bugs críticos",
    progress: 50, // De 20 para 15 bugs = 50% da redução
    lastUpdate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    status: "on-track" as const,
    type: "decrease" as const,
    currentValue: 15,
    targetValue: 10,
    startValue: 20,
    unit: "bugs críticos",
  },
  {
    id: "goal-3",
    title: "Aumentar cobertura de testes",
    description: "Atingir 90% de cobertura de código",
    progress: 78, // 78% de cobertura atual
    lastUpdate: new Date(), // hoje
    status: "on-track" as const,
    type: "percentage" as const,
    targetValue: 90,
    unit: "% de cobertura",
  },
  {
    id: "goal-4",
    title: "Obter certificação AWS",
    description: "Conquistar AWS Solutions Architect Associate",
    progress: 0, // Ainda não obtida
    lastUpdate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
    status: "needs-attention" as const,
    type: "binary" as const,
  },
];

export const mockCompetenciesData = [
  {
    id: "comp-1",
    name: "Liderança de Times",
    category: "leadership" as const,
    currentLevel: 2,
    targetLevel: 3,
    currentProgress: 60,
    nextMilestone: "", // Campo legado - não exibido no UI
    totalXP: 840,
  },
  {
    id: "comp-2",
    name: "Arquitetura de Software",
    category: "technical" as const,
    currentLevel: 3,
    targetLevel: 4,
    currentProgress: 40,
    nextMilestone: "", // Campo legado - não exibido no UI
    totalXP: 1200,
  },
  {
    id: "comp-3",
    name: "Comunicação e Empatia",
    category: "behavioral" as const,
    currentLevel: 4,
    targetLevel: 5,
    currentProgress: 75,
    nextMilestone: "", // Campo legado - não exibido no UI
    totalXP: 800,
  },
];

export const mockActivitiesData = [
  {
    id: "act-1",
    type: "oneOnOne" as const,
    title: "1:1 com Maria Silva",
    person: "Maria Silva",
    xpEarned: 50,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    duration: 45,
    // Campos específicos de 1:1
    workingOn: [
      "Refatoração do módulo de autenticação",
      "Implementação de testes E2E no projeto React",
      "Estudos sobre padrões de design avançados",
    ],
    generalNotes:
      "Conversa muito produtiva focada no desenvolvimento de carreira da Maria. Discutimos suas aspirações de se tornar tech lead e os próximos passos necessários para alcançar este objetivo. Maria demonstrou bastante maturidade técnica e liderança natural ao conduzir as dailies.",
    positivePoints: [
      "Excelente proatividade ao propor melhorias no código",
      "Ótima comunicação com o time durante as dailies",
      "Demonstrou domínio técnico no projeto React",
    ],
    improvementPoints: [
      "Trabalhar na confiança para tomar decisões de arquitetura sozinha",
      "Participar mais ativamente das discussões técnicas de design",
      "Documentar melhor as decisões técnicas tomadas",
    ],
    nextSteps: [
      "Estudar padrões de design avançados (Livro: Design Patterns)",
      "Liderar próximo refinamento técnico da equipe",
      "Criar apresentação sobre arquitetura limpa para o time",
    ],
  },
  {
    id: "act-2",
    type: "mentoring" as const,
    title: "Mentoria: João Santos",
    person: "João Santos",
    topics: ["Clean Code", "SOLID Principles"],
    progress: { from: 60, to: 75 },
    xpEarned: 35,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
    description:
      "Sessão prática de code review focada em aplicar princípios SOLID no projeto atual. João demonstrou excelente compreensão dos conceitos.",
    duration: 60,
    outcomes:
      "João conseguiu refatorar 3 classes aplicando Single Responsibility Principle",
    nextSteps: [
      "Aplicar Dependency Inversion no módulo de autenticação",
      "Estudar Open/Closed Principle para próxima sessão",
    ],
  },
  {
    id: "act-3",
    type: "certification" as const,
    title: "AWS Solutions Architect",
    outcomes: "Certificação obtida com 92% de aproveitamento",
    rating: 5,
    xpEarned: 100,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
    description:
      "Certificação AWS Solutions Architect Associate conquistada após 3 meses de estudos intensivos. Prova realizada no centro Pearson Vue.",
    topics: ["EC2", "S3", "Lambda", "VPC", "CloudFormation"],
    nextSteps: [
      "Aplicar conhecimentos no projeto de migração cloud",
      "Iniciar estudos para certificação Professional",
      "Compartilhar aprendizados com o time",
    ],
  },
];
