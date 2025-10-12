import { Injectable, Logger } from "@nestjs/common";
import {
  ProfileDetectorService,
  UserProfile,
} from "./profile-detector.service";
import { ACTION_CONFIG } from "./constants";

interface MultiplierResult {
  originalXP: number;
  finalXP: number;
  multiplier: number;
  appliedMultipliers: AppliedMultiplier[];
}

export { MultiplierResult };

interface AppliedMultiplier {
  type: "IC_LEADERSHIP" | "MANAGER_PROCESS";
  percentage: number;
  reason: string;
}

@Injectable()
export class MultiplierService {
  private readonly logger = new Logger(MultiplierService.name);

  constructor(private profileDetector: ProfileDetectorService) {}

  /**
   * Obtém informações básicas de perfil do usuário
   */
  async getUserProfileInfo(userId: number) {
    const [profile, details] = await Promise.all([
      this.profileDetector.detectUserProfile(userId),
      this.profileDetector.getManagerDetails(userId),
    ]);

    return { profile, details };
  }

  /**
   * Aplica multiplicadores baseados no perfil do usuário e tipo de ação
   */
  async applyMultipliers(
    userId: number,
    action: string,
    baseXP: number
  ): Promise<MultiplierResult> {
    const originalXP = baseXP;
    let finalXP = baseXP;
    const appliedMultipliers: AppliedMultiplier[] = [];

    // Detectar perfil do usuário
    const userProfile = await this.profileDetector.detectUserProfile(userId);

    // Aplicar multiplicadores baseados no perfil
    if (userProfile === "IC") {
      const icMultiplier = this.getICLeadershipMultiplier(action);
      if (icMultiplier.applies) {
        finalXP = Math.floor(finalXP * icMultiplier.multiplier);
        appliedMultipliers.push({
          type: "IC_LEADERSHIP",
          percentage: (icMultiplier.multiplier - 1) * 100,
          reason: icMultiplier.reason,
        });
      }
    } else if (userProfile === "MANAGER") {
      const managerMultiplier = this.getManagerProcessMultiplier(action);
      if (managerMultiplier.applies) {
        finalXP = Math.floor(finalXP * managerMultiplier.multiplier);
        appliedMultipliers.push({
          type: "MANAGER_PROCESS",
          percentage: (managerMultiplier.multiplier - 1) * 100,
          reason: managerMultiplier.reason,
        });
      }
    }

    const totalMultiplier = finalXP / originalXP;

    this.logger.debug(
      `Multiplier applied for user ${userId} (${userProfile}): ${originalXP} → ${finalXP} (${totalMultiplier.toFixed(
        2
      )}x)`
    );

    return {
      originalXP,
      finalXP,
      multiplier: totalMultiplier,
      appliedMultipliers,
    };
  }

  /**
   * Verifica multiplicador de liderança por influência para ICs
   * IC: +30% em ações de liderança por influência
   */
  private getICLeadershipMultiplier(action: string): {
    applies: boolean;
    multiplier: number;
    reason: string;
  } {
    const icLeadershipActions = ACTION_CONFIG.MULTIPLIER_ELIGIBLE.IC_LEADERSHIP;

    if (icLeadershipActions.includes(action as any)) {
      return {
        applies: true,
        multiplier: 1.3, // +30%
        reason:
          "Liderança por influência (IC demonstrando capacidades de liderança)",
      };
    }

    return {
      applies: false,
      multiplier: 1.0,
      reason: "",
    };
  }

  /**
   * Verifica multiplicador de processo para Managers
   * Manager: +100% em melhorias de processo com impacto
   */
  private getManagerProcessMultiplier(action: string): {
    applies: boolean;
    multiplier: number;
    reason: string;
  } {
    const managerProcessActions =
      ACTION_CONFIG.MULTIPLIER_ELIGIBLE.MANAGER_PROCESS;

    if (managerProcessActions.includes(action as any)) {
      return {
        applies: true,
        multiplier: 2.0, // +100%
        reason: "Melhoria de processo (Manager com impacto organizacional)",
      };
    }

    return {
      applies: false,
      multiplier: 1.0,
      reason: "",
    };
  }

  /**
   * Obtém informações sobre multiplicadores disponíveis para um usuário
   */
  async getUserMultiplierInfo(userId: number): Promise<{
    profile: UserProfile;
    availableMultipliers: {
      type: "IC_LEADERSHIP" | "MANAGER_PROCESS";
      percentage: number;
      description: string;
      eligibleActions: string[];
    }[];
  }> {
    const profile = await this.profileDetector.detectUserProfile(userId);
    const availableMultipliers: {
      type: "IC_LEADERSHIP" | "MANAGER_PROCESS";
      percentage: number;
      description: string;
      eligibleActions: string[];
    }[] = [];

    if (profile === "IC") {
      availableMultipliers.push({
        type: "IC_LEADERSHIP",
        percentage: 30,
        description:
          "Bônus por demonstrar liderança por influência sem autoridade formal",
        eligibleActions: [...ACTION_CONFIG.MULTIPLIER_ELIGIBLE.IC_LEADERSHIP],
      });
    } else if (profile === "MANAGER") {
      availableMultipliers.push({
        type: "MANAGER_PROCESS",
        percentage: 100,
        description:
          "Bônus por melhorias de processo com impacto organizacional",
        eligibleActions: [...ACTION_CONFIG.MULTIPLIER_ELIGIBLE.MANAGER_PROCESS],
      });
    }

    return {
      profile,
      availableMultipliers,
    };
  }

  /**
   * Simula multiplicadores para uma ação sem aplicar
   */
  async simulateMultipliers(
    userId: number,
    action: string,
    baseXP: number
  ): Promise<MultiplierResult> {
    // Usar o mesmo método de aplicação, mas apenas para simulação
    return this.applyMultipliers(userId, action, baseXP);
  }

  /**
   * Obtém estatísticas de multiplicadores aplicados
   */
  async getMultiplierStats(
    userId: number,
    period: "week" | "month" | "all" = "week"
  ): Promise<{
    totalActionsWithMultiplier: number;
    averageMultiplier: number;
    totalBonusXP: number;
    breakdown: {
      type: "IC_LEADERSHIP" | "MANAGER_PROCESS";
      count: number;
      totalBonusXP: number;
    }[];
  }> {
    // Esta função seria implementada quando tivermos histórico de XP com multiplicadores
    // Por enquanto, retorna dados mock para demonstração
    const userProfile = await this.profileDetector.detectUserProfile(userId);

    if (userProfile === "IC") {
      return {
        totalActionsWithMultiplier: 3,
        averageMultiplier: 1.3,
        totalBonusXP: 45, // 30% de 150 XP base
        breakdown: [
          {
            type: "IC_LEADERSHIP",
            count: 3,
            totalBonusXP: 45,
          },
        ],
      };
    } else {
      return {
        totalActionsWithMultiplier: 2,
        averageMultiplier: 2.0,
        totalBonusXP: 240, // 100% de 240 XP base
        breakdown: [
          {
            type: "MANAGER_PROCESS",
            count: 2,
            totalBonusXP: 240,
          },
        ],
      };
    }
  }

  /**
   * Verifica se uma ação é elegível para multiplicador baseado no perfil
   */
  async isActionEligibleForMultiplier(
    userId: number,
    action: string
  ): Promise<{
    eligible: boolean;
    multiplierType?: "IC_LEADERSHIP" | "MANAGER_PROCESS";
    percentage?: number;
    description?: string;
  }> {
    const userProfile = await this.profileDetector.detectUserProfile(userId);

    if (userProfile === "IC") {
      const icMultiplier = this.getICLeadershipMultiplier(action);
      if (icMultiplier.applies) {
        return {
          eligible: true,
          multiplierType: "IC_LEADERSHIP",
          percentage: 30,
          description: icMultiplier.reason,
        };
      }
    } else if (userProfile === "MANAGER") {
      const managerMultiplier = this.getManagerProcessMultiplier(action);
      if (managerMultiplier.applies) {
        return {
          eligible: true,
          multiplierType: "MANAGER_PROCESS",
          percentage: 100,
          description: managerMultiplier.reason,
        };
      }
    }

    return { eligible: false };
  }

  /**
   * Obtém detalhes completos sobre multiplicadores para dashboard
   */
  async getMultiplierDashboard(userId: number): Promise<{
    userProfile: UserProfile;
    profileDetails: {
      isManager: boolean;
      reasons: string[];
      subordinatesCount: number;
      teamsManaged: number;
    };
    availableMultipliers: {
      type: string;
      percentage: number;
      description: string;
      eligibleActions: {
        action: string;
        name: string;
        baseXP: number;
        multipliedXP: number;
      }[];
    }[];
    recentMultipliers: {
      action: string;
      originalXP: number;
      finalXP: number;
      multiplier: number;
      date: Date;
    }[];
  }> {
    const [userProfile, profileDetails, multiplierInfo] = await Promise.all([
      this.profileDetector.detectUserProfile(userId),
      this.profileDetector.getManagerDetails(userId),
      this.getUserMultiplierInfo(userId),
    ]);

    // Construir informações das ações elegíveis
    const availableMultipliers = multiplierInfo.availableMultipliers.map(
      (multiplier) => ({
        type: multiplier.type,
        percentage: multiplier.percentage,
        description: multiplier.description,
        eligibleActions: multiplier.eligibleActions.map((action) => {
          // Simular XP base (seria obtido das constantes)
          const baseXP = this.getBaseXPForAction(action);
          const multipliedXP = Math.floor(
            baseXP * (1 + multiplier.percentage / 100)
          );

          return {
            action,
            name: this.getActionDisplayName(action),
            baseXP,
            multipliedXP,
          };
        }),
      })
    );

    // Multiplicadores recentes seriam obtidos do histórico (mock por enquanto)
    const recentMultipliers = [
      // Dados de exemplo seriam carregados do banco
    ];

    return {
      userProfile,
      profileDetails,
      availableMultipliers,
      recentMultipliers,
    };
  }

  /**
   * Helper: Obtém XP base para uma ação (mock por enquanto)
   */
  private getBaseXPForAction(action: string): number {
    const xpValues: Record<string, number> = {
      peer_development_support: 50,
      knowledge_sharing_session: 80,
      junior_onboarding_support: 90,
      team_culture_building: 50,
      conflict_resolution_support: 80,
      process_improvement: 120,
      team_goal_contribution: 100,
      team_retrospective_facilitation: 60,
      performance_improvement_support: 100,
    };

    return xpValues[action] || 50;
  }

  /**
   * Helper: Obtém nome de exibição para uma ação
   */
  private getActionDisplayName(action: string): string {
    const displayNames: Record<string, string> = {
      peer_development_support: "Suporte ao Desenvolvimento",
      knowledge_sharing_session: "Compartilhamento de Conhecimento",
      junior_onboarding_support: "Suporte de Onboarding",
      team_culture_building: "Construção de Cultura",
      conflict_resolution_support: "Resolução de Conflito",
      process_improvement: "Melhoria de Processo",
      team_goal_contribution: "Contribuição para Meta da Equipe",
      team_retrospective_facilitation: "Facilitação de Retrospectiva",
      performance_improvement_support: "Suporte para Melhoria de Performance",
    };

    return displayNames[action] || action;
  }
}
