import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';

/**
 * Use Case: Find One User
 * Returns user details with workspace memberships
 */
@Injectable()
export class FindOneUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: string) {
    const user = await this.usersRepository.findByIdWithRelations(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
