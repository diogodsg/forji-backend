import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";

export type UserProfile = "IC" | "MANAGER";

interface ProfileCache {
  userId: number;
  profile: UserProfile;
  cachedAt: Date;
  expiresAt: Date;
}

@Injectable()
export class ProfileDetectorService {
  private readonly logger = new Logger(ProfileDetectorService.name);
  private readonly profileCache = new Map<number, ProfileCache>();
  private readonly CACHE_TTL_HOURS = 24;

  constructor(private prisma: PrismaService) {}

  /**
   * Detecta automaticamente o perfil de um usuário (IC ou Manager)
   * com cache de 24h para performance
   */
  async detectUserProfile(userId: number): Promise<UserProfile> {
    // Verificar cache primeiro
    const cached = this.getCachedProfile(userId);
    if (cached) {
      this.logger.debug(`Profile cache hit for user ${userId}: ${cached}`);
      return cached;
    }

    // Detectar perfil e cachear
    const profile = await this.detectProfileFromDatabase(userId);
    this.cacheProfile(userId, profile);

    this.logger.debug(`Profile detected for user ${userId}: ${profile}`);
    return profile;
  }

  /**
   * Detecta perfil baseado em dados do banco
   */
  private async detectProfileFromDatabase(
    userId: number
  ): Promise<UserProfile> {
    // 1. Verificar se tem subordinados diretos via ManagementRule
    const hasSubordinates = await this.hasDirectSubordinates(userId);
    if (hasSubordinates) {
      return "MANAGER";
    }

    // 2. Verificar se é manager de alguma equipe
    const isTeamManager = await this.isManagerOfTeam(userId);
    if (isTeamManager) {
      return "MANAGER";
    }

    // 3. Verificar se tem role MANAGER em alguma equipe
    const hasManagerRole = await this.hasManagerRoleInTeam(userId);
    if (hasManagerRole) {
      return "MANAGER";
    }

    // 4. Verificar se é admin do sistema
    const isAdmin = await this.isSystemAdmin(userId);
    if (isAdmin) {
      return "MANAGER";
    }

    // Por padrão, é IC (Individual Contributor)
    return "IC";
  }

  /**
   * Verifica se usuário tem subordinados diretos
   */
  private async hasDirectSubordinates(userId: number): Promise<boolean> {
    const subordinatesCount = await this.prisma.managementRule.count({
      where: {
        managerId: userId,
        ruleType: "INDIVIDUAL",
        deleted_at: null,
      },
    });

    return subordinatesCount > 0;
  }

  /**
   * Verifica se usuário é manager de alguma equipe via ManagementRule
   */
  private async isManagerOfTeam(userId: number): Promise<boolean> {
    const teamManagementCount = await this.prisma.managementRule.count({
      where: {
        managerId: userId,
        ruleType: "TEAM",
        deleted_at: null,
      },
    });

    return teamManagementCount > 0;
  }

  /**
   * Verifica se usuário tem role MANAGER em alguma equipe
   */
  private async hasManagerRoleInTeam(userId: number): Promise<boolean> {
    const managerMemberships = await this.prisma.teamMembership.count({
      where: {
        userId,
        role: "MANAGER",
        deleted_at: null,
      },
    });

    return managerMemberships > 0;
  }

  /**
   * Verifica se usuário é admin do sistema
   */
  private async isSystemAdmin(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { isAdmin: true },
    });

    return user?.isAdmin || false;
  }

  /**
   * Obtém perfil do cache se válido
   */
  private getCachedProfile(userId: number): UserProfile | null {
    const cached = this.profileCache.get(userId);

    if (!cached) {
      return null;
    }

    const now = new Date();
    if (now > cached.expiresAt) {
      // Cache expirado, remover
      this.profileCache.delete(userId);
      return null;
    }

    return cached.profile;
  }

  /**
   * Cacheia perfil com TTL
   */
  private cacheProfile(userId: number, profile: UserProfile): void {
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + this.CACHE_TTL_HOURS * 60 * 60 * 1000
    );

    this.profileCache.set(userId, {
      userId,
      profile,
      cachedAt: now,
      expiresAt,
    });

    this.logger.debug(
      `Profile cached for user ${userId}: ${profile}, expires at ${expiresAt}`
    );
  }

  /**
   * Invalida cache de um usuário específico
   */
  invalidateUserCache(userId: number): void {
    this.profileCache.delete(userId);
    this.logger.debug(`Profile cache invalidated for user ${userId}`);
  }

  /**
   * Invalida todo o cache
   */
  invalidateAllCache(): void {
    this.profileCache.clear();
    this.logger.debug("All profile cache invalidated");
  }

  /**
   * Obtém estatísticas do cache
   */
  getCacheStats(): {
    totalCached: number;
    icCount: number;
    managerCount: number;
    expiredCount: number;
  } {
    const now = new Date();
    let icCount = 0;
    let managerCount = 0;
    let expiredCount = 0;

    for (const cached of this.profileCache.values()) {
      if (now > cached.expiresAt) {
        expiredCount++;
      } else {
        if (cached.profile === "IC") {
          icCount++;
        } else {
          managerCount++;
        }
      }
    }

    return {
      totalCached: this.profileCache.size,
      icCount,
      managerCount,
      expiredCount,
    };
  }

  /**
   * Detecta perfil para múltiplos usuários em batch
   */
  async detectMultipleUserProfiles(
    userIds: number[]
  ): Promise<Map<number, UserProfile>> {
    const results = new Map<number, UserProfile>();

    // Processar em paralelo com limite para não sobrecarregar o banco
    const BATCH_SIZE = 10;
    const batches: number[][] = [];

    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      batches.push(userIds.slice(i, i + BATCH_SIZE));
    }

    for (const batch of batches) {
      const promises = batch.map(async (userId) => {
        const profile = await this.detectUserProfile(userId);
        return { userId, profile };
      });

      const batchResults = await Promise.all(promises);

      for (const { userId, profile } of batchResults) {
        results.set(userId, profile);
      }
    }

    this.logger.debug(
      `Detected profiles for ${userIds.length} users in ${batches.length} batches`
    );
    return results;
  }

  /**
   * Obtém dados detalhados sobre por que um usuário é Manager
   */
  async getManagerDetails(userId: number): Promise<{
    isManager: boolean;
    reasons: string[];
    subordinatesCount: number;
    teamsManaged: number;
    managerRoles: number;
    isAdmin: boolean;
  }> {
    const [subordinatesCount, teamsManaged, managerRoles, user] =
      await Promise.all([
        this.prisma.managementRule.count({
          where: {
            managerId: userId,
            ruleType: "INDIVIDUAL",
            deleted_at: null,
          },
        }),
        this.prisma.managementRule.count({
          where: {
            managerId: userId,
            ruleType: "TEAM",
            deleted_at: null,
          },
        }),
        this.prisma.teamMembership.count({
          where: {
            userId,
            role: "MANAGER",
            deleted_at: null,
          },
        }),
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { isAdmin: true },
        }),
      ]);

    const isAdmin = user?.isAdmin || false;
    const reasons: string[] = [];

    if (subordinatesCount > 0) {
      reasons.push(`Gerencia ${subordinatesCount} subordinado(s) direto(s)`);
    }
    if (teamsManaged > 0) {
      reasons.push(`Gerencia ${teamsManaged} equipe(s)`);
    }
    if (managerRoles > 0) {
      reasons.push(`Tem role de manager em ${managerRoles} equipe(s)`);
    }
    if (isAdmin) {
      reasons.push("É administrador do sistema");
    }

    const isManager =
      subordinatesCount > 0 || teamsManaged > 0 || managerRoles > 0 || isAdmin;

    return {
      isManager,
      reasons,
      subordinatesCount,
      teamsManaged,
      managerRoles,
      isAdmin,
    };
  }
}
