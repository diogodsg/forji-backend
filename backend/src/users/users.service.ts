import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { CreateUserOnboardingDto } from './dto/create-user-onboarding.dto';
import {
  FindAllUsersUseCase,
  FindOneUserUseCase,
  SearchUsersUseCase,
  CreateUserUseCase,
  OnboardUserUseCase,
  UpdateUserUseCase,
  UpdatePasswordUseCase,
  AdminResetPasswordUseCase,
  DeleteUserUseCase,
} from './use-cases';

/**
 * Users Service - Facade Pattern
 * Delegates all operations to specialized use cases
 * This keeps the service thin and easy to maintain
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly onboardUserUseCase: OnboardUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    private readonly adminResetPasswordUseCase: AdminResetPasswordUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  /**
   * Find all users with pagination and hierarchy
   */
  async findAll(page: number = 1, limit: number = 20, search?: string, workspaceId?: string) {
    return this.findAllUsersUseCase.execute(page, limit, search, workspaceId);
  }

  /**
   * Search users by query string
   */
  async search(query: string, workspaceId?: string) {
    return this.searchUsersUseCase.execute(query, workspaceId);
  }

  /**
   * Find user by ID
   */
  async findOne(id: string) {
    return this.findOneUserUseCase.execute(id);
  }

  /**
   * Create new user (Admin only)
   */
  async create(createUserDto: CreateUserDto, creatorId: string) {
    return this.createUserUseCase.execute(createUserDto, creatorId);
  }

  /**
   * Create new user with full onboarding setup
   * Allows setting manager, team, and workspace role in a single request
   *
   * If user already exists (by email), adds them to the workspace instead of creating a new user
   */
  async createWithOnboarding(createUserDto: CreateUserOnboardingDto, creatorId: string) {
    return this.onboardUserUseCase.execute(createUserDto, creatorId);
  }

  /**
   * Update user profile
   */
  async update(id: string, updateUserDto: UpdateUserDto, requesterId: string) {
    return this.updateUserUseCase.execute(id, updateUserDto, requesterId);
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto, requesterId: string) {
    return this.updatePasswordUseCase.execute(id, updatePasswordDto, requesterId);
  }

  /**
   * Admin reset user password (without requiring current password)
   * Only admins can use this endpoint
   */
  async adminResetPassword(userId: string, adminId: string, newPassword?: string) {
    return this.adminResetPasswordUseCase.execute(userId, adminId, newPassword);
  }

  /**
   * Delete user (soft delete)
   */
  async remove(id: string, requesterId: string) {
    return this.deleteUserUseCase.execute(id, requesterId);
  }
}
