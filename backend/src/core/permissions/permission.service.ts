import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ManagementService } from "../../management/management.service";

@Injectable()
export class PermissionService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => ManagementService))
    private managementService: ManagementService
  ) {}

  async isOwnerOrManager(requesterId: number, targetUserId: number) {
    if (requesterId === targetUserId) return true;
    
    // Verificar se requesterId é manager de targetUserId usando as regras de gerenciamento
    return await this.managementService.isSubordinate(requesterId, targetUserId);
  }

  /** Verifica se o usuário é gerente (role=MANAGER) da equipe */
  async isTeamManager(userId: number, teamId: number) {
    const membership = await this.prisma.teamMembership.findFirst({
      where: {
        teamId: BigInt(teamId),
        userId: BigInt(userId),
        role: "MANAGER",
      },
      select: { id: true },
    });
    return !!membership;
  }

  /** Pode gerenciar a equipe: admin global ou manager da equipe */
  async canManageTeam(userId: number, teamId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      select: { isAdmin: true },
    });
    if (user?.isAdmin) return true;
    return this.isTeamManager(userId, teamId);
  }
}
