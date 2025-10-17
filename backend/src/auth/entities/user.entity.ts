import { User } from '@prisma/client';

/**
 * User entity type (Prisma already returns camelCase with @map)
 */
export type UserEntity = Omit<User, 'password'>;

/**
 * Utility class for user operations
 */
export class UserUtils {
  /**
   * Remove sensitive and internal fields from user object
   */
  static toSafeUser(user: User): Omit<User, 'password' | 'deletedAt'> {
    const { password, deletedAt, ...safeUser } = user;
    return safeUser;
  }
}
