// Sistema de XP - pontos por ação baseado em gamification.md
export const XP_SYSTEM = {
  // 🏗️ Desenvolvimento Pessoal (40% do XP total)
  pdi_milestone_completed: 100,
  competency_level_up: 75,
  key_result_achieved: 150,
  pdi_cycle_completed: 300,
  self_assessment_completed: 35,
  learning_goal_set: 30,
  pdi_meeting_documented: 45,

  // 🤝 Colaboração e Mentoring (35% do XP total)
  meaningful_feedback_given: 40,
  development_mentoring_session: 60,
  peer_development_support: 50,
  knowledge_sharing_session: 80,
  cross_team_collaboration: 70,
  junior_onboarding_support: 90,
  career_coaching_session: 80,
  performance_improvement_support: 100,

  // 👥 Contribuição para Equipe (25% do XP total)
  team_goal_contribution: 100,
  process_improvement: 120,
  team_retrospective_facilitation: 60,
  conflict_resolution_support: 80,
  team_culture_building: 50,
  documentation_contribution: 40,

  // Bonus XP para Learning Goals
  goal_completion_30_days: 50,
  goal_completion_early: 70,
  goal_shared_with_team: 20,
  goal_applied_at_work: 40,

  // Atividades básicas (mantidas para compatibilidade)
  login_daily: 5,
  profile_update: 15,
  first_login_week: 20,

  // Legacy (descontinuados, manter para compatibilidade)
  pdi_first_milestone: 50,
  pdi_competency_improved: 50,
  pdi_updated: 25,
  team_goal_achieved: 200,
  peer_feedback_given: 25,
  mentoring_session: 75,
  knowledge_sharing: 100,
  team_collaboration: 50,
  daily_activity: 10,
  weekly_goal_met: 50,
  monthly_consistency: 200,
  peer_recognition: 30,
  manager_commendation: 100,
  team_mvp: 500,
} as const;

// Cálculo de nível baseado em XP total
export function calculateLevel(totalXP: number): number {
  // Fórmula: level = sqrt(totalXP / 100)
  // Level 1 = 100 XP, Level 10 = 10,000 XP, Level 100 = 1,000,000 XP
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
}

// XP necessário para próximo nível
export function getXPForNextLevel(currentLevel: number): number {
  return Math.pow(currentLevel, 2) * 100;
}

// Títulos por nível
export function getLevelTitle(level: number): string {
  if (level <= 10) return "Junior Professional";
  if (level <= 25) return "Mid-Level Professional";
  if (level <= 40) return "Senior Specialist";
  if (level <= 55) return "Tech Lead";
  if (level <= 70) return "Senior Architect";
  if (level <= 85) return "Team Mentor";
  return "Master Professional";
}

// Badges disponíveis
export const BADGE_DEFINITIONS = [
  // Desenvolvimento
  {
    id: "first_milestone",
    name: "First Steps",
    description: "Complete seu primeiro milestone de PDI",
    icon: "🎯",
    rarity: "common" as const,
    category: "development",
    criteria: { type: "milestone_count", target: 1 },
  },
  {
    id: "milestone_master",
    name: "Milestone Master",
    description: "Complete 10 milestones de PDI",
    icon: "🏆",
    rarity: "rare" as const,
    category: "development",
    criteria: { type: "milestone_count", target: 10 },
  },
  {
    id: "pdi_starter",
    name: "PDI Starter",
    description: "Complete sua primeira milestone PDI",
    icon: "🌱",
    rarity: "common" as const,
    category: "development",
    criteria: { type: "pdi_first_milestone", target: 1 },
  },
  {
    id: "goal_crusher",
    name: "Goal Crusher",
    description: "Complete 5 milestones PDI em uma semana",
    icon: "💪",
    rarity: "epic" as const,
    category: "development",
    criteria: { type: "weekly_milestones", target: 5 },
  },
  {
    id: "development_master",
    name: "Development Master",
    description: "Complete um ciclo completo de PDI",
    icon: "🎖️",
    rarity: "epic" as const,
    category: "development",
    criteria: { type: "pdi_cycle_completed", target: 1 },
  },
  {
    id: "competency_builder",
    name: "Competency Builder",
    description: "Desenvolva 5 competências diferentes",
    icon: "📈",
    rarity: "rare" as const,
    category: "development",
    criteria: { type: "competency_count", target: 5 },
  },

  // Colaboração
  {
    id: "feedback_giver",
    name: "Feedback Champion",
    description: "Dê feedback 20 vezes",
    icon: "💬",
    rarity: "common" as const,
    category: "collaboration",
    criteria: { type: "feedback_count", target: 20 },
  },
  {
    id: "team_player",
    name: "Team Player",
    description: "Participe de 5 atividades colaborativas",
    icon: "🤝",
    rarity: "common" as const,
    category: "collaboration",
    criteria: { type: "collaboration_count", target: 5 },
  },
  {
    id: "peer_supporter",
    name: "Peer Supporter",
    description: "Dê feedback para 3 colegas de equipe",
    icon: "💭",
    rarity: "common" as const,
    category: "collaboration",
    criteria: { type: "peer_feedback_count", target: 3 },
  },
  {
    id: "knowledge_sharer",
    name: "Knowledge Sharer",
    description: "Compartilhe conhecimento em 5 sessões",
    icon: "📚",
    rarity: "rare" as const,
    category: "collaboration",
    criteria: { type: "knowledge_sharing_count", target: 5 },
  },

  // Team-focused badges
  {
    id: "team_booster",
    name: "Team Booster",
    description: "Ajude sua equipe a alcançar o top 3 do ranking",
    icon: "🚀",
    rarity: "epic" as const,
    category: "teamwork",
    criteria: { type: "team_ranking", target: 3 },
  },
  {
    id: "collaboration_champion",
    name: "Collaboration Champion",
    description: "Seja o maior colaborador da equipe por uma semana",
    icon: "👑",
    rarity: "rare" as const,
    category: "teamwork",
    criteria: { type: "team_top_contributor", target: 1 },
  },
  {
    id: "team_mentor",
    name: "Team Mentor",
    description: "Mentore 2 colegas de equipe em seu desenvolvimento",
    icon: "🎓",
    rarity: "epic" as const,
    category: "teamwork",
    criteria: { type: "team_mentoring", target: 2 },
  },
  {
    id: "bridge_builder",
    name: "Bridge Builder",
    description: "Colabore com 3 equipes diferentes",
    icon: "🌉",
    rarity: "epic" as const,
    category: "collaboration",
    criteria: { type: "cross_team_collaboration", target: 3 },
  },

  // Liderança
  {
    id: "mentor",
    name: "Mentor",
    description: "Ajude 3 colegas com seu desenvolvimento",
    icon: "🎓",
    rarity: "rare" as const,
    category: "leadership",
    criteria: { type: "mentoring_count", target: 3 },
  },
  {
    id: "team_leader",
    name: "Team Leader",
    description: "Lidere sua equipe para o primeiro lugar",
    icon: "🏆",
    rarity: "legendary" as const,
    category: "leadership",
    criteria: { type: "team_first_place", target: 1 },
  },

  // Especiais
  {
    id: "early_adopter",
    name: "Early Adopter",
    description: "Um dos primeiros 100 usuários da gamificação",
    icon: "🚀",
    rarity: "legendary" as const,
    category: "special",
    criteria: { type: "user_rank", target: 100 },
  },
] as const;

export type BadgeId = (typeof BADGE_DEFINITIONS)[number]["id"];
export type XPAction = keyof typeof XP_SYSTEM;

// 🛡️ Salvaguardas Anti-Gaming
export const WEEKLY_XP_CAPS = {
  // Colaboração
  meaningful_feedback_given: 200, // Máx 5 feedbacks/semana (40*5)
  development_mentoring_session: 180, // Máx 3 sessions/semana (60*3)
  peer_development_support: 150, // Máx 3 supports/semana (50*3)
  knowledge_sharing_session: 160, // Máx 2 workshops/semana (80*2)
  cross_team_collaboration: 140, // Máx 2 collaborations/mês (70*2)
  junior_onboarding_support: 90, // Máx 1 onboarding ativo por vez
  career_coaching_session: 80, // Máx 1 session/mês por pessoa
  performance_improvement_support: 100, // Baseado em resultados mensuráveis

  // Desenvolvimento Pessoal
  self_assessment_completed: 140, // Máx 4 assessments/mês (35*4)
  learning_goal_set: 30, // Máx 1 meta/semana
  pdi_meeting_documented: 45, // Máx 1 documentação/semana

  // Contribuição para Equipe
  process_improvement: 120, // Máx 1 improvement/mês
  team_retrospective_facilitation: 60, // Máx 1 facilitation/mês
  conflict_resolution_support: 80, // Máx 1 resolution/trimestre
  team_culture_building: 50, // Máx 1 initiative/trimestre
} as const;

export const COOLDOWNS = {
  // Anti-gaming específico
  meaningful_feedback_given: 72, // 72h entre feedbacks para mesma pessoa
  development_mentoring_session: 168, // 1 semana entre sessions com mesma pessoa
  peer_development_support: 24, // 24h entre diferentes tipos de suporte
  repeated_documentation_topic: 720, // 1 mês para mesmo tópico de documentação
} as const;

export const VALIDATION_REQUIREMENTS = {
  // Todas as ações precisam de validação
  meaningful_feedback_given: "peer_rating_4_plus", // Receptor avalia como útil ≥4.0/5
  development_mentoring_session: "colaborator_exceptional_rating", // ≥4.5/5
  career_coaching_session: "transformative_rating", // ≥4.5/5
  performance_improvement_support: "measurable_improvement + hr_validation",
  knowledge_sharing_session: "participant_rating_4_plus", // ≥4.0/5 dos participantes
  process_improvement: "team_validation + measurable_results",
  team_retrospective_facilitation: "team_rating_4_plus", // ≥4.0/5
  learning_goals: "completion_evidence + application_proof",
} as const;

// 📊 Categorias de XP
export const XP_CATEGORIES = {
  // Desenvolvimento Pessoal (40%)
  development: [
    "pdi_milestone_completed",
    "competency_level_up",
    "key_result_achieved",
    "pdi_cycle_completed",
    "self_assessment_completed",
    "learning_goal_set",
    "pdi_meeting_documented",
  ],

  // Colaboração e Mentoring (35%)
  collaboration: [
    "meaningful_feedback_given",
    "development_mentoring_session",
    "peer_development_support",
    "knowledge_sharing_session",
    "cross_team_collaboration",
    "junior_onboarding_support",
    "career_coaching_session",
    "performance_improvement_support",
  ],

  // Contribuição para Equipe (25%)
  teamwork: [
    "team_goal_contribution",
    "process_improvement",
    "team_retrospective_facilitation",
    "conflict_resolution_support",
    "team_culture_building",
    "documentation_contribution",
  ],

  // Bonus e especiais
  bonus: [
    "goal_completion_30_days",
    "goal_completion_early",
    "goal_shared_with_team",
    "goal_applied_at_work",
  ],
} as const;

// Configurações de validação e anti-gaming
export const ACTION_CONFIG = {
  // Cooldowns (em horas)
  COOLDOWNS: {
    meaningful_feedback_given: 72, // 3 dias
    development_mentoring_session: 168, // 7 dias
    peer_development_support: 24, // 1 dia
    knowledge_sharing_session: 168, // 7 dias
    cross_team_collaboration: 24, // 1 dia
    junior_onboarding_support: 72, // 3 dias
    career_coaching_session: 168, // 7 dias
    performance_improvement_support: 168, // 7 dias
    team_goal_contribution: 168, // 7 dias
    process_improvement: 168, // 7 dias
    team_retrospective_facilitation: 168, // 7 dias
    conflict_resolution_support: 72, // 3 dias
    team_culture_building: 24, // 1 dia
    documentation_contribution: 24, // 1 dia
  },

  // Caps semanais
  WEEKLY_CAPS: {
    meaningful_feedback_given: 5,
    development_mentoring_session: 3,
    peer_development_support: 10,
    knowledge_sharing_session: 2,
    cross_team_collaboration: 5,
    junior_onboarding_support: 2,
    career_coaching_session: 2,
    performance_improvement_support: 1,
    team_goal_contribution: 3,
    process_improvement: 2,
    team_retrospective_facilitation: 1,
    conflict_resolution_support: 3,
    team_culture_building: 7,
    documentation_contribution: 10,
  },

  // Ações que requerem evidência
  REQUIRES_EVIDENCE: [
    "knowledge_sharing_session",
    "process_improvement",
    "performance_improvement_support",
    "career_coaching_session",
    "junior_onboarding_support",
  ],

  // Ações que requerem validação por pares
  REQUIRES_VALIDATION: [
    "development_mentoring_session",
    "knowledge_sharing_session",
    "process_improvement",
    "performance_improvement_support",
    "career_coaching_session",
    "team_goal_contribution",
  ],

  // Ações elegíveis para multiplicadores
  MULTIPLIER_ELIGIBLE: {
    IC_LEADERSHIP: [
      "peer_development_support",
      "knowledge_sharing_session",
      "junior_onboarding_support",
      "team_culture_building",
      "conflict_resolution_support",
    ],
    MANAGER_PROCESS: [
      "process_improvement",
      "team_retrospective_facilitation",
      "performance_improvement_support",
      "team_goal_contribution",
    ],
  },

  // Rating mínimo para aprovação
  MIN_RATING: 4.0,
} as const;

// Tipos de ação com metadados
export const ACTION_TYPES = {
  meaningful_feedback_given: {
    name: "Feedback Significativo",
    description: "Dar feedback construtivo e específico para um colega",
    category: "collaboration",
    requiresEvidence: false,
    requiresValidation: false,
    cooldownHours: 72,
    weeklyLimit: 5,
    multiplierEligible: false,
  },
  development_mentoring_session: {
    name: "Sessão de Mentoria",
    description: "Conduzir uma sessão de mentoria focada em desenvolvimento",
    category: "mentoring",
    requiresEvidence: false,
    requiresValidation: true,
    cooldownHours: 168,
    weeklyLimit: 3,
    multiplierEligible: false,
  },
  peer_development_support: {
    name: "Suporte ao Desenvolvimento",
    description: "Ajudar um colega em seu desenvolvimento profissional",
    category: "collaboration",
    requiresEvidence: false,
    requiresValidation: false,
    cooldownHours: 24,
    weeklyLimit: 10,
    multiplierEligible: true, // Elegível para multiplicador IC
  },
  knowledge_sharing_session: {
    name: "Compartilhamento de Conhecimento",
    description: "Realizar apresentação ou workshop para a equipe",
    category: "collaboration",
    requiresEvidence: true,
    requiresValidation: true,
    cooldownHours: 168,
    weeklyLimit: 2,
    multiplierEligible: true, // Elegível para multiplicador IC
  },
  cross_team_collaboration: {
    name: "Colaboração Entre Equipes",
    description: "Trabalhar efetivamente com outras equipes",
    category: "collaboration",
    requiresEvidence: false,
    requiresValidation: false,
    cooldownHours: 24,
    weeklyLimit: 5,
    multiplierEligible: false,
  },
  junior_onboarding_support: {
    name: "Suporte de Onboarding",
    description: "Ajudar novos membros da equipe ou júniores",
    category: "mentoring",
    requiresEvidence: true,
    requiresValidation: false,
    cooldownHours: 72,
    weeklyLimit: 2,
    multiplierEligible: true, // Elegível para multiplicador IC
  },
  career_coaching_session: {
    name: "Coaching de Carreira",
    description: "Sessão de coaching focada em carreira e crescimento",
    category: "mentoring",
    requiresEvidence: true,
    requiresValidation: true,
    cooldownHours: 168,
    weeklyLimit: 2,
    multiplierEligible: false,
  },
  performance_improvement_support: {
    name: "Suporte para Melhoria de Performance",
    description: "Ajudar alguém a melhorar sua performance",
    category: "mentoring",
    requiresEvidence: true,
    requiresValidation: true,
    cooldownHours: 168,
    weeklyLimit: 1,
    multiplierEligible: false,
  },
  team_goal_contribution: {
    name: "Contribuição para Meta da Equipe",
    description: "Contribuir significativamente para uma meta da equipe",
    category: "team",
    requiresEvidence: false,
    requiresValidation: true,
    cooldownHours: 168,
    weeklyLimit: 3,
    multiplierEligible: true, // Elegível para multiplicador Manager
  },
  process_improvement: {
    name: "Melhoria de Processo",
    description: "Implementar uma melhoria de processo que beneficia a equipe",
    category: "team",
    requiresEvidence: true,
    requiresValidation: true,
    cooldownHours: 168,
    weeklyLimit: 2,
    multiplierEligible: true, // Elegível para multiplicador Manager
  },
  team_retrospective_facilitation: {
    name: "Facilitação de Retrospectiva",
    description: "Facilitar uma retrospectiva ou reunião de melhoria da equipe",
    category: "team",
    requiresEvidence: false,
    requiresValidation: false,
    cooldownHours: 168,
    weeklyLimit: 1,
    multiplierEligible: true, // Elegível para multiplicador Manager
  },
  conflict_resolution_support: {
    name: "Resolução de Conflito",
    description: "Ajudar a resolver conflitos ou tensões na equipe",
    category: "team",
    requiresEvidence: false,
    requiresValidation: false,
    cooldownHours: 72,
    weeklyLimit: 3,
    multiplierEligible: true, // Elegível para multiplicador IC
  },
  team_culture_building: {
    name: "Construção de Cultura",
    description: "Contribuir para a cultura positiva da equipe",
    category: "team",
    requiresEvidence: false,
    requiresValidation: false,
    cooldownHours: 24,
    weeklyLimit: 7,
    multiplierEligible: true, // Elegível para multiplicador IC
  },
  documentation_contribution: {
    name: "Contribuição de Documentação",
    description: "Criar ou melhorar documentação importante",
    category: "team",
    requiresEvidence: false,
    requiresValidation: false,
    cooldownHours: 24,
    weeklyLimit: 10,
    multiplierEligible: false,
  },
} as const;
