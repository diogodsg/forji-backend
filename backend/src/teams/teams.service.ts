import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { PermissionService } from "../core/permissions/permission.service";
import { CreateTeamDto, UpdateTeamDto, TeamRoleDto } from "../dto/team.dto";
import { SoftDeleteService } from "../common/prisma/soft-delete.extension";

@Injectable()
export class TeamsService extends SoftDeleteService {
  constructor(prisma: PrismaService, private permissions: PermissionService) {
    super(prisma);
  }

  private normalizeTeam(raw: any, summaryOnly: boolean) {
    if (!raw) return raw;
    // Prisma relation now is TeamMembership[] with nested User; we expose legacy shape 'memberships'
    const membershipsSrc: any[] = raw.TeamMembership || [];
    const memberships = membershipsSrc.map((m) => {
      if (summaryOnly) {
        return { role: m.role };
      }
      return {
        role: m.role,
        user: m.User ? { ...m.User } : undefined,
      };
    });
    const { TeamMembership, ...rest } = raw;
    return { ...rest, memberships };
  }

  list(summaryOnly = false) {
    return (this.prisma as any).team
      .findMany({
        where: this.addSoftDeleteFilter({}),
        orderBy: { id: "asc" },
        include: summaryOnly
          ? {
              TeamMembership: {
                where: this.addSoftDeleteFilter({}),
                select: { role: true },
              },
            }
          : {
              TeamMembership: {
                where: this.addSoftDeleteFilter({}),
                include: {
                  User: { select: { id: true, name: true, email: true } },
                },
                orderBy: { createdAt: "asc" },
              },
            },
      })
      .then((teams: any[]) =>
        teams.map((t) => this.normalizeTeam(t, summaryOnly))
      );
  }

  listManagedBy(userId: number) {
    return (this.prisma as any).team
      .findMany({
        orderBy: { id: "asc" },
        where: {
          TeamMembership: {
            some: { userId: BigInt(userId), role: "MANAGER", deleted_at: null },
          },
          deleted_at: null,
        },
        include: {
          TeamMembership: {
            select: { role: true },
            where: { deleted_at: null },
          },
        },
      })
      .then((teams: any[]) => teams.map((t) => this.normalizeTeam(t, true)));
  }

  async metrics() {
    const [teams, memberships, users] = await Promise.all([
      (this.prisma as any).team.findMany({
        select: { id: true, createdAt: true },
      }),
      (this.prisma as any).teamMembership.findMany({
        select: { role: true, userId: true },
      }),
      (this.prisma as any).user.findMany({ select: { id: true } }),
    ]);
    const totalTeams = teams.length;
    const totalManagers = memberships.filter(
      (m: any) => m.role === "MANAGER"
    ).length;
    const totalMembers = memberships.length;
    const userIdsWithTeam = new Set(
      memberships.map((m: any) => String(m.userId))
    );
    const usersWithoutTeam = users.filter(
      (u: any) => !userIdsWithTeam.has(String(u.id))
    ).length;
    const lastTeam =
      teams.sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1))[0] ||
      null;
    return {
      totalTeams,
      totalManagers,
      totalMembers,
      usersWithoutTeam,
      lastTeamCreatedAt: lastTeam?.createdAt || null,
    };
  }

  async get(id: number) {
    const teamRaw = await (this.prisma as any).team.findFirst({
      where: this.addSoftDeleteFilter({ id: BigInt(id) }),
      include: {
        TeamMembership: {
          where: this.addSoftDeleteFilter({}),
          include: { User: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!teamRaw) throw new NotFoundException("Team not found");
    return this.normalizeTeam(teamRaw, false);
  }

  async create(data: CreateTeamDto, requesterId: number) {
    // Criador se torna MANAGER automaticamente
    const created = await (this.prisma as any).team.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim(),
        TeamMembership: {
          create: { userId: BigInt(requesterId), role: "MANAGER" },
        },
      },
      include: {
        TeamMembership: {
          include: { User: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    return this.normalizeTeam(created, false);
  }

  async update(id: number, data: UpdateTeamDto, requesterId: number) {
    const can = await this.permissions.canManageTeam(requesterId, id);
    if (!can) throw new BadRequestException("Not allowed");
    const updated = await (this.prisma as any).team.update({
      where: { id: BigInt(id) },
      data: {
        name: data.name?.trim(),
        description:
          data.description === undefined
            ? undefined
            : data.description?.trim() || null,
      },
      include: {
        TeamMembership: {
          include: { User: { select: { id: true, name: true, email: true } } },
        },
      },
    });
    return this.normalizeTeam(updated, false);
  }

  async delete(id: number, requesterId: number) {
    const can = await this.permissions.canManageTeam(requesterId, id);
    if (!can) throw new BadRequestException("Not allowed");

    // Verificar se a equipe existe
    const team = await (this.prisma as any).team.findFirst({
      where: this.addSoftDeleteFilter({ id: BigInt(id) }),
    });
    if (!team) throw new NotFoundException("Team not found");

    // Usar transação para garantir atomicidade (soft delete)
    await (this.prisma as any).$transaction(async (tx: any) => {
      // Primeiro, soft delete todos os memberships da equipe
      await tx.teamMembership.updateMany({
        where: { teamId: BigInt(id), deleted_at: null },
        data: { deleted_at: new Date() },
      });

      // Depois, soft delete a equipe
      await tx.team.update({
        where: { id: BigInt(id) },
        data: { deleted_at: new Date() },
      });
    });

    return { deleted: true };
  }

  // Método para hard delete (apenas para admin)
  async hardDeleteTeam(id: number, requesterId: number) {
    const can = await this.permissions.canManageTeam(requesterId, id);
    if (!can) throw new BadRequestException("Not allowed");

    // Usar transação para garantir atomicidade (hard delete)
    await (this.prisma as any).$transaction(async (tx: any) => {
      // Primeiro, remover todos os memberships da equipe
      await tx.teamMembership.deleteMany({
        where: { teamId: BigInt(id) },
      });

      // Depois, deletar a equipe
      await tx.team.delete({ where: { id: BigInt(id) } });
    });

    return { deleted: true };
  }

  // Método para restaurar equipe
  async restoreTeam(id: number, requesterId: number) {
    const can = await this.permissions.canManageTeam(requesterId, id);
    if (!can) throw new BadRequestException("Not allowed");

    // Verificar se a equipe existe e está deletada
    const team = await (this.prisma as any).team.findFirst({
      where: { id: BigInt(id), deleted_at: { not: null } },
    });
    if (!team) throw new NotFoundException("Deleted team not found");

    // Restaurar equipe e seus memberships
    await (this.prisma as any).$transaction(async (tx: any) => {
      // Restaurar a equipe
      await tx.team.update({
        where: { id: BigInt(id) },
        data: { deleted_at: null },
      });

      // Restaurar memberships que foram deletados junto
      await tx.teamMembership.updateMany({
        where: { teamId: BigInt(id), deleted_at: team.deleted_at },
        data: { deleted_at: null },
      });
    });

    return { restored: true };
  }

  async addMember(
    teamId: number,
    userId: number,
    role: TeamRoleDto | undefined,
    requesterId: number
  ) {
    const can = await this.permissions.canManageTeam(requesterId, teamId);
    if (!can) throw new BadRequestException("Not allowed");
    const existing = await (this.prisma as any).teamMembership.findFirst({
      where: this.addSoftDeleteFilter({
        teamId: BigInt(teamId),
        userId: BigInt(userId),
      }),
    });
    if (existing) throw new BadRequestException("User already in team");
    await (this.prisma as any).teamMembership.create({
      data: {
        teamId: BigInt(teamId),
        userId: BigInt(userId),
        role: role || "MEMBER",
      },
    });
    return this.get(teamId);
  }

  async updateMemberRole(
    teamId: number,
    userId: number,
    role: TeamRoleDto,
    requesterId: number
  ) {
    const can = await this.permissions.canManageTeam(requesterId, teamId);
    if (!can) throw new BadRequestException("Not allowed");
    const membership = await (this.prisma as any).teamMembership.findFirst({
      where: this.addSoftDeleteFilter({
        teamId: BigInt(teamId),
        userId: BigInt(userId),
      }),
    });
    if (!membership) throw new NotFoundException("Membership not found");
    // Garantir que não removemos último MANAGER
    if (membership.role === "MANAGER" && role !== "MANAGER") {
      const managers = await (this.prisma as any).teamMembership.count({
        where: this.addSoftDeleteFilter({
          teamId: BigInt(teamId),
          role: "MANAGER",
        }),
      });
      if (managers <= 1) {
        throw new BadRequestException(
          "Não é possível remover o último gerente da equipe"
        );
      }
    }
    await (this.prisma as any).teamMembership.update({
      where: {
        teamId_userId: { teamId: BigInt(teamId), userId: BigInt(userId) },
      },
      data: { role },
    });
    return this.get(teamId);
  }

  async removeMember(teamId: number, userId: number, requesterId: number) {
    const can = await this.permissions.canManageTeam(requesterId, teamId);
    if (!can) throw new BadRequestException("Not allowed");
    const membership = await (this.prisma as any).teamMembership.findFirst({
      where: this.addSoftDeleteFilter({
        teamId: BigInt(teamId),
        userId: BigInt(userId),
      }),
    });
    if (!membership) throw new NotFoundException("Membership not found");
    if (membership.role === "MANAGER") {
      const managers = await (this.prisma as any).teamMembership.count({
        where: this.addSoftDeleteFilter({
          teamId: BigInt(teamId),
          role: "MANAGER",
        }),
      });
      if (managers <= 1)
        throw new BadRequestException(
          "Não é possível remover o último gerente"
        );
    }
    await (this.prisma as any).teamMembership.update({
      where: {
        teamId_userId: { teamId: BigInt(teamId), userId: BigInt(userId) },
      },
      data: { deleted_at: new Date() },
    });
    return this.get(teamId);
  }
}
