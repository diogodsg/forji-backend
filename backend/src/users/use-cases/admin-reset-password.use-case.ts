import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { PasswordService } from '../services/password.service';
import { PermissionsService } from '../services/permissions.service';

/**
 * Use Case: Admin Reset Password
 * Allows admins to reset user passwords without requiring current password
 */
@Injectable()
export class AdminResetPasswordUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async execute(userId: string, adminId: string, newPassword?: string) {
    // 1. Check if requester is admin
    await this.permissionsService.ensureWorkspaceAdmin(adminId, userId);

    // 2. Find user
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 3. Generate password if not provided
    const plainPassword = newPassword || this.passwordService.generate();
    const hashedPassword = await this.passwordService.hash(plainPassword);

    // 4. Update password
    await this.usersRepository.update(userId, { password: hashedPassword });

    return {
      success: true,
      message: 'Password reset successfully',
      generatedPassword: newPassword ? undefined : plainPassword,
    };
  }
}
