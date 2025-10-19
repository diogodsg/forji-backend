import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkspacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id, deletedAt: null },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.workspace.findUnique({
      where: { slug, deletedAt: null },
    });
  }

  async findByIdWithMembers(id: string) {
    return this.prisma.workspace.findUnique({
      where: { id, deletedAt: null },
      include: {
        members: {
          where: { deletedAt: null },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                position: true,
              },
            },
          },
        },
      },
    });
  }

  async findAll(params?: { where?: Prisma.WorkspaceWhereInput; skip?: number; take?: number }) {
    return this.prisma.workspace.findMany({
      where: {
        ...params?.where,
        deletedAt: null,
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: Prisma.WorkspaceCreateInput) {
    return this.prisma.workspace.create({ data });
  }

  async update(id: string, data: Prisma.WorkspaceUpdateInput) {
    return this.prisma.workspace.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.workspace.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async findMember(workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        deletedAt: null,
      },
    });
  }

  async addMember(data: {
    workspaceId: string;
    userId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }) {
    return this.prisma.workspaceMember.create({ data });
  }

  async removeMember(workspaceId: string, userId: string) {
    return this.prisma.workspaceMember.updateMany({
      where: {
        workspaceId,
        userId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  async updateMemberRole(workspaceId: string, userId: string, role: 'OWNER' | 'ADMIN' | 'MEMBER') {
    return this.prisma.workspaceMember.updateMany({
      where: {
        workspaceId,
        userId,
        deletedAt: null,
      },
      data: { role },
    });
  }

  async transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
