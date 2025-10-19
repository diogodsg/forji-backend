import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Repository for User data access
 * Encapsulates all Prisma queries related to users
 */
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find user by ID
   */
  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
  }

  /**
   * Find user by ID with relations
   */
  async findByIdWithRelations(id: string) {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        workspaceMemberships: {
          where: { deletedAt: null },
          include: {
            workspace: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find users with pagination and filters
   */
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    return this.prisma.user.findMany({
      where: {
        ...where,
        deletedAt: null,
      },
      skip,
      take,
      orderBy,
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Count users with filters
   */
  async count(where?: Prisma.UserWhereInput) {
    return this.prisma.user.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  /**
   * Search users by query
   */
  async search(query: string, workspaceId?: string, limit: number = 20) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { position: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (workspaceId) {
      where.workspaceMemberships = {
        some: {
          workspaceId,
          deletedAt: null,
        },
      };
    }

    return this.prisma.user.findMany({
      where,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        bio: true,
      },
    });
  }

  /**
   * Create user
   */
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Update user
   */
  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Soft delete user
   */
  async softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * Find workspace member
   */
  async findWorkspaceMember(userId: string, workspaceId: string) {
    return this.prisma.workspaceMember.findFirst({
      where: {
        userId,
        workspaceId,
        deletedAt: null,
      },
    });
  }

  /**
   * Create workspace membership
   */
  async createWorkspaceMembership(data: {
    userId: string;
    workspaceId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }) {
    return this.prisma.workspaceMember.create({
      data,
    });
  }

  /**
   * Create management rule (manager-subordinate relationship)
   */
  async createManagementRule(data: {
    managerId: string;
    subordinateId: string;
    workspaceId: string;
    ruleType: 'INDIVIDUAL' | 'TEAM';
    teamId?: string;
  }) {
    return this.prisma.managementRule.create({
      data,
    });
  }

  /**
   * Create team membership
   */
  async createTeamMembership(data: { userId: string; teamId: string; role: 'MANAGER' | 'MEMBER' }) {
    return this.prisma.teamMember.create({
      data,
    });
  }

  /**
   * Find team
   */
  async findTeam(teamId: string, workspaceId: string) {
    return this.prisma.team.findFirst({
      where: {
        id: teamId,
        workspaceId,
        deletedAt: null,
      },
    });
  }

  /**
   * Execute transaction
   */
  async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
