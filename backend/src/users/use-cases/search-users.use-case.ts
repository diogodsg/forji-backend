import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';

/**
 * Use Case: Search Users
 * Search users by query string with optional workspace filter
 */
@Injectable()
export class SearchUsersUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(query: string, workspaceId?: string) {
    return this.usersRepository.search(query, workspaceId);
  }
}
