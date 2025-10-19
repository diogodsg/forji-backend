import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { PermissionsService } from '../services/permissions.service';

/**
 * Use Case: Delete User
 * Soft deletes a user (only admins)
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async execute(id: string, requesterId: string) {
    // 1. Check if user exists
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Check if requester is admin
    await this.permissionsService.ensureWorkspaceAdmin(requesterId, id);

    // 3. Soft delete user
    await this.usersRepository.softDelete(id);

    return { message: 'User deleted successfully' };
  }
}
