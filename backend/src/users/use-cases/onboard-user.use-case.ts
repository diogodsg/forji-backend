import {
  Injectable,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { PasswordService } from '../services/password.service';
import { PermissionsService } from '../services/permissions.service';
import { GamificationService } from '../../gamification/gamification.service';
import { CreateUserOnboardingDto } from '../dto/create-user-onboarding.dto';

/**
 * Use Case: Onboard User
 * Creates a new user with full setup (manager, team, workspace role)
 * OR adds existing user to workspace if email already exists
 */
@Injectable()
export class OnboardUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly permissionsService: PermissionsService,
    private readonly gamificationService: GamificationService,
  ) {}

  async execute(dto: CreateUserOnboardingDto, creatorId: string) {
    console.log('🔵 OnboardUserUseCase: Starting', {
      email: dto.email,
      name: dto.name,
      managerId: dto.managerId,
      teamId: dto.teamId,
      workspaceRole: dto.workspaceRole,
    });

    // 1. Get creator's workspace
    const workspaceId = await this.permissionsService.getUserPrimaryWorkspace(creatorId);
    if (!workspaceId) {
      throw new ForbiddenException('Creator has no workspace');
    }

    // 2. Check if user already exists
    const existingUser = await this.usersRepository.findByEmail(dto.email);

    if (existingUser) {
      console.log('👤 User exists, adding to workspace');
      return this.addExistingUserToWorkspace(existingUser.id, dto, workspaceId);
    }

    // 3. Create new user with full setup
    console.log('🆕 Creating new user');
    return this.createNewUserWithSetup(dto, workspaceId);
  }

  /**
   * Add existing user to workspace with manager and team
   */
  private async addExistingUserToWorkspace(
    userId: string,
    dto: CreateUserOnboardingDto,
    workspaceId: string,
  ) {
    // Check if user is already in this workspace
    const existingMembership = await this.usersRepository.findWorkspaceMember(userId, workspaceId);
    if (existingMembership) {
      throw new ConflictException('User is already a member of this workspace');
    }

    // Validate manager if provided
    if (dto.managerId) {
      const managerInWorkspace = await this.usersRepository.findWorkspaceMember(
        dto.managerId,
        workspaceId,
      );
      if (!managerInWorkspace) {
        throw new BadRequestException('Manager not found in workspace');
      }
    }

    // Validate team if provided
    if (dto.teamId) {
      const team = await this.usersRepository.findTeam(dto.teamId, workspaceId);
      if (!team) {
        throw new BadRequestException('Team not found in workspace');
      }
    }

    const result = await this.usersRepository.transaction(async (tx) => {
      // Add to workspace
      const workspaceRole = dto.workspaceRole || 'MEMBER';
      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId,
          role: workspaceRole,
        },
      });
      console.log('✅ Added to workspace with role:', workspaceRole);

      // Add manager relationship
      if (dto.managerId) {
        await tx.managementRule.create({
          data: {
            managerId: dto.managerId,
            subordinateId: userId,
            workspaceId,
            ruleType: 'INDIVIDUAL',
          },
        });
        console.log('✅ Manager relationship created');
      }

      // Add to team
      if (dto.teamId) {
        await tx.teamMember.create({
          data: {
            userId,
            teamId: dto.teamId,
            role: 'MEMBER',
          },
        });
        console.log('✅ Added to team');
      }

      // Get user details
      const user = await tx.user.findUnique({
        where: { id: userId },
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

      return {
        ...user,
        workspaceRole,
      };
    });

    // Create gamification profile for the user in this workspace
    try {
      await this.gamificationService.createProfile(userId, workspaceId);
    } catch (error) {
      // Log error but don't fail user addition
      console.error(`Failed to create gamification profile for user ${userId}:`, error);
    }

    return result;
  }

  /**
   * Create new user with full setup
   */
  private async createNewUserWithSetup(dto: CreateUserOnboardingDto, workspaceId: string) {
    // Generate or use provided password
    const plainPassword = dto.password || this.passwordService.generate();
    const hashedPassword = await this.passwordService.hash(plainPassword);

    // Generate random avatar ID (1-12 for different avatar variations)
    const randomAvatarId = `avatar-${Math.floor(Math.random() * 12) + 1}`;

    // Validate manager if provided
    if (dto.managerId) {
      const managerInWorkspace = await this.usersRepository.findWorkspaceMember(
        dto.managerId,
        workspaceId,
      );
      if (!managerInWorkspace) {
        throw new BadRequestException('Manager not found in workspace');
      }
    }

    // Validate team if provided
    if (dto.teamId) {
      const team = await this.usersRepository.findTeam(dto.teamId, workspaceId);
      if (!team) {
        throw new BadRequestException('Team not found in workspace');
      }
    }

    const result = await this.usersRepository.transaction(async (tx) => {
      // 1. Create user
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          position: dto.position,
          bio: dto.bio,
          avatarId: randomAvatarId,
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
      console.log('✅ User created:', user.id, 'with avatar:', randomAvatarId);

      // 2. Add to workspace
      const workspaceRole = dto.workspaceRole || 'MEMBER';
      await tx.workspaceMember.create({
        data: {
          userId: user.id,
          workspaceId,
          role: workspaceRole,
        },
      });
      console.log('✅ Added to workspace with role:', workspaceRole);

      // 3. Add manager relationship
      if (dto.managerId) {
        await tx.managementRule.create({
          data: {
            managerId: dto.managerId,
            subordinateId: user.id,
            workspaceId,
            ruleType: 'INDIVIDUAL',
          },
        });
        console.log('✅ Manager relationship created');
      }

      // 4. Add to team
      if (dto.teamId) {
        await tx.teamMember.create({
          data: {
            userId: user.id,
            teamId: dto.teamId,
            role: 'MEMBER',
          },
        });
        console.log('✅ Added to team');
      }

      return {
        ...user,
        generatedPassword: dto.password ? undefined : plainPassword,
        workspaceRole,
      };
    });

    // 5. Create gamification profile (outside transaction to avoid blocking user creation)
    try {
      await this.gamificationService.createProfile(result.id, workspaceId);
    } catch (error) {
      // Log error but don't fail user creation
      console.error(`Failed to create gamification profile for user ${result.id}:`, error);
    }

    return result;
  }
}
