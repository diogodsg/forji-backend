import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { PasswordService } from '../services/password.service';
import { PermissionsService } from '../services/permissions.service';
import { GamificationService } from '../../gamification/gamification.service';
import { CreateUserDto } from '../dto/create-user.dto';

/**
 * Use Case: Create User
 * Creates a new user and adds them to the creator's workspace
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly permissionsService: PermissionsService,
    private readonly gamificationService: GamificationService,
  ) {}

  async execute(createUserDto: CreateUserDto, creatorId: string) {
    // 1. Check if email already exists
    const existing = await this.usersRepository.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    // 2. Hash password
    const hashedPassword = await this.passwordService.hash(createUserDto.password);

    // 3. Get creator's primary workspace
    const workspaceId = await this.permissionsService.getUserPrimaryWorkspace(creatorId);
    if (!workspaceId) {
      throw new ForbiddenException('Creator has no workspace');
    }

    // 4. Create user and add to workspace in transaction
    const user = await this.usersRepository.transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
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
          userId: newUser.id,
          workspaceId,
          role: 'MEMBER',
        },
      });

      return newUser;
    });

    // 5. Create gamification profile for the new user
    try {
      await this.gamificationService.createProfile(user.id, workspaceId);
    } catch (error) {
      // Log error but don't fail user creation
      console.error(`Failed to create gamification profile for user ${user.id}:`, error);
    }

    return user;
  }
}
