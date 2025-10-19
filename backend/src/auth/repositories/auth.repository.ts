import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        workspaceMemberships: {
          where: { deletedAt: null },
          include: {
            workspace: true,
          },
        },
      },
    });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: {
        workspaceMemberships: {
          where: { deletedAt: null },
          include: {
            workspace: true,
          },
        },
      },
    });
  }

  async createUser(data: { email: string; password: string; name: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async createWorkspace(data: { name: string; slug: string }) {
    return this.prisma.workspace.create({
      data,
    });
  }

  async addUserToWorkspace(data: {
    userId: string;
    workspaceId: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER';
  }) {
    return this.prisma.workspaceMember.create({
      data,
    });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
