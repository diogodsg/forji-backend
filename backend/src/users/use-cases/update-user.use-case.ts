import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { PermissionsService } from '../services/permissions.service';
import { UpdateUserDto } from '../dto/update-user.dto';

/**
 * Use Case: Update User
 * Updates user profile (only self or admins)
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly permissionsService: PermissionsService,
  ) {}

  async execute(id: string, updateUserDto: UpdateUserDto, requesterId: string) {
    // 1. Check if user exists
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Check permissions (self or admin)
    await this.permissionsService.ensureCanEditUser(requesterId, id);

    // 3. Update user
    return this.usersRepository.update(id, updateUserDto);
  }
}
