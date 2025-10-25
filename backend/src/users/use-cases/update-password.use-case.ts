import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { PasswordService } from '../services/password.service';
import { UpdatePasswordDto } from '../dto/update-password.dto';

/**
 * Use Case: Update Password
 * Allows user to change their own password (requires current password)
 */
@Injectable()
export class UpdatePasswordUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async execute(id: string, updatePasswordDto: UpdatePasswordDto, requesterId: string) {
    // 1. Only user themselves can change their own password
    if (id !== requesterId) {
      throw new ForbiddenException('You can only update your own password');
    }

    // 2. Find user with password
    const user = await this.usersRepository.findByIdWithPassword(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 3. Verify current password
    const isValid = await this.passwordService.compare(
      updatePasswordDto.currentPassword,
      user.password,
    );
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // 4. Hash new password
    const hashedPassword = await this.passwordService.hash(updatePasswordDto.newPassword);

    // 5. Update password
    await this.usersRepository.update(id, { password: hashedPassword });

    return { message: 'Password updated successfully' };
  }
}
