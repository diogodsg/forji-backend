import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../core/prisma/prisma.service";
import { PermissionService } from "../core/permissions/permission.service";
import { CreateTeamDto, UpdateTeamDto, TeamRoleDto } from "../dto/team.dto";

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private permissions: PermissionService
  ) {}

  list(summaryOnly = false) {
    return (this.prisma as any).team.findMany({
      orderBy: { id: "asc" },
      include: summaryOnly
        ? { memberships: { select: { role: true } } }
        : {
            memberships: {
              include: {
                user: { select: { id: true, name: true, email: true } },
              },
            },
          },
    });
  }

  listManagedBy(userId: number) {
    return (this.prisma as any).team.findMany({
      orderBy: { id: "asc" },
      where: {
        memberships: {
          some: { userId: BigInt(userId), role: "MANAGER" },
        },
      },
      include: { memberships: { select: { role: true } } },
    });
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
    const team = await (this.prisma as any).team.findUnique({
      where: { id: BigInt(id) },
      include: {
        memberships: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    if (!team) throw new NotFoundException("Team not found");
    return team;
  }

  async create(data: CreateTeamDto, requesterId: number) {
    // Criador se torna MANAGER automaticamente
    return (this.prisma as any).team.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim(),
        memberships: {
          create: { userId: BigInt(requesterId), role: "MANAGER" },
        },
      },
      include: {
        memberships: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  async update(id: number, data: UpdateTeamDto, requesterId: number) {
    const can = await this.permissions.canManageTeam(requesterId, id);
    if (!can) throw new BadRequestException("Not allowed");
    return (this.prisma as any).team.update({
      where: { id: BigInt(id) },
      data: {
        name: data.name?.trim(),
        description:
          data.description === undefined
            ? undefined
            : data.description?.trim() || null,
      },
      include: {
        memberships: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  async delete(id: number, requesterId: number) {
    const can = await this.permissions.canManageTeam(requesterId, id);
    if (!can) throw new BadRequestException("Not allowed");
    await (this.prisma as any).team.delete({ where: { id: BigInt(id) } });
    return { deleted: true };
  }

  async addMember(
    teamId: number,
    userId: number,
    role: TeamRoleDto | undefined,
    requesterId: number
  ) {
    const can = await this.permissions.canManageTeam(requesterId, teamId);
    if (!can) throw new BadRequestException("Not allowed");
    const existing = await (this.prisma as any).teamMembership.findUnique({
      where: {
        teamId_userId: { teamId: BigInt(teamId), userId: BigInt(userId) },
      },
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
    const membership = await (this.prisma as any).teamMembership.findUnique({
      where: {
        teamId_userId: { teamId: BigInt(teamId), userId: BigInt(userId) },
      },
    });
    if (!membership) throw new NotFoundException("Membership not found");
    // Garantir que não removemos último MANAGER
    if (membership.role === "MANAGER" && role !== "MANAGER") {
      const managers = await (this.prisma as any).teamMembership.count({
        where: { teamId: BigInt(teamId), role: "MANAGER" },
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
    const membership = await (this.prisma as any).teamMembership.findUnique({
      where: {
        teamId_userId: { teamId: BigInt(teamId), userId: BigInt(userId) },
      },
    });
    if (!membership) throw new NotFoundException("Membership not found");
    if (membership.role === "MANAGER") {
      const managers = await (this.prisma as any).teamMembership.count({
        where: { teamId: BigInt(teamId), role: "MANAGER" },
      });
      if (managers <= 1)
        throw new BadRequestException(
          "Não é possível remover o último gerente"
        );
    }
    await (this.prisma as any).teamMembership.delete({
      where: {
        teamId_userId: { teamId: BigInt(teamId), userId: BigInt(userId) },
      },
    });
    return this.get(teamId);
  }
}
