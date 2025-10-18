import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { CreateUserOnboardingDto } from './dto/create-user-onboarding.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all users with pagination
   */
  async findAll(page: number = 1, limit: number = 20, search?: string, workspaceId?: string) {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    // Search by name or email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by workspace if provided
    let workspaceFilter = {};
    if (workspaceId) {
      workspaceFilter = {
        workspaceMemberships: {
          some: {
            workspaceId,
            deletedAt: null,
          },
        },
      };
      Object.assign(where, workspaceFilter);
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          position: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Search users by query string
   */
  async search(query: string, workspaceId?: string) {
    const where: any = {
      deletedAt: null,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
        { position: { contains: query, mode: 'insensitive' } },
      ],
    };

    // Filter by workspace if provided
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
      take: 20,
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
   * Find user by ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
      select: {
        id: true,
        email: true,
        name: true,
        position: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
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

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Create new user (Admin only)
   */
  async create(createUserDto: CreateUserDto, creatorId: string) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(createUserDto.password);

    // Get creator's workspace to add new user to it
    const creatorMembership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: creatorId,
        deletedAt: null,
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    if (!creatorMembership) {
      throw new ForbiddenException('Creator has no workspace');
    }

    // Create user and add to workspace in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
          position: createUserDto.position,
          bio: createUserDto.bio,
        },
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

      // Add user to creator's workspace as member
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId: creatorMembership.workspaceId,
          role: 'MEMBER',
        },
      });

      return user;
    });

    return result;
  }

  /**
   * Create new user with full onboarding setup
   * Allows setting manager, team, and workspace role in a single request
   */
  async createWithOnboarding(createUserDto: CreateUserOnboardingDto, creatorId: string) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // Generate password if not provided
    const password = createUserDto.password || this.generateRandomPassword();
    const hashedPassword = await this.hashPassword(password);

    // Get creator's workspace to add new user to it
    const creatorMembership = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: creatorId,
        deletedAt: null,
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    if (!creatorMembership) {
      throw new ForbiddenException('Creator has no workspace');
    }

    const workspaceId = creatorMembership.workspaceId;

    // Validate manager exists in same workspace if provided
    if (createUserDto.managerId) {
      const managerMembership = await this.prisma.workspaceMember.findFirst({
        where: {
          userId: createUserDto.managerId,
          workspaceId,
          deletedAt: null,
        },
      });

      if (!managerMembership) {
        throw new BadRequestException('Manager not found in workspace');
      }
    }

    // Validate team exists in same workspace if provided
    if (createUserDto.teamId) {
      const team = await this.prisma.team.findFirst({
        where: {
          id: createUserDto.teamId,
          workspaceId,
          deletedAt: null,
        },
      });

      if (!team) {
        throw new BadRequestException('Team not found in workspace');
      }
    }

    // Create user and setup in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Create user
      const user = await tx.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
          position: createUserDto.position,
          bio: createUserDto.bio,
        },
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

      // 2. Add user to workspace with specified role (default: MEMBER)
      const workspaceRole = createUserDto.workspaceRole || 'MEMBER';
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId,
          role: workspaceRole,
        },
      });

      // 3. Add manager relationship if provided
      if (createUserDto.managerId) {
        await tx.managementRule.create({
          data: {
            managerId: createUserDto.managerId,
            subordinateId: user.id,
            workspaceId,
            ruleType: 'INDIVIDUAL',
          },
        });
      }

      // 4. Add to team if provided
      if (createUserDto.teamId) {
        await tx.teamMember.create({
          data: {
            teamId: createUserDto.teamId,
            userId: user.id,
            role: 'MEMBER', // Default team role
          },
        });
      }

      return {
        ...user,
        generatedPassword: createUserDto.password ? undefined : password,
        workspaceRole,
      };
    });

    return result;
  }

  /**
   * Update user profile
   */
  async update(id: string, updateUserDto: UpdateUserDto, requesterId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Regular users can only update themselves
    if (id !== requesterId) {
      // Check if requester is admin in same workspace
      const isAdmin = await this.isWorkspaceAdmin(requesterId, id);
      if (!isAdmin) {
        throw new ForbiddenException('You can only update your own profile');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
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
   * Update user password
   */
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto, requesterId: string) {
    // Only user themselves can change their own password
    if (id !== requesterId) {
      throw new ForbiddenException('You can only update your own password');
    }

    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isValid = await bcrypt.compare(updatePasswordDto.currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await this.hashPassword(updatePasswordDto.newPassword);

    await this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Delete user (soft delete)
   */
  async remove(id: string, requesterId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if requester is admin in same workspace
    const isAdmin = await this.isWorkspaceAdmin(requesterId, id);
    if (!isAdmin) {
      throw new ForbiddenException('Only workspace admins can delete users');
    }

    await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'User deleted successfully' };
  }

  /**
   * Helper: Hash password
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Helper: Generate random password
   */
  private generateRandomPassword(): string {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }

  /**
   * Helper: Check if requester is admin in same workspace as target user
   */
  private async isWorkspaceAdmin(requesterId: string, targetUserId: string): Promise<boolean> {
    // Get requester's workspace memberships where they are OWNER or ADMIN
    const requesterMemberships = await this.prisma.workspaceMember.findMany({
      where: {
        userId: requesterId,
        role: {
          in: ['OWNER', 'ADMIN'],
        },
        deletedAt: null,
      },
      select: { workspaceId: true },
    });

    if (requesterMemberships.length === 0) {
      return false;
    }

    const adminWorkspaceIds = requesterMemberships.map((m) => m.workspaceId);

    // Check if target user is in any of these workspaces
    const targetInWorkspace = await this.prisma.workspaceMember.findFirst({
      where: {
        userId: targetUserId,
        workspaceId: {
          in: adminWorkspaceIds,
        },
        deletedAt: null,
      },
    });

    return !!targetInWorkspace;
  }
}
